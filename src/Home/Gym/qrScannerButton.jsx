import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useSelector } from "react-redux";

const QRScannerButton = ({ attendenceStatus, setAttendenceStatus }) => {
  const loggedIn = useSelector((state) => state.login);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  const markAttendance = async (token) => {
    let newAttendenceStatus = "Absent";
    if (attendenceStatus === "Absent") {
      newAttendenceStatus = "Checkout Pending";
    } else if (attendenceStatus === "Checkout Pending") {
      newAttendenceStatus = "Both Marked";
    }

    try {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/home/gym/mark-attendance?status=${attendenceStatus}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            userId: loggedIn.user.userId,
          }),
        }
      );

      if (!response.ok) {
        alert(newAttendenceStatus, " failed");
        return;
      }

      const data = await response.json();
      setAttendenceStatus(newAttendenceStatus);
      alert(data?.message || data?.error);
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const getResponsiveQrBox = () => {
    const minEdge = Math.min(window.innerWidth, window.innerHeight);
    return Math.floor(minEdge * 0.8); // 80% of smaller screen dimension
  };

  const startScanner = () => {
    setScanning(true);

    setTimeout(() => {
      const qrCodeSuccessCallback = (decodedText) => {
        stopScanner();
        markAttendance(decodedText);
      };

      const config = {
        fps: 10,
        qrbox: getResponsiveQrBox(),
      };

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            html5QrCode
              .start(
                { facingMode: "environment" },
                config,
                qrCodeSuccessCallback
              )
              .catch((err) => {
                console.error("Failed to start scanner:", err);
              });
          } else {
            console.warn("❌ No camera devices found.");
          }
        })
        .catch((err) => {
          console.error("Error getting cameras:", err);
        });
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current.clear();
          setScanning(false);
        })
        .catch((err) => console.error("Failed to stop scanner:", err));
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={startScanner}
        className="w-full max-w-md mx-auto px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
      >
        <span>
          {attendenceStatus == "Absent"
            ? "Scan QR to Mark Attendance In"
            : "Scan QR to Mark Attendance Out"}
        </span>
      </button>

      {scanning && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative bg-gray-900 rounded-xl shadow-2xl p-4 border border-gray-700 w-full max-w-md">
            <button
              onClick={stopScanner}
              className="absolute -top-3 -right-3 z-10 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-transform hover:scale-110 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="aspect-square w-full rounded-md overflow-hidden bg-black">
              <div
                id="qr-reader"
                className="w-full h-full max-w-full max-h-full"
              />
            </div>

            <p className="mt-4 text-gray-300 text-center text-sm font-medium">
              Align the QR code inside the frame
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScannerButton;
