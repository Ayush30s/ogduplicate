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
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
  FiUser,
  FiMail,
  FiPhone,
  FiTag,
  FiLayers,
  FiAward,
  FiTruck,
  FiImage,
  FiSettings,
  FiBarChart2,
} from "react-icons/fi";

import {
  fetchListingDataThunk,
  handleLikeListingThunk,
  handleReportListingThunk,
} from "../store/thunk/listing-management";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/loading";

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

  const toggleFavorite = debounce(() => {
    dispatch(handleLikeListingThunk(listingId));
  }, 500);

  const handleReport = debounce(() => {
    dispatch(
      handleReportListingThunk(listingId, {
        reason: "Fraud",
        message: "please check the model",
      })
    );
  }, 500);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full mb-6">
          <FiAlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Listing Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
          The equipment you're looking for doesn't exist or may have been
          removed.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Return to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleFavorite()}
              className={`p-2 rounded-lg flex items-center space-x-1 transition-colors ${
                storeData.likeStatus
                  ? "bg-red-100 dark:bg-red-900/20 text-red-500"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              }`}
              title={
                storeData.likeStatus
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <FiHeart
                className={`w-5 h-5 ${
                  storeData.likeStatus ? "fill-current" : ""
                }`}
              />
              <span className="text-sm font-medium">{storeData.likeCount}</span>
            </button>

            <button
              onClick={() => handleReport()}
              className={`p-2 rounded-lg flex items-center space-x-1 transition-colors ${
                storeData.flagStatus
                  ? "bg-orange-100 dark:bg-orange-900/20 text-orange-500"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              }`}
              title="Report this listing"
            >
              <FiFlag
                className={`w-5 h-5 ${
                  storeData.flagStatus ? "fill-current" : ""
                }`}
              />
              <span className="text-sm font-medium">{storeData.flagCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:w-2/3 space-y-6">
            {/* Title and Basic Info */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-slate-800 rounded-lg">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {listingData?.title}
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                <FiMapPin className="mr-2" />
                {listingData?.location?.street || "Address not specified"},{" "}
                {listingData?.location?.city || "City not specified"}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 text-sm font-medium rounded-full flex items-center">
                  <FiTag className="mr-1" />
                  {listingData?.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                    listingData?.condition === "New"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : listingData?.condition === "Good"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : listingData?.condition === "Fair"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                  }`}
                >
                  <FiAward className="mr-1" />
                  {listingData?.condition} Condition
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
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
                  <FiCheckCircle className="mr-1" />
                  {listingData?.status?.toUpperCase()}
                </span>
              </div>
            </div>
            {/* Image Gallery */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              {listingData?.images && listingData.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={listingData.images[currentImageIndex]}
                    alt={`Listing Image ${currentImageIndex + 1}`}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/50 rounded-full px-3 py-1 flex space-x-2">
                      {listingData.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-white w-4"
                              : "bg-white/50"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[450px] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <FiImage className="w-16 h-16 mb-4" />
                  <p>No images available</p>
                </div>
              )}

              {/* Navigation Arrows */}
              {listingData?.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Pricing & Description Section */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-col align-middle justify-center lg:flex-row gap-6">
                  {/* Pricing Section */}
                  <div className="lg:w-1/2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiDollarSign className="mr-2" />
                      Pricing Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isSale && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                            <FiDollarSign className="mr-2" />
                            <span className="text-sm">Purchase Price</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{listingData?.price}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {listingData?.negotiable
                              ? "Price negotiable"
                              : "Fixed price"}
                          </div>
                        </div>
                      )}
                      {isRent && listingData?.rental?.rentalPrice && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                            <FiClock className="mr-2" />
                            <span className="text-sm">Rental Price</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{listingData.rental.rentalPrice}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                              / period
                            </span>
                          </div>
                          {listingData.rental.deposit && (
                            <div className="text-sm font-medium text-white dark:text-gray-400 mt-1">
                              <span className="font-medium">Deposit:</span> ₹
                              {listingData.rental.deposit}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="lg:w-1/2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                      <FiInfo className="mr-2" />
                      Description
                    </h2>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {listingData?.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              {isRent && listingData?.rental && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiClock className="mr-2" />
                    Rental Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
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
                        label: "Minimum Rental Period",
                        value: `${
                          listingData.rental.minRentalPeriod || "Not specified"
                        } days`,
                        icon: <FiBarChart2 />,
                      },
                      {
                        label: "Maximum Rental Period",
                        value: `${
                          listingData.rental.maxRentalPeriod || "Not specified"
                        } days`,
                        icon: <FiBarChart2 />,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                      >
                        <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {item.label}
                          </p>
                          <p className="text-gray-800 dark:text-white">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment Specifications */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiSettings className="mr-2" />
                  Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Equipment Type",
                      value: listingData?.equipment,
                      icon: <FiLayers />,
                    },
                    {
                      label: "Brand",
                      value: listingData?.brand,
                      icon: <FiAward />,
                    },
                    {
                      label: "Model",
                      value: listingData?.model,
                      icon: <FiSettings />,
                    },
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
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                      >
                        <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {item.label}
                          </p>
                          <p className="text-gray-800 dark:text-white">
                            {item.value || "Not specified"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Owner Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-full text-indigo-600 dark:text-indigo-400 mr-3">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Owner
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {listingData?.owner?.fullName || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-full text-indigo-600 dark:text-indigo-400 mr-3">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {listingData?.owner?.email || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-full text-indigo-600 dark:text-indigo-400 mr-3">
                      <FiPhone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {listingData?.contactNumber || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-full text-indigo-600 dark:text-indigo-400 mr-3">
                      <FiStar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Member Since
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {formatDate(listingData?.owner?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors mb-3">
                  <WhatsAppButton
                    phoneNumber={listingData?.contactNumber}
                    message={`Hello ${
                      listingData?.owner?.fullName || ""
                    }, I came across your listing for "${
                      listingData?.title
                    }" on ${window.location.href}. 
I’m very interested in learning more about it.

Here are some details I saw:
- Title: ${listingData?.title}
- Price: ${
                      listingData?.price
                        ? `$${listingData.price}`
                        : `${listingData?.rental?.rentalPrice}`
                    }
- Location: ${
                      listingData?.location.street +
                        " " +
                        listingData?.location.city +
                        " " +
                        listingData?.location.state || "Not specified"
                    }
- Description: ${
                      listingData?.description?.slice(0, 150) ||
                      "No description provided"
                    }

Could you please provide more information, availability, or arrange a viewing? Thank you!`}
                  />
                </button>
              </div>
            </div>

            {/* Listing Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiInfo className="mr-2" />
                  Listing Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">
                      Created
                    </span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {formatDate(listingData?.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">
                      Last Updated
                    </span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {formatDate(listingData?.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiShield className="mr-2" />
                  Safety Tips
                </h2>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Meet the seller in a public place
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Inspect the equipment thoroughly before payment
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Never pay in advance with wire transfer
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Check all documents and ownership proofs
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    Use secure payment methods
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingPage;
