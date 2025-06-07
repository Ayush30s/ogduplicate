import React, { useState, useRef } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { equipmentCategories } from "../../public/data";
import { addNewListingThunk } from "../store/thunk/listing-management";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorDivRef = useRef(null);
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
  const [formErrors, setFormErrors] = useState({});
  const [customEquipment, setCustomEquipment] = useState("");
  const { loading } = useSelector((store) => store.listing);
  console.log(formErrors, "formErrors");

  const categoryOptions = Object.keys(equipmentCategories).map((category) => ({
    label: category,
    value: category,
  }));

  const isDateBefore = (d1, d2) => new Date(d1) < new Date(d2);
  const isValidDate = (d) => !isNaN(new Date(d).getTime());

  const setFieldError = (field, message) => {
    setFormErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field) => {
    setFormErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
      const newValue = type === "checkbox" ? checked : value;
      const updatedRental = {
        ...formData.rental,
        [fieldName]: newValue,
      };

      // Rental date logic
      if (
        fieldName === "availableFrom" &&
        updatedRental.availableUntil &&
        !isDateBefore(newValue, updatedRental.availableUntil)
      ) {
        setFieldError("rental.availableFrom", "Must be before Available Until");
        return;
      } else if (fieldName === "availableFrom") {
        clearFieldError("rental.availableFrom");
      }

      if (
        fieldName === "availableUntil" &&
        updatedRental.availableFrom &&
        !isDateBefore(updatedRental.availableFrom, newValue)
      ) {
        setFieldError("rental.availableUntil", "Must be after Available From");
        return;
      } else if (fieldName === "availableUntil") {
        clearFieldError("rental.availableUntil");
      }

      if (
        formData.purchaseDate &&
        isValidDate(formData.purchaseDate) &&
        !isDateBefore(formData.purchaseDate, newValue)
      ) {
        setFieldError("purchaseDate", "Must be before rental availability.");
        return;
      } else {
        clearFieldError("purchaseDate");
      }

      // Rental period logic
      if (fieldName === "minRentalPeriod" || fieldName === "maxRentalPeriod") {
        const min = Number(
          fieldName === "minRentalPeriod"
            ? newValue
            : updatedRental.minRentalPeriod
        );
        const max = Number(
          fieldName === "maxRentalPeriod"
            ? newValue
            : updatedRental.maxRentalPeriod
        );

        if (min && max && min > max) {
          setFieldError("rental.maxRentalPeriod", "Max must be ≥ Min");
          return;
        } else {
          clearFieldError("rental.maxRentalPeriod");
        }
      }

      setFormData((prev) => ({
        ...prev,
        rental: updatedRental,
      }));
    } else if (type === "file") {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) {
        setFieldError("images", "At least one image is required.");
        return;
      }
      if (fileArray.length > 5) {
        setFieldError("images", "You can upload up to 5 images only.");
        return;
      }

      clearFieldError("images");

      const base64Array = await Promise.all(
        fileArray.map((file) => convertToBase64(file))
      );

      setFormData((prev) => ({ ...prev, images: base64Array }));

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
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
      // For purchaseDate field
      if (name === "purchaseDate") {
        if (!isValidDate(value) || new Date(value) > new Date()) {
          setFieldError(name, "Must be a valid date in the past.");
          return;
        }

        if (
          formData.rental.availableFrom &&
          !isDateBefore(value, formData.rental.availableFrom)
        ) {
          setFieldError(name, "Must be before rental availability.");
          return;
        }

        if (
          formData.rental.availableUntil &&
          !isDateBefore(value, formData.rental.availableUntil)
        ) {
          setFieldError(name, "Must be before rental availability.");
          return;
        }

        clearFieldError(name);
      }

      // For price validation
      if (
        name === "price" ||
        name === "rental.rentalPrice" ||
        name === "rental.deposit"
      ) {
        if (value && isNaN(value)) {
          setFieldError(name, "Please enter a valid number");
          return;
        } else if (value && Number(value) <= 0) {
          setFieldError(name, "Value must be greater than 0");
          return;
        } else {
          clearFieldError(name);
        }
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFormBeforeSubmit = () => {
    const errors = {};

    // Basic required fields
    if (!formData.title || formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters long.";
    }

    if (!formData.description || formData.description.length < 20) {
      errors.description = "Description must be at least 20 characters long.";
    }

    if (!formData.category) {
      errors.category = "Category is required.";
    }

    if (!formData.equipment) {
      errors.equipment = "Equipment type is required.";
    } else if (formData.equipment === "Other" && !customEquipment) {
      errors.customEquipment = "Please specify equipment name.";
    }

    if (
      !formData.contactNumber ||
      !/^\d{10,15}$/.test(formData.contactNumber)
    ) {
      errors.contactNumber = "Valid 10-15 digit contact number is required.";
    }

    if (!formData.purchaseDate || !isValidDate(formData.purchaseDate)) {
      errors.purchaseDate = "Valid purchase date is required.";
    } else if (new Date(formData.purchaseDate) > new Date()) {
      errors.purchaseDate = "Purchase date cannot be in the future.";
    }

    // Images validation
    if (!formData.images || formData.images.length === 0) {
      errors.images = "At least one image is required.";
    } else if (formData.images.length > 5) {
      errors.images = "You can upload up to 5 images only.";
    }

    // Sale validation
    if (
      formData.type === "sale" &&
      (!formData.price || Number(formData.price) <= 0)
    ) {
      errors.price = "Sale price must be greater than 0.";
    }

    // Rental validation
    if (formData.type === "rent" || formData.type === "both") {
      if (
        !formData.rental.rentalPrice ||
        Number(formData.rental.rentalPrice) <= 0
      ) {
        errors["rental.rentalPrice"] = "Rental price must be greater than 0.";
      }

      if (formData.rental.availableFrom && formData.rental.availableUntil) {
        if (
          !isDateBefore(
            formData.rental.availableFrom,
            formData.rental.availableUntil
          )
        ) {
          errors["rental.availableFrom"] = "Must be before Available Until";
          errors["rental.availableUntil"] = "Must be after Available From";
        }
      }

      if (formData.rental.minRentalPeriod && formData.rental.maxRentalPeriod) {
        if (
          Number(formData.rental.minRentalPeriod) >
          Number(formData.rental.maxRentalPeriod)
        ) {
          errors["rental.maxRentalPeriod"] = "Max must be ≥ Min";
        }
      }
    }

    // Location validation
    if (!formData.location.city) {
      errors["location.city"] = "City is required.";
    }
    if (!formData.location.state) {
      errors["location.state"] = "State is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateFormBeforeSubmit();
    if (!isValid) {
      errorDivRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    const submissionData = {
      ...formData,
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

    dispatch(addNewListingThunk(submissionData, navigate));
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
    return (
      <div className="flex justify-center items-center h-screen flex-col text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
        <p className="text-lg text-gray-700 font-medium">
          Posting your listing... Please wait.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950">
      <div
        id="errorblock"
        className="max-w-4xl mx-auto p-6 text-gray-100 bg-gray-950 min-h-screen"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          {Object.keys(formErrors).length > 0 && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <h3 className="font-medium text-red-300 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside text-red-200 text-sm space-y-1">
                {Object.entries(formErrors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Title <span className="text-red-500">*</span>
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
                  Category <span className="text-red-500">*</span>
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
                    clearFieldError("category");
                  }}
                  placeholder="Select Category"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              {formData.category && (
                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    Equipment <span className="text-red-500">*</span>
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
                      clearFieldError("equipment");
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
                  Custom Equipment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customEquipment"
                  value={customEquipment}
                  onChange={(e) => {
                    const { value } = e.target;
                    setCustomEquipment(value);
                    if (value.trim() === "") {
                      setFieldError(
                        "customEquipment",
                        "Please enter equipment name"
                      );
                    } else {
                      clearFieldError("customEquipment");
                    }
                  }}
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
                  Purchase Date <span className="text-red-500">*</span>
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
                Description <span className="text-red-500">*</span>
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
                    Sale Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
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
                      min="1"
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
                      min="1"
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {formData.type === "rent" && (
                  <div>
                    <label className="block font-medium mb-2 text-gray-300">
                      Rental Price (per day){" "}
                      <span className="text-red-500">*</span>
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
                      min="0"
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
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Upload Images (Max 5) <span className="text-red-500">*</span>
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
                        onClick={() => {
                          const newPreviews = [...previewImages];
                          newPreviews.splice(idx, 1);
                          setPreviewImages(newPreviews);
                          setFormData((prev) => {
                            const newImages = [...prev.images];
                            newImages.splice(idx, 1);
                            return { ...prev, images: newImages };
                          });
                        }}
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
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
