import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
} from "lucide-react";
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!data) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md border border-gray-700">
        No data available.
      </div>
    );
  }

  const handleDeleteShift = () => {
    try {
      dispatch(deleteShiftThunk(data._id));
      navigate("/home/gym-dashboard");
    } catch (err) {
      setError("Failed to delete shift.");
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(updateShiftThunk({ ...formData, _id: data._id }));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update shift.");
    }
  };

  if (error) {
    return (
      <div className="m-20 text-red-400 flex flex-col items-center">
        <div className="bg-gray-800 p-4 rounded-lg border border-red-400/30">
          {error}
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-800 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
          <Clock className="text-indigo-400" size={20} />
          Shift Details
        </h2>
        {!isEditing && (
          <div className="flex gap-3">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-3 py-2 rounded-lg transition text-sm border border-indigo-500/30"
            >
              <Edit size={14} />
              Edit
            </button>

            <button
              onClick={handleDeleteShift}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg transition text-sm border border-red-500/30"
            >
              <Trash2 size={14} />
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
                min="1"
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
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium transition-colors"
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
              <InfoItem
                icon={<Users size={18} className="text-purple-400" />}
                label="Gender"
                value={data?.sex || "All"}
              />
              <InfoItem
                icon={<Users size={18} className="text-blue-400" />}
                label="Joined Members"
                value={`${data.joinedBy?.length || 0}`}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <button
              onClick={toggleMembers}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition text-sm mb-4 font-medium"
            >
              {showMembers ? (
                <>
                  <ChevronUp size={16} />
                  Hide Members
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show Members ({data.joinedBy?.length || 0})
                </>
              )}
            </button>

            {showMembers && (
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                {data.joinedBy?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No members joined yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {data.joinedBy.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl border border-gray-700 shadow-sm hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={member.profileImage}
                          alt={member.fullName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                        />
                        <Link
                          to={`/home/user/${member._id}`}
                          className="hover:underline flex-1 min-w-0"
                        >
                          <p className="text-white font-medium truncate">
                            {member.fullName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            Joined:{" "}
                            {new Date(member.joinedAt).toLocaleDateString()}
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

const InputField = ({ label, name, type, value, onChange, min }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      required
    />
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
    <div className="mt-0.5">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
    <div className="flex items-center gap-3">
      <div
        className={`w-3 h-3 rounded-full ${
          status === "Active" ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <div>
        <p className="text-sm text-gray-400">Status</p>
        <p
          className={`font-medium ${
            status === "Active" ? "text-green-400" : "text-red-400"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  </div>
);

export default ShiftPage;
