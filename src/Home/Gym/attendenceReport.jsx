import React, { useState, useCallback } from "react";
import { format } from "date-fns";

const AttendanceReport = ({ joinedBy }) => {
  const [username, setUsername] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredDate, setHoveredDate] = useState("2025-01-01");
  const [selectedUserId, setSelectedUserId] = useState();
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );

  const monthNames = [
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

  const handleSearchUser = (e) => {
    setUsername(e.target.value);
    const filteredMemberList = joinedBy?.filter((user) => {
      let allMatch = true;
      let searchValue = e.target.value;
      let fullName = user.user.fullName;
      for (let index = 0; index < searchValue.length; index++) {
        if (
          searchValue[index]?.toUpperCase() !== fullName[index]?.toUpperCase()
        ) {
          allMatch = false;
          break;
        }
      }
      return allMatch;
    });

    setShowSuggestions(filteredMemberList);
  };

  // const handleSearchUser = useCallback(
  //   (e) => {
  //     const searchValue = e.target.value;
  //     setUsername(searchValue);
  //     setShowSuggestions(true);

  //     const filteredMemberList = joinedBy?.filter((user) => {
  //       return user.user.fullName
  //         .toLowerCase()
  //         .includes(searchValue.toLowerCase());
  //     });

  //     setFilteredMembers(filteredMemberList || []);
  //   },
  //   [joinedBy]
  // );

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
        `https://gymbackenddddd-1.onrender.com/home/attendence-report?username=${selectedUserId}`,
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

  console.log(attendance);

  const handleDateHover = useCallback((monthIndex, dayIndex, value) => {
    if (value === null) return;

    const year = new Date().getFullYear();
    const date = new Date(year, monthIndex, dayIndex + 1);
    setHoveredDate(value);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredDate(null);
  }, []);

  return (
    <div className="relative text-white rounded-xl flex flex-row justify-between items-center align-middle mx-auto">
      <div className={`flex flex-col w-[100%]`}>
        {attendance.length == 0 ? (
          <form
            className="w-[100%] flex flex-col items-start relative mb-2"
            onSubmit={handleSubmit}
          >
            <label className="text-gray-200 text-lg my-1 font-medium">
              Username
            </label>
            <div className="w-[100%] flex flex-row justify-between relative">
              <div className="w-[100%]">
                <input
                  type="text"
                  className="w-[40%] p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
                  value={username}
                  onChange={handleSearchUser}
                  placeholder="Enter the username"
                  required
                />
                {username && showSuggestions && showSuggestions.length > 0 && (
                  <ul className="absolute top-11 z-10 mt-1 w-[30%] bg-gray-800 border border-gray-600 rounded-md max-h-40 overflow-y-auto">
                    {showSuggestions.map((entry) => (
                      <li
                        key={entry.user._id}
                        onClick={() =>
                          handleSelectSuggestion(
                            entry.user.fullName,
                            entry.user._id
                          )
                        }
                        className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                      >
                        {entry.user.fullName}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg mx-2 text-white font-semibold w-[20%] sm:w-auto"
                >
                  Show Report
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            className="absolute bg-blue-500 p-2 rounded-md ml-3"
            onClick={() => setAttendance([])}
          >
            Reset
          </button>
        )}

        {attendance.length > 0 && (
          <div className="w-full h-auto p-2 flex overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {attendance?.map((month, monthIndex) => (
              <div
                key={monthIndex}
                className="mt-10 flex flex-col items-center gap-1"
              >
                <span className="text-xs text-gray-400 mb-1">
                  {months[monthIndex]}
                </span>

                <div className="w-32 flex flex-wrap gap-1 justify-center">
                  {month.map((day, dayIndex) => {
                    let intensity = "bg-gray-700";
                    const attendanceData = day.value;

                    if (day.value == -1) intensity = "bg-gray-200";
                    else if (day.value == 0) intensity = "bg-red-500";
                    else intensity = "bg-green-500";

                    return (
                      <div
                        key={dayIndex}
                        className={`relative ${
                          attendanceData !== -1 ? "group" : ""
                        }`}
                      >
                        <div
                          className={`w-4 h-4 ${intensity} rounded-sm hover:scale-110 transition-transform cursor-pointer`}
                        ></div>

                        {attendanceData === 1 && (
                          <div className="absolute invisible group-hover:visible z-[999] w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-lg bottom-[calc(100%)] left-1/2 transform -translate-x-1/2 border border-gray-700">
                            <div className="font-medium mb-1 text-blue-400">
                              Date: {day?.eachDayAttendenceObj?.date}
                            </div>
                            <div className="mb-1">
                              <span className="text-blue-300">
                                Check In Time:
                              </span>{" "}
                              {day?.eachDayAttendenceObj?.checkInTime
                                ? new Date(
                                    day.eachDayAttendenceObj.checkInTime
                                  ).toLocaleTimeString()
                                : "Not marked"}
                            </div>
                            <div className="mb-1">
                              <span className="text-blue-300">
                                Check Out Time:
                              </span>{" "}
                              {day?.eachDayAttendenceObj?.checkOutTime
                                ? new Date(
                                    day.eachDayAttendenceObj.checkOutTime
                                  ).toLocaleTimeString()
                                : "Not marked"}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
                          </div>
                        )}

                        {attendanceData === 0 && (
                          <div className="absolute invisible group-hover:visible z-[999] w-32 p-3 bg-gray-900 text-white text-xs rounded shadow-lg bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 border border-gray-700">
                            <spam className="font-medium mb-1 text-blue-400">
                              Date: {day?.eachDayAttendenceObj?.date}
                            </spam>
                            <spam className="text-red-300">Absent</spam>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-0 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AttendanceReport;
