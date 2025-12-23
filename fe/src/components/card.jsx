export default function TelemetryCard({ label, value, tag, }) {
  return (
    <div className="card t-card col m-2">
      <div className="card-body p-1">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="t-label">{label}</span>
        
        </div>
        <div className="t-value">
          {value ?? "-"} <span className="t-tag">{tag? tag : ""}</span>
        </div>

        

      </div>
    </div>
  );
}