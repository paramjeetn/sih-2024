// "use client";

// import React, { useEffect, useState } from 'react';
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebaseConfig"; // Adjust the path to your Firebase configuration

// // Define the type for a complaint
// interface Complaint {
//   id: string;
//   problemId: string;
//   complaintText: string;
//   grievanceDescription: string;
//   incidentDate: string;
//   mobileNo: string;
//   createdAt: any; // You can use `firebase.firestore.Timestamp` if you import it
//   fileUrl: string;
//   severity?: 'High' | 'Mid' | 'Low'; // Optional, since severity might not be present
// }

// const MockUserDashboard = () => {
//   const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Hardcoded mock mobile number
//   const mockMobileNumber = "9692639456";

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         // Query to find complaints by mobile number
//         const complaintsQuery = query(
//           collection(db, "complaints"),
//           where("mobileNo", "==", mockMobileNumber)
//         );

//         const complaintsSnapshot = await getDocs(complaintsQuery);
//         const complaints: Complaint[] = complaintsSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         })) as Complaint[]; // Explicitly type this as an array of Complaint

//         setUserComplaints(complaints);
//       } catch (err) {
//         if (err instanceof Error) {
//           console.error("Error fetching data:", err);
//           setError(err.message);
//         } else {
//           console.error("Unexpected error", err);
//           setError("An unexpected error occurred.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="min-h-screen flex flex-col p-6 bg-gray-100">
//       <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
//         <h1 className="text-2xl font-semibold mb-4">Mock User Dashboard</h1>
//         <h2 className="text-xl font-semibold mt-6 mb-2">Your Complaints</h2>
//         {userComplaints.length === 0 ? (
//           <p>No complaints found.</p>
//         ) : (
//           <ul>
//             {userComplaints.map(complaint => (
//               <li key={complaint.id} className="mb-4 border-b pb-4">
//                 <p><strong>Problem ID:</strong> {complaint.problemId}</p>
//                 <p><strong>Complaint:</strong> {complaint.complaintText}</p>
//                 <p><strong>Grievance Description:</strong> {complaint.grievanceDescription}</p>
//                 <p><strong>Incident Date:</strong> {complaint.incidentDate}</p>
//                 <p><strong>Created At:</strong> {new Date(complaint.createdAt.toDate()).toLocaleString()}</p>
//                 <p><strong>File:</strong> <a href={complaint.fileUrl} target="_blank" rel="noopener noreferrer">View File</a></p>
//                 <p><strong>Severity:</strong> <span
//                   className={`inline-block px-3 py-1 rounded-full ${
//                     complaint.severity === 'High'
//                       ? 'bg-red-100 text-red-800'
//                       : complaint.severity === 'Mid'
//                       ? 'bg-yellow-100 text-yellow-800'
//                       : complaint.severity === 'Low'
//                       ? 'bg-green-100 text-green-800'
//                       : ''
//                   }`}
//                 >
//                   {complaint.severity}
//                 </span></p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MockUserDashboard;


"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useComplaint } from '@/lib/ComplaintContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface Complaint {
  userId: string;
  problemId: string;
  mobileNo: string;
  complaintText: string;
  date: string; // This corresponds to incidentDate from your schema
  severity?: 'High' | 'Mid' | 'Low';
  grievanceDescription?: string;
  status?: string;
  fileUrl?: string;
  pnr?: string; // Assuming pnr is also part of your schema
}

interface Admin {
  name: string;
  email: string;
  phone: string;
  totalComplaintsHandled: number;
  profileImage: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const { setComplaint } = useComplaint();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      const q = query(collection(db, 'departments'));
      const querySnapshot = await getDocs(q);
      const fetchedComplaints: Complaint[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedComplaints.push({
          userId: data.userId,
          problemId: data.problemId,
          mobileNo: data.mobileNo,
          complaintText: data.complaintText,
          date: data.incidentDate,
          severity: data.severity,
          grievanceDescription: data.grievanceDescription,
          status: data.status,
          fileUrl: data.fileUrl,
          pnr: data.pnr,
        });
      });

      setComplaints(fetchedComplaints);
    };

    const fetchAdminDetails = async () => {
      const q = query(
        collection(db, 'departments'), 
        where('email', '==', 'admin@example.com')
        ); // Replace with actual email or identifier
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        const adminData = adminDoc.data();

        setAdmin({
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone,
          totalComplaintsHandled: setComplaints.length,
          profileImage: adminData.profileImage,
        });
      }
    };

    fetchComplaints();
    fetchAdminDetails();
  }, []);

  const markAsSolved = (problemId: string) => {
    const updatedComplaints = complaints.filter((complaint) => complaint.problemId !== problemId);
    setComplaints(updatedComplaints);

    if (admin) {
      setAdmin({
        ...admin,
        totalComplaintsHandled: admin.totalComplaintsHandled + 1,
      });
    }
  };

  const handleComplaintClick = (complaint: Complaint) => {
    setComplaint(complaint);
    router.push(`/admin/${complaint.problemId}`);
  };

  return (
    <div className="min-h-screen flex p-6 bg-gray-100">
      {/* Left Panel */}
      <div className="w-1/4 bg-white shadow-md rounded-lg p-6 mr-6 flex flex-col items-center">
        {admin && (
          <>
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden">
              <img src={admin.profileImage} alt="Profile" className="rounded-full object-cover w-full h-full" />
            </div>
            <div className="text-center mb-4">
              <p className="font-semibold text-lg">{admin.name}</p>
              <p className="text-gray-500">{admin.email}</p>
              <p className="text-gray-500">{admin.phone}</p>
            </div>
            <div className="bg-blue-100 text-blue-700 rounded-lg px-4 py-2 w-full text-center">
              <p>Total Complaints Handled</p>
              <p className="font-bold text-xl">{admin.totalComplaintsHandled}</p>
            </div>
          </>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-3/4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b border-gray-300 py-2 px-4 text-left">Problem ID</th>
                <th className="border-b border-gray-300 py-2 px-4 text-left">PNR</th>
                <th className="border-b border-gray-300 py-2 px-4 text-left">Complaint</th>
                <th className="border-b border-gray-300 py-2 px-4 text-left">Date</th>
                <th className="border-b border-gray-300 py-2 px-4 text-left">Severity</th>
                <th className="border-b border-gray-300 py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.problemId} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 py-2 px-4">{complaint.problemId}</td>
                  <td className="border-b border-gray-300 py-2 px-4">{complaint.pnr}</td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => handleComplaintClick(complaint)}
                    >
                      {complaint.complaintText}
                    </span>
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">{complaint.date}</td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full border ${
                        complaint.severity === 'High'
                          ? 'text-red-500 border-red-500'
                          : complaint.severity === 'Mid'
                          ? 'text-yellow-500 border-yellow-500'
                          : 'text-green-500 border-green-500'
                      }`}
                    >
                      {complaint.severity}
                    </span>
                  </td>
                  <td className="border-b border-gray-300 py-2 px-4">
                    <button
                      onClick={() => markAsSolved(complaint.problemId)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Mark as Solved
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
