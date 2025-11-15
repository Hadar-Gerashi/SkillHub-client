import Swal from "sweetalert2";
import { Button, Card, Input, Stack } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import Alert from "@mui/material/Alert";
import Grow from "@mui/material/Grow";
import { FaCreditCard, FaLock } from "react-icons/fa";

import { deleteCart } from "../../features/cartSlice.js";
import { addOrder } from "../../api/ordersService.js";
import { Field } from "../../components/ui/field.jsx";
import "../auth/Login.css";
import './Checkout.css';

const Checkout = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm();

  const firstError = errors.cardNumber?.message || errors.expiryDate?.message || errors.cvv?.message;

  const courses = useSelector((state) => state.cart.arr);
  const sum = useSelector((state) => state.cart.sum);
  const count = useSelector((state) => state.cart.count);
  const userId = useSelector((state) => state.users.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const show = () => {
    Swal.fire({
      title: "Payment sent successfully!",
      text: "Thank you for your purchase!",
      icon: "success",
      confirmButtonText: "Close",
      confirmButtonColor: "#3085d6",
      background: "#fefefe",
      customClass: { popup: "thank-you-popup" },
    }).then(() => {
      navigate("/");
    });
  };

  const onSubmit = async (data) => {
    if (!userId) return navigate("/login");

    try {
      alert("Processing payment...");
      await addOrder({ count, totalSum: sum, courses, userId }, userId.token);
      show();
      dispatch(deleteCart());
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.error(err);
    }
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    e.target.value = value;
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    const formattedValue = value.replace(/(\d{2})(?=\d)/g, "$1/");
    e.target.value = formattedValue;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = formattedValue;
  };

  return (
    <div>
      <Card.Root className="form-checkout">
        <Card.Header>
          <Card.Title>Payment Information</Card.Title>
        </Card.Header>

        <Card.Body>
          <Stack gap="4" w="full">


            <Field label="Card Type" className="field-label">
              <Controller
                name="cardType"
                control={control}
                rules={{
                  required: "Card type is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Visa", label: "Visa" },
                      { value: "Mastercard", label: "Mastercard" },
                      { value: "American Express", label: "American Express" },
                    ]}
                    placeholder="Select a card type"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        color: "black",
                        width: "250px",
                        backgroundColor: "white",
                        border: "1px solid black",
                        borderColor: state.isFocused ? "#ffffff" : "#cccccc",
                        outline: "none",
                        boxShadow: state.isFocused ? "0 0 10px rgba(196, 198, 200, 0.5)" : "none",

                        transition: "all 0.3s ease-in-out",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "black",


                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        color: "black",
                        backgroundColor: isFocused ? "white" : "white",

                      }),
                    }}
                  />
                )}
              />
            </Field>


            <Field label="Card Number" className="field-label">
              <Input
                {...register("cardNumber", {
                  required: "Card number is required",
                  pattern: {
                    value: /^(\d{4}\s?){4}$/,
                    message: "Card number must be 16 digits",
                  },
                })}
                className={`input-checkout ${errors.cardNumber ? "error-border" : ""}`}
                placeholder="**** **** **** ****"
                maxLength={19}
                onInput={handleCardNumberChange}
              />
              <FaCreditCard className="input-icon card-icon" />
            </Field>


            <div className="form-row">
              <Field label="Expiry Date" className="field-label">
                <Input
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                    pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "Expiry date must be in MM/YY format" },
                  })}
                  className={`input-checkout ${errors.expiryDate ? "error-border" : ""}`}
                  placeholder="MM/YY"
                  maxLength={5}
                  onInput={handleExpiryDateChange}
                />
              </Field>

              <Field label="CVV" className="field-label">
                <div className="input-wrapper">
                  <Input
                    {...register("cvv", {
                      required: "CVV is required",
                      pattern: { value: /^\d{3,4}$/, message: "CVV must be 3 or 4 digits" },
                    })}
                    className={`input-checkout ${errors.cvv ? "error-border" : ""}`}
                    placeholder="***"
                    maxLength={4}
                    onInput={handleCvvChange}
                  />
                  <FaLock className="input-icon" />
                </div>
              </Field>
            </div>

          </Stack>
        </Card.Body>

        <div className="error-container">
          {firstError && (
            <Grow in={Boolean(firstError)} timeout={500} key={firstError}>
              <Alert severity="error" className="error-message">
                {firstError}
              </Alert>
            </Grow>
          )}
        </div>

        <Card.Footer justifyContent="flex-end">
          <Button
            className="btn-checkout"
            variant="solid"
            onClick={handleSubmit(onSubmit)}
            disabled={sum === 0}
          >
            Pay Now
          </Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
};

export default Checkout;



