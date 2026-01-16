import React from "react";
import { useNavigate } from "react-router-dom";

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at center, #000010 20%, #000 80%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Orbitron, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        🌞 Solar System Simulator
      </h1>
      <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
        Explore planets and experience real-time 3D orbits.
      </p>
      <button
        onClick={() => navigate("/simulator")}
        style={{
          background: "#FFD700",
          color: "#000",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1.1rem",
          boxShadow: "0 0 15px rgba(255,215,0,0.4)",
        }}
      >
        🚀 Start Simulation
      </button>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          style={{
            background: "#FFD700",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 0 15px rgba(255,215,0,0.4)",
          }}
          onClick={() => navigate("/earth")}
        >
          🌏 Earth
        </button>
        <button
          onClick={() => navigate("/saturn")}
          style={{
            background: "#FFD700",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 0 15px rgba(255,215,0,0.4)",
          }}
        >
          🪐 Saturn
        </button>
        <button
          onClick={() => navigate("/jupiter")}
          style={{
            background: "#FFD700",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 0 15px rgba(255,215,0,0.4)",
          }}
        >
          🪐 Jupiter
        </button>
        <button
          onClick={() => navigate("/venus")}
          style={{
            background: "#FFD700",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 0 15px rgba(255,215,0,0.4)",
          }}
        >
          🟠 Venus
        </button>
        <button
          onClick={() => navigate("/mercury")}
          style={{
            background: "#FFD700",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 0 15px rgba(255,215,0,0.4)",
          }}
        >
          🟠 Mercury
        </button>
        <button
          onClick={() => navigate("/mars")}
          style={{
            background: "#FFD700",
            color: "#000",
            padding: "12px 24px",
            borderRadius: "8px",
            marginTop: "1rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 0 15px rgba(255,215,0,0.4)",
          }}
        >
          🟠 Mars
        </button>
      </div>
    </div>
  );
}
