const ExcerciseCard = (data) => {
  const { exercise, setSelectedExercise } = data;
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-indigo-600 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-2xl font-extrabold text-indigo-400 mb-2 uppercase">
        {exercise.exerciseName}
      </h3>
      <p className="text-gray-300 text-md font-bold mb-2">
        Focus: <span className="text-yellow-400">{exercise.focusPart}</span>
      </p>
      <p className="text-gray-300 text-sm">
        Sets: {exercise.sets} | Reps: {exercise.reps}
      </p>
      {exercise.timeLimit && (
        <p className="text-gray-500 text-xs mt-2 italic">
          ⏱️ Complete within: {exercise.timeLimit}
        </p>
      )}
      <div className="mt-4 space-y-2">
        <button
          onClick={() => setSelectedExercise(exercise)}
          className="block w-full text-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold rounded-full"
        >
          🚀 Start
        </button>
      </div>
    </div>
  );
};

export default ExcerciseCard;
