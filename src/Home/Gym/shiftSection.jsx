import { useState } from "react";

const ShiftsSection = ({
  shifts,
  gymId,
  userType,
  shiftJoinedIndex,
  setshiftJoinedIndex,
  joinStatus,
  joinRequestAccepted,
  isPaymentDone,
  setError,
  setMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const JoinShiftRequest = async (shiftId, index) => {
    if (!joinStatus && !(joinRequestAccepted && isPaymentDone)) {
      alert("You need to be a member of this gym to join a shift");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:7000/home/gym/${gymId}/join-shift/${shiftId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.status === 200) {
        setshiftJoinedIndex(index);
        setMessage(data.msg);
      } else {
        setError(data.msg);
      }
    } catch (error) {
      setError("Failed to join shift. Please try again.");
      console.error("Error joining shift:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-2xl font-semibold text-blue-400 mb-6">
        {shifts.length > 0 ? "Active Shifts" : "No Active Shifts"}
      </h3>

      {shifts.length > 0 ? (
        <div className="relative">
          {/* Mobile Carousel */}
          <div className="md:hidden relative overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {shifts.map((shift, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div
                    className={`p-5 rounded-lg border transition-colors ${
                      shiftJoinedIndex === index
                        ? "border-blue-500 bg-gray-700"
                        : "border-gray-600 bg-gray-700 hover:border-blue-500"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white text-lg font-medium">
                        {shift.sex} Shift
                      </span>
                      <span className="text-sm text-gray-400">
                        Limit: {shift.limit}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-400 my-3">
                      <span>{shift.startTime}</span>
                      <span className="text-gray-500">to</span>
                      <span>{shift.endTime}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-300 pt-3 border-t border-gray-600">
                      <span>
                        Joined:{" "}
                        <span className="text-white font-semibold">
                          {shift?.joinedBy?.length || 0}
                        </span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          shift.status === "Active"
                            ? "bg-green-900/20 text-green-400"
                            : "bg-red-900/20 text-red-400"
                        }`}
                      >
                        {shift.status || "Inactive"}
                      </span>
                    </div>

                    <div className="pt-4 flex justify-end">
                      {userType === "OWNER" ? (
                        <button className="text-sm text-blue-400 hover:text-white">
                          View Details
                        </button>
                      ) : (
                        <button
                          onClick={() => JoinShiftRequest(shift?._id, index)}
                          disabled={loading || shiftJoinedIndex === index}
                          className={`text-sm px-4 py-1.5 rounded-lg ${
                            shiftJoinedIndex === index
                              ? "bg-gray-600 text-gray-300"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {loading
                            ? "Processing..."
                            : shiftJoinedIndex === index
                            ? "Joined"
                            : "Join Shift"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {shifts.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentSlide === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/80 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-white text-xl">&lt;</span>
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      Math.min(prev + 1, shifts.length - 1)
                    )
                  }
                  disabled={currentSlide === shifts.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/80 rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-white text-xl">&gt;</span>
                </button>
              </>
            )}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map((shift, index) => (
              <div
                key={index}
                className={`p-5 rounded-lg border transition-colors ${
                  shiftJoinedIndex === index
                    ? "border-blue-500 bg-gray-700"
                    : "border-gray-600 bg-gray-700 hover:border-blue-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg font-medium">
                    {shift.sex} Shift
                  </span>
                  <span className="text-sm text-gray-400">
                    Limit: {shift.limit}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-400 my-3">
                  <span>{shift.startTime}</span>
                  <span className="text-gray-500">to</span>
                  <span>{shift.endTime}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-300 pt-3 border-t border-gray-600">
                  <span>
                    Joined:{" "}
                    <span className="text-white font-semibold">
                      {shift?.joinedBy?.length || 0}
                    </span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      shift.status === "Active"
                        ? "bg-green-900/20 text-green-400"
                        : "bg-red-900/20 text-red-400"
                    }`}
                  >
                    {shift.status || "Inactive"}
                  </span>
                </div>

                <div className="pt-4 flex justify-end">
                  {userType === "OWNER" ? (
                    <button className="text-sm text-blue-400 hover:text-white">
                      View Details
                    </button>
                  ) : (
                    <button
                      onClick={() => JoinShiftRequest(shift?._id, index)}
                      disabled={loading || shiftJoinedIndex === index}
                      className={`text-sm px-4 py-1.5 rounded-lg ${
                        shiftJoinedIndex === index
                          ? "bg-gray-600 text-gray-300"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {loading
                        ? "Processing..."
                        : shiftJoinedIndex === index
                        ? "Joined"
                        : "Join Shift"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Currently no shifts available
        </div>
      )}
    </div>
  );
};

export default ShiftsSection;
