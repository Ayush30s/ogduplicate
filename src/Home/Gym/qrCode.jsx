import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const QRCodeGenerator = ({ gymId, sessionId }) => {
  const canvasRef = useRef(null);
  const [token, setToken] = useState(null);

  const now = new Date();
  const currDate =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const getAttendanceToken = async ({ gymId, sessionId, date }) => {
    const response = await fetch(
      "http://localhost:7000/register/generate-qr-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gymId, sessionId, date }),
        credentials: "include",
      }
    );

    const data = await response.json();
    return data.token;
  };

  useEffect(() => {
    const generateTokenAndQRCode = async () => {
      try {
        const token = await getAttendanceToken({
          gymId,
          sessionId,
          date: currDate,
        });
        setToken(token);

        if (canvasRef.current && token) {
          QRCode.toCanvas(canvasRef.current, token, { width: 256 }, (err) => {
            if (err) console.error("QR code error:", err);
          });
        }
      } catch (err) {
        console.error("Failed to generate token:", err);
      }
    };

    generateTokenAndQRCode();
  }, [gymId, sessionId, currDate]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCodeGenerator;
