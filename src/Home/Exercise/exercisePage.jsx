import React, { useState, useEffect } from "react";

const ExercisePage = ({ exercise, onClose }) => {
  const [customTime, setCustomTime] = useState(
    convertToSeconds(exercise.timeLimit)
  );

  const [newExerciseObj, setNewExerciseObj] = useState(exercise);
  const [timeLeft, setTimeLeft] = useState(customTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [circleDashoffset, setCircleDashoffset] = useState(0);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        const offset = circumference - (timeLeft / customTime) * circumference;
        setCircleDashoffset(offset);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowDialog(true); // Show modal when time is up
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, customTime, circumference]);

  function convertToSeconds(timeStr) {
    const num = parseInt(timeStr);
    if (timeStr?.toLowerCase().includes("minute")) return num * 60;
    if (timeStr?.toLowerCase().includes("second")) return num;
    return 300;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    if (isNaN(s)) {
      return "00:00";
    }
    return `${m}:${s}`;
  }

  const handleTimeChange = (e) => {
    const newMinutes = Math.ceil(parseInt(e.target.value));
    const exerciseObj = { ...newExerciseObj, time: newMinutes };
    setNewExerciseObj(exerciseObj);
    const newTime = newMinutes * 60;
    setCustomTime(newTime);
    setTimeLeft(newTime);
    setCircleDashoffset(0);
  };

  const handleReset = () => {
    setShowDialog(true);
    setTimeLeft(customTime);
    setCustomTime(300);
    setIsRunning(false);
    setCircleDashoffset(0);
  };

  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = exercise.exerciseVideoURL
    ? getYouTubeId(exercise.exerciseVideoURL)
    : null;

  const handleStartExercise = async () => {
    try {
      const response = await fetch(
        `https://gymbackenddddd-1.onrender.com/workout/exercise/${exercise?.exerciseName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExerciseObj),
          credentials: "include",
        }
      );

      const data = await response.json();
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col h-screen w-full overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 py-2 px-5 flex justify-between items-center border-b border-indigo-700 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">{exercise.exercise}</h1>
          <p className="text-indigo-200">
            Focus: <span className="text-yellow-300">{exercise.focusPart}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Exercise Details */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">
              Exercise Details
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoBox label="Sets" value={exercise.sets} />
              <InfoBox label="Reps" value={exercise.reps} />
              <InfoBox label="Difficulty" value={exercise.difficulty} />
              <InfoBox
                label="Calories"
                value={`${exercise.caloriesBurned} kcal`}
              />
            </div>
            <div className="space-y-4">
              <InfoSection title="Equipment" content={exercise.equipment} />
              <InfoSection title="Rest Time" content={exercise.restTime} />
            </div>
          </div>

          {/* Timer */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Workout Timer</h2>
            <div className="bg-gray-700 p-6 rounded-lg flex flex-col items-center">
              <div className="relative w-36 h-36 mb-6">
                <svg className="absolute" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#1F2937"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#4F46E5"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circleDashoffset}
                    className="transition-all duration-1000 ease-linear"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-yellow-400">
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="flex gap-4 mb-6 w-full justify-center">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-3 rounded-lg font-bold text-white min-w-[120px] ${
                    isRunning
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isRunning ? "⏸ Pause" : "▶ Start"}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 font-bold text-white min-w-[120px]"
                >
                  🔄 Reset
                </button>
              </div>

              <div className="w-full max-w-xs">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Set Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  onChange={handleTimeChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center"
                  placeholder="Enter time"
                />
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Exercise Video
            </h2>
            {videoId ? (
              <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Exercise Tutorial"
                />
              </div>
            ) : (
              <div className="bg-gray-700 p-8 rounded-lg text-center">
                <p className="text-gray-400">No video available</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-2">Description</h3>
              <div className="bg-gray-700 p-4 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-gray-300 whitespace-pre-line">
                  {exercise.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDialog && customTime >= 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Do you want to save this exercise in your profile?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  handleStartExercise();
                  setShowDialog(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components for reuse
const InfoBox = ({ label, value }) => (
  <div className="bg-gray-700 p-3 rounded-lg">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white font-bold text-xl">{value}</p>
  </div>
);

const InfoSection = ({ title, content }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h3 className="text-indigo-300 font-semibold mb-2">{title}</h3>
    <p className="text-white">{content}</p>
  </div>
);

export default ExercisePage;
