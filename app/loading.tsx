import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "18px",
        background: "#ffffff",
        color: "#09090b",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "48px",
          height: "48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid #e4e4e7",
            borderTopColor: "#16a34a",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "8px",
            background: "#09090b",
            color: "#ffffff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 800,
          }}
        >
          O
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#09090b" }}>
          Loading review data...
        </div>
        <div style={{ fontSize: "12px", color: "#71717a", marginTop: "2px" }}>
          Synchronizing state with Ovio engine
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
