import { Card, Input, Stack } from "@chakra-ui/react";
import Alert from "@mui/material/Alert";
import Grow from "@mui/material/Grow";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

import { Field } from "../../../../components/ui/field.jsx";
import { DAY_NAMES, DAY_NAMES_HE, parseLocalDate, toDateStr } from "../../../../utils/sessionUtils.js";
import "./Step2.css";

const Step2 = ({
    register, errors, isEdit, details, getValues, setValue,
    selectedDays, setSelectedDays, sessions, skippedHolidays, regenerate, toggleDay,
    aiSuggestedLong, aiSuggestedPrice, aiPriceNote,
    aiLongAccepted, setAiLongAccepted,
    aiPriceAccepted, setAiPriceAccepted
}) => {
    const secondError = errors.openingDate?.message || errors.price?.message || errors.long?.message;

    const [longValue, setLongValue] = useState(
        getValues("long") || (isEdit ? String(details.course.long) : "")
    );
    const [priceValue, setPriceValue] = useState(
        getValues("price") || (isEdit ? String(details.course.price) : "")
    );

    const showLongGhost = aiSuggestedLong && !aiLongAccepted && !longValue;
    const showPriceGhost = aiSuggestedPrice && !aiPriceAccepted && !priceValue;

    const handleLongKeyDown = (e) => {
        if ((e.key === "Tab" || e.key === "Enter") && showLongGhost) {
            e.preventDefault();
            setAiLongAccepted(true);
            setLongValue(String(aiSuggestedLong));
            setValue("long", aiSuggestedLong, { shouldValidate: true, shouldDirty: true });
            regenerate(getValues("openingDate"), aiSuggestedLong, selectedDays);
        }
    };

    const handlePriceKeyDown = (e) => {
        if ((e.key === "Tab" || e.key === "Enter") && showPriceGhost) {
            e.preventDefault();
            setAiPriceAccepted(true);
            setPriceValue(String(aiSuggestedPrice));
            setValue("price", aiSuggestedPrice, { shouldValidate: true, shouldDirty: true });
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="centered-form">
            <Card.Root border="0px" width="500px" className="step1">
                <Card.Header><Card.Title>Step 2</Card.Title></Card.Header>
                <Card.Body>
                    <Stack gap="4" w="full">

                        <Field label="Opening Date">
                            <input
                                type="hidden"
                                {...register("openingDate", { required: "Opening date is required" })}
                            />
                            <DatePicker
                                wrapperClassName="datepicker-full-width"
                                locale="en"
                                selected={getValues("openingDate") ? parseLocalDate(getValues("openingDate")) : null}
                                filterDate={(date) => date.getDay() !== 6}
                                onChange={(date) => {
                                    const dateStr = toDateStr(date);
                                    setValue("openingDate", dateStr, { shouldValidate: true, shouldDirty: true });
                                    const dayNum = date.getDay();
                                    const newDays = selectedDays.length ? selectedDays : [dayNum];
                                    if (!selectedDays.length) setSelectedDays(newDays);
                                    regenerate(dateStr, getValues("long"), newDays);
                                }}
                                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                dateFormat="dd/MM/yyyy"
                                customInput={<Input />}
                            />
                        </Field>

                        <Field label="Meeting Days (select one or more)">
                            <div className="day-buttons">
                                {DAY_NAMES.map((name, i) => {
                                    if (i === 6) return null;
                                    const isSelected = selectedDays.includes(i);
                                    return (
                                        <button key={i} type="button" onClick={() => toggleDay(i)} title={name}
                                            className={`day-btn${isSelected ? " day-btn--selected" : ""}`}>
                                            {DAY_NAMES_HE[i]}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedDays.length === 0 && <span className="day-error">Please select at least one day</span>}
                            {selectedDays.length > 0 && <span className="day-selected-label">Selected: {selectedDays.map(d => DAY_NAMES[d]).join(" + ")}</span>}
                        </Field>

                        <Field label="Total Sessions">
                            <div className="step2-ghost-wrapper">
                                <Input
                                    type="number"
                                    value={longValue}
                                    onKeyDown={handleLongKeyDown}
                                    className="step2-input-transparent"
                                    {...register("long", {
                                        required: "Course length is required",
                                        min: { value: 3, message: "Must be at least 3 sessions" },
                                        max: { value: 50, message: "Must be at most 50 sessions" },
                                        onChange: (e) => {
                                            setLongValue(e.target.value);
                                            regenerate(getValues("openingDate"), e.target.value, selectedDays);
                                        }
                                    })}
                                />
                                {showLongGhost && (
                                    <div className="step2-ghost-inline">{aiSuggestedLong}</div>
                                )}
                            </div>
                            {showLongGhost && (
                                <span className="step2-ai-hint">
                                    <kbd className="step2-kbd">Tab</kbd> or <kbd className="step2-kbd">Enter</kbd> to accept AI suggestion ({aiSuggestedLong} sessions)
                                </span>
                            )}
                        </Field>

                        <Field label="Price (NIS)">
                            <div className="step2-ghost-wrapper">
                                <Input
                                    type="text"
                                    value={priceValue}
                                    onKeyDown={handlePriceKeyDown}
                                    className="step2-input-transparent"
                                    {...register("price", {
                                        required: "Price is required",
                                        validate: (value) => parseFloat(value) > 200 ? true : "Price must be above 200",
                                        onChange: (e) => setPriceValue(e.target.value),
                                    })}
                                />
                                {showPriceGhost && (
                                    <div className="step2-ghost-inline">{aiSuggestedPrice}</div>
                                )}
                            </div>
                            {showPriceGhost && (
                                <span className="step2-ai-hint">
                                    <kbd className="step2-kbd">Tab</kbd> or <kbd className="step2-kbd">Enter</kbd> to accept AI suggestion (₪{aiSuggestedPrice})
                                    {aiPriceNote && <span className="step2-price-note">· 💡 {aiPriceNote}</span>}
                                </span>
                            )}
                        </Field>

                        {sessions.length > 0 && (
                            <Field label={`Sessions Preview · ${sessions.length} meetings`}>
                                <div className="sessions-preview">
                                    {sessions.map((s, i) => (
                                        <span key={i} className="session-chip">
                                            #{i + 1}&nbsp;{parseLocalDate(s).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
                                        </span>
                                    ))}
                                </div>
                                {skippedHolidays.length > 0 && (
                                    <div className="skipped-holidays">
                                        <span className="skipped-label">Skipped – public holidays:</span>
                                        <div className="skipped-chips">
                                            {skippedHolidays.map((s, i) => (
                                                <span key={i} className="skipped-chip">
                                                    {parseLocalDate(s).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Field>
                        )}

                    </Stack>
                    <div className="error-container">
                        {secondError && (
                            <Grow in timeout={500} key={secondError}>
                                <Alert severity="error" className="error-show">{secondError}</Alert>
                            </Grow>
                        )}
                    </div>
                </Card.Body>
            </Card.Root>
        </form>
    );
};

export default Step2;