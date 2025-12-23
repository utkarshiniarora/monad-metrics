import React, { useEffect, useState } from "react";
import axios from "axios";
import TelemetryGrid from "./components/grid";
import "./App.css";

export default function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      const res = await axios.get("http://localhost:3001/metrics");
      setTelemetry(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4">
      <div className="stars" />
      <h1>Monad Metrics</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <TelemetryGrid telemetry={telemetry} />
      )}
    </div>
  );
}
