import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../common/loading";

export default function PaymentStatus() {
  const [status, setStatus] = useState(null);
  const loc = useLocation();
  const txnId = new URLSearchParams(loc.search).get("txnId");

  useEffect(() => {
    fetch(`http://localhost:5000/payment-status?txnId=${txnId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setStatus(data))
      .catch(() => setStatus({ error: "Couldn't fetch status" }));
  }, [txnId]);

  if (!status) return <Loading />;

  return (
    <div>
      <h2>Payment Status for {txnId}</h2>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
