import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertToBase64 } from "../../utils/FileToBase64";
import { useNavigate } from "react-router-dom";
import { updatePersonalProfileDataThunk } from "../store/thunk/profile-management";

const EditPersonalDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile);
  const isUser = profileData?.userType;
  console.log(isUser);

  const [formData, setFormData] = useState({
    fullName: profileData?.fullName || "",
    contactNumber: profileData?.contactNumber || "",
    gender: profileData?.gender || "male",
    bio: profileData?.bio || "",
    description: profileData?.description || "",
    monthlyCharge: profileData?.monthlyCharge ?? "",
    profileImage: profileData?.profileImage || "",
  });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    console.log(formData);

    if (name === "profileImage" && files.length > 0) {
      const base64Image = await convertToBase64(files[0]);
      console.log(base64Image);
      setFormData({ ...formData, profileImage: base64Image });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      ...(isUser === "userModel"
        ? { bio: formData.bio }
        : { description: formData.description }),
    };

    if (isUser === "userModel") delete payload.description;
    else delete payload.bio;
    console.log(payload);

    dispatch(updatePersonalProfileDataThunk(payload));
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <form
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <button
          className="fixed left-4 top-20 p-2 bg-red-500 hover:bg-gray-500 text-white rounded-full z-50 shadow-lg"
          onClick={() => navigate(-1)}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Edit Personal Details
        </h2>

        {/* Profile Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-300">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {formData.profileImage && (
            <img
              src={formData.profileImage}
              alt="Profile Preview"
              className="mt-3 w-24 h-24 rounded-full mx-auto border-2 border-blue-500"
            />
          )}
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-300">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block text-gray-300">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-300">Gender</label>
          <div className="flex gap-4">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-2 text-gray-300">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Bio or Description */}
        <div className="mb-4">
          <label className="block text-gray-300">
            {isUser === "userModel" ? "Bio" : "Description"}
          </label>
          <textarea
            name={isUser === "userModel" ? "bio" : "description"}
            value={isUser === "userModel" ? formData.bio : formData.description}
            placeholder={
              isUser === "userModel" ? "Edit Bio" : "Edit Description"
            }
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
          ></textarea>
        </div>

        {/* Monthly Charge (Optional) */}
        {profileData?.monthlyCharge !== undefined && (
          <div className="mb-4">
            <label className="block text-gray-300">
              Monthly Charge (Optional)
            </label>
            <input
              type="number"
              name="monthlyCharge"
              value={formData.monthlyCharge}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              min="0"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-md transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditPersonalDetails;
