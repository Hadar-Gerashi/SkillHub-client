import { Card, Input, Stack, Textarea, Group, Button, Steps } from "@chakra-ui/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Select from 'react-select';
import Alert from "@mui/material/Alert";
import Grow from "@mui/material/Grow";
import { useEffect } from "react";
import { Flex } from "@chakra-ui/react";


import {
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
} from "../../components/ui/steps.jsx";
import { Field } from "../../components/ui/field.jsx";
import { addCourse, updateCourse } from "../../api/courseService.js";
import { updateCourseInCart } from '../../features/cartSlice.js'
import { addImage } from '../../api/courseService.js'
import { getCategories } from '../../api/courseService.js'
import './AddCourseForm.css'



const AddCourseForm = () => {

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const formatted = res.data.map(cat => ({
          value: cat,
          label: cat.charAt(0) + cat.slice(1).toLowerCase()
        }));
        setCategories(formatted);
      } catch (err) {
        console.log(err);
        alert("Error fetching categories");
      }
    };

    fetchCategories();
  }, []);


  const currentUser = useSelector((state) => state.users.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = location.state || {};
  const { details } = location.state || {};

  const locationsArray = details?.course.locations;
  const categoriesArray = details?.course.categories;
  const {
    register,
    control,
    formState: { errors, isValid, isDirty },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      locations: locationsArray?.map(city => ({ location: city })) || [{ location: "" }],
      categories: categoriesArray?.map(cat => ({
        value: cat.toUpperCase(),
        label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
      })) || []

    }
  });
  const firstError = errors.name?.message || errors.describe?.message || errors.motivation?.message;
  const secondError = errors.openingDate?.message || errors.price?.message || errors.long?.message;

  const { fields, append, remove } = useFieldArray({ control, name: "locations" });

  // ניהול שלבים
  const [step, setStep] = useState(0);
  // שמירת נתוני כל השלבים
  const [formData, setFormData] = useState({});
  const [nameImage, setNameImage] = useState(status === "EDIT" ? details.course.img : "");
  let dispatch = useDispatch()

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(details?.course?.img ? `${import.meta.env.VITE_CLOUDINARY_URL}/${details.course.img}` : ""); // כתובת התמונה לתצוגה


  useEffect(() => {
    const storedImage = localStorage.getItem("selectedImage");
    const storedImageName = localStorage.getItem("selectedImageName");

    if (storedImage && storedImageName) {
      setPreview(storedImage);
      setNameImage(storedImageName);
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));

      // שמירת הנתונים ב- localStorage
      localStorage.setItem("selectedImage", URL.createObjectURL(file));
      localStorage.setItem("selectedImageName", file.name);
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("choose picture");


    const formDa = new FormData();
    formDa.append("image", image);
    setNameImage(image.name)

    try {
      console.log(formDa, "formDa")
      const response = await addImage(formDa)
      console.log("The file has been saved at:", response.data.filePath);
      localStorage.removeItem("selectedImage");
      localStorage.removeItem("selectedImageName");

    } catch (error) {
      console.error("Upload error:", error);
    }
  };


  // שומר את הנתונים של השלב הנוכחי ל- formData הכללי
  const saveStepData = () => {
    const currentStepData = getValues();
    setFormData((prev) => ({ ...prev, ...currentStepData }));
    console.log("Final:", currentStepData);
  };

  // מעבר לשלב הבא רק אם כל השדות תקינים
  const nextStep = async () => {
    const isValid = await trigger(); // בודק אם השדות בשלב הנוכחי תקינים
    if (isValid) {

      saveStepData();
      setStep((prev) => prev + 1);

    }

  };

  const prevStep = async () => {
    setStep((prev) => prev - 1);
  };


  // שליחת הטופס הסופי
  const onSubmit = async () => {
    // שמירה אחרונה של נתוני השלב
    const currentStepData = getValues();
    let locations = currentStepData.locations.map(item => item.location)
    let categories = currentStepData.categories.map(item => item.value)
    if (status === "EDIT") {

      let img;
      if (image) {
        img = image.name

        handleUpload()

      }
      else
        img = details.course.img

      let data = { ...formData, locations, categories, img }

      try {
        const res = await updateCourse(details.course, data, currentUser?.token);
        console.log(res);

        const id = details.course._id;
        console.log("data", data);

        dispatch(updateCourseInCart({ id, data }));
        setStep((prev) => prev + 1);

      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
          setPreview("")

        }
        console.log(err);
        alert("Error: " + err.response?.data?.title);
      }


    } else {
      let data = { ...formData, locations, categories, img: image.name }
      handleUpload()

      try {
        await addCourse(data, currentUser?.token);
        setStep((prev) => prev + 1);
      } catch (err) {
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }

    }
  };




  return (
    <div className="form-add-course" >
      <Steps.Root defaultStep={0} count={3} colorPalette="teal" color="white">
        <h1 className="title">{status === "EDIT" ? "- UPDATE " : "- ADD "}COURSE -</h1>

        <div className="steps-container">
          <StepsList>
            <StepsItem index={0} title="Step 1" />
            <StepsItem index={1} title="Step 2" />
            <StepsItem index={2} title="Step 3" />
          </StepsList>
        </div>


        {/* === שלב 1 === */}
        {step === 0 && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="centered-form"
          >

            <Card.Root border="0px" width="100%" maxWidth="500px" className="step">
              <Card.Header>
                <Card.Title>Step 1</Card.Title>
              </Card.Header>

              <Card.Body>
                <Stack gap="4" w="full">
                  <Field label="Name">
                    <Input
                      defaultValue={status === "EDIT" ? details.course.name : ""}
                      {...register("name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                      })}
                    />
                  </Field>

                  <Field label="Describe">
                    <Textarea
                      defaultValue={status === "EDIT" ? details.course.describe : ""}
                      {...register("describe", {
                        required: "Describe is required",
                        minLength: { value: 25, message: "Describe must be at least 25 characters" },
                      })}
                    />
                  </Field>

                  <Field label="Motivation">
                    <Textarea
                      defaultValue={status === "EDIT" ? details.course.motivation : ""}
                      {...register("motivation", {
                        required: "Motivation is required",
                        minLength: { value: 25, message: "Motivation must be at least 25 characters" },
                      })}
                    />
                  </Field>
                </Stack>
                <div className="error-container">
                  {firstError && (
                    <Grow in={Boolean(firstError)} timeout={500} key={firstError}>
                      <Alert severity="error" className="error-show" >
                        {firstError}
                      </Alert>
                    </Grow>
                  )}
                </div>
              </Card.Body>


            </Card.Root>
          </form>
        )}




        {/* === שלב 2 === */}
        {step === 1 && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="centered-form"
          >
            <Card.Root border="0px" width="500px" className="step1">
              <Card.Header>
                <Card.Title>Step 2</Card.Title>
              </Card.Header>

              <Card.Body>
                <Stack gap="4" w="full" >
                  <Field label="Opening Date">
                    <Input
                      defaultValue={status === "EDIT" ? details.course.openingDate?.substring(0, 10) : ""}
                      type="date"
                      {...register("openingDate", {
                        required: "Opening Date is required",
                        validate: (value) => {
                          const selectedDate = new Date(value);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return selectedDate > today || "Opening Date must be in the future";
                        },
                      })}
                      min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} // הגדרת מינימום לתאריך של מחר
                    />
                  </Field>

                  <Field label="Course Length">
                    <Input
                      defaultValue={status === "EDIT" ? details.course.long : ""}
                      type="number"
                      {...register("long", {
                        required: "Course length is required",
                        min: { value: 3, message: "long must be least 3" },
                        max: { value: 50, message: "long must be max 50" },
                      })}
                    />
                  </Field>

                  <Field label="Price">
                    <Input
                      defaultValue={status === "EDIT" ? details.course.price : ""}
                      type="text"
                      {...register("price", {
                        required: "Price is required",
                        validate: (value) =>
                          parseFloat(value) > 200 ? true : "Price must be above 200",
                      })}
                    />
                  </Field>
                </Stack>
                <div className="error-container">
                  {secondError && (
                    <Grow in={Boolean(secondError)} timeout={500} key={secondError}>
                      <Alert severity="error" className="error-show">
                        {secondError}
                      </Alert>
                    </Grow>
                  )}
                </div>
              </Card.Body>



            </Card.Root>
          </form>
        )}






        {/* === שלב 3 === */}
        {step === 2 && (
          <form
            onSubmit={(e) => e.preventDefault()}
          >

            <Card.Root className="step2">
              <Card.Header>
                <Card.Title>Step 3</Card.Title>
              </Card.Header>



              <Stack gap="4" w="full"  >
                <Flex gap={2} padding="30px" marginBottom="-50px">

                  <Field label="Image" flex={2}>
                    <div className="file-upload-container">
                      <label htmlFor="file-upload" className="file-upload-label">
                        Choose file
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-upload-input"
                      />

                      {preview && (
                        <div className="image-preview">
                          <img src={preview} alt="Preview" className="image-preview-img" />
                        </div>
                      )}
                    </div>
                  </Field>




                  <Field label="Locations" flex={2}>


                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="field-row"
                      >

                        <Input
                          type="text"
                          {...register(`locations.${index}.location`, { required: "Location is required" })}
                        /> {index !== 0 &&
                          <Button type="button" onClick={() => remove(index)} className="remove-btn">
                            Remove
                          </Button>

                        }
                      </div>
                    ))}

                    <Button type="button" onClick={() => append({ location: "" })} className="add-location-btn">
                      + Add Location
                    </Button>

                    {errors.locations && (
                      <span className="error-message">{errors.locations.message}</span>
                    )}


                  </Field>


                </Flex>
                <Field label="Categories" flex={3} width="50%" >
                  <Controller
                    name="categories"
                    control={control}
                    rules={{
                      required: "Categories are required"
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={categories}
                        isMulti
                        defaultValue={categoriesArray?.map(cat => ({
                          value: cat.toUpperCase(),
                          label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
                        }))}
                        placeholder="Select categories..."
                        onChange={selectedOptions => field.onChange(selectedOptions)}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            color: "black",
                            backgroundColor: "white",
                            borderColor: state.isFocused ? "#ffffff" : "#cccccc",
                            outline: "none",
                            boxShadow: state.isFocused ? "0 0 10px rgba(196, 198, 200, 0.5)" : "none",
                            borderWidth: "0px",
                            transition: "all 0.3s ease-in-out",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: 'black',
                          }),
                          multiValue: (base) => ({
                            ...base,
                            color: 'black',
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: 'black',
                          }),
                          option: (base) => ({
                            ...base,
                            color: 'black',
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.categories && <span className="error-message">{errors.categories.message}</span>}

                </Field>
              </Stack>
            </Card.Root>

          </form>
        )}


        {/* === הודעה סופית אחרי שליחה === */}
        {step === 3 && <h3 className="end">The course was successfully{status === "EDIT" ? " update!!!" : " added!!!"}</h3>}

        {/* === כפתורי ניווט === */}
        <Group >
          {/* כפתור חזרה */}
          {step > 0 && step < 3 && (
            <StepsPrevTrigger asChild>
              <Button className="btn-add1" variant="outline" size="sm" onClick={prevStep}  >
                Prev
              </Button></StepsPrevTrigger>
          )}

          {/* כפתור Next (שלבים 0 ו-1) */}
          {step < 2 && (

            <StepsNextTrigger asChild>
              <Button className="btn-add2" variant="outline" size="sm" onClick={nextStep} disabled={!isValid || !isDirty}>
                Next
              </Button></StepsNextTrigger>
          )}

          {/* כפתור Submit (שלב 2) */}
          {step === 2 && (
            <StepsNextTrigger>
              <Button className="btn-add2" variant="solid" size="sm" onClick={onSubmit} disabled={!isValid || !isDirty}>
                Submit
              </Button>
            </StepsNextTrigger>
          )}


        </Group>
      </Steps.Root>

    </div>
  );
};

export default AddCourseForm;










