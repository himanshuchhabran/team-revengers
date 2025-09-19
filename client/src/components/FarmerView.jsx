// src/components/FarmerView.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import styles from "./styles.js";
import QRCode from "./QRCode.jsx";

const FarmerView = () => {
  const [produceName, setProduceName] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const qrRef = useRef(null); // ref for QRCode canvas

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post("http://localhost:3001/produce", {
        name: produceName,
      });
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred. Is the backend server running?"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `produce-qr.png`;
        link.click();
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.h2}>Farmer Dashboard</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="produceName" style={styles.label}>
              Produce Name
            </label>
            <input
              type="text"
              id="produceName"
              value={produceName}
              onChange={(e) => setProduceName(e.target.value)}
              style={styles.input}
              placeholder="e.g., Wheat"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Produce"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.resultBox}>
            <h3 style={{ fontWeight: "600", color: "#14532d" }}>
              {result.message || "Produce registered"}
            </h3>

            {(() => {
              const produceId = result.produceId || result.id || result._id;

              return (
                <>
                  <p style={styles.p}>
                    Produce ID:{" "}
                    <strong
                      style={{
                        fontFamily: "monospace",
                        backgroundColor: "#f1f5f9",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                      }}
                    >
                      {produceId || "unknown"}
                    </strong>
                  </p>

                  <div style={styles.qrContainer} ref={qrRef}>
                    {produceId ? (
                      <QRCode
                        value={`http://localhost:5173/?id=${produceId}`}
                        size={192}
                      />
                    ) : (
                      <div style={{ color: "#64748b" }}>
                        No ID available to generate QR.
                      </div>
                    )}
                  </div>

                  {produceId && (
                    <button
                      onClick={handleDownload}
                      style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#15803d",
                        color: "white",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                      }}
                    >
                      Download QR
                    </button>
                  )}
                </>
              );
            })()}

            <p
              style={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              Scan this QR Code to trace the produce.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerView;
