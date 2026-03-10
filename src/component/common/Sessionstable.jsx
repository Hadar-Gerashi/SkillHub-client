import { useState } from "react";
import { parseLocalDate, PREVIEW_COUNT } from "../../utils/courseUtils";

const SessionsTable = ({
    sessions = [],
    emptyMessage = "No sessions scheduled yet.",
    tableClassName = "sessions-table",
}) => {
    const [modalOpen, setModalOpen] = useState(false);

    if (sessions.length === 0) {
        return <p className="sessions-empty">{emptyMessage}</p>;
    }

    const hiddenCount = sessions.length - PREVIEW_COUNT;

    const rows = (list) =>
        list.map((s, i) => {
            const d = parseLocalDate(s);
            return (
                <tr key={i}>
                    <td className="col-num">{i + 1}</td>
                    <td className="col-day">
                        {d.toLocaleDateString("en-GB", { weekday: "short" })}
                    </td>
                    <td>
                        {d.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                        })}
                    </td>
                </tr>
            );
        });

    return (
        <>
            <table className={tableClassName}>
                <thead>
                    <tr><th>#</th><th>Day</th><th>Date</th></tr>
                </thead>
                <tbody>{rows(sessions.slice(0, PREVIEW_COUNT))}</tbody>
            </table>

            {sessions.length > PREVIEW_COUNT && (
                <button className="sessions-toggle" onClick={() => setModalOpen(true)}>
                    +{hiddenCount} more ↓
                </button>
            )}

            {modalOpen && (
                <div className="sessions-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="sessions-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sessions-modal-header">
                            <h3>All Sessions · {sessions.length} meetings</h3>
                            <button className="sessions-modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <div className="sessions-modal-body">
                            <table className={tableClassName}>
                                <thead>
                                    <tr><th>#</th><th>Day</th><th>Date</th></tr>
                                </thead>
                                <tbody>{rows(sessions)}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SessionsTable;
