import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getPendingInstructors, handleInstructorRequest } from "../../api/userService";
import { getPendingCourses, handleCourseApproval } from "../../api/courseService";
import SharedCourseCard from "../../component/instructor/CourseManagementCard";
import "./AdminDashboard.css";
import Loading from "../../component/common/Loading";

const AdminDashboard = () => {
    const currentUser = useSelector((state) => state.users.currentUser);
    const navigate = useNavigate();
    const [pendingInstructors, setPendingInstructors] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("instructors");

    useEffect(() => {
        if (!currentUser || currentUser.role !== "ADMIN") { navigate("/"); return; }
        fetchData();
    }, []);

    const handleAuthError = (err) => {
        if (err.response?.status === 401) {
            navigate("/login");
            return true;
        }
        return false;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [instructorsRes, coursesRes] = await Promise.all([
                getPendingInstructors(currentUser.token),
                getPendingCourses(currentUser.token),
            ]);
            setPendingInstructors(instructorsRes.data);
            setPendingCourses(coursesRes.data);
        } catch (err) {
            if (!handleAuthError(err))
                console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInstructor = async (userId, action) => {
        try {
            await handleInstructorRequest(userId, action, currentUser.token);
            setPendingInstructors((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            if (!handleAuthError(err))
                alert("Error: " + err.response?.data?.title);
        }
    };

    const handleCourse = async (courseId, action) => {
        try {
            await handleCourseApproval(courseId, action, currentUser.token);
            setPendingCourses((prev) => prev.filter((c) => c._id !== courseId));
        } catch (err) {
            if (!handleAuthError(err))
                alert("Error: " + err.response?.data?.title);
        }
    };

    if (loading)
        return (
            <div className="loading-container">
                <Loading />
            </div>
        );

    return (
        <div className="admin-dashboard">

            <h1 className="admin-title">- Admin Dashboard -</h1>
            <p className="admin-subtitle">Review and manage pending requests</p>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === "instructors" ? "active" : ""}`}
                    onClick={() => setActiveTab("instructors")}
                >
                    Pending Instructors
                    {pendingInstructors.length > 0 && (
                        <span className="badge">{pendingInstructors.length}</span>
                    )}
                </button>
                <button
                    className={`tab-btn ${activeTab === "courses" ? "active" : ""}`}
                    onClick={() => setActiveTab("courses")}
                >
                    Pending Courses
                    {pendingCourses.length > 0 && (
                        <span className="badge">{pendingCourses.length}</span>
                    )}
                </button>
            </div>

            {activeTab === "instructors" && (
                <div className="tab-content">
                    {pendingInstructors.length === 0 ? (
                        <p className="empty-msg">No pending instructor requests</p>
                    ) : (
                        pendingInstructors.map((user) => (
                            <div key={user._id} className="pending-card">
                                <div className="pending-info">
                                    <h3>{user.name}</h3>
                                    <p>{user.email}</p>
                                    <span className="pending-tag">Pending Instructor</span>
                                </div>
                                <div className="pending-actions">
                                    <button className="approve-btn" onClick={() => handleInstructor(user._id, "approve")}>
                                        Approve
                                    </button>
                                    <button className="reject-btn" onClick={() => handleInstructor(user._id, "reject")}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "courses" && (
                <div className="tab-content">
                    {pendingCourses.length === 0 ? (
                        <p className="empty-msg">No pending courses</p>
                    ) : (
                        <div className="admin-courses-grid">
                            {pendingCourses.map((course) => (
                                <SharedCourseCard
                                    key={course._id}
                                    course={course}
                                    mode="admin"
                                    onApprove={(id) => handleCourse(id, "approve")}
                                    onReject={(id) => handleCourse(id, "reject")}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;