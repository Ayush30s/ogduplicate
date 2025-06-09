import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertToBase64 } from "../../utils/FileToBase64";

const RegisterOwner = () => {
  const [fullName, setFullname] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [gymName, setGymName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyCharge, setMonthlyCharge] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [street, setStreet] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR63wsnbmsG6UCb-NZBJUTEkUr3F_E6jhRWiA&s"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    const base64 = await convertToBase64(file);
    setPreviewImage(base64);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const Base64ImageString = await convertToBase64(profileImage);

    const userData = {
      fullName,
      gender,
      email,
      password,
      contact,
      gymName,
      city,
      state,
      street,
      description,
      profileImage: Base64ImageString,
      monthlyCharge,
    };

    const response = await fetch("http://localhost:7000/register/owner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response.status === 409) {
      setErrorMessage("This email is already registered");
      setSuccessMessage("");
    } else if (response.status === 201) {
      setSuccessMessage("Your gym has been successfully registered!");
      navigate("/");
    } else {
      setErrorMessage("Something went wrong. Please try again later.");
      setSuccessMessage("");
    }
  };

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

            {successMessage && (
              <div className="bg-green-600 p-3 rounded mb-4 text-center">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-600 p-3 rounded mb-4 text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Name and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={fullName}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
                <select
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email and Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Contact and Gym Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Contact Number"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Gym Name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  required
                />
              </div>

              {/* Monthly Charge */}
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Monthly Membership Charge ($)"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={monthlyCharge}
                  onChange={(e) => setMonthlyCharge(e.target.value)}
                  required
                />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="State"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Street"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              {/* Gym Description */}
              <div>
                <textarea
                  placeholder="Gym Description"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Gym Logo */}
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-center border border-gray-600 hover:bg-gray-600 transition">
                  Upload Gym Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    required
                  />
                </label>
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
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
              >
                Register Gym
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterOwner;
