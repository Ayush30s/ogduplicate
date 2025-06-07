import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  deleteShiftThunk,
  updateShiftThunk,
} from "../../store/thunk/profile-management";

const ShiftPage = ({ data }) => {
  const [showMembers, setShowMembers] = useState(false);
  const [error, setError] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    limit: data?.limit || "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    status: data?.status || "Active",
  });

  const dispatch = useDispatch();

  if (!data) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md border border-gray-700">
        No data available.
      </div>
    );
  }

  const handleDeleteShift = async () => {
    dispatch(deleteShiftThunk(data._id));
  };

  const toggleMembers = () => setShowMembers((prev) => !prev);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => setIsEditing(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateShiftThunk({ ...formData, _id: data._id }));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update shift.");
    }
  };

  if (error) {
    return <div className="m-20 text-red-400">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow border border-gray-800 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
          Shift Details
        </h2>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-indigo-300 px-3 py-1 rounded-lg transition text-sm"
            >
              <Edit size={12} />
              Edit
            </button>

            <button
              onClick={handleDeleteShift}
              className="flex items-center gap-1 bg-gray-700 hover:bg-red-600 text-red-400 px-3 py-1 rounded-lg transition text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField
                label="Member Limit"
                name="limit"
                type="number"
                value={formData.limit}
                onChange={handleInputChange}
              />
              <InputField
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
              />
              <InputField
                label="End Time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoItem
                icon={<Users size={18} className="text-green-400" />}
                label="Member Limit"
                value={data.limit}
              />
              <InfoItem
                icon={<Clock size={18} className="text-yellow-400" />}
                label="Start Time"
                value={data.startTime}
              />
              <InfoItem
                icon={<Clock size={18} className="text-red-400" />}
                label="End Time"
                value={data.endTime}
              />
            </div>

            <div className="space-y-4">
              <StatusBadge status={data.status} />
              <InfoItem label="Gender" value={data?.sex} />
              <InfoItem
                label="Joined"
                value={`${data.joinedBy?.length} members`}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={toggleMembers}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition text-sm mb-4"
            >
              {showMembers ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              {showMembers ? "Hide Members" : "Show Members"}
            </button>

            {showMembers && (
              <div>
                {data.joinedBy.length === 0 ? (
                  <p className="text-gray-500">No members joined yet.</p>
                ) : (
                  <div className="flex flex-row overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-2">
                    {data.joinedBy.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center gap-4 bg-gray-800 p-3 rounded-xl border border-gray-700 shadow-sm"
                      >
                        <img
                          src={member.profileImage}
                          alt={member.fullName}
                          className="w-12 h-12 rounded-full object-cover border border-gray-500"
                        />
                        <Link
                          to={`/home/user/${member._id}`}
                          className="hover:underline"
                        >
                          <p className="text-white font-medium">
                            {member.fullName}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon && icon}
    <div className="text-sm">
      <p className="text-gray-400">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <div className="flex items-center gap-2">
    <p className="text-gray-400">Status:</p>
    <span
      className={`font-semibold px-2 py-1 rounded-md text-sm ${
        status === "Active"
          ? "bg-green-700 text-green-200"
          : "bg-red-700 text-red-200"
      }`}
    >
      {status}
    </span>
  </div>
);

export default ShiftPage;
