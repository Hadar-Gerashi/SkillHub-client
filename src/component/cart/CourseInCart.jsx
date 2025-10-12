import { useDispatch } from "react-redux";

import { removeFromCart } from '../../features/cartSlice.js';
import AlertDialog from "../common/AlertDialog.jsx";
import StepperInput from "../common/StepperInput.jsx";
import IsChecked from "../common/IsChecked.jsx";
import './CourseInCart.css';


//קומפוננטה להצגת קורס בודד בעגלת הקניות
const CourseInCart = ({ course, onDelete }) => {
    let dispatch = useDispatch()

    const deleted = () => {
        dispatch(removeFromCart(course._id))
        onDelete(course._id)
    };
    return (

        <tr key={course._id} className="course-info-row">
            <td className="course-info-cell">
                <div className="course-info-container">
                    <IsChecked course={course} checked={course.checked} dis={false} />
                    <img
                        src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course?.img}`}
                        alt={course.name}
                        width="100px"
                        height="100px"
                    />
                    <div className="course-text">
                        <strong className="course-name">{course.name}</strong>
                        <p className="course-date"><b> Open Date:</b> {course?.openingDate.substring(0, 10)}</p>
                        <p className="course-duration"><b> During:</b> {course?.long} meetings</p>
                    </div>
                </div>
                {course.description}
            </td>
            <td className="course-price">${course.price}</td>
            <td className="course-stepper">
                <StepperInput course={course} />
            </td>
            <td className="course-delete">
                <AlertDialog deleted={deleted} />
            </td>
        </tr>

    )

}
export default CourseInCart;
