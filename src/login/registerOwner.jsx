import { useState } from "react";
import { convertToBase64 } from "../../utils/FileToBase64";
import { useNavigate } from "react-router-dom";

const RegisterOwner = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    password: "",
    contact: "",
    gymName: "",
    description: "",
    monthlyCharge: "",
    city: "",
    state: "",
    street: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR63wsnbmsG6UCb-NZBJUTEkUr3F_E6jhRWiA&s"
  );
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6)
          error = "Password must be at least 6 characters";
        break;
      case "contact":
        if (!value) error = "Contact number is required";
        else if (!/^\d{10,15}$/.test(value))
          error = "Invalid phone number (10-15 digits)";
        break;
      case "gymName":
        if (!value.trim()) error = "Gym name is required";
        break;
      case "monthlyCharge":
        if (!value) error = "Monthly charge is required";
        else if (isNaN(value)) error = "Must be a valid number";
        else if (Number(value) <= 0) error = "Must be greater than 0";
        break;
      case "state":
      case "city":
      case "street":
        if (!value.trim()) error = "This field is required";
        break;
      case "description":
        if (!value.trim()) error = "Description is required";
        else if (value.length < 20)
          error = "Description must be at least 20 characters";
        break;
      case "gender":
        if (!value) error = "Please select a gender";
        break;
      default:
        break;
    }

    return error;
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    // Validate field
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match("image.*")) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Please upload an image file",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Image must be less than 2MB",
      }));
      return;
    }

    try {
      setProfileImage(file);
      const base64 = await convertToBase64(file);
      setPreviewImage(base64);
      setErrors((prev) => ({
        ...prev,
        profileImage: "",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Failed to process image",
      }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    // Validate profile image
    if (!profileImage) {
      newErrors.profileImage = "Gym logo is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const Base64ImageString = await convertToBase64(profileImage);

      const userData = {
        ...formData,
        profileImage: Base64ImageString,
      };

      const response = await fetch(
        "https://gymbackenddddd-1.onrender.com/register/owner",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const contentType = response.headers.get("content-type");

      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        responseData = { message: text };
      }

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: "This email is already registered" });
        } else {
          setErrors({
            form:
              responseData.message || "Something went wrong. Please try again.",
          });
        }
        setSuccessMessage("");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Your gym has been successfully registered!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ form: "Network error. Please check your connection." });
      setIsSubmitting(false);
    }
  };

  // Helper to check if field has error
  const hasError = (field) => errors[field] && errors[field].length > 0;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto shadow-2xl rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row bg-gray-900 rounded-xl">
          {/* Sidebar */}
          <div className="md:w-1/3 bg-gradient-to-b from-red-600 to-red-800 p-8 flex flex-col justify-center items-center text-white">
            <h1 className="text-3xl font-bold mb-2">Only Gym</h1>
            <p className="text-red-100 mb-6">Register Your Gym With Us</p>
            <div className="w-full h-40 bg-red-700 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-20 h-20 text-red-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
            </div>
            <p className="text-sm text-center text-red-100">
              Join our network of professional gym owners and reach more
              customers through our platform.
            </p>
          </div>

          {/* Form */}
          <div className="md:w-2/3 p-8 bg-gray-800">
            <h2 className="text-3xl font-bold text-white mb-2">
              Gym Owner Registration
            </h2>
            <p className="text-gray-400 mb-6">
              Register your gym to start managing members and services.
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Name and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    autoComplete="name"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("fullName")
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {hasError("fullName") && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    name="gender"
                    autoComplete="sex"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("gender") ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {hasError("gender") && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Email and Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("email") ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {hasError("email") && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("password")
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {hasError("password") && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact and Gym Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="Contact Number"
                    autoComplete="tel"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("contact") ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.contact}
                    onChange={handleChange}
                  />
                  {hasError("contact") && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contact}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="gymName"
                    placeholder="Gym Name"
                    autoComplete="organization"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("gymName") ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.gymName}
                    onChange={handleChange}
                  />
                  {hasError("gymName") && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.gymName}
                    </p>
                  )}
                </div>
              </div>

              {/* Monthly Charge */}
              <div>
                <input
                  type="number"
                  name="monthlyCharge"
                  placeholder="Monthly Membership Charge ($)"
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                    hasError("monthlyCharge")
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  value={formData.monthlyCharge}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
                {hasError("monthlyCharge") && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.monthlyCharge}
                  </p>
                )}
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    autoComplete="address-level1"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("state") ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {hasError("state") && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    autoComplete="address-level2"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("city") ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {hasError("city") && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    autoComplete="address-line1"
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                      hasError("street") ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    value={formData.street}
                    onChange={handleChange}
                  />
                  {hasError("street") && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>
              </div>

              {/* Gym Description */}
              <div>
                <textarea
                  name="description"
                  placeholder="Gym Description"
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                    hasError("description")
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {hasError("description") && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Gym Logo */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="cursor-pointer w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-center border border-gray-600 hover:bg-gray-600 transition">
                    Upload Gym Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {errors.profileImage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.profileImage}
                    </p>
                  )}
                </div>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-red-600"
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
                disabled={
                  isSubmitting || Object.values(errors).some((error) => error)
                }
              >
                {isSubmitting ? "Registering..." : "Register Gym"}
              </button>
            </form>

            {successMessage && (
              <div className="bg-green-600 p-3 rounded mt-4 text-center">
                {successMessage}
              </div>
            )}

            {errors.form && (
              <div className="bg-red-600 p-3 rounded mt-4 text-center">
                {errors.form}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterOwner;
