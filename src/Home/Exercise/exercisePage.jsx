import React, { useState, useEffect, useMemo, useCallback } from "react";

const DEFAULT_RESET_SECONDS = 5 * 60;
const beepSound = new Audio("/audio/beep.wav");

const ExercisePage = ({ exercise, onClose }) => {
  const initialSeconds = useMemo(
    () => convertToSeconds(exercise?.timeLimit) ?? DEFAULT_RESET_SECONDS,
    [exercise?.timeLimit]
  );

  const [customTime, setCustomTime] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [circleDashoffset, setCircleDashoffset] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // We store a minimal payload used when saving to backend.
  const [exercisePayload, setExercisePayload] = useState(() =>
    buildInitialPayload(exercise)
  );

  useEffect(() => {
    const newPayload = buildInitialPayload(exercise);
    setExercisePayload(newPayload);
    const secs = convertToSeconds(exercise?.timeLimit) ?? DEFAULT_RESET_SECONDS;
    setCustomTime(secs);
    setTimeLeft(secs);
    setCircleDashoffset(0);
    setIsRunning(false);
  }, [exercise]);

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
      beepSound.play();
      setIsRunning(false);
      setShowDialog(true);
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, customTime, circumference]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) {
      setIsRunning(false);
      setShowDialog(true);
      setCircleDashoffset(calcOffset(0, customTime, circumference));
    }
  }, [timeLeft, isRunning, customTime, circumference]);

  const handleTimeChange = (e) => {
    const raw = e.target.value;
    const newMinutes = Math.min(Math.max(Math.ceil(Number(raw)), 1), 60);
    const newSeconds = newMinutes * 60;

    setCustomTime(newSeconds);
    setTimeLeft(newSeconds);
    setCircleDashoffset(0);

    setExercisePayload((p) => ({ ...p, time: newMinutes }));
  };

  const hardResetTo5 = useCallback(() => {
    setCustomTime(DEFAULT_RESET_SECONDS);
    setTimeLeft(DEFAULT_RESET_SECONDS);
    setCircleDashoffset(0);
    setIsRunning(false);
    setShowDialog(false);
    setSaveStatus(null);

    setExercisePayload((p) => ({ ...p, time: 5 }));
  }, []);

  const handleResetClick = () => {
    hardResetTo5();
  };

  const handleStartPause = () => {
    if (!isRunning && timeLeft === customTime) {
      setCircleDashoffset(calcOffset(timeLeft, customTime, circumference));
    }
    setIsRunning((r) => !r);
  };

  const handleModalYes = async () => {
    await handleSaveToBackend();
    alert(
      "Well done! Your exercise has been saved and is now visible on your heatmap."
    );
    hardResetTo5();
  };

  const handleModalNo = () => {
    hardResetTo5();
  };

  const handleSaveToBackend = async () => {
    try {
      setIsSaving(true);
      setSaveStatus(null);

      const url = `http://localhost:7000/workout/exercise/${encodeURIComponent(
        exercise?.exercise || "Not defined"
      )}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(exercisePayload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save exercise");
      }
      setSaveStatus("success");
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Derived UI bits ---
  const progressPct = timeLeft > 0 ? timeLeft / customTime : 0;
  const progressColor = getProgressColor(progressPct); // dynamic stroke color

  const videoId = exercise?.exerciseVideoURL
    ? getYouTubeId(exercise.exerciseVideoURL)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/95 flex flex-col h-screen w-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 py-3 px-5 flex justify-between items-center border-b border-indigo-700 shrink-0 sticky top-0 z-10 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {exercise?.exercise}
          </h1>
          <p className="text-indigo-200 text-sm">
            Focus:{" "}
            <span className="text-yellow-300 font-medium">
              {exercise?.focusPart}
            </span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 px-2 py-2 rounded-full text-white font-medium flex items-center gap-2 transition-colors"
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
      <div className="flex-1 p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exercise Details */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Exercise Details
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoBox label="Sets" value={exercise?.sets} />
              <InfoBox label="Reps" value={exercise?.reps} />
              <InfoBox label="Difficulty" value={exercise?.difficulty} />
              <InfoBox
                label="Calories"
                value={`${exercise?.caloriesBurned} kcal`}
              />
            </div>
            <div className="space-y-4">
              <InfoSection
                title="Equipment"
                content={exercise?.equipment || "Bodyweight"}
              />
              <InfoSection
                title="Rest Time"
                content={exercise?.restTime || "--"}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Workout Timer</h2>
            <div className="bg-gray-700 p-6 rounded-lg flex flex-col items-center w-full">
              <div className="relative w-36 h-36 mb-6 select-none">
                <svg
                  className="absolute inset-0"
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="Workout progress"
                >
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
                    stroke={progressColor}
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

              <div className="flex gap-4 mb-6 w-full justify-center flex-wrap">
                <button
                  onClick={handleStartPause}
                  className={`px-6 py-3 rounded-lg font-bold text-white min-w-[120px] transition-colors ${
                    isRunning
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isRunning ? "⏸ Pause" : "▶ Start"}
                </button>
                <button
                  onClick={handleResetClick}
                  className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 font-bold text-white min-w-[120px] transition-colors"
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
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter time"
                />
              </div>

              {/* Save status toast under controls */}
              {saveStatus === "success" && (
                <p className="mt-4 text-sm text-green-300">Exercise saved!</p>
              )}
              {saveStatus === "error" && (
                <p className="mt-4 text-sm text-red-300">
                  Save failed. Try again.
                </p>
              )}
            </div>
          </div>

          {/* Video */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
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
                  {exercise?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Save this exercise to your profile?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleModalYes}
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Yes"}
              </button>
              <button
                onClick={handleModalNo}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
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

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function convertToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const num = parseInt(timeStr, 10);
  if (Number.isNaN(num)) return null;
  const lower = timeStr.toLowerCase();
  if (lower.includes("minute")) return num * 60;
  if (lower.includes("second")) return num;
  return null; // caller will fallback to default
}

function formatTime(sec) {
  const safe = Number(sec);
  if (Number.isNaN(safe) || safe < 0) return "00:00";
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const s = (safe % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getProgressColor(pct) {
  if (pct > 0.66) return "#4ade80"; // green-400
  if (pct > 0.33) return "#facc15"; // yellow-400
  return "#f87171"; // red-400
}

function calcOffset(remaining, total, circumference) {
  if (!total) return 0;
  const ratio = remaining / total;
  return circumference - ratio * circumference;
}

function getYouTubeId(url = "") {
  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1] && match[1].length === 11 ? match[1] : null;
}

/** Build the outbound payload expected by backend. */
function buildInitialPayload(exercise = {}) {
  // Determine reps string (use incoming; fallback to "0")
  let reps = exercise?.reps ?? "0";
  // Some sources may provide numeric reps
  if (typeof reps === "number") reps = String(reps);

  // Determine time (minutes) from exercise.timeLimit if present
  const secs = convertToSeconds(exercise?.timeLimit);
  const mins = secs ? Math.round(secs / 60) : 5; // fallback to 5

  return {
    time: mins, // minutes expected by backend schema you showed earlier
    focusPart: exercise?.focusPart || "General",
    exerciseName: exercise?.exercise || "push-ups",
    caloriesBurned: Number(exercise?.caloriesBurned ?? 0),
    difficulty: exercise?.difficulty || "Beginner",
    sets: Number(exercise?.sets ?? 1),
    reps, // raw; backend will parse range if it contains '-'
  };
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

const InfoBox = ({ label, value }) => (
  <div className="bg-gray-700 p-3 rounded-lg text-center">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white font-bold text-xl break-words">{value}</p>
  </div>
);

const InfoSection = ({ title, content }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h3 className="text-indigo-300 font-semibold mb-2">{title}</h3>
    <p className="text-white whitespace-pre-line">{content}</p>
  </div>
);

export default ExercisePage;
