import { useEffect, useState, useRef } from "react";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { addToCart, isOpenDrawer } from "../../features/cartSlice.js";
import { getCourse } from "../../api/courseService.js";
import CoursesList from "./CoursesList";
import SessionsTable from "../../component/common/Sessionstable";
import LocationsList from "../../component/common/Locationslist";
import { DAY_NAMES, parseLocalDate } from "../../utils/courseutils.js";
import "./CourseDetails.css";

const TABS = ["About", "Details", "Sessions"];

export const CourseDetails = () => {
  const dispatch = useDispatch();
  const id = useParams().id;
  const [course, setCourse] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourse(id);
        setCourse(res.data);
      } catch (err) {
        console.log(err);
        alert("Error in getting the courses");
      }
    };
    fetchCourse();
  }, []);

  useEffect(() => {
    if (descRef.current) {
      setIsClamped(descRef.current.scrollHeight > descRef.current.clientHeight);
    }
  }, [course]);

  if (!course) return null;

  const meetingDays = course.daysOfWeek?.length
    ? course.daysOfWeek.map((d) => DAY_NAMES[d]).join(" & ")
    : null;

  const openingFormatted = parseLocalDate(course.openingDate).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="course-page-wrapper">

      <div className="course-container">

        <img
          className="image-show"
          src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course.img}`}
          alt={course.name}
        />

        <div className="course-content">

          {course.categories?.length > 0 && (
            <div className="course-category-badges">
              {course.categories.map((cat, i) => (
                <span key={i} className="course-category-badge">
                  {cat.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          <h2 className="course-title">{course.name}</h2>

          <div className="price-row">
            <span className="old-price">${(course.price + 50).toLocaleString()}</span>
            <span className="current-price">${course.price.toLocaleString()}</span>
          </div>

          <div className="course-tabs">
            <div className="tabs-nav">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  className={`tab-btn${activeTab === i ? " active" : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className={`tab-panel${activeTab === 0 ? " active" : ""}`}>
              <p
                ref={descRef}
                className={`other-color course-description${expanded ? " course-description--expanded" : ""}`}
                style={{
                  WebkitLineClamp: expanded ? "unset" : 9,
                }}
              >
                {course.describe}
              </p>
              {isClamped && !expanded && (
                <span className="cd-read-toggle" onClick={() => setExpanded(true)}>
                  Read more...
                </span>
              )}
              {expanded && (
                <span className="cd-read-toggle" onClick={() => setExpanded(false)}>
                  Show less
                </span>
              )}
            </div>

            <div className={`tab-panel${activeTab === 1 ? " active" : ""}`}>
              <table className="sessions-table">
                <tbody>
                  <tr>
                    <td className="col-icon"><AccessTimeFilledIcon className="detail-icon" /></td>
                    <td className="col-day">Opens</td>
                    <td>{openingFormatted}</td>
                  </tr>
                  <tr>
                    <td className="col-icon"><ChairAltIcon className="detail-icon" /></td>
                    <td className="col-day">Duration</td>
                    <td>{course.long} meetings</td>
                  </tr>
                  {meetingDays && (
                    <tr>
                      <td className="col-icon"><CalendarMonthIcon className="detail-icon" /></td>
                      <td className="col-day">Days</td>
                      <td>{meetingDays}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="col-icon col-icon--top"><PlaceIcon className="detail-icon" /></td>
                    <td className="col-day col-day--top">Location</td>
                    <td><LocationsList locations={course.locations} /></td>
                  </tr>
                  <tr>
                    <td className="col-icon"><LocalOfferIcon className="detail-icon" /></td>
                    <td className="col-day">Category</td>
                    <td>{course.categories.map((c) => c.toLowerCase()).join(", ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`tab-panel${activeTab === 2 ? " active" : ""}`}>
              <SessionsTable
                sessions={course.sessions}
                emptyMessage="No sessions scheduled yet."
                tableClassName="sessions-table"
              />
            </div>
          </div>

          <button
            className="add-cart"
            onClick={() => {
              dispatch(addToCart(course));
              dispatch(isOpenDrawer(true));
            }}
          >
            Add To Cart
          </button>

        </div>
      </div>

      <div className="courses-list-container">
        <h1 className="show-more-title">- SHOW MORE -</h1>
        <CoursesList type="Show" />
      </div>

    </div>
  );
};

export default CourseDetails;