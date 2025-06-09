import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleMyListingThunk } from "../store/thunk/listing-management";
import ListingCard from "./listingCard";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const MyListing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((store) => store.listing);
  const { myListing, loading, error } = data;

  useEffect(() => {
    dispatch(handleMyListingThunk());
  }, [dispatch]);

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {myListing.length !== 0 && (
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-white mb-6 sm:mb-8"
            >
              My Listings
            </motion.h1>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 max-w-md w-full text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-400 font-medium mb-4">Error: {error}</p>
              <button
                onClick={() => dispatch(handleMyListingThunk())}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition"
              >
                Retry
              </button>
            </motion.div>
          </div>
        ) : myListing.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-center items-center text-center min-h-[60vh] px-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-300 mb-2">
              No Listings Found
            </h2>
            <p className="text-gray-400 mb-6 max-w-md">
              You haven't created any listings yet. Start by posting your first equipment listing!
            </p>
            <button
              onClick={() => navigate("/listing/new")}
              className="px-6 py-3 font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md"
            >
              Post a New Listing
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {myListing.map((listing) => (
              <ListingCard
                key={listing._id || listing.id}
                listing={listing}
                loggedInUserCreated={true}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyListing;