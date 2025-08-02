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
  const [currentImageIndex] = useState(0);
  const isRent = type === "rent" || type === "both";
  const isSale = type === "sale" || type === "both";

  const handleClick = () => navigate(`/listing/${_id}`);
  const handleDelete = () => dispatch(handleDeleteThunk(_id));

  const getPriceDisplay = () => {
    if (type === "both") {
      return (
        <div className="flex flex-col items-end">
          <span className="text-indigo-400 font-bold">₹{price}</span>
          {rental?.rentalPrice && (
            <span className="text-indigo-300 text-xs">
              ₹{rental.rentalPrice}/day
            </span>
          )}
        </div>
      );
    }
    return (
      <span className="text-indigo-400 font-bold">
        {isRent ? `₹${rental?.rentalPrice || price}/day` : `₹${price}`}
      </span>
    );
  };

  const getConditionColor = () => {
    switch (condition) {
      case "New":
        return "text-green-400";
      case "Good":
        return "text-blue-400";
      default:
        return "text-orange-400";
    }
  };

  return (
    <div className="w-full max-w-sm bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:shadow-indigo-500/20">
      {/* Image Section */}
      <div className="relative aspect-square">
        <img
          src={images?.length > 0 ? images[currentImageIndex] : listingavatar}
          alt={title}
          className="w-full h-[300px] object-cover"
        />

        {/* Admin Controls */}
        {loggedInUserCreated && (
          <div className="absolute top-2 left-2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/listing/edit/${_id}`);
              }}
              className="p-2 bg-gray-800/90 hover:bg-indigo-600 text-white rounded-full transition-all shadow-lg"
              aria-label="Edit listing"
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 bg-gray-800/90 hover:bg-red-600 text-white rounded-full transition-all shadow-lg"
              aria-label="Delete listing"
            >
              <FaTrashAlt className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === "active"
                ? "bg-green-900/80 text-green-100"
                : status === "sold"
                ? "bg-purple-900/80 text-purple-100"
                : "bg-gray-700/80 text-gray-300"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 cursor-pointer" onClick={handleClick}>
        {/* Title and Price */}
        <div className="flex justify-between items-start">
          <h3 className="text-white font-medium line-clamp-2">{title}</h3>
          <div className="text-right">{getPriceDisplay()}</div>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-indigo-600/20 text-indigo-300 text-xs px-2 py-1 rounded">
            {type === "both" ? "Rent/Sale" : isRent ? "Rent" : "Sale"}
          </span>

          {negotiable && (
            <span className="bg-green-600/20 text-green-300 text-xs px-2 py-1 rounded">
              Negotiable
            </span>
          )}

          <span
            className={`${getConditionColor()} bg-opacity-20 text-xs px-2 py-1 rounded`}
          >
            {condition}
          </span>

          {(warrantyIncluded || gurrantyIncluded) && (
            <span className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded">
              {warrantyIncluded
                ? `Warranty ${warrantyTime}`
                : `Guaranty ${gurrantyTime}`}
            </span>
          )}
        </div>

        {/* Brand and Location */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          {brand && (
            <span className="truncate">
              <span className="text-gray-300 font-medium">{brand}</span>
            </span>
          )}

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
            <span className="truncate max-w-[120px]">
              {location?.city || "City"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
