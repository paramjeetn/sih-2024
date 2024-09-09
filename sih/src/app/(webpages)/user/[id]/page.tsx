"use client";

import React from 'react';
import { useComplaint } from '../../../../lib/ComplaintContext';

const ComplaintDetailsPage = () => {
  const { complaint } = useComplaint();

  if (!complaint) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-3xl border border-gray-300">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800 border-b-2 border-gray-200 pb-4">
          Complaint Details
        </h1>
        
        <div className="space-y-8">
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">Problem ID:</span>
            <span className="text-gray-900 mt-2">{complaint.problemId}</span>
          </div>
          <hr className="border-t border-gray-200 my-4" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">Mobile No:</span>
            <span className="text-gray-900 mt-2">{complaint.mobileNo}</span>
          </div>
          <hr className="border-t border-gray-200 my-4" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">Complaint:</span>
            <span className="text-gray-900 mt-2">{complaint.complaintText}</span>
          </div>
          <hr className="border-t border-gray-200 my-4" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">Date:</span>
            <span className="text-gray-900 mt-2">{complaint.date}</span>
          </div>
          <hr className="border-t border-gray-200 my-4" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">Severity:</span>
            <span
              className={`mt-2 ${
                complaint.severity === 'High'
                  ? 'text-red-600'
                  : complaint.severity === 'Mid'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              } font-medium`}
            >
              {complaint.severity}
            </span>
          </div>
          <hr className="border-t border-gray-200 my-4" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">Description:</span>
            <span className="text-gray-900 mt-2">{complaint.grievanceDescription}</span>
          </div>

          {complaint.fileUrl && (
            <div className="flex flex-col mt-8">
              <span className="font-semibold text-lg text-gray-600">Attached File:</span>
              <a
                href={complaint.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2"
              >
                View File
              </a>
            </div>
          )}

          <hr className="border-t border-gray-200 my-4" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">Status:</span>
            <span className="text-gray-900 mt-2">{complaint.status || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
