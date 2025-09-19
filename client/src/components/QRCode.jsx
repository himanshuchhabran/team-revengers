// src/components/QRCode.jsx
import React, { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

// forwardRef allows parent to grab the canvas DOM node
const QRCode = forwardRef(({ value, size = 192 }, ref) => {
  if (!value) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        No QR
      </div>
    );
  }

  return (
    <QRCodeCanvas
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#000000"
      level="M"
      includeMargin={true}
      ref={ref} // <-- attach ref here
    />
  );
});

export default QRCode;
