import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useSelector } from "react-redux";

const QRScannerButton = ({
  setAttendenceMarked,
  setAttendenceStatus,
  attendenceStatus,
  setQrScannerResponse,
}) => {
  const loggedIn = useSelector((state) => state.login);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  const markAttendance = async (token) => {
    try {
      const response = await fetch(
        `http://localhost:7000/home/gym/mark-attendance?status=${attendenceStatus}`,
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

      const data = await response.json();
      setQrScannerResponse(data.message);
      if (data.success) {
        setAttendenceMarked(true);
        setAttendenceStatus(!attendenceStatus);
        setTimeout(() => {
          setAttendenceMarked(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const startScanner = () => {
    setScanning(true);

    setTimeout(() => {
      const qrCodeSuccessCallback = (decodedText) => {
        console.log("Scanned QR Code:", decodedText);
        stopScanner();
        markAttendance(decodedText); // Pass token as-is
      };

      const config = { fps: 10, qrbox: 300 };
      scannerRef.current = new Html5Qrcode("qr-reader");

      scannerRef.current
        .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .catch((err) => {
          console.error("Failed to start QR scanner:", err);
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
    <>
      <button
        onClick={startScanner}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        🚀{" "}
        {!attendenceStatus
          ? "Scan QR to Mark Attendance In"
          : "Scan QR to Mark Attendance Out"}
      </button>

      {scanning && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
            <button
              onClick={stopScanner}
              className="absolute top-2 z-10 right-2 text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
            >
              ✖ Close
            </button>

            <div
              id="qr-reader"
              className="w-[350px] h-[350px] rounded-md overflow-hidden"
            />
            <p className="mt-4 text-gray-300 text-center text-sm">
              Align the QR code inside the box
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default QRScannerButton;
