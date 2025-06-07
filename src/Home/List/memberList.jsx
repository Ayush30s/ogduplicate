import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MemberList = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [membersList, setMemberrsList] = useState([]);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await fetch(
          `https://gymbackenddddd-1.onrender.com/home/gym/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.status === 401) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Something went wrong");
        }

        const data = await response.json();
        setMemberrsList(data?.gymData?.joinedBy);
      } catch (err) {
        console.log(err);
        if (err.message === "Unauthorized access!") {
          navigate(
            "/?error=Please sign in to continue and access all features of the application."
          );
        }
      }
    };
    fetchGym();
  }, [id, navigate]);

  const handleNavigatetoProfile = (userId) => {
    navigate(`/home/user/${userId}`);
  };

  if (membersList.length === 0) {
    return <h1 className="my-[10%] mx-[40%]">NO MEMBERS FOUND</h1>;
  }

  return (
    <div className="p-6 bg-white min-h-screen max-w-2xl mx-auto relative">
      {/* Close button positioned absolutely at top right */}
      <button
        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full transition-colors duration-200"
        onClick={() => navigate(-1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M6.225 6.225a.75.75 0 011.06 0L12 10.94l4.715-4.715a.75.75 0 111.06 1.06L13.06 12l4.715 4.715a.75.75 0 11-1.06 1.06L12 13.06l-4.715 4.715a.75.75 0 11-1.06-1.06L10.94 12 6.225 7.285a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-start">
        Members
      </h1>

      <div className="space-y-4 mx-auto">
        {membersList.map((member, index) => {
          const userData = member?.user;
          return (
            <div
              onClick={() => handleNavigatetoProfile(userData?._id)}
              key={index}
              className="flex flex-row justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={userData.profileImage}
                  alt={userData.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <h1 className="text-lg font-medium text-gray-800">
                  {userData.fullName}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberList;
