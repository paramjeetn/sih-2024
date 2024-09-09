"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

interface Complaint {
  id: string;
  userId: number;
  problemId: number;
  phone: number;
  pnr: number;
  enhancedComplaint: string;
  severity?: 'High' | 'Mid' | 'Low';
  date: string;
  status: string;
  email: string;
  fileUrl?: string;
  department?: string;
}

const ComplaintDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const complaintData = searchParams.get('complaint');
    if (complaintData) {
      setComplaint(JSON.parse(complaintData));
    } else {
      // If no complaint data is found, navigate back to the admin dashboard
      router.push('/admin');
    }
  }, [router, searchParams]);

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
            <span className="font-semibold text-lg text-gray-600">Complaint:</span>
            <span className="text-gray-900 mt-2">{complaint.enhancedComplaint}</span>
          </div>
          <hr className="border-t border-gray-200 my-4" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-600">PNR:</span>
            <span className="text-gray-900 mt-2">{complaint.pnr}</span>
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

          {complaint.fileUrl && (
            <div className="flex flex-col mt-8">
              <span className="font-semibold text-lg text-gray-600">Attached File:</span>
              <a href={complaint.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2">
                View File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
