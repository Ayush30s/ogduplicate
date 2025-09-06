import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { FaTag, FaUser, FaClock } from "react-icons/fa";
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
    category,
    createdAt,
    owner,
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

  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400";
      case "booked":
        return "bg-blue-500/10 text-blue-400";
      case "sold":
        return "bg-purple-500/10 text-purple-400";
      case "inactive":
        return "bg-gray-500/10 text-gray-400";
      default:
        return "bg-orange-500/10 text-orange-400"; // fallback
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="text-gray-100 w-full max-w-[320px] rounded-2xl border border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:shadow-indigo-500/30 cursor-pointer bg-gray-900">
      {/* Image with overlay */}
      <div className="relative p-2 h-48 overflow-hidden" onClick={handleClick}>
        <img
          src={images?.length > 0 ? images[currentImageIndex] : listingavatar}
          alt={title}
          className="w-full rounded-lg h-full object-cover hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent flex justify-center items-center p-4">
          <div className="bg-black/50 px-3 py-1 rounded-md flex gap-1">
            <h2 className="text-sm font-medium text-white drop-shadow">
              {title + " -"}
            </h2>
            {brand && (
              <span className="text-sm font-medium text-white drop-shadow">
                {" " + brand}
              </span>
            )}
          </div>
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
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 bg-gray-900/80 hover:bg-red-600 text-white rounded-full transition-all shadow-md"
              aria-label="Delete listing"
            >
              <FaTrashAlt className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 p-4" onClick={handleClick}>
        {/* Price + Type + status badge */}
        <div className="flex justify-start gap-4 items-center">
          <span className="bg-indigo-500/10 text-indigo-300 text-xs px-2 py-1 rounded-full">
            {type === "both" ? "Rent/Sale" : isRent ? "Rent" : "Sale"}
          </span>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full shadow ${getStatusColor()}`}
          >
            {status}
          </span>
          {getPriceDisplay()}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4">
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
              {warrantyIncluded ? `Warranty` : `Guaranty`}
            </span>
          )}
          {category && (
            <span className="bg-yellow-500/10 text-yellow-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <FaTag className="w-3 h-3" /> {category}
            </span>
          )}
        </div>

        {/* Brand + Location + Owner */}
        <div className="flex flex-col gap-4 text-sm text-gray-300 border-t border-gray-700 pt-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-indigo-300">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate max-w-[300px]">
                {location?.city + ", " + location?.state || "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400">
            {owner?.name && (
              <span className="flex items-center gap-1">
                <FaUser className="w-3 h-3 text-gray-500" /> {owner.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaClock className="w-3 h-3 text-gray-500" />{" "}
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
