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
          <span className="text-indigo-400 font-bold text-lg">₹{price}</span>
          {rental?.rentalPrice && (
            <span className="text-indigo-300 text-sm">
              ₹{rental.rentalPrice}/day
            </span>
          )}
        </div>
      );
    }
    return (
      <span className="text-indigo-400 font-bold text-lg">
        {isRent ? `₹${rental?.rentalPrice || price}/day` : `₹${price}`}
      </span>
    );
  };

  const getConditionColor = () => {
    switch (condition) {
      case "New":
        return "bg-green-500/10 text-green-400";
      case "Good":
        return "bg-blue-500/10 text-blue-400";
      default:
        return "bg-orange-500/10 text-orange-400";
    }
  };

  return (
    <div className="text-gray-100 w-full max-w-[300px] rounded-xl border border-gray-700 overflow-hidden transition-all hover:shadow-md hover:shadow-blue-400 cursor-pointer">
      {/* Image with overlay */}
      <div className="relative h-48  overflow-hidden" onClick={handleClick}>
        <img
          src={images?.length > 0 ? images[currentImageIndex] : listingavatar}
          alt={title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-4">
          <h2 className="text-lg font-bold text-white line-clamp-2">{title}</h2>
        </div>

        {/* Admin Controls */}
        {loggedInUserCreated && (
          <div className="absolute top-3 left-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/listing/edit/${_id}`);
              }}
              className="p-2 bg-gray-900/80 hover:bg-indigo-600 text-white rounded-full transition-all shadow-md"
              aria-label="Edit listing"
            >
              <FiEdit className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 bg-gray-900/80 hover:bg-red-600 text-white rounded-full transition-all shadow-md"
              aria-label="Delete listing"
            >
              <FaTrashAlt className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full shadow ${
              status === "active"
                ? "bg-green-600/80 text-green-100"
                : status === "sold"
                ? "bg-purple-600/80 text-purple-100"
                : "bg-gray-600/80 text-gray-200"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4" onClick={handleClick}>
        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="bg-indigo-500/10 text-indigo-300 text-xs px-2 py-1 rounded-full">
            {type === "both" ? "Rent/Sale" : isRent ? "Rent" : "Sale"}
          </span>
          {getPriceDisplay()}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2">
          {negotiable && (
            <span className="bg-green-500/10 text-green-300 text-xs px-2 py-1 rounded-full">
              Negotiable
            </span>
          )}
          <span
            className={`${getConditionColor()} text-xs px-2 py-1 rounded-full`}
          >
            {condition}
          </span>
          {(warrantyIncluded || gurrantyIncluded) && (
            <span className="bg-blue-500/10 text-blue-300 text-xs px-2 py-1 rounded-full">
              {warrantyIncluded
                ? `Warranty ${warrantyTime}`
                : `Guaranty ${gurrantyTime}`}
            </span>
          )}
        </div>

        {/* Brand + Location */}
        <div className="flex justify-between items-center text-sm text-gray-300 border-t border-gray-700 pt-3 mt-3">
          {brand && <span className="font-medium">{brand}</span>}
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
