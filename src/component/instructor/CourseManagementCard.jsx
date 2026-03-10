import { useState, useRef, useEffect } from "react";

import AlertDialog from "../common/AlertDialog";
import SessionsTable from "../common/Sessionstable";
import LocationsList from "../common/Locationslist";
import { DAY_NAMES, CARD_TABS, parseLocalDate } from "../../utils/courseutils";
import ClampedText from "../common/ClampedText";
import "./CourseManagementCard.css";

const getStatus = (course) => {
    if (course.hasPendingEdit && course.status === "approved")
        return { label: "Edit Pending Approval", cls: "s-pending-edit" };
    const map = {
        approved: { label: "Approved", cls: "s-approved" },
        pending: { label: "Pending Approval", cls: "s-pending" },
        rejected: { label: "Rejected", cls: "s-rejected" },
    };
    return map[course.status] || map.pending;
};
const IconClock = () => (
    <svg className="scc-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const IconChair = () => (
    <svg className="scc-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v6" /><path d="M18 2v6" /><path d="M6 8h12" /><path d="M6 12H4v8h16v-8h-2" /><path d="M9 20v-4" /><path d="M15 20v-4" />
    </svg>
);
const IconCalendar = () => (
    <svg className="scc-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconPin = () => (
    <svg className="scc-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);
const IconTag = () => (
    <svg className="scc-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);
const IconUser = () => (
    <svg className="scc-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const IconEdit = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const SharedCourseCard = ({
    course,
    mode = "instructor",
    onResubmit,
    onDelete,
    onApprove,
    onReject,
    onNavigate,
}) => {
    const [activeTab, setActiveTab] = useState(0);
    const [pendingExpanded, setPendingExpanded] = useState(false);
    const [imgOpen, setImgOpen] = useState(false);

    const isAdmin = mode === "admin";
    const status = getStatus(course);
    const canDelete = isAdmin || course.status !== "approved";

    const meetingDays = course.daysOfWeek?.length
        ? course.daysOfWeek.map((d) => DAY_NAMES[d]).join(" & ")
        : null;

    const openingFmt = course.openingDate
        ? parseLocalDate(course.openingDate).toLocaleDateString("en-GB", {
            day: "2-digit", month: "long", year: "numeric",
        })
        : null;

    const name = course?.name?.[0]?.toUpperCase() + course?.name?.slice(1)?.toLowerCase();

    const pendingEdit = course.hasPendingEdit ? course.pendingEditData : null;
    const pendingChanges = pendingEdit
        ? Object.keys(pendingEdit).filter((key) => {
            if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) return false;
            return JSON.stringify(pendingEdit[key]) !== JSON.stringify(course[key]);
        })
        : [];

    return (
        <div className="scc-card">

            <div className="scc-img-wrap" onClick={() => setImgOpen(true)}>
                <img
                    className="scc-img"
                    src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course?.img}`}
                    alt={name}
                />
            </div>

            {imgOpen && (
                <div className="scc-lightbox-overlay" onClick={() => setImgOpen(false)}>
                    <img
                        className="scc-lightbox-img"
                        src={`${import.meta.env.VITE_CLOUDINARY_URL}/${course?.img}`}
                        alt={name}
                    />
                </div>
            )}

            <div className="scc-content">

                <div className="scc-header">
                    <div className="scc-header-left">
                        {course.categories?.length > 0 && (
                            <span className="scc-cat-badge">{course.categories[0].toLowerCase()}</span>
                        )}
                        <h2 className="scc-title">{name}</h2>
                    </div>
                    <div>
                        {!isAdmin && (
                            <span className={`scc-status-badge ${status.cls}`}>{status.label}</span>
                        )}
                        {isAdmin && (
                            <span className={`scc-admin-tag ${course.hasPendingEdit ? "scc-update-tag" : ""}`}>
                                {course.hasPendingEdit ? "Edit Request" : "New Course"}
                            </span>
                        )}
                    </div>
                </div>

                <div className="scc-price-row">
                    <span className="scc-current-price">${course.price?.toLocaleString()}</span>
                </div>

                <div className="scc-divider" />

                <div className="scc-tabs-nav">
                    {CARD_TABS.map((t, i) => (
                        <button
                            key={t}
                            className={`scc-tab-btn${activeTab === i ? " active" : ""}`}
                            onClick={() => setActiveTab(i)}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className={`scc-tab-panel${activeTab === 0 ? " active" : ""}`}>
                    <ClampedText label="Motivation:" text={course.motivation} className="scc-motivation" lines={7} />
                    <ClampedText label="Description:" text={course.describe} className="scc-describe" lines={7} />
                </div>

                <div className={`scc-tab-panel${activeTab === 1 ? " active" : ""}`}>
                    <table className="scc-details-table">
                        <tbody>
                            {openingFmt && (
                                <tr>
                                    <td className="col-icon"><IconClock /></td>
                                    <td className="col-label">Opens</td>
                                    <td>{openingFmt}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="col-icon"><IconChair /></td>
                                <td className="col-label">Duration</td>
                                <td>{course.long} meetings</td>
                            </tr>
                            {meetingDays && (
                                <tr>
                                    <td className="col-icon"><IconCalendar /></td>
                                    <td className="col-label">Days</td>
                                    <td>{meetingDays}</td>
                                </tr>
                            )}
                            {course.locations?.length > 0 && (
                                <tr>
                                    <td className="col-icon col-icon--top"><IconPin /></td>
                                    <td className="col-label col-label--top">Location</td>
                                    <td>
                                        <LocationsList
                                            locations={course.locations}
                                            containerClass="scc-locations-list"
                                            itemClass="scc-location-item"
                                        />
                                    </td>
                                </tr>
                            )}
                            {course.categories?.length > 0 && (
                                <tr>
                                    <td className="col-icon"><IconTag /></td>
                                    <td className="col-label">Category</td>
                                    <td>{course.categories.map((c) => c.toLowerCase()).join(", ")}</td>
                                </tr>
                            )}
                            {isAdmin && course.instructorId && (
                                <tr>
                                    <td className="col-icon"><IconUser /></td>
                                    <td className="col-label">Instructor</td>
                                    <td>{course.instructorId.name}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={`scc-tab-panel${activeTab === 2 ? " active" : ""}`}>
                    <SessionsTable sessions={course.sessions} />
                </div>

                {!isAdmin && course.status === "pending" && !course.hasPendingEdit && (
                    <p className="scc-msg scc-msg-pending">Waiting for admin approval...</p>
                )}

                {!isAdmin && course.hasPendingEdit && course.status === "approved" && (
                    <div className="scc-msg scc-msg-pending">
                        <div className="scc-msg-pending-header">
                            <span>Your edit is waiting for admin approval.</span>
                            {pendingChanges.length > 0 && (
                                <button
                                    className="scc-msg-pending-toggle"
                                    onClick={() => setPendingExpanded((p) => !p)}
                                >
                                    {pendingExpanded ? "Hide ↑" : "See changes ↓"}
                                </button>
                            )}
                        </div>
                        {pendingExpanded && (
                            <ul className="scc-msg-pending-list">
                                {pendingChanges.map((key) => (
                                    <li key={key}>
                                        <b>{key}:</b>{" "}
                                        {Array.isArray(pendingEdit[key])
                                            ? pendingEdit[key].join(", ")
                                            : String(pendingEdit[key]).substring(0, 80)}
                                        {String(pendingEdit[key]).length > 80 ? "…" : ""}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="scc-msg-pending-note">
                            Course remains live with current content until approved.
                        </p>
                    </div>
                )}

                {!isAdmin && course.hasPendingEdit && course.status === "pending" && (
                    <p className="scc-msg scc-msg-pending">Updated details submitted - waiting for admin approval...</p>
                )}

                {!isAdmin && course.status === "rejected" && (
                    <p className="scc-msg scc-msg-rejected">Rejected by admin - edit and resubmit.</p>
                )}

                {!isAdmin && course.status === "approved" && !course.hasPendingEdit && (
                    <p className="scc-msg scc-msg-approved">Live - visible to all students.</p>
                )}

                <div className="scc-actions">
                    {!isAdmin && (
                        <>
                            <button
                                className="scc-btn-edit"
                                onClick={() =>
                                    onNavigate?.(`/edit/${course._id}`, {
                                        state: { status: "EDIT", details: { course } },
                                    })
                                }
                            >
                                <IconEdit /> Edit Course
                            </button>
                            {course.status === "rejected" && (
                                <button className="scc-btn-resubmit" onClick={() => onResubmit?.(course._id)}>
                                    Resubmit
                                </button>
                            )}
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <button className="scc-btn-approve" onClick={() => onApprove?.(course._id)}>Approve</button>
                            <button className="scc-btn-reject" onClick={() => onReject?.(course._id)}>Reject</button>
                        </>
                    )}

                    {canDelete && !isAdmin && (
                        <div className="scc-btn-delete">
                            <AlertDialog deleted={() => onDelete?.(course._id)} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SharedCourseCard;