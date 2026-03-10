import { useEffect, useRef, useState } from "react";

const ClampedText = ({ text, className, lines = 7, label }) => {
    const ref = useRef(null);
    const [isClamped, setIsClamped] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (ref.current) {
            setIsClamped(ref.current.scrollHeight > ref.current.clientHeight);
        }
    }, [text]);

    if (!text) return null;

    return (
        <>
            {label && (
                <span className="scc-clamped-label">{label}</span>
            )}
            <p
                ref={ref}
                className={className}
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: expanded ? "unset" : lines,
                    WebkitBoxOrient: "vertical",
                    overflow: expanded ? "visible" : "hidden",
                }}
            >
                {text}
            </p>
            {isClamped && !expanded && (
                <span className="scc-clamped-toggle" onClick={() => setExpanded(true)}>
                    Read more...
                </span>
            )}
            {expanded && (
                <span className="scc-clamped-toggle" onClick={() => setExpanded(false)}>
                    Show less
                </span>
            )}
        </>
    );
};

export default ClampedText


