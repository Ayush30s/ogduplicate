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
        `https://gymbackenddddd-1.onrender.com/home/gym/${gymId}/join-shift/${shiftId}`,
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
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                  shiftJoinedIndex === index
                    ? "border-blue-500 bg-gradient-to-br from-blue-900/20 to-gray-800 shadow-lg shadow-blue-500/10"
                    : "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5"
                } overflow-hidden group`}
              >
                {/* Glow effect for active shift */}
                {shiftJoinedIndex === index && (
                  <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                )}

                {/* Shift header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {shift.sex === "male" ? "♂ Male" : "♀ Female"} Shift
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Capacity: {shift?.joinedBy?.length || 0}/{shift.limit}{" "}
                      members
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      shift.status === "Active"
                        ? "bg-green-900/30 text-green-300"
                        : "bg-red-900/30 text-red-300"
                    }`}
                  >
                    {shift.status || "Inactive"}
                  </span>
                </div>

                {/* Time display */}
                <div className="flex items-center justify-center gap-3 my-5">
                  <div className="text-center">
                    <span className="block text-lg font-medium text-white">
                      {shift.startTime}
                    </span>
                    <span className="text-xs text-gray-400">Start</span>
                  </div>

                  <div className="w-10 h-px bg-gray-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500 bg-gray-800 px-1">
                        to
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="block text-lg font-medium text-white">
                      {shift.endTime}
                    </span>
                    <span className="text-xs text-gray-400">End</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Capacity</span>
                    <span>
                      {Math.round(
                        ((shift?.joinedBy?.length || 0) / shift.limit) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((shift?.joinedBy?.length || 0) / shift.limit) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-4 border-t border-gray-700/50">
                  {userType === "OWNER" ? (
                    <button className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Details
                    </button>
                  ) : (
                    <button
                      onClick={() => JoinShiftRequest(shift?._id, index)}
                      disabled={loading || shiftJoinedIndex === index}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                        shiftJoinedIndex === index
                          ? "bg-green-600/20 text-green-300 border border-green-500/30 cursor-default"
                          : loading
                          ? "bg-blue-600/50 text-white cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-blue-500/20"
                      } flex items-center justify-center gap-2`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      ) : shiftJoinedIndex === index ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Joined Successfully
                        </>
                      ) : (
                        "Join This Shift"
                      )}
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
