import { FaPhoneAlt, FaRupeeSign } from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

const GymCard = ({ data }) => {
  const gymData = data || {};

  return (
    <motion.div
      className="bg-gray-800 text-gray-100 w-full max-w-[300px] rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all"
      whileHover={{ y: -5 }}
    >
      {/* Gym Image with Gradient Overlay */}
      <div className="relative h-48">
        <img
          src={gymData?.profileImage || "https://via.placeholder.com/300"}
          alt={gymData?.gymName || "Gym"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-4">
          <h2 className="text-xl font-bold text-white">
            {gymData?.gymName || "Gym Name"}
          </h2>
        </div>
      </div>

      {/* Gym Info Section */}
      <div className="p-5 space-y-3">
        {/* Trainer Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-indigo-300 font-medium">
            {gymData?.ownerName || "Trainer Name"}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10">
            <FaRupeeSign className="text-indigo-400" />
          </div>
          <span className="font-semibold">
            {gymData?.monthlyCharge
              ? `₹${gymData.monthlyCharge}/month`
              : "Contact for pricing"}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MdEmail className="text-indigo-400" />
            <span className="truncate">
              {gymData?.email || "email@example.com"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FaPhoneAlt className="text-indigo-400" />
            <span>{gymData?.contactNumber || "N/A"}</span>
          </div>
        </div>

        {/* Rating & Location */}
        <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-700">
          <span className="flex items-center gap-1 bg-gray-700/50 px-2.5 py-1 rounded-full text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {gymData?.rating === 0 ? 1.0 : gymData?.rating}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <MdLocationOn className="text-indigo-400" />
            <span className="truncate max-w-[120px]">
              {gymData?.street + " " + gymData?.state || "Location"}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GymCard;
