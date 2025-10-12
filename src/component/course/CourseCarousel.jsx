import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { getAllCourses } from '../../api/courseService.js';
import './CourseCarousel.css';

const CourseCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [hoveredCourseIndex, setHoveredCourseIndex] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses(1);
        console.log(res.data);
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching courses");
      }
    };

    fetchCourses();
  }, []);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length);
  };

  const handleCourseHover = (index) => {
    setShowCourseDetails(true);
    setHoveredCourseIndex(index);
  };

  const handleCourseLeave = () => {
    setShowCourseDetails(false);
    setHoveredCourseIndex(null);
  };

  const getVisibleCourses = () => {
    if (courses.length < 5) return courses;
    return [...courses, ...courses].slice(startIndex, startIndex + 5);
  };

  const visibleCourses = getVisibleCourses();

  return (
    <div className="carousel-container">
      <h1 className="courses-title"> OUR COURSES </h1>
      <div className="carousel-wrapper">

        <button className="carousel-arrow left" onClick={handlePrev}>
          <FaChevronLeft size={20} />
        </button>
        <div className="courses-wrapper">
          {visibleCourses.map((course, index) => (
            <Link to={"/details/" + course?._id}>
              <div
                key={index}
                className="course-card"
                onMouseEnter={() => handleCourseHover(startIndex + index)}
                onMouseLeave={handleCourseLeave}
              >
                <img
                  src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course?.img}`}
                  alt={course.title}
                  className="course-image"
                />
                <div

                  className={`course-details ${showCourseDetails && hoveredCourseIndex === startIndex + index ? 'show' : ''}`}
                >
                  <h2><b>{course.name}</b></h2>
                  <p>{course.motivation}</p>
                  <p className="course-price">price: {course.price}$</p>
                </div>
                <div className="course-title-overlay">
                  {course.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button className="carousel-arrow right" onClick={handleNext}>
          <FaChevronRight size={20} />
        </button>

      </div>
    </div>
  );
};

export default CourseCarousel;
