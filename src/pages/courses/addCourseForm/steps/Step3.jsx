import { Card, Input, Stack, Button } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import Select from 'react-select';
import { useEffect } from "react";

import { Field } from "../../../../components/ui/field.jsx";
import "./Step3.css";

const selectStyles = {
    control: (base, state) => ({
        ...base,
        color: "black",
        backgroundColor: "white",
        borderColor: state.isFocused ? "#ffffff" : "#cccccc",
        outline: "none",
        boxShadow: state.isFocused ? "0 0 10px rgba(196,198,200,0.5)" : "none",
        borderWidth: "0px",
        transition: "all 0.3s ease-in-out",
    }),
    singleValue: (base) => ({ ...base, color: "black" }),
    multiValue: (base) => ({ ...base, color: "black" }),
    placeholder: (base) => ({ ...base, color: "black" }),
    option: (base) => ({ ...base, color: "black" }),
};

const Step3 = ({
    register, errors, control, fields, append, remove, preview, handleFileChange,
    locationStatuses, locationSuggestions, showSuggestions, setShowSuggestions,
    fetchSuggestions, selectSuggestion, categories, categoriesArray,
    aiSuggestedCategories, aiCategoriesAccepted, setAiCategoriesAccepted, setValue
}) => {

    useEffect(() => {
        if (aiCategoriesAccepted === true && aiSuggestedCategories?.length > 0) {
            setValue("categories", aiSuggestedCategories.map(cat => ({
                value: cat.toUpperCase(),
                label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
            })), { shouldValidate: true, shouldDirty: true });
        }
    }, [aiCategoriesAccepted]);

    const showCatHint = aiSuggestedCategories?.length > 0 && !aiCategoriesAccepted;

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Card.Root className="step2">
                <Card.Header><Card.Title>Step 3</Card.Title></Card.Header>
                <Stack gap="4" w="full">
                    <Flex gap={2} padding="30px" marginBottom="-50px">

                        <Field label="Image" flex={2}>
                            <div className="file-upload-container">
                                <label htmlFor="file-upload" className="file-upload-label">Choose file</label>
                                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="file-upload-input" />
                                {preview && (
                                    <div className="image-preview">
                                        <img src={preview} alt="Preview" className="image-preview-img" />
                                    </div>
                                )}
                            </div>
                        </Field>

                        <Field label="Locations" flex={2}>
                            {fields.map((field, index) => {
                                const locStatus = locationStatuses[index] || "idle";
                                const suggestions = locationSuggestions[index] || [];
                                const showDrop = showSuggestions[index] || false;

                                const inputClassName =
                                    locStatus === "valid" ? "step3-input-valid" :
                                        locStatus === "invalid" ? "step3-input-invalid" :
                                            "step3-input-default";

                                return (
                                    <div key={field.id} className="field-row step3-field-row">
                                        <div className="step3-location-row">
                                            <div className="step3-input-wrapper">
                                                <Input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={inputClassName}
                                                    {...register(`locations.${index}.location`, { required: "Location is required" })}
                                                    onChange={(e) => {
                                                        register(`locations.${index}.location`).onChange(e);
                                                        fetchSuggestions(e.target.value, index);
                                                    }}
                                                    onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, [index]: false })), 150)}
                                                />
                                                <span className="step3-status-icon">
                                                    {locStatus === "checking" && (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                                        </svg>
                                                    )}
                                                    {locStatus === "valid" && (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" />
                                                        </svg>
                                                    )}
                                                    {locStatus === "invalid" && (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc8181" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                                                        </svg>
                                                    )}
                                                </span>
                                                {showDrop && suggestions.length > 0 && (
                                                    <div className="suggestions-dropdown">
                                                        {suggestions.map((s, i) => {
                                                            const addr = s.address;
                                                            const road = [addr.road, addr.house_number].filter(Boolean).join(" ");
                                                            const city = addr.city || addr.town || addr.village || addr.county || "";
                                                            const country = addr.country || "";
                                                            const mainLine = road || city;
                                                            const subLine = [road ? city : "", country].filter(Boolean).join(", ");
                                                            if (!mainLine) return null;
                                                            return (
                                                                <div key={i} className="suggestion-item"
                                                                    onMouseDown={() => selectSuggestion(index, s)}>
                                                                    <span className="suggestion-main">{mainLine}</span>
                                                                    <span className="suggestion-sub">{subLine}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            {index !== 0 && (
                                                <Button type="button" onClick={() => remove(index)} className="remove-btn">Remove</Button>
                                            )}
                                        </div>
                                        {locStatus === "invalid" && <span className="step3-loc-error">Location not found.</span>}
                                        {locStatus === "valid" && <span className="step3-loc-success">Location verified ✓</span>}
                                    </div>
                                );
                            })}
                            <Button type="button" onClick={() => append({ location: "" })} className="add-location-btn"
                                disabled={fields.length > 0 && locationStatuses[fields.length - 1] !== "valid"}>
                                + Add Location
                            </Button>
                            {errors.locations && <span className="error-message">{errors.locations.message}</span>}
                        </Field>

                    </Flex>

                    <Field label="Categories" flex={3} width="50%">

                        {showCatHint && (
                            <div className="step3-ai-hint-bar">
                                <span>AI suggests: <strong>{aiSuggestedCategories.map(c => c.charAt(0) + c.slice(1).toLowerCase()).join(", ")}</strong></span>
                                <button type="button" className="step3-kbd-accept" onClick={() => setAiCategoriesAccepted(true)}>Accept</button>
                                <button type="button" className="step3-kbd-dismiss" onClick={() => { setAiCategoriesAccepted("dismissed"); setValue("categories", []); }}>Dismiss</button>
                            </div>
                        )}

                        <Controller name="categories" control={control} rules={{ required: "Categories are required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={categories}
                                    isMulti
                                    value={
                                        field.value?.length > 0
                                            ? field.value
                                            : aiCategoriesAccepted === true && aiSuggestedCategories
                                                ? aiSuggestedCategories.map(cat => ({
                                                    value: cat.toUpperCase(),
                                                    label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
                                                }))
                                                : aiCategoriesAccepted === "dismissed"
                                                    ? []
                                                    : categoriesArray?.map(cat => ({
                                                        value: cat.toUpperCase(),
                                                        label: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
                                                    })) || []
                                    }
                                    placeholder="Select categories..."
                                    onChange={selectedOptions => field.onChange(selectedOptions)}
                                    styles={selectStyles}
                                />
                            )}
                        />
                        {errors.categories && <span className="error-message">{errors.categories.message}</span>}
                    </Field>

                </Stack>
            </Card.Root>
        </form>
    );
};

export default Step3;