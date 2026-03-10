import { Group, Button, Steps } from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger } from "../../../components/ui/steps.jsx";
import { addCourse, submitCourseEdit } from "../../../api/courseService.js";
import { updateCourseInCart } from '../../../features/cartSlice.js';
import { addImage, getCategories } from '../../../api/courseService.js';
import { parseLocalDate, toDateStr, buildSessions } from '../../../utils/sessionUtils.js';
import { buildAddressLabel, fetchLocationSuggestions } from '../../../api/locationService.js';
import Step1 from './steps/Step1.jsx';
import Step2 from './steps/Step2.jsx';
import Step3 from './steps/Step3.jsx';
import './AddCourseForm.css';

const AddCourseForm = () => {
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data.map(cat => ({ value: cat, label: cat.charAt(0) + cat.slice(1).toLowerCase() }))))
      .catch(() => alert("Error fetching categories"));
  }, []);

  const currentUser = useSelector((state) => state.users.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { status, details } = location.state || {};
  const isEdit = status === "EDIT";

  const locationsArray = details?.course.locations;
  const categoriesArray = details?.course.categories;
  const pendingEdit = details?.course?.hasPendingEdit ? details.course.pendingEditData : null;

  const [aiSuggestedLong, setAiSuggestedLong] = useState(null);
  const [aiSuggestedCategories, setAiSuggestedCategories] = useState(null);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState(null);
  const [aiFullSuggestion, setAiFullSuggestion] = useState(null);
  const [aiLongAccepted, setAiLongAccepted] = useState(false);
  const [aiPriceAccepted, setAiPriceAccepted] = useState(false);
  const [aiCategoriesAccepted, setAiCategoriesAccepted] = useState(false);
  const [aiPriceNote, setAiPriceNote] = useState("");

  const handleAiSuggest = ({ long, categories: cats, price, priceNote }) => {
    setAiSuggestedLong(long);
    setAiSuggestedCategories(cats);
    setAiSuggestedPrice(price);
    setAiPriceNote(priceNote || "");
  };

  const { register, control, formState: { errors, isValid, isDirty }, trigger, getValues, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      openingDate: isEdit ? details.course.openingDate?.substring(0, 10) : "",
      long: isEdit ? details.course.long : "",
      locations: locationsArray?.map(city => ({ location: city })) || [{ location: "" }],
      categories: categoriesArray?.map(cat => ({
        value: cat.toUpperCase(),
        label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
      })) || []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "locations" });
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    details?.course?.img ? `${import.meta.env.VITE_CLOUDINARY_URL}/${details.course.img}` : ""
  );
  const [sessions, setSessions] = useState(details?.course?.sessions?.map(d => toDateStr(new Date(d))) || []);
  const [skippedHolidays, setSkippedHolidays] = useState([]);
  const [selectedDays, setSelectedDays] = useState(
    details?.course?.daysOfWeek?.length
      ? details.course.daysOfWeek
      : (details?.course?.openingDate
        ? [parseLocalDate(details.course.openingDate.substring(0, 10)).getDay()]
        : [])
  );

  const [locationStatuses, setLocationStatuses] = useState({});
  const [locationSuggestions, setLocationSuggestions] = useState({});
  const [showSuggestions, setShowSuggestions] = useState({});
  const locationTimers = useRef({});
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (!currentUser?.token || isTokenExpired(currentUser.token)) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (isEdit && locationsArray?.length) {
      const initialStatuses = {};
      locationsArray.forEach((_, i) => { initialStatuses[i] = "valid"; });
      setLocationStatuses(initialStatuses);
    }
  }, []);

  const fetchSuggestions = (value, index) => {
    if (locationTimers.current[index]) clearTimeout(locationTimers.current[index]);
    if (!value || value.trim().length < 1) {
      setLocationStatuses(prev => ({ ...prev, [index]: "idle" }));
      setLocationSuggestions(prev => ({ ...prev, [index]: [] }));
      setShowSuggestions(prev => ({ ...prev, [index]: false }));
      return;
    }
    setLocationStatuses(prev => ({ ...prev, [index]: "checking" }));
    locationTimers.current[index] = setTimeout(async () => {
      try {
        const filtered = await fetchLocationSuggestions(value);
        setLocationSuggestions(prev => ({ ...prev, [index]: filtered }));
        setShowSuggestions(prev => ({ ...prev, [index]: true }));
        setLocationStatuses(prev => ({ ...prev, [index]: filtered.length > 0 ? "checking" : "invalid" }));
      } catch {
        setLocationStatuses(prev => ({ ...prev, [index]: "idle" }));
      }
    }, 400);
  };

  const selectSuggestion = (index, suggestion) => {
    setValue(`locations.${index}.location`, buildAddressLabel(suggestion));
    setLocationStatuses(prev => ({ ...prev, [index]: "valid" }));
    setShowSuggestions(prev => ({ ...prev, [index]: false }));
    setLocationSuggestions(prev => ({ ...prev, [index]: [] }));
  };

  const regenerate = (openingDate, count, days) => {
    const { generated, skipped } = buildSessions(openingDate, count, days);
    setSessions(generated);
    setSkippedHolidays(skipped);
  };

  const toggleDay = (dayNum) => {
    setSelectedDays(prev => {
      const next = prev.includes(dayNum) ? prev.filter(d => d !== dayNum) : [...prev, dayNum].sort((a, b) => a - b);
      regenerate(getValues("openingDate"), getValues("long"), next);
      return next;
    });
  };

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedImage");
    const storedImageName = localStorage.getItem("selectedImageName");
    if (storedImage && storedImageName) { setPreview(storedImage); }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      localStorage.setItem("selectedImage", URL.createObjectURL(file));
      localStorage.setItem("selectedImageName", file.name);
    }
  };

  const handleUpload = async () => {
    if (!image) { alert("Please choose a picture"); return; }
    const fd = new FormData();
    fd.append("image", image);
    try {
      const response = await addImage(fd);
      localStorage.removeItem("selectedImage");
      localStorage.removeItem("selectedImageName");
      return response.data.filePath;
    } catch (error) { console.error("Upload error:", error); throw error; }
  };

  const saveStepData = () => setFormData(prev => ({ ...prev, ...getValues() }));
  const nextStep = async () => {
    const valid = await trigger();
    if (valid) { saveStepData(); setStep(prev => prev + 1); }
  };
  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async () => {
    const currentStepData = getValues();
    const locations = currentStepData.locations.map(item => item.location);
    const cats = currentStepData.categories.map(item => item.value);
    const daysOfWeek = selectedDays;

    if (!daysOfWeek.length) return alert("Please select at least one meeting day");

    const hasInvalid = Object.values(locationStatuses).some(s => s === "invalid");
    const hasChecking = Object.values(locationStatuses).some(s => s === "checking");
    const hasUnverified = fields.some((_, i) => locationStatuses[i] !== "valid");
    if (hasInvalid) return alert("Please fix invalid locations before submitting.");
    if (hasChecking) return alert("Please wait while locations are being verified.");
    if (hasUnverified) return alert("Please select a location from the suggestions list.");

    try {
      setIsSubmitting(true);
      if (isEdit) {
        const img = image ? image.name : details.course.img;
        if (image) await handleUpload();
        const data = { ...formData, ...getValues(), locations, categories: cats, img, sessions, daysOfWeek };
        await submitCourseEdit(details.course._id, data, currentUser?.token);
        dispatch(updateCourseInCart({ id: details.course._id, data }));
      } else {
        if (!image) return alert("Please select an image");
        await handleUpload();
        const data = { ...formData, ...getValues(), locations, categories: cats, img: image.name, sessions, daysOfWeek };
        await addCourse(data, currentUser?.token);
      }
      setStep(prev => prev + 1);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) { navigate("/login"); setPreview(""); }
      else alert("Error: " + (err.response?.data?.title || err.message));
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-add-course">
      <Steps.Root defaultStep={0} count={3} colorPalette="teal" color="white">
        <h1 className="title">{isEdit ? "- UPDATE " : "- ADD "}COURSE -</h1>

        {isEdit && pendingEdit && (
          <div style={{ background: "rgba(255,200,0,0.12)", border: "1px solid rgba(255,200,0,0.4)", borderRadius: "10px", padding: "14px 20px", marginBottom: "24px", color: "#ffd700", fontSize: "0.9rem" }}>
            <strong>You have a pending edit awaiting admin approval.</strong>
            <p style={{ marginTop: "8px", color: "rgba(255,215,0,0.75)", fontSize: "0.82rem" }}>Submitting a new edit will replace the pending one.</p>
          </div>
        )}

        {isEdit && !pendingEdit && details?.course?.lastEditStatus === "rejected" && (
          <div style={{ background: "rgba(220,53,69,0.12)", border: "1px solid rgba(220,53,69,0.4)", borderRadius: "10px", padding: "14px 20px", marginBottom: "24px", color: "#ff6b6b", fontSize: "0.9rem" }}>
            <strong>Your last edit was rejected by admin.</strong>
            <p style={{ marginTop: "6px", color: "rgba(255,107,107,0.75)", fontSize: "0.82rem" }}>The course remains as approved. You can submit a new edit below.</p>
          </div>
        )}

        <div className="steps-container">
          <StepsList>
            <StepsItem index={0} title="Step 1" />
            <StepsItem index={1} title="Step 2" />
            <StepsItem index={2} title="Step 3" />
          </StepsList>
        </div>

        {step === 0 && (
          <Step1
            register={register} errors={errors} isEdit={isEdit} details={details}
            setValue={setValue} trigger={trigger} getValues={getValues}
            onAiSuggest={handleAiSuggest} aiFullSuggestion={aiFullSuggestion} setAiFullSuggestion={setAiFullSuggestion}
          />
        )}

        {step === 1 && (
          <Step2
            register={register} errors={errors} isEdit={isEdit} details={details}
            getValues={getValues} setValue={setValue}
            selectedDays={selectedDays} setSelectedDays={setSelectedDays}
            sessions={sessions} skippedHolidays={skippedHolidays}
            regenerate={regenerate} toggleDay={toggleDay}
            aiSuggestedLong={aiSuggestedLong}
            aiSuggestedPrice={aiSuggestedPrice}
            aiPriceNote={aiPriceNote}
            aiLongAccepted={aiLongAccepted} setAiLongAccepted={setAiLongAccepted}
            aiPriceAccepted={aiPriceAccepted} setAiPriceAccepted={setAiPriceAccepted}
          />
        )}

        {step === 2 && (
          <Step3
            register={register} errors={errors} control={control}
            fields={fields} append={append} remove={remove}
            preview={preview} handleFileChange={handleFileChange}
            locationStatuses={locationStatuses}
            locationSuggestions={locationSuggestions}
            showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions}
            fetchSuggestions={fetchSuggestions} selectSuggestion={selectSuggestion}
            categories={categories} categoriesArray={categoriesArray}
            aiSuggestedCategories={aiSuggestedCategories}
            aiCategoriesAccepted={aiCategoriesAccepted} setAiCategoriesAccepted={setAiCategoriesAccepted}
            setValue={setValue}
          />
        )}

        {step === 3 && (
          <div style={{ textAlign: "center" }}>
            <h3 className="end">
              {isEdit
                ? "Edit submitted for admin approval!"
                : currentUser?.role === "INSTRUCTOR"
                  ? "Course submitted for admin approval!"
                  : "The course was successfully added!!!"}
            </h3>
            {isEdit && currentUser?.role === "INSTRUCTOR" && (
              <p style={{ color: "#888", marginTop: "10px", fontSize: "0.95rem" }}>
                Your changes are pending review. The course remains live with its current content until approved.
              </p>
            )}
            {!isEdit && currentUser?.role === "INSTRUCTOR" && (
              <p style={{ color: "#888", marginTop: "10px", fontSize: "0.95rem" }}>
                You will be notified once an admin reviews your course.
              </p>
            )}
          </div>
        )}

        <Group>
          {step > 0 && step < 3 && (
            <StepsPrevTrigger asChild>
              <Button className="btn-add1" variant="outline" size="sm" onClick={prevStep}>Prev</Button>
            </StepsPrevTrigger>
          )}
          {step < 2 && (
            <StepsNextTrigger asChild>
              <Button className="btn-add2" variant="outline" size="sm" onClick={nextStep}
                disabled={!isValid || (!isDirty && !isEdit)}>
                Next
              </Button>
            </StepsNextTrigger>
          )}
          {step === 2 && (
            <StepsNextTrigger>
              <Button className="btn-add2" variant="solid" size="sm" onClick={onSubmit}
                loading={isSubmitting}
                disabled={
                  !isValid ||
                  (!isDirty && !isEdit) ||
                  Object.values(locationStatuses).some(s => s === "invalid" || s === "checking") ||
                  fields.some((_, i) => locationStatuses[i] !== "valid")
                }>
                {isEdit ? "Update" : "Submit"}
              </Button>
            </StepsNextTrigger>
          )}
        </Group>
      </Steps.Root>
    </div>
  );
};

export default AddCourseForm;