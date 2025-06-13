import React, { useState, useCallback } from "react";
import { format } from "date-fns";

const AttendanceReport = ({ joinedBy }) => {
  const [username, setUsername] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleSearchUser = useCallback(
    (e) => {
      const searchValue = e.target.value;
      setUsername(searchValue);
      setShowSuggestions(true);

      const filteredMemberList = joinedBy?.filter((user) => {
        return user.user.fullName
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });

      setFilteredMembers(filteredMemberList || []);
    },
    [joinedBy]
  );

  const handleSelectSuggestion = useCallback((name, id) => {
    setSelectedUserId(id);
    setUsername(name);
    setShowSuggestions(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;

    try {
      const response = await fetch(
        `http://localhost:7000/home/attendence-report?username=${selectedUserId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setAttendance(data.attendanceArray || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleDateHover = useCallback((date) => {
    setHoveredDate(date);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredDate(null);
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      {hoveredDate && (
        <div className="lg:hidden fixed top-4 left-4 right-4 z-50 p-3 bg-gray-900 text-white text-xs rounded shadow-lg border border-gray-700">
          <div className="font-medium mb-1 text-blue-400">
            Date: {hoveredDate.date}
          </div>
          {hoveredDate.value === 1 ? (
            <>
              <div className="mb-1">
                <span className="text-blue-300">Check In Time:</span>{" "}
                {hoveredDate.checkInTime
                  ? new Date(hoveredDate.checkInTime).toLocaleTimeString()
                  : "Not marked"}
              </div>
              <div className="mb-1">
                <span className="text-blue-300">Check Out Time:</span>{" "}
                {hoveredDate.checkOutTime
                  ? new Date(hoveredDate.checkOutTime).toLocaleTimeString()
                  : "Not marked"}
              </div>
            </>
          ) : (
            <div className="text-red-300">Absent</div>
          )}
        </div>
      )}

      {attendance.length === 0 ? (
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <label className="text-gray-200 text-lg my-1 font-medium">
            Username
          </label>
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                value={username}
                onChange={handleSearchUser}
                placeholder="Enter the username"
                required
              />
              {username && showSuggestions && filteredMembers.length > 0 && (
                <ul className="absolute top-11 z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md max-h-40 overflow-y-auto">
                  {filteredMembers.map((entry) => (
                    <li
                      key={entry.user._id}
                      onClick={() =>
                        handleSelectSuggestion(
                          entry.user.fullName,
                          entry.user._id
                        )
                      }
                      className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-sm"
                    >
                      {entry.user.fullName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg text-white font-semibold md:w-auto w-full"
            >
              Show Report
            </button>
          </div>
        </form>
      ) : (
        <div className="relative">
          <button
            className="bg-blue-500 hover:bg-blue-400 p-2 rounded-md mb-4"
            onClick={() => setAttendance([])}
          >
            Reset
          </button>

          {/* Mobile Carousel */}
          <div className="lg:hidden relative px-6">
            <div className="overflow-x-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentMonthIndex * 100}%)`,
                }}
              >
                {attendance.map((month, monthIndex) => (
                  <div key={monthIndex} className="w-full flex-shrink-0 px-2">
                    <div className="flex flex-col items-center gap-1 w-full">
                      <span className="text-xs text-gray-400 mb-1">
                        {months[monthIndex]}
                      </span>
                      <div className="flex flex-col gap-[2px] w-full h-[120px]">
                        {Array.from({
                          length: Math.ceil(month.length / 7),
                        }).map((_, weekIndex) => (
                          <div
                            key={weekIndex}
                            className="flex gap-[2px] flex-1"
                          >
                            {Array.from({ length: 7 }).map(
                              (_, dayInWeekIndex) => {
                                const dayIndex = weekIndex * 7 + dayInWeekIndex;
                                const day = month[dayIndex];

                                if (!day)
                                  return (
                                    <div
                                      key={dayInWeekIndex}
                                      className="flex-1"
                                    ></div>
                                  );

                                let intensity = "bg-gray-700";
                                if (day.value === -1) intensity = "bg-gray-200";
                                else if (day.value === 0)
                                  intensity = "bg-red-500";
                                else if (day.value === 1)
                                  intensity = "bg-green-500";

                                return (
                                  <div
                                    key={dayIndex}
                                    className="relative flex-1"
                                    onMouseEnter={() =>
                                      day.value !== -1 && handleDateHover(day)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                    onTouchStart={() =>
                                      day.value !== -1 && handleDateHover(day)
                                    }
                                  >
                                    <div
                                      className={`w-full h-full ${intensity} rounded-sm hover:scale-110 transition-transform ${
                                        day.value !== -1
                                          ? "cursor-pointer"
                                          : "cursor-default"
                                      }`}
                                    ></div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel buttons */}
            {currentMonthIndex > 0 && (
              <button
                onClick={() =>
                  setCurrentMonthIndex((prev) => Math.max(0, prev - 1))
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white bg-gray-700/80 hover:bg-gray-600/80 rounded-full w-8 h-8 flex items-center justify-center"
              >
                &lt;
              </button>
            )}
            {currentMonthIndex < attendance.length - 1 && (
              <button
                onClick={() =>
                  setCurrentMonthIndex((prev) =>
                    Math.min(attendance.length - 1, prev + 1)
                  )
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700/80 text-white hover:bg-gray-600/80 rounded-full w-8 h-8 flex items-center justify-center"
              >
                &gt;
              </button>
            )}
            <div className="text-center text-xs text-gray-400 mt-2">
              {currentMonthIndex + 1} / {attendance.length}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {attendance.map((month, monthIndex) => (
              <div
                key={monthIndex}
                className="flex flex-col items-center gap-1 w-full"
              >
                <span className="text-xs text-gray-400 mb-1">
                  {months[monthIndex]}
                </span>
                <div className="flex flex-col gap-[2px] w-full h-[120px]">
                  {Array.from({ length: Math.ceil(month.length / 7) }).map(
                    (_, weekIndex) => (
                      <div key={weekIndex} className="flex gap-[2px] flex-1">
                        {Array.from({ length: 7 }).map((_, dayInWeekIndex) => {
                          const dayIndex = weekIndex * 7 + dayInWeekIndex;
                          const day = month[dayIndex];

                          if (!day)
                            return (
                              <div
                                key={dayInWeekIndex}
                                className="flex-1"
                              ></div>
                            );

                          let intensity = "bg-gray-700";
                          if (day.value === -1) intensity = "bg-gray-200";
                          else if (day.value === 0) intensity = "bg-red-500";
                          else if (day.value === 1) intensity = "bg-green-500";

                          return (
                            <div
                              key={dayIndex}
                              className={`relative flex-1 ${
                                day.value !== -1 ? "group" : ""
                              }`}
                            >
                              <div
                                className={`w-full h-full ${intensity} rounded-sm hover:scale-110 transition-transform ${
                                  day.value !== -1
                                    ? "cursor-pointer"
                                    : "cursor-default"
                                }`}
                              ></div>
                              {day.value === 1 && (
                                <div className="absolute invisible group-hover:visible z-[999] w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-lg bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 border border-gray-700">
                                  <div className="font-medium mb-1 text-blue-400">
                                    Date: {day.eachDayAttendenceObj?.date}
                                  </div>
                                  <div className="mb-1">
                                    <span className="text-blue-300">
                                      Check In Time:
                                    </span>{" "}
                                    {day.eachDayAttendenceObj?.checkInTime
                                      ? new Date(
                                          day.eachDayAttendenceObj.checkInTime
                                        ).toLocaleTimeString()
                                      : "Not marked"}
                                  </div>
                                  <div className="mb-1">
                                    <span className="text-blue-300">
                                      Check Out Time:
                                    </span>{" "}
                                    {day.eachDayAttendenceObj?.checkOutTime
                                      ? new Date(
                                          day.eachDayAttendenceObj.checkOutTime
                                        ).toLocaleTimeString()
                                      : "Not marked"}
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
                                </div>
                              )}
                              {day.value === 0 && (
                                <div className="absolute invisible group-hover:visible z-[999] w-32 p-3 bg-gray-900 text-white text-xs rounded shadow-lg bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 border border-gray-700">
                                  <span className="font-medium mb-1 text-blue-400">
                                    Date: {day.eachDayAttendenceObj?.date}
                                  </span>
                                  <span className="text-red-300"> Absent</span>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
              <span className="text-gray-400">No data</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span className="text-gray-400">Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-gray-400">Present</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
