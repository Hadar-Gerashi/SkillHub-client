import { useEffect ,useState} from 'react';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { useDispatch } from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import { useLocation } from "react-router-dom";

import { addToCart } from '../../features/cartSlice.js'
import { isOpenDrawer } from '../../features/cartSlice.js'
import { useParams } from 'react-router-dom';
import { getCourse } from '../../api/courseService.js'
import CoursesList from './CoursesList';
import './CourseDetails.css'


export const CourseDetails = () => {

  let dispatch = useDispatch()
  let id = useParams().id
  const [course, setCourse] = useState();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);



  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourse(id);
        console.log(res.data);
        setCourse(res.data);
      } catch (err) {
        console.log(err);
        alert("Error in getting the courses");
      }
    };

    fetchCourse();
  }, []);


  const items = [
    { value: "a", title: <p ><AccessTimeFilledIcon /><b><u> Open Date:</u></b></p>, text: <p> {course?.openingDate.substring(0, 10)}</p> },
    { value: "b", title: <p><ChairAltIcon /><b> <u>During:</u></b></p>, text: <p> {course?.long} meetings</p> },
    { value: "c", title: <p><LocalOfferIcon /><b><u> Price:</u></b></p>, text: <p> ${course?.price.toLocaleString()}</p> },
    { value: "d", title: <p>  <PlaceIcon /> <b><u> locations:</u></b></p>, text: <p> {course?.locations.map((location, index) => (<span key={index}>{` ${location} , `}</span>))}</p> }
  ]

  return (
    <>
      <div className="course-container">

        <img className="image-show" src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course?.img}`} alt={course?.name} />

        <div className="course-content">
          <h2 className="course-title">- {course?.name} -</h2>
          <br />
          <p><b>Open Date:</b> {course?.openingDate.substring(0, 10)}</p>
          <p><b>During:</b> {course?.long} meetings</p>
          <p><b>Locations: </b> {course?.locations.map((location, index) => (
            <span key={index}>{`${location} ,`}</span>
          ))}</p>
          <p><b>Category:</b> {course?.categories.map((category, index) => (
            <span key={index}>{`${category.toLowerCase()} , `}</span>
          ))}</p>
          <div className="price-row">
            <span className="old-price">${(course?.price + 1000).toLocaleString()}</span>
            <span className="current-price">${course?.price.toLocaleString()}</span>
          </div>
          <p className='other-color course-description'>
            {course?.describe}
          </p>

          <button className="add-cart"
            onClick={() => {
              dispatch(addToCart(course))
              dispatch(isOpenDrawer(true))
            }}>
            add to cart
          </button>
        </div>
      </div>

      <div className='courses-list-container'>
        <h1 className="show-more-title">- SHOW MORE -</h1>
        <CoursesList type="Show" />
      </div>
    </>
  );
}

export default CourseDetails;


