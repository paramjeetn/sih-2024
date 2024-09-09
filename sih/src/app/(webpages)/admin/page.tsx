"use client";

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';

interface Complaint {
  id: string;
  userId: number;
  problemId: number;
  phone: number;
  pnr: number;
  enhancedComplaint: string;
  severity?: 'High' | 'Mid' | 'Low';
  date: string;
  email: string;
  fileUrl?: string;
  department?: string;
}

interface Admin {
  name: string;
  email: string;
  department: string;
  profileImage: string;
  totalComplaintsHandled: number;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminDetailsString = localStorage.getItem('adminDetails');
        let adminEmail = null;

        if (adminDetailsString) {
          const adminDetails = JSON.parse(adminDetailsString);
          adminEmail = adminDetails.email;
        }
        if (!adminEmail) {
          router.push('/admin'); // Redirect to admin login if not logged in
          return;
        }

        const adminQuery = query(collection(db, 'admin'), where('email', '==', adminEmail));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminDoc = adminSnapshot.docs[0];
          const adminData = adminDoc.data() as Admin;
          setAdmin(adminData);
        } else {
          console.error("Admin not found in the database");
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, [router]);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (admin && admin.department) {
        try {
          const complaintsQuery = query(
            collection(db, 'department'),
            where('department', '==', admin.department)
          );
          const complaintsSnapshot = await getDocs(complaintsQuery);

          const fetchedComplaints: Complaint[] = complaintsSnapshot.docs.map((doc) => {
            const data = doc.data();
            let dateStr = "";
            if (data.date instanceof Timestamp) {
              dateStr = data.date.toDate().toLocaleString(); // Convert to string format
            } else {
              dateStr = data.date;
            }
            return {
              id: doc.id,
              userId: data.userId,
              problemId: data.problemId,
              phone: data.phone,
              pnr: data.pnr,
              enhancedComplaint: data.enhancedComplaint,
              severity: data.severity,
              date: dateStr,
              email: data.email,
              fileUrl: data.fileUrl,
              department: data.department,
            };
          });

          setComplaints(fetchedComplaints);
        } catch (error) {
          console.error("Error fetching complaints:", error);
        }
      }
    };

    fetchComplaints();
  }, [admin]);

  const handleComplaintClick = (complaint: Complaint) => {
    router.push(`/admin/${complaint.id}?complaint=${encodeURIComponent(JSON.stringify(complaint))}`);
  };

  const markAsSolved = async (complaintId: string) => {
    try {
      // First, remove the complaint from Firestore
      const complaintDocRef = doc(db, 'department', complaintId);
      await deleteDoc(complaintDocRef);

      // Then, remove the complaint from the local state to make it disappear from the UI
      setComplaints(prevComplaints =>
        prevComplaints.filter(complaint => complaint.id !== complaintId)
      );

      // Fetch the admin document reference using the email
      if (admin) {
        const adminQuery = query(collection(db, 'admin'), where('email', '==', admin.email));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminDocRef = adminSnapshot.docs[0].ref;
          const newTotalComplaintsHandled = admin.totalComplaintsHandled + 1;

          // Update the admin's complaint count in Firestore
          await updateDoc(adminDocRef, { totalComplaintsHandled: newTotalComplaintsHandled });

          // Update the local state for the admin to trigger a re-render
          setAdmin(prevAdmin => prevAdmin ? { ...prevAdmin, totalComplaintsHandled: newTotalComplaintsHandled } : prevAdmin);
        } else {
          console.error("Admin document not found.");
        }
      }
    } catch (error) {
      console.error("Error marking complaint as solved:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex justify-center items-center bg-gray-100 p-6">
        <h1 className="text-2xl">Admin Dashboard</h1>
      </main>
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
            <h2 className="text-xl font-semibold mb-6">Complaints Overview</h2>
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
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="border-b border-gray-300 py-2 px-4">{complaint.problemId}</td>
                    <td className="border-b border-gray-300 py-2 px-4">{complaint.pnr}</td>
                    <td
  className="border-b border-gray-300 py-2 px-4 text-blue-600 hover:underline cursor-pointer"
  onClick={() => handleComplaintClick(complaint)}
>
  {(() => {
    const words = complaint.enhancedComplaint.split(' ');
    if (words.length > 4) {
      return `${words.slice(0, 4).join(' ')}...`;
    }
    return complaint.enhancedComplaint;
  })()}
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
                        onClick={() => markAsSolved(complaint.id)}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        Mark as Solved
                      </button>
                    </td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No complaints found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
