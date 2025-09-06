const GymFilter = ({
  handleReset,
  handleSubmit,
  formData,
  handleFilterChange,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-200">Filter Gyms</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter state"
            />
          </div>
          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Min Rating
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Any rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Max Price ($)
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter max price"
              min="0"
            />
          </div>
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default GymFilter;
