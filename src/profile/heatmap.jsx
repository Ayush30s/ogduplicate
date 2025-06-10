import { useState } from "react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const HeatMapComponent = ({ profileData }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [hoveredDay, setHoveredDay] = useState(null);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      {/* Mobile hover info display (fixed at top) */}
      {hoveredDay && (
        <div className="lg:hidden fixed top-4 left-4 right-4 z-50 p-3 bg-gray-900 text-white text-xs rounded shadow-lg border border-gray-700">
          <div className="font-medium mb-1 text-blue-400">
            Date: {hoveredDay.Date}
          </div>
          <div className="mb-1">
            <span className="text-blue-300">Duration:</span>{" "}
            {hoveredDay.totalWorkoutTime} minutes
          </div>
          <div className="mb-1">
            <span className="text-blue-300">Calories Burned:</span>{" "}
            {hoveredDay.caloriesBurned} Kcal
          </div>
          {Object.keys(hoveredDay).some((key) =>
            key.startsWith("BodyPart-")
          ) && (
            <div className="mb-1">
              <span className="text-blue-300">Body Parts:</span>{" "}
              {Object.keys(hoveredDay)
                .filter((key) => key.startsWith("BodyPart-"))
                .map((key) => key.replace("BodyPart-", ""))
                .join(", ")}
            </div>
          )}
          {Object.keys(hoveredDay).some((key) =>
            key.startsWith("Exercise-")
          ) && (
            <div>
              <span className="text-blue-300">Exercises:</span>{" "}
              {Object.keys(hoveredDay)
                .filter((key) => key.startsWith("Exercise-"))
                .map((key) => key.replace("Exercise-", ""))
                .join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Mobile Carousel (hidden on desktop) */}
      <div className="lg:hidden relative px-6">
        <div className="overflow-x-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentMonthIndex * 100}%)` }}
          >
            {profileData.HeatMap?.map((month, monthIndex) => (
              <div key={monthIndex} className="w-full flex-shrink-0 px-2">
                <div className="flex flex-col items-center gap-1 w-full">
                  <span className="text-xs text-gray-400 mb-1">
                    {months[monthIndex]}
                  </span>
                  <div className="flex flex-col gap-[2px] w-full h-[120px]">
                    {Array.from({ length: Math.ceil(month.length / 7) }).map(
                      (_, weekIndex) => (
                        <div key={weekIndex} className="flex gap-[2px] flex-1">
                          {Array.from({ length: 7 }).map(
                            (_, dayInWeekIndex) => {
                              const dayIndex = weekIndex * 7 + dayInWeekIndex;
                              const day = month[dayIndex];

                              if (!day) {
                                return (
                                  <div
                                    key={dayInWeekIndex}
                                    className="flex-1"
                                  ></div>
                                );
                              }

                              let intensity = "bg-gray-700";
                              const hasWorkoutData = day.totalWorkoutTime > 0;

                              if (hasWorkoutData) {
                                if (day.totalWorkoutTime < 30)
                                  intensity = "bg-blue-900/70";
                                else if (day.totalWorkoutTime < 60)
                                  intensity = "bg-blue-700";
                                else if (day.totalWorkoutTime < 120)
                                  intensity = "bg-blue-500";
                                else intensity = "bg-blue-400";
                              }

                              return (
                                <div
                                  key={dayIndex}
                                  className="relative flex-1"
                                  onMouseEnter={() =>
                                    hasWorkoutData && setHoveredDay(day)
                                  }
                                  onMouseLeave={() => setHoveredDay(null)}
                                  onTouchStart={() =>
                                    hasWorkoutData && setHoveredDay(day)
                                  }
                                >
                                  <div
                                    className={`w-full h-full ${intensity} rounded-sm hover:scale-110 transition-transform ${
                                      hasWorkoutData
                                        ? "cursor-pointer"
                                        : "cursor-default"
                                    }`}
                                  ></div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation buttons */}
        {currentMonthIndex > 0 && (
          <button
            onClick={() =>
              setCurrentMonthIndex((prev) => Math.max(0, prev - 1))
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/80 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Previous month"
          >
            &lt;
          </button>
        )}
        {currentMonthIndex < profileData.HeatMap.length - 1 && (
          <button
            onClick={() =>
              setCurrentMonthIndex((prev) =>
                Math.min(profileData.HeatMap.length - 1, prev + 1)
              )
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700/80 hover:bg-gray-600/80 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Next month"
          >
            &gt;
          </button>
        )}
        {/* Month indicator */}
        <div className="text-center text-xs text-gray-400 mt-2">
          {currentMonthIndex + 1} / {profileData.HeatMap.length}
        </div>
      </div>

      {/* Desktop Grid (hidden on mobile) */}
      <div className="hidden lg:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {profileData.HeatMap?.map((month, monthIndex) => (
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
                          <div key={dayInWeekIndex} className="flex-1"></div>
                        );

                      let intensity = "bg-gray-700";
                      const hasWorkoutData = day.totalWorkoutTime > 0;

                      if (hasWorkoutData) {
                        if (day.totalWorkoutTime < 30)
                          intensity = "bg-blue-900/70";
                        else if (day.totalWorkoutTime < 60)
                          intensity = "bg-blue-700";
                        else if (day.totalWorkoutTime < 120)
                          intensity = "bg-blue-500";
                        else intensity = "bg-blue-400";
                      }

                      return (
                        <div
                          key={dayIndex}
                          className={`relative flex-1 ${
                            hasWorkoutData ? "group" : ""
                          }`}
                        >
                          <div
                            className={`w-full h-full ${intensity} rounded-sm hover:scale-110 transition-transform ${
                              hasWorkoutData
                                ? "cursor-pointer"
                                : "cursor-default"
                            }`}
                          ></div>
                          {hasWorkoutData && (
                            <div className="absolute invisible group-hover:visible z-[999] w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-lg bottom-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 border border-gray-700">
                              <div className="font-medium mb-1 text-blue-400">
                                Date: {day.Date}
                              </div>
                              <div className="mb-1">
                                <span className="text-blue-300">Duration:</span>{" "}
                                {day.totalWorkoutTime} minutes
                              </div>
                              <div className="mb-1">
                                <span className="text-blue-300">
                                  Calories Burned:
                                </span>{" "}
                                {day.caloriesBurned} Kcal
                              </div>
                              {Object.keys(day).filter((key) =>
                                key.startsWith("BodyPart-")
                              ).length > 0 && (
                                <div className="mb-1">
                                  <span className="text-blue-300">
                                    Body Parts:
                                  </span>{" "}
                                  {Object.keys(day)
                                    .filter((key) =>
                                      key.startsWith("BodyPart-")
                                    )
                                    .map((key) => key.replace("BodyPart-", ""))
                                    .join(", ")}
                                </div>
                              )}
                              {Object.keys(day).filter((key) =>
                                key.startsWith("Exercise-")
                              ).length > 0 && (
                                <div>
                                  <span className="text-blue-300">
                                    Exercises:
                                  </span>{" "}
                                  {Object.keys(day)
                                    .filter((key) =>
                                      key.startsWith("Exercise-")
                                    )
                                    .map((key) => key.replace("Exercise-", ""))
                                    .join(", ")}
                                </div>
                              )}
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
          <div className="w-3 h-3 bg-gray-700 rounded-sm"></div>
          <span className="text-gray-400">No workout</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-900/70 rounded-sm"></div>
          <span className="text-gray-400">1-30 min</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
          <span className="text-gray-400">30-60 min</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span className="text-gray-400">60-120 min</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
          <span className="text-gray-400">120+ min</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMapComponent;
