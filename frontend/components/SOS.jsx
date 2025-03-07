import React from "react";
import "./Sos.css";

function Sos() {
  const handleEmergency = () => {
    // Your emergency handling logic
    const emergencyNumber = "+911234567890";
    window.location.href = `tel:${emergencyNumber}`;
  };

  return (
    <div className="sos-container-left" onClick={handleEmergency}>
      <div className="sos-square">
        <div className="heartbeat-box">
          <span className="sos-text">SOS</span>
        </div>
      </div>
    </div>
  );
}

export default Sos;