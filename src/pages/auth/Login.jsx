import { Button, Card, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import Grow from "@mui/material/Grow";
import Fade from "@mui/material/Fade";
import { useEffect,useState } from "react";

import { Field } from "../../components/ui/field.jsx";
import { PasswordInput } from "../../components/ui/password-input.jsx";
import { login } from "../../api/userService.js";
import { userIn } from "../../features/userSlice.js";
import "./Login.css";


const Login = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessages, setErrorMessages] = useState([]);
    const [visibleError, setVisibleError] = useState(null);
    const firstError = errors.email?.message || errors.password?.message || errors.verification?.message;
    const onSubmit = async (data) => {
        let apiErrors = [];
        if (data.password != data.verification) {
            apiErrors.push("Incorrect verification");

            setErrorMessages(apiErrors);
        }




        else {
            try {
                const res = await login(data.email, data.password);
                dispatch(userIn(res.data));

                if (res.data.role === "ADMIN" && location.state?.referrer === "add") {
                    navigate("/add", { state: { pageFound: "3" } });
                } else {
                    navigate("/");
                }
            } catch (err) {
                console.error(err);


                if (err.response?.data?.message === "Incorrect password") {
                    apiErrors.push("Incorrect password, please try again.");
                } else if (err.status === 404) {
                    apiErrors.push("Incorrect email, please try again.");
                } else {
                    apiErrors.push(err.message || "An error occurred. Please try again.");
                }

                setErrorMessages(apiErrors);
            }
        }
    };

    useEffect(() => {

        if (errorMessages.length > 0) {
            setVisibleError(null);
            setTimeout(() => {
                setVisibleError(errorMessages[0]);
            }, 200);
        } else {
            setVisibleError(null);
        }
    }, [errorMessages]);

    return (
        <div className="form-login">
            <Card.Root className="card-login">
                <Card.Header>
                    <Card.Title>Login</Card.Title>
                    <Card.Description color="white">Fill in the form below to log in to your account</Card.Description>
                </Card.Header>
                <Card.Body>
                    <Stack gap="4" w="full">
                        <Field label="Email">
                            <Input
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zAport]{2,4}$/, message: "Enter a valid email." }
                                })}
                                className={`input-login ${errors.email ? "error-border" : ""}`}
                            />
                        </Field>


                        <Field label="Password">
                            <PasswordInput
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: { value: 7, message: "Password must be at least 7 characters." }
                                })}
                                className={`input-login ${errors.password ? "error-border" : ""}`}
                            />
                        </Field>

                        <Field label="Verification">
                            <PasswordInput
                                {...register("verification", {
                                    required: "Verification is required.",
                                    minLength: { value: 7, message: "Verification must be at least 7 characters." }
                                })}
                                className={`input-login ${errors.verification ? "error-border" : ""}`}
                            />
                        </Field>
                    </Stack>
                </Card.Body>

                <Collapse in={Boolean(visibleError)} timeout={300}>
                    <Fade in={Boolean(visibleError)} timeout={500}>
                        <div className="error-container">
                            {visibleError && (
                                <Alert severity="error" className="error-message">
                                    {visibleError}
                                </Alert>
                            )}
                        </div>
                    </Fade>
                </Collapse>


                <div className="error-container">
                    {firstError && (
                        <Grow in={Boolean(firstError)} timeout={500} key={firstError}>
                            <Alert severity="error" className="error-message">
                                {firstError}
                            </Alert>
                        </Grow>
                    )}
                </div>

                <Card.Footer justifyContent="flex-end" >
                    <p>Don't have an account?</p>
                    <Link to="/signup" className="link"
                        onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
                        Register
                    </Link>
                    <Button variant="solid" backgroundColor="white" color="black" onClick={handleSubmit(onSubmit)}>
                        Log in
                    </Button>
                </Card.Footer>

            </Card.Root>
        </div>
    );
};

export default Login;
