import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WhatsAppButton from "../common/whatsappButton";
import { debounce } from "lodash";
import { useCallback } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiHeart,
  FiInfo,
  FiDollarSign,
  FiShield,
  FiShare2,
  FiFlag,
} from "react-icons/fi";

import {
  fetchListingDataThunk,
  handleLikeListingThunk,
  handleReportListingThunk,
} from "../store/thunk/listing-management";
import { useDispatch, useSelector } from "react-redux";

const ListingPage = () => {
  const id = useParams();
  const { listingId } = id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchListingDataThunk(listingId));
  }, [dispatch, listingId]);

  const storeData = useSelector((store) => store.listingActive);
  const { error, loading } = storeData;
  const listingData = storeData?.listingData;

  const isRent = listingData?.type === "rent" || listingData?.type === "both";
  const isSale = listingData?.type === "sale" || listingData?.type === "both";

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listingData?.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listingData?.images.length - 1 : prevIndex - 1
    );
  };

  const toggleFavorite = useCallback(
    debounce(() => {
      dispatch(handleLikeListingThunk(listingId));
    }, 500),
    [dispatch, listingId]
  );

  const handleReport = useCallback(
    debounce(() => {
      dispatch(
        handleReportListingThunk(listingId, {
          reason: "Fraud",
          message: "please check the model",
        })
      );
    }, 500),
    [dispatch, listingId]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href; // Current listing page URL
    const text = `Check out this equipment listing: ${url}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500">
          f
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mb-4"
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
        <h1 className="text-2xl font-semibold text-red-400">
          Listing Not Found
        </h1>
        <p className="text-gray-400 mt-2 max-w-md">
          The listing you're trying to view doesn’t exist or may have been
          removed.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md transition duration-150"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full border border-indigo-500 hover:border-red-500 text-indigo-500 hover:text-red-500"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
              <FiShare2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => toggleFavorite()}
              title="Like this listing to save it to your favorites"
              className={`p-2 rounded-full flex flex-row justify-center items-center align-middle ${
                storeData.likeStatus
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <FiHeart
                className={`w-5 h-5 ${
                  storeData.likeStatus ? "fill-current" : ""
                }`}
              />
              <span className="pl-1 text-lg">{storeData.likeCount}</span>
            </button>

            <button
              onClick={() => handleReport()}
              title="Report this listing if you find it inappropriate or incorrect"
              className="p-2 rounded-md text-red-500 flex flex-row justify-center items-center align-middle"
            >
              <FiFlag
                className={`w-5 h-5 ${
                  storeData.flagStatus ? "fill-current" : ""
                }`}
              />
              <span className="pl-1 text-lg">{storeData.flagCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section with Images and Description */}
          <div className="lg:w-2/3">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
              {listingData?.images && listingData.images.length > 0 ? (
                <img
                  src={listingData.images[currentImageIndex]}
                  alt={`Listing Image ${currentImageIndex + 1}`}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                  No Images Available
                </div>
              )}

              {/* Image Controls */}
              {listingData?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 text-gray-800 dark:text-white p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-black"
                  >
                    &#10094;
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/60 text-gray-800 dark:text-white p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-black"
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm space-y-6">
              {/* Description Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words text-sm leading-relaxed">
                  {listingData?.description || "No description provided"}
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Reason for sale
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words text-sm leading-relaxed">
                  {listingData?.reasonForSale}
                </p>
              </section>

              {/* Equipment Details */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Equipment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Equipment Type", value: listingData?.equipment },
                    { label: "Brand", value: listingData?.brand },
                    { label: "Model", value: listingData?.model },
                    {
                      label: "Purchase Date",
                      value: formatDate(listingData?.purchaseDate),
                      icon: <FiCalendar />,
                    },
                    listingData?.warrantyIncluded && {
                      label: "Warranty",
                      value: "Included",
                      icon: <FiShield />,
                    },
                  ]
                    .filter(Boolean)
                    .map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.icon || <FiInfo />}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-800 dark:text-white font-medium">
                            {item.value || "Not specified"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {/* Rental Details */}
              {isRent && listingData?.rental && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Rental Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Rental Price",
                        value: `₹${
                          listingData.rental.rentalPrice || "Not specified"
                        } per period`,
                        icon: <FiDollarSign />,
                      },
                      {
                        label: "Available From",
                        value: formatDate(listingData.rental.availableFrom),
                        icon: <FiCalendar />,
                      },
                      {
                        label: "Available Until",
                        value: formatDate(listingData.rental.availableUntil),
                        icon: <FiCalendar />,
                      },
                      {
                        label: "Min Rental Period",
                        value: `${
                          listingData.rental.minRentalPeriod || "Not specified"
                        } days`,
                        icon: <FiInfo />,
                      },
                      {
                        label: "Max Rental Period",
                        value: `${
                          listingData.rental.maxRentalPeriod || "Not specified"
                        } days`,
                        icon: <FiInfo />,
                      },
                      {
                        label: "Deposit Required",
                        value: `₹${listingData.rental.deposit || "None"}`,
                        icon: <FiDollarSign />,
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-800 dark:text-white font-medium">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Section with Info */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {listingData?.title}
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                <FiMapPin className="mr-1" />
                {listingData?.location?.street || "City not specified"},
                {listingData?.location?.city || "City not specified"},{" "}
                {listingData?.location?.state || "State not specified"}
              </div>
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 text-sm font-medium px-3 py-1 rounded-full">
                {listingData?.category}
              </span>

              <div className="mt-4">
                {isSale && (
                  <div className="mb-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{listingData?.price}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                      {listingData?.negotiable
                        ? "(Negotiable)"
                        : "(Fixed Price)"}
                    </span>
                  </div>
                )}
                {isRent && listingData?.rental?.rentalPrice && (
                  <div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{listingData.rental.rentalPrice}
                    </span>
                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                      / rental period
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-row">
                <span
                  className={`px-3 py-1 mr-2 rounded-full text-sm font-medium ${
                    listingData?.condition === "New"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : listingData?.condition === "Good"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : listingData?.condition === "Fair"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                >
                  {listingData?.condition}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listingData?.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : listingData?.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : listingData?.status === "booked"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : listingData?.status === "sold"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {listingData?.status?.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 mt-6">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors">
                  <WhatsAppButton
                    phoneNumber={listingData?.contactNumber}
                    message={`Hello, I'm interested in your ${listingData?.title} listing.`}
                  />
                </button>
              </div>

              <div className="mt-8 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Owner Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-28 text-gray-600 dark:text-gray-400 font-medium">
                      Name:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {listingData?.owner?.fullName || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-28 text-gray-600 dark:text-gray-400 font-medium">
                      Email:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {listingData?.owner?.email || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-28 text-gray-600 dark:text-gray-400 font-medium">
                      Contact:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {listingData?.owner?.contactNumber || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-28 text-gray-600 dark:text-gray-400 font-medium">
                      Member since:
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(listingData?.owner?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Listing Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-36 text-gray-600 dark:text-gray-400 font-medium">
                      Created:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formatDate(listingData?.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-36 text-gray-600 dark:text-gray-400 font-medium">
                      Last Updated:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formatDate(listingData?.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingPage;
