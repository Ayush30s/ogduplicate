import { useState } from "react";

function PaymentGateway({
  userId,
  gymId,
  monthlyCharge,
  onSuccess,
  onClose,
  setIsPaymentDone,
}) {
  const [mobile, setMobile] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const backend = "http://localhost:7000";

  const makePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${backend}/payment/makepayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          gymId,
        }),
      });

      if (!res.ok) {
        throw new Error("Payment request failed");
      }

      const data = await res.json();

      if (data.success) {
        setIsPaymentDone(true);
        onSuccess();
      } else {
        throw new Error(data.message || "Payment update failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const pay = async () => {
    if (!mobile || mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`${backend}/payment/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: monthlyCharge * 100, // Convert to paise
          mobile,
          gymId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Open payment in new tab
        const paymentWindow = window.open(data.checkoutUrl, "_blank");

        // Poll for payment completion
        const checkPaymentStatus = async () => {
          try {
            const statusResponse = await fetch(
              `${backend}/payment/verify-payment/${data.paymentId}`,
              {
                credentials: "include",
              }
            );

            const statusData = await statusResponse.json();

            if (statusData.paymentStatus === "SUCCESS") {
              onSuccess();
              paymentWindow.close();
              setIsProcessing(false);
            } else if (statusData.paymentStatus === "FAILED") {
              throw new Error("Payment failed");
            } else {
              // Continue polling
              setTimeout(checkPaymentStatus, 2000);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              "Payment verification failed. Please check your payment history."
            );
            setIsProcessing(false);
          }
        };

        // Start polling
        setTimeout(checkPaymentStatus, 3000);
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const CloseButton = () => (
    <button
      className="p-2 bg-gray-500 hover:bg-gray-700 text-gray-300 rounded-full transition-all duration-200 hover:text-white hover:rotate-90"
      onClick={() => onClose(-1)}
      aria-label="Close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M6.225 6.225a.75.75 0 011.06 0L12 10.94l4.715-4.715a.75.75 0 111.06 1.06L13.06 12l4.715 4.715a.75.75 0 11-1.06 1.06L12 13.06l-4.715 4.715a.75.75 0 11-1.06-1.06L10.94 12 6.225 7.285a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
        <div className="flex justify-between align-middle items-center mb-6">
          <h2 className="text-lg font-bold text-white">
            Complete Your Membership
          </h2>
          <CloseButton />
        </div>

        <div className="mb-6 bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 font-medium">Amount:</span>
            <span className="text-green-400 font-bold text-xl">
              ₹{monthlyCharge}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Monthly membership fee for gym access
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="mobile"
            className="block mb-2 text-gray-300 font-medium"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Enter 10-digit mobile number"
            pattern="[0-9]{10}"
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>

        <button
          onClick={makePayment}
          className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${
            isProcessing || !mobile || mobile.length !== 10
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isProcessing || !mobile || mobile.length !== 10}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            `Pay ₹${monthlyCharge}`
          )}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Secure payment processing powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;
