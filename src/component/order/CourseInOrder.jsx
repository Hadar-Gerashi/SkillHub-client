import './CourseInOrder.css'

//קומפוננטה להצגת קורס בודד ברשימת ההזמנות
const CourseInOrder = ({ course, onDelete }) => {

    return (


        <tr key={course._id}>
            <td className="course-cell">
                <div className="course-row">
                    <img src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course?.img}`} width="100px" height="100px" alt={course.name} />
                    <div className="course-detail">
                        <strong className="course-name" >{course.name}</strong>
                        <p style={{ fontSize: "12px" }}><b> Open Date:</b> {course?.openingDate.substring(0, 10)}</p>
                        <p style={{ fontSize: "12px" }}><b> During:</b> {course?.long} meetings</p>
                        <p style={{ fontSize: "12px" }}><b> Price:</b> {course?.price}$</p>
                        <p style={{ fontSize: "12px" }}><b> Qty:</b> {course?.qty}</p>
                    </div>  </div>
                {course.description}
            </td>


        </tr>

    )
}
export default CourseInOrder;





