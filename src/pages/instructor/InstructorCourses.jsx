import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getMyCourses, resubmitCourse, deleteCourse } from "../../api/courseService";
import SharedCourseCard from "../../component/instructor/CourseManagementCard";
import Loading from "../../component/common/Loading";
import "./InstructorCourses.css";

const PAGE_TABS = ["all", "approved", "pending", "rejected"];

const MyCourses = () => {
    const currentUser = useSelector((state) => state.users.currentUser);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (!currentUser || (currentUser.role !== "INSTRUCTOR" && currentUser.role !== "ADMIN")) {
            navigate("/"); return;
        }
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        setLoading(true);
        try {
            const res = await getMyCourses(currentUser.token);
            setCourses(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleResubmit = async (courseId) => {
        try {
            await resubmitCourse(courseId, currentUser.token);
            setCourses((prev) => prev.map((c) => c._id === courseId ? { ...c, status: "pending" } : c));
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401 || err.response?.status === 403) { navigate("/login"); return; }
            alert("Failed to resubmit course");
        }
    };

    const handleDelete = async (courseId) => {
        try {
            await deleteCourse(courseId, currentUser.token);
            setCourses((prev) => prev.filter((c) => c._id !== courseId));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete course");
        }
    };

    const filtered = filter === "all" ? courses : courses.filter((c) => c.status === filter);
    const counts = {
        all: courses.length,
        approved: courses.filter((c) => c.status === "approved").length,
        pending: courses.filter((c) => c.status === "pending").length,
        rejected: courses.filter((c) => c.status === "rejected").length,
    };

    if (loading)
        return (
            <div className="loading-container">
                <Loading />
            </div>
        );

    return (
        <div className="mc-page">
            <div className="mc-page-header">
                <div>
                    <h1 className="mc-page-title">- MY COURSES -</h1>
                    <p className="mc-page-subtitle">
                        {courses.length} course{courses.length !== 1 ? "s" : ""} in your portfolio
                    </p>
                </div>
                <button className="mc-add-btn" onClick={() => navigate("/add")}>+ Add New Course</button>
            </div>

            {courses.length > 0 && (
                <div className="mc-page-tabs">
                    {PAGE_TABS.map((tab) => (
                        <button key={tab} className={`mc-page-tab ${filter === tab ? "active" : ""}`} onClick={() => setFilter(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="mc-page-tab-count">{counts[tab]}</span>
                        </button>
                    ))}
                </div>
            )}

            {filtered.length === 0 && (
                <div className="mc-empty">
                    <p>No {filter !== "all" ? filter : ""} courses found.</p>
                    {filter === "all" && (
                        <button className="mc-add-btn" onClick={() => navigate("/add")}>+ Add Your First Course</button>
                    )}
                </div>
            )}

            <div className="mc-list">
                {filtered.map((course) => (
                    <SharedCourseCard
                        key={course._id}
                        course={course}
                        mode="instructor"
                        onResubmit={handleResubmit}
                        onDelete={handleDelete}
                        onNavigate={(path, opts) => navigate(path, opts)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyCourses;