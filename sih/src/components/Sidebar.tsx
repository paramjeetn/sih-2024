import React from 'react';

const Sidebar = ({ userDetails, complaintsCount }: { userDetails: any, complaintsCount: number }) => {
  return (
    <div className="w-1/4 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
      {userDetails && (
        <>
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden">
            {/* Profile Image */}
            <img
              src={userDetails.profileImage}
              alt="Profile"
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div className="text-center mb-4">
            <p className="font-semibold text-lg">{userDetails.name}</p>
            <p className="text-gray-500">{userDetails.email}</p>
            <p className="text-gray-500">{userDetails.phoneNumber}</p>
          </div>
          <div className="bg-blue-100 text-blue-700 rounded-lg px-4 py-2 w-full text-center">
            <p>Total Complaints Lodged</p>
            <p className="font-bold text-xl">{complaintsCount}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
