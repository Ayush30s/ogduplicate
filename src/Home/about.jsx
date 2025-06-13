import { useSelector } from "react-redux";
import Header from "../common/header";
const AboutPage = () => {
  const data = useSelector((state) => state.login);
  return (
    <>
      <Header userData={data?.user} />
      <div className="min-h-screen bg-gray-900 text-white py-16 px-6 flex flex-col items-center">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-indigo-500 mb-6">
            About GymAI
          </h1>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            GymAI is your personal fitness assistant, designed to help you crush
            your goals using smart, AI-driven technology. Whether you're a
            beginner just starting out or a seasoned athlete looking to optimize
            your performance, our app tailors every workout to match your body,
            goals, and available equipment.
          </p>
        </div>

        <div className="w-full max-w-5xl bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-indigo-400 mb-4">
            What Makes Us Different
          </h2>
          <ul className="text-gray-300 list-disc pl-6 space-y-2">
            <li>
              🧠 <strong>AI-Assisted Workout Generator:</strong> Automatically
              builds workouts based on your goals, experience level, and
              frequency.
            </li>
            <li>
              📊 <strong>Personal Physique Data:</strong> Uses your height,
              weight, limitations, and muscle targets for smarter suggestions.
            </li>
            <li>
              🏋️ <strong>Equipment-Based Filtering:</strong> Only shows workouts
              you can do with what you already have.
            </li>
            <li>
              🧬 <strong>Adaptive to Progress:</strong> Easily tweak your plan
              as your physique evolves or goals change.
            </li>
          </ul>
        </div>

        <div className="w-full max-w-4xl text-center text-gray-400 mb-12">
          <p className="italic text-lg">
            "Fitness is personal. GymAI helps you stay consistent, challenge
            your limits, and never guess what to do next."
          </p>
        </div>

        <div className="w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-400 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We believe fitness should be accessible, intelligent, and
            personalized. GymAI was built to take the guesswork out of workouts—
            using technology to understand you, your goals, and your
            constraints. Whether you train at home with dumbbells or hit the gym
            daily, GymAI adapts to your reality and helps you grow stronger,
            smarter.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
