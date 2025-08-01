import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { convertToBase64 } from "../../utils/FileToBase64";
import { equipmentCategories } from "../../public/data";
import { updateListingThunk } from "../store/thunk/listing-management";
import Loading from "../common/loading";

const EditListingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { listingId } = useParams();

  const storeData = useSelector((store) => store.listing);
  const loading = storeData?.loading;
  const myListing = storeData.myListing;
  let [listingDetails, setListingDetails] = useState({});

  useEffect(() => {
    let activedata = {};
    myListing.forEach((listing) => {
      if (listing._id === listingId) {
        activedata = listing;
      }
    });

    setListingDetails(activedata);
  }, [listingId, myListing]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    equipment: "",
    brand: "",
    model: "",
    purchaseDate: "",
    images: [],
    contactNumber: "",
    condition: "New",
    type: "sale",
    price: "",
    negotiable: false,
    warrantyIncluded: false,
    reasonForSale: "",
    rental: {
      availableFrom: "",
      availableUntil: "",
      isAvailable: false,
      minRentalPeriod: "",
      maxRentalPeriod: "",
      rentalPrice: "",
      deposit: "",
      maintenanceBy: "Owner",
    },
    location: {
      city: "",
      street: "",
      state: "",
    },
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [customEquipment, setCustomEquipment] = useState("");
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (listingDetails) {
      // Format dates for the form inputs
      const formattedPurchaseDate = listingDetails.purchaseDate
        ? new Date(listingDetails.purchaseDate).toISOString().split("T")[0]
        : "";

      const formattedAvailableFrom = listingDetails.rental?.availableFrom
        ? new Date(listingDetails.rental.availableFrom)
            .toISOString()
            .split("T")[0]
        : "";

      const formattedAvailableUntil = listingDetails.rental?.availableUntil
        ? new Date(listingDetails.rental.availableUntil)
            .toISOString()
            .split("T")[0]
        : "";

      setFormData({
        title: listingDetails.title || "",
        description: listingDetails.description || "",
        category: listingDetails.category || "",
        equipment: listingDetails.equipment || "",
        brand: listingDetails.brand || "",
        model: listingDetails.model || "",
        purchaseDate: formattedPurchaseDate,
        images: listingDetails.images || [],
        contactNumber: listingDetails.contactNumber || "",
        condition: listingDetails.condition || "New",
        type: listingDetails.type || "sale",
        price: listingDetails.price || "",
        negotiable: listingDetails.negotiable || false,
        warrantyIncluded: listingDetails.warrantyIncluded || false,
        reasonForSale: listingDetails.reasonForSale || "",
        rental: {
          availableFrom: formattedAvailableFrom,
          availableUntil: formattedAvailableUntil,
          isAvailable: listingDetails.rental?.isAvailable || false,
          minRentalPeriod: listingDetails.rental?.minRentalPeriod || "",
          maxRentalPeriod: listingDetails.rental?.maxRentalPeriod || "",
          rentalPrice: listingDetails.rental?.rentalPrice || "",
          deposit: listingDetails.rental?.deposit || "",
          maintenanceBy: listingDetails.rental?.maintenanceBy || "Owner",
        },
        location: {
          city: listingDetails.location?.city || "",
          street: listingDetails.location?.street || "",
          state: listingDetails.location?.state || "",
        },
      });

      // Set preview images for existing images
      if (listingDetails.images && listingDetails.images.length > 0) {
        setPreviewImages(listingDetails.images);
      }
    }
  }, [listingDetails]);

  const categoryOptions = Object.keys(equipmentCategories).map((category) => ({
    label: category,
    value: category,
  }));

  const EquipmentOptions =
    formData.category && equipmentCategories[formData.category]
      ? equipmentCategories[formData.category].map((sub) => ({
          label: sub,
          value: sub,
        }))
      : [];

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith("rental.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        rental: {
          ...prev.rental,
          [fieldName]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (type === "file") {
      const fileArray = Array.from(files);
      const base64Array = await Promise.all(
        fileArray.map((file) => convertToBase64(file))
      );

      setNewImages(base64Array);
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previews]);
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine existing images with new images
    const allImages = [...formData.images, ...newImages];

    const submissionData = {
      ...formData,
      images: allImages,
      contactNumber: Number(formData.contactNumber),
      price: Number(formData.price),
      purchaseDate: formData.purchaseDate
        ? new Date(formData.purchaseDate)
        : null,
      rental: {
        ...formData.rental,
        availableFrom: formData.rental.availableFrom
          ? new Date(formData.rental.availableFrom)
          : null,
        availableUntil: formData.rental.availableUntil
          ? new Date(formData.rental.availableUntil)
          : null,
        minRentalPeriod: Number(formData.rental.minRentalPeriod) || 0,
        maxRentalPeriod: Number(formData.rental.maxRentalPeriod) || 0,
        rentalPrice: Number(formData.rental.rentalPrice) || 0,
        deposit: Number(formData.rental.deposit) || 0,
      },
      location: {
        city: formData.location.city,
        state: formData.location.state,
        street: formData.location.street,
      },
      equipment: customEquipment ? customEquipment : formData.equipment,
    };

    dispatch(updateListingThunk(listingId, submissionData, navigate));
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    // Check if the image is from the existing images or new uploads
    if (index < formData.images.length) {
      // Remove from existing images
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData((prev) => ({ ...prev, images: newImages }));
    } else {
      // Remove from new uploads
      const adjustedIndex = index - formData.images.length;
      const newUploads = [...newImages];
      newUploads.splice(adjustedIndex, 1);
      setNewImages(newUploads);
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#111827",
      borderColor: "#374151",
      minHeight: "42px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4b5563",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#f3f4f6",
    }),
    input: (base) => ({
      ...base,
      color: "#f3f4f6",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#111827",
      borderColor: "#374151",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#4f46e5"
        : isFocused
        ? "#1f2937"
        : "#111827",
      color: isSelected ? "#ffffff" : "#f3f4f6",
      "&:active": {
        backgroundColor: "#4f46e5",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
  };

  if (loading) {
    return <Loading
     />;
  }

  return (
    <div className="bg-gray-950">
      <div className="max-w-4xl mx-auto p-6 text-gray-100 bg-gray-950 min-h-screen">
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-100">
            Edit Listing
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-300">
                  Category
                </label>
                <Select
                  styles={customStyles}
                  options={categoryOptions}
                  value={
                    formData.category
                      ? { value: formData.category, label: formData.category }
                      : null
                  }
                  onChange={(selected) => {
                    setFormData((prev) => ({
                      ...prev,
                      category: selected.value,
                      equipment: "",
                    }));
                    setCustomEquipment("");
                  }}
                  placeholder="Select Category"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              {formData.category && (
                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    Equipment
                  </label>
                  <Select
                    styles={customStyles}
                    options={EquipmentOptions}
                    value={
                      formData.equipment
                        ? {
                            value: formData.equipment,
                            label: formData.equipment,
                          }
                        : null
                    }
                    onChange={(selected) => {
                      setFormData((prev) => ({
                        ...prev,
                        equipment: selected.value,
                      }));
                      setCustomEquipment("");
                    }}
                    placeholder="Select Equipment"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              )}
            </div>

            {formData.equipment === "Other" && (
              <div>
                <label className="block font-medium mb-2 text-gray-300">
                  Custom Equipment Name
                </label>
                <input
                  type="text"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  placeholder="Specify equipment name"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-300">
                  Brand
                </label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-300">
                  Model
                </label>
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-300">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-300">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Old">Old</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-300">
                  Listing Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                  <option value="both">Both</option>
                </select>
              </div>
              {formData.type === "sale" && (
                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    Sale Price{" "}
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="negotiable"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
                />
                <label htmlFor="negotiable" className="ml-2 text-gray-300">
                  Price is Negotiable
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="warrantyIncluded"
                  name="warrantyIncluded"
                  checked={formData.warrantyIncluded}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="warrantyIncluded"
                  className="ml-2 text-gray-300"
                >
                  Warranty Included
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Reason for Sale
              </label>
              <input
                name="reasonForSale"
                value={formData.reasonForSale}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {(formData.type === "rent" || formData.type === "both") && (
              <div className="space-y-6 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-300">
                  Rental Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Available From
                    </label>
                    <input
                      type="date"
                      name="rental.availableFrom"
                      value={formData.rental.availableFrom}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Available Until
                    </label>
                    <input
                      type="date"
                      name="rental.availableUntil"
                      value={formData.rental.availableUntil}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Min Rental Period (days)
                    </label>
                    <input
                      type="number"
                      name="rental.minRentalPeriod"
                      value={formData.rental.minRentalPeriod}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Max Rental Period (days)
                    </label>
                    <input
                      type="number"
                      name="rental.maxRentalPeriod"
                      value={formData.rental.maxRentalPeriod}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {formData.type === "both" && (
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Rental Price (per day)
                    </label>
                    <input
                      type="number"
                      name="rental.rentalPrice"
                      value={formData.rental.rentalPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Deposit Amount
                    </label>
                    <input
                      type="number"
                      name="rental.deposit"
                      value={formData.rental.deposit}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Maintenance Responsibility
                    </label>
                    <select
                      name="rental.maintenanceBy"
                      value={formData.rental.maintenanceBy}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Renter">Renter</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rental.isAvailable"
                    name="rental.isAvailable"
                    checked={formData.rental.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="rental.isAvailable"
                    className="ml-2 text-gray-300"
                  >
                    Currently Available for Rent
                  </label>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-300">
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="location.street"
                    value={formData.location.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    State
                  </label>
                  <input
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Contact Number
              </label>
              <input
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Upload Images (Max 5)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-800 border-gray-700 hover:bg-gray-700/50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG (MAX. 5MB each)
                    </p>
                  </div>
                  <input
                    name="images"
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                    max="5"
                  />
                </label>
              </div>
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-700"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(idx)}
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Updating Listing..." : "Update Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;
