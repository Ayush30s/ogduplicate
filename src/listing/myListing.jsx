import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleMyListingThunk } from "../store/thunk/listing-management";
import ListingCard from "./listingCard";
import { useNavigate } from "react-router-dom";

const MyListing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((store) => store.listing);
  const { myListing, loading, error } = data;
  console.log(data)

  useEffect(() => {
    dispatch(handleMyListingThunk());
  }, [dispatch]);

  return (
    <div className="bg-gray-950 py-9 min-h-screen">
      {myListing.length !== 0 && (
        <h1 className="text-[40px] font-semibold text-center text-white">
          My Listings
        </h1>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg">Error: {error}</div>
      ) : myListing.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center text-gray-300 text-lg min-h-[60vh]">
          <p className="mb-4">You haven't created any listings yet.</p>
          <button
            onClick={() => navigate("/listing/new")}
            className="py-2 px-6 font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Post a Listing
          </button>
        </div>
      ) : (
        <div className="grid gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myListing.map((listing) => (
            <ListingCard
              key={listing._id || listing.id}
              listing={listing}
              loggedInUserCreated={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListing;
