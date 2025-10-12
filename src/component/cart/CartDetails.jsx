import CourseInCart from "../CourseInCart";
import StepperInput from "./StepperInput";


const CartDetails = ({ course }) => {

  return (<>
    <StepperInput course={course} />
    <CourseInCart course={course} />
  </>)

};

export default CartDetails;
