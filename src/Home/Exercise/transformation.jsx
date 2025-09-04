import { useState, useEffect } from "react";
import ExercisePage from "./exercisePage";
import ExcerciseCard from "./exerciseCard";

const WorkoutPlanForm = () => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    workoutFrequency: "",
    fitnessGoal: "muscleGain",
    experienceLevel: "beginner",
    availableEquipment: "",
    injuriesLimitations: "",
    trainMuscle: "",
  });

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showTokenMessage, setShowTokenMessage] = useState(false);

  useEffect(() => {
    const fetchTransformationData = async () => {
      try {
        const response = await fetch(
          "https://gymbackenddddd-1.onrender.com/workout/user-physic-data",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        if (data?.data) {
          setFormData((prev) => ({
            ...prev,
            ...data.data,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchTransformationData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://gymbackenddddd-1.onrender.com/workout/ai-assistance",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (data.message === "Token balance exhausted") {
          // Show funny message and use hardcoded data
          setShowTokenMessage(true);
          setExercises(getHardcodedExercises());
        } else {
          setExercises(data.exercises);
          setShowTokenMessage(false);
        }
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred. Please try again.");
    }
  };

  // Hardcoded exercise data for demonstration
  const getHardcodedExercises = () => {
    return [
      {
        exercise: "Push-ups",
        focusPart: "Chest & Arms",
        sets: "3",
        reps: "12-15",
        difficulty: "Beginner",
        caloriesBurned: "100",
        equipment: "Bodyweight",
        restTime: "30-60 seconds",
        description:
          "Classic bodyweight exercise for upper body strength. Keep your core tight and back straight.",
        exerciseVideoURL: "https://www.youtube.com/watch?v=IODxDxX7oi4",
      },
      {
        exercise: "Squats",
        focusPart: "Legs & Glutes",
        sets: "4",
        reps: "10-12",
        difficulty: "Beginner",
        caloriesBurned: "120",
        equipment: "Bodyweight",
        restTime: "45-60 seconds",
        description:
          "Fundamental lower body exercise. Keep your chest up and knees behind toes.",
        exerciseVideoURL: "https://www.youtube.com/watch?v=aclHkVaku9U",
      },
      {
        exercise: "Plank",
        focusPart: "Core",
        sets: "3",
        reps: "30-60 sec",
        difficulty: "Beginner",
        caloriesBurned: "80",
        equipment: "Bodyweight",
        restTime: "30 seconds",
        description:
          "Excellent core exercise. Maintain straight line from head to heels.",
        exerciseVideoURL: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 flex flex-col items-center">
      <div className="max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-4">
          Personalized Workout Plan by AI
        </h1>
        <p className="text-lg text-gray-300">
          "The only bad workout is the one that didn't happen. Let AI help you
          stay consistent and achieve your goals."
        </p>
      </div>

      <div className="w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              placeholder="Height (cm)"
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            <input
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
            <input
              name="workoutFrequency"
              type="number"
              min="1"
              max="7"
              value={formData.workoutFrequency}
              onChange={handleChange}
              placeholder="Workout Frequency"
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            >
              <option value="muscleGain">Muscle Gain</option>
              <option value="weightLoss">Weight Loss</option>
              <option value="endurance">Endurance</option>
            </select>

            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <input
            type="text"
            name="availableEquipment"
            placeholder="Available Equipment"
            value={formData.availableEquipment}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
          />
          <input
            type="text"
            name="trainMuscle"
            placeholder="Train Muscle Group"
            value={formData.trainMuscle}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
          />
          <textarea
            name="injuriesLimitations"
            rows="3"
            placeholder="Injuries or Limitations"
            value={formData.injuriesLimitations}
            onChange={handleChange}
            className="w-full mb-6 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>

      {selectedExercise && (
        <ExercisePage
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {exercises.length > 0 && !selectedExercise && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-full max-w-6xl">
          {exercises.map((ex, idx) => (
            <ExcerciseCard
              key={idx}
              exercise={ex}
              setSelectedExercise={setSelectedExercise}
            />
          ))}
        </div>
      )}

      {showTokenMessage && (
        <div className="w-full max-w-3xl mt-6 p-4 bg-blue-900 border border-blue-700 rounded-lg text-center">
          <p className="text-blue-200 font-bold">⚠️ Demo Mode Activated ⚠️</p>
          <p className="text-blue-100">
            Our AI service limit has been reached for this demo period. You're
            seeing sample exercises identical to what our AI would generate.
          </p>
          <p className="text-blue-100 mt-2">
            In a production environment, this would be your personalized
            AI-generated workout plan.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanForm;
