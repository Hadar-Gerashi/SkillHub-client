import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { requestInstructor } from "../../api/userService";
import { userIn } from "../../features/userSlice";
import "./BecomeInstructor.css";

const BecomeInstructor = () => {
  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // "idle"    → לא התחיל כלום (ברירת מחדל)
  // "loading" → הבקשה בדרך לשרת
  // "success" → הבקשה הצליחה
  // "error"   → הבקשה נכשלה
  const [status, setStatus] = useState("idle");

  const handleRequest = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setStatus("loading");
    try {
      await requestInstructor(currentUser.token);
      dispatch(userIn({ ...currentUser, instructorRequestStatus: "PENDING" }));
      setStatus("idle");
    } catch (err) {
      const msg = err.response?.data?.title || "";
      // זה הודעה שהיא לא באמת שגיאה לכן כן נעדכן נעדכן את הסטטוס ל-PENDING
      if (msg.includes("already") || msg.includes("pending")) {
        dispatch(userIn({ ...currentUser, instructorRequestStatus: "PENDING" }));
        setStatus("idle");
      } else {
        setStatus("error");
      }
    }
  };

  const renderStatus = () => {
    if (!currentUser) return null;

    if (currentUser.role === "ADMIN") {
      return <p className="role-note">You are an Admin - no need to apply.</p>;
    }

    if (currentUser.role === "INSTRUCTOR") {
      return <p className="role-note success-note">You are already an instructor!</p>;
    }

    if (currentUser.instructorRequestStatus === "PENDING") {
      return <p className="role-note pending-note">Your request is pending admin approval.</p>;
    }

    if (currentUser.instructorRequestStatus === "REJECTED") {
      return <p className="role-note error-note">Your request was rejected. You may apply again.</p>;
    }

    if (status === "error") {
      return <p className="role-note error-note">Something went wrong. Please try again.</p>;
    }

    return null;
  };

  const canApply =
    currentUser &&
    currentUser.role !== "ADMIN" &&
    currentUser.role !== "INSTRUCTOR" &&
    currentUser.instructorRequestStatus !== "PENDING";

  return (
    <div className="become-instructor-page">
      <div className="become-card">
        <h1>Become an Instructor</h1>
        <p className="become-sub">
          Share your knowledge and reach thousands of students on SkillHub.
          Submit a request and our team will review it shortly.
        </p>

        {renderStatus()}

        {canApply && (
          <button
            className="request-btn"
            onClick={handleRequest}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Request Instructor Access"}
          </button>
        )}

        {!currentUser && (
          <button className="request-btn" onClick={() => navigate("/login")}>
            Log in to Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default BecomeInstructor;
