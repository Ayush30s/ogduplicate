import { useState } from "react";
import { convertToBase64 } from "../../utils/FileToBase64";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  // State variables
  const [fullName, setFullname] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR63wsnbmsG6UCb-NZBJUTEkUr3F_E6jhRWiA&s"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    const base64 = await convertToBase64(file);
    setPreviewImage(base64);
  };

  // Form Submit Handler
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const Base64ImageString = await convertToBase64(profileImage);
    const userData = {
      fullName,
      gender,
      email,
      password,
      contact,
      profileImage: Base64ImageString,
      state,
      city,
      street,
    };
    const response = await fetch(
      "https://gymbackenddddd-1.onrender.com/register/user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    if (response.status === 409) {
      setErrorMessage("This email is already registered");
      setSuccessMessage("");
    } else if (response.status === 201) {
      setSuccessMessage("You have successfully registered!");
      navigate("/");
      setErrorMessage("");
      setFullname("");
      setGender("");
      setEmail("");
      setPassword("");
      setContact("");
      setProfileImage(null);
      setPreviewImage("/images/gym-profile-placeholder.jpg");
      setCity("");
      setState("");
      setStreet("");
    } else {
      setErrorMessage("Something went wrong. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-2xl">
          {/* Left Side - Gym Theme Image */}
          <div className="md:w-1/3 bg-gradient-to-b from-red-600 to-red-800 p-8 flex flex-col justify-center items-center text-white">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">FITPRO</h1>
              <p className="text-red-100">Join Our Fitness Community</p>
            </div>
            <div className="w-full h-48 bg-red-700 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-24 h-24 text-red-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                ></path>
              </svg>
            </div>
            <p className="text-center text-red-100 text-sm">
              Start your fitness journey today and achieve your goals with our
              professional trainers and facilities.
            </p>
          </div>

          {/* Right Side - Registration Form */}
          <div className="md:w-2/3 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Member Registration
            </h2>
            <p className="text-gray-600 mb-6">
              Create your account to access our gym facilities
            </p>

            {successMessage && (
              <div className="bg-green-500 text-white p-3 rounded mb-4 text-center">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Full Name & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={fullName}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Contact & Profile Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="text-sm text-gray-500 mt-2">
                          {profileImage ? "Change image" : "Click to upload"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        required
                      />
                    </label>
                    {previewImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-full border-2 border-red-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Join Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
