import { Star, X } from "lucide-react";

const RateGym = ({ setRateLater, HandleRating, PostRating, rating }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Rate This Gym</h3>
        <button
          onClick={() => setRateLater(true)}
          className="text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => HandleRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600 fill-gray-600"
              }`}
            />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          PostRating(rating, id);
          setRateLater(true);
        }}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Submit Rating
      </button>
    </div>
  );
};

export default RateGym;
