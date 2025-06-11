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
    try {
      const res = await fetch("http://localhost:7000/payment/makepayment", {
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

  return (
    <div className="bg-white rounded-2xl p-7 max-w-md mx-auto shadow-xl font-sans text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Complete Your Membership</h2>
        <button
          onClick={onClose}
          className="text-gray-500 text-2xl leading-none hover:text-red-600 focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg mb-1">
          <strong>Amount:</strong>{" "}
          <span className="text-green-700 font-bold">₹{monthlyCharge}</span>
        </p>
        <p className="text-sm text-gray-600">
          Monthly membership fee for gym access
        </p>
      </div>

      <div className="mb-5">
        <label htmlFor="mobile" className="block mb-1 font-medium">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      <button
        onClick={makePayment}
        className={`w-full py-3 text-white text-base font-medium rounded-lg transition-colors ${
          isProcessing || !mobile || mobile.length !== 10
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isProcessing || !mobile || mobile.length !== 10}
      >
        {isProcessing ? "Processing..." : `Pay ₹${monthlyCharge}`}
      </button>
    </div>
  );
}

export default PaymentGateway;
