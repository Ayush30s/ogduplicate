import { useEffect, useState } from "react";
import GymCard from "./gymcard";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PendingPaymentGyms = () => {
  const loggedInUser = useSelector((store) => store.login);
  const userId = loggedInUser.user.userId;
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequestedGyms = async () => {
      try {
        const res = await fetch(
          `https://gymbackenddddd-1.onrender.com/home/gym/requested`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        console.log(data);
        setGyms(data);
      } catch (err) {
        setError("Failed to load gyms pending payment.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestedGyms();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-10 text-blue-400 font-medium">
        Loading gyms pending payment...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-4">{error}</div>;
  }

  if (gyms.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No gyms found waiting for payment completion.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Gyms Waiting for Payment
        </h1>
        <p className="text-gray-400 mb-8">
          These gyms have accepted your join request. Complete payment to
          finalize your membership.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <Link key={gym._id} to={`/home/gym/${gym._id}`}>
              <GymCard
                data={gym}
                showPaymentButton={true} // You might want to modify GymCard to handle this
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingPaymentGyms;
