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
  const backend = "https://gymbackenddddd-1.onrender.com";

  const makePayment = async () => {
    try {
      const res = await fetch(
        "https://gymbackenddddd-1.onrender.com/payment/makepayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            gymId,
          }),
        }
      );

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
    <div className="payment-gateway">
      <div className="payment-header">
        <h2>Complete Your Membership</h2>
        <button onClick={onClose} className="close-btn" aria-label="Close">
          &times;
        </button>
      </div>

      <div className="payment-details">
        <p className="amount-display">
          <strong>Amount:</strong> <span>₹{monthlyCharge}</span>
        </p>
        <p className="description">Monthly membership fee for gym access</p>
      </div>

      <div className="form-group">
        <label htmlFor="mobile">Mobile Number</label>
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
        />
      </div>

      <button className="p-2 font-medium text-green-600" onClick={makePayment}>
        Make Dummy Payment
      </button>

      <button
        onClick={pay}
        className="pay-button"
        disabled={isProcessing || !mobile || mobile.length !== 10}
      >
        {isProcessing ? "Processing..." : `Pay ₹${monthlyCharge}`}
      </button>

      <style jsx>{`
        .payment-gateway {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px 24px;
          max-width: 420px;
          margin: 0 auto;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          font-family: "Segoe UI", sans-serif;
          color: #1e1e1e;
        }

        .payment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .payment-header h2 {
          font-size: 1.6rem;
          font-weight: 600;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #888;
          transition: color 0.3s ease;
        }

        .close-btn:hover {
          color: #d32f2f;
        }

        .payment-details {
          margin-bottom: 24px;
        }

        .amount-display {
          font-size: 1.3rem;
          margin-bottom: 4px;
        }

        .amount-display span {
          font-weight: bold;
          color: #2e7d32;
        }

        .description {
          font-size: 0.95rem;
          color: #666;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          border-color: #1976d2;
          outline: none;
        }

        .pay-button {
          width: 100%;
          padding: 12px;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .pay-button:hover:not(:disabled) {
          background-color: #1565c0;
        }

        .pay-button:disabled {
          background-color: #cfd8dc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default PaymentGateway;
