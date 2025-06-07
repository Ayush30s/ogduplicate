import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { handleDeleteThunk } from "../store/thunk/listing-management";
import listingavatar from "../../public/images/listingavatar.jpg";

const ListingCard = ({ listing, loggedInUserCreated }) => {
  const {
    _id,
    title,
    type,
    images,
    price,
    rental,
    condition,
    brand,
    location,
    status,
    createdAt,
    negotiable,
    warrantyIncluded,
    gurrantyIncluded,
    warrantyTime,
    gurrantyTime,
  } = listing ?? {};

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isRent = type === "rent" || type === "both";
  const isSale = type === "sale" || type === "both";

  const handleClick = () => {
    navigate(`/listing/${_id}`);
  };

  const handleDelete = () => {
    dispatch(handleDeleteThunk(_id));
  };

  const getPriceDisplay = () => {
    if (type === "both") {
      return (
        <>
          <span className="text-indigo-400 font-bold text-base">₹{price}</span>
          {rental?.rentalPrice && (
            <span className="text-indigo-300 text-xs">
              ₹{rental.rentalPrice}/day
            </span>
          )}
        </>
      );
    }
    return (
      <span className="text-indigo-400 font-bold text-base">
        {isRent ? `₹${rental?.rentalPrice || price}/day` : `₹${price}`}
      </span>
    );
  };

  return (
    <div className="w-full max-w-sm bg-gray-900 overflow-hidden shadow-lg border border-gray-700 rounded-lg transition duration-300">
      {/* Image */}
      <div className="relative">
        {
          <img
            src={images?.length > 0 ? images[currentImageIndex] : listingavatar}
            alt={title}
            className="w-full h-48 object-cover"
          />
        }

        {loggedInUserCreated && (
          <div className="space-x-2 absolute top-2 left-2">
            <button
              title="Edit Listing"
              className="p-2 bg-gray-800/90 hover:bg-red-500/90 text-red-400 hover:text-white absolute z-10 rounded-full transition-all duration-200 shadow-lg"
              onClick={() => navigate(`/listing/edit/${_id}`)}
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              className="p-2 bg-gray-800/90 hover:bg-red-500/90 text-red-400 hover:text-white absolute left-8 z-10 rounded-full transition-all duration-200 shadow-lg"
              onClick={handleDelete}
              aria-label="Delete blog"
            >
              <FaTrashAlt className="text-sm" />
            </button>
          </div>
        )}

        {/* Listed on date */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded shadow">
          Listed on: {new Date(createdAt).toLocaleDateString()}
        </div>

        {/* Gradient overlay for readability */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-2 space-y-2 cursor-pointer" onClick={handleClick}>
        <div className="flex gap-2">
          <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {type === "both" ? "Rent/Sale" : isRent ? "For Rent" : "For Sale"}
          </span>
          {negotiable && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
              Negotiable
            </span>
          )}
          {type == "sale" && warrantyIncluded && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Warranty - {warrantyTime}
            </span>
          )}
          {gurrantyIncluded && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Gurranty - {gurrantyTime}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold line-clamp-2">
            {title}
          </h2>
          <div className="text-right">{getPriceDisplay()}</div>
        </div>

        {brand && (
          <div>
            <span className="text-gray-400">Brand: </span>
            <span className="text-gray-200 font-medium">{brand}</span>
          </div>
        )}

        <div className="flex items-center text-sm gap-2">
          <span className="text-gray-400">Condition:</span>
          <span
            className={`${
              condition === "New"
                ? "text-green-400"
                : condition === "Good"
                ? "text-blue-400"
                : "text-orange-400"
            } font-medium`}
          >
            {condition}
          </span>
        </div>

        {/* Location and status */}
        <div className="flex justify-between text-sm text-gray-400 items-center">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {location?.city || "City"}, {location?.state || "State"}
            </span>
          </div>
          <span
            className={`capitalize px-2 py-0.5 rounded text-xs ${
              status === "active"
                ? "bg-green-900/30 text-green-400"
                : status === "sold"
                ? "bg-purple-900/30 text-purple-400"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
