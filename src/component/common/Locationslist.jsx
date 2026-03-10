import { useState } from "react";

const LOCATIONS_PREVIEW = 2;
const LocationsList = ({
  locations,
  containerClass = "locations-list",
  itemClass = "location-item",
}) => {
  const [expanded, setExpanded] = useState(false);
  if (!locations?.length) return null;

  const visible = expanded ? locations : locations.slice(0, LOCATIONS_PREVIEW);
  const hidden  = locations.length - LOCATIONS_PREVIEW;

  return (
    <div className={containerClass}>
      {visible.map((loc, i) => (
        <div key={i} className={itemClass}>
          <span className="location-number">{i + 1}</span>
          <span className="location-text">{loc}</span>
        </div>
      ))}
      {locations.length > LOCATIONS_PREVIEW && (
        <button className="locations-toggle" onClick={() => setExpanded((p) => !p)}>
          {expanded ? "Show less ↑" : `+${hidden} more ↓`}
        </button>
      )}
    </div>
  );
};

export default LocationsList;