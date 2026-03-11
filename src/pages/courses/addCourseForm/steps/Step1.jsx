import { Card, Input, Stack, Textarea } from "@chakra-ui/react";
import Alert from "@mui/material/Alert";
import Grow from "@mui/material/Grow";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";

import { Field } from "../../../../components/ui/field.jsx";
import { enhanceCourse } from "../../../../api/aiService.js";
import "./Step1.css";

const Step1 = ({ register, errors, isEdit, details, setValue, trigger, getValues, onAiSuggest }) => {
    const firstError = errors.name?.message || errors.describe?.message || errors.motivation?.message;
    const currentUser = useSelector((state) => state.users.currentUser);

    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [describeValue, setDescribeValue] = useState(
        getValues("describe") || (isEdit ? details.course.describe : "")
    );
    const [motivationValue, setMotivationValue] = useState(
        getValues("motivation") || (isEdit ? details.course.motivation : "")
    );
    const debounceTimer = useRef(null);

    const fetchSuggestion = async (name) => {
        if (!name || name.length < 3) { setAiSuggestion(null); return; }
        if (isEdit) return;
        setIsLoading(true);
        try {
            const res = await enhanceCourse(name, currentUser?.token);
            setAiSuggestion(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameChange = (e) => {
        setAiSuggestion(null);
        if (!isEdit) {
            setDescribeValue("");
            setMotivationValue("");
        }
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => fetchSuggestion(e.target.value), 1000);
    };

    const handleDescribeKeyDown = (e) => {
        if ((e.key === "Tab" || e.key === "Enter") && aiSuggestion?.describe && !describeValue) {
            e.preventDefault();
            setDescribeValue(aiSuggestion.describe);
            setValue("describe", aiSuggestion.describe, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleMotivationKeyDown = (e) => {
        if ((e.key === "Tab" || e.key === "Enter") && aiSuggestion?.motivation && !motivationValue) {
            e.preventDefault();
            setMotivationValue(aiSuggestion.motivation);
            setValue("motivation", aiSuggestion.motivation, { shouldValidate: true, shouldDirty: true });
            if (onAiSuggest) onAiSuggest({
                long: aiSuggestion.long,
                categories: aiSuggestion.categories,
                price: aiSuggestion.price,
                priceNote: aiSuggestion.priceNote,
            });
            setAiSuggestion(null);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="centered-form step1-form">
            <Card.Root className="step step1-card">
                <Card.Header>
                    <Card.Title className="step1-title">
                        Step 1
                        {isLoading && (
                            <span className="step1-ai-thinking">AI thinking...</span>
                        )}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Stack gap="4" w="full">

                        <Field label="Name">
                            <Input
                                defaultValue={isEdit ? details.course.name : ""}
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                                    onChange: handleNameChange,
                                })}
                            />
                        </Field>

                        <Field label="Describe">
                            <div className="step1-ghost-wrapper">
                                <Textarea
                                    value={describeValue}
                                    onKeyDown={handleDescribeKeyDown}
                                    className="step1-textarea"
                                    {...register("describe", {
                                        required: "Describe is required",
                                        minLength: { value: 25, message: "Describe must be at least 25 characters" },
                                        onChange: (e) => setDescribeValue(e.target.value),
                                    })}
                                />
                                {aiSuggestion?.describe && !describeValue && (
                                    <div className="step1-ghost-overlay">{aiSuggestion.describe}</div>
                                )}
                            </div>
                            {aiSuggestion?.describe && !describeValue && (
                                <span className="step1-ai-hint">
                                    <kbd className="step1-kbd">Tab</kbd> or <kbd className="step1-kbd">Enter</kbd> to accept
                                </span>
                            )}
                        </Field>

                        <Field label="Motivation">
                            <div className="step1-ghost-wrapper">
                                <Textarea
                                    value={motivationValue}
                                    onKeyDown={handleMotivationKeyDown}
                                    className="step1-textarea"
                                    {...register("motivation", {
                                        required: "Motivation is required",
                                        minLength: { value: 25, message: "Motivation must be at least 25 characters" },
                                        onChange: (e) => setMotivationValue(e.target.value),
                                    })}
                                />
                                {aiSuggestion?.motivation && !motivationValue && (
                                    <div className="step1-ghost-overlay">{aiSuggestion.motivation}</div>
                                )}
                            </div>
                            {aiSuggestion?.motivation && !motivationValue && (
                                <span className="step1-ai-hint">
                                    <kbd className="step1-kbd">Tab</kbd> or <kbd className="step1-kbd">Enter</kbd> to accept
                                </span>
                            )}
                        </Field>

                    </Stack>
                    <div className="error-container">
                        {firstError && (
                            <Grow in timeout={500} key={firstError}>
                                <Alert severity="error" className="error-show">{firstError}</Alert>
                            </Grow>
                        )}
                    </div>
                </Card.Body>
            </Card.Root>
        </form>
    );
};

export default Step1;