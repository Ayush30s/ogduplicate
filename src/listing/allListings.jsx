import { useEffect, useState, useCallback } from "react";
import ListingCard from "./listingCard";
import { AnimatePresence, motion } from "framer-motion";
import { equipments } from "../../public/data";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { allListingsThunk } from "../store/thunk/listing-management";

const AllListing = () => {
  const dispatch = useDispatch();
  const data = useSelector((store) => store.listing);
  const { loading, listings, error } = data;
  console.log(listings);

  const [filters, setFilters] = useState({
    type: "sale",
    equipment: "",
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const fetchListingData = useCallback(async () => {
    dispatch(allListingsThunk(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    fetchListingData(filters);
  }, [fetchListingData, filters]);

  const handleTempFilterChange = (field, value) => {
    if (field === "equipment" && value === "Other") {
      value = "write equipment name...";
    }
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilterPanel(false);
  };

  const applyTypeFilter = ({ type }) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const tabs = ["sale", "rent"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    console.log(error, "error");
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500"
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
        <p className="mt-4 text-red-400 font-medium max-w-md text-center">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-6 sm:p-10 min-h-screen bg-gray-950 text-gray-100">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => applyTypeFilter({ type: tab })}
              className={`px-6 py-3 font-medium text-sm tracking-wide transition-all relative ${
                filters.type === tab
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab === "sale" ? "For Sale" : "For Rent"}
              {filters.type === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilterPanel((prev) => !prev)}
          className="bg-indigo-600 hover:bg-indigo-700 transition-all px-5 py-2 rounded-lg text-white font-medium text-sm flex items-center gap-2 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </button>
      </div>

      {/* Slide-in Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 w-full sm:w-96 h-full z-50 bg-gray-900 shadow-xl border-l border-gray-800 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-100">Filters</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={tempFilters.city}
                  onChange={(e) =>
                    handleTempFilterChange("city", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={tempFilters.state}
                  onChange={(e) =>
                    handleTempFilterChange("state", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Equipment Type
                </label>
                <select
                  onChange={(e) => {
                    handleTempFilterChange("equipment", e.target.value);
                  }}
                  value={tempFilters.equipment}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {equipments.map((equipment, index) => (
                    <option key={index} value={equipment}>
                      {equipment}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="e.g. Excavator"
                  value={tempFilters.equipment}
                  onChange={(e) =>
                    handleTempFilterChange("equipment", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Price Range (₹)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempFilters.minPrice}
                    onChange={(e) =>
                      handleTempFilterChange("minPrice", e.target.value)
                    }
                    className="w-1/2 flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempFilters.maxPrice}
                    onChange={(e) =>
                      handleTempFilterChange("maxPrice", e.target.value)
                    }
                    className="w-1/2 flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={applyFilters}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg font-medium text-white shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listings */}
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-500"
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
          <p className="mt-4 text-gray-400">
            No equipment found. Try adjusting your filters.
          </p>
          <button
            onClick={() =>
              setFilters({
                type: "sale",
                equipment: "",
                city: "",
                state: "",
                minPrice: "",
                maxPrice: "",
              })
            }
            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {listings.map((item, index) => (
            <>
              <ListingCard
                key={index}
                listing={item}
                loggedInUserCreated={item.loggedInUserCreated}
              />
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllListing;
