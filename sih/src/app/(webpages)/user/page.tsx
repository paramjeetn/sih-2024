"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ComplaintsTable from '@/components/ComplaintsTable';
import { useComplaint } from '@/lib/ComplaintContext';
import { useAuth } from '@/components/AuthProvider';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface Complaint {
  userId: string;
  problemId: string;
  mobileNo: string;
  complaintText: string;
  date: string;
  severity?: 'High' | 'Mid' | 'Low';
  grievanceDescription?: string;
  status?: string;
  fileUrl?: string;
  pnr?: string;
}

interface UserDetails {
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
}

const UserDashboard = () => {
  const router = useRouter();
  const { setComplaint } = useComplaint();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (user) {
        const phnNr_q = query(
          collection(db, 'users'),
          where('email', '==', user.email)
        );
        const query_res = await getDocs(phnNr_q);

        if (!query_res.empty) {
          const userDoc = query_res.docs[0];
          const userPhoneNumber = userDoc.data().phoneNumber;
          const userData = {
            name: userDoc.data().name || "User",
            email: userDoc.data().email,
            phoneNumber: userPhoneNumber,
            profileImage: userDoc.data().profileImage || '/path-to-default-profile-image.jpg',
          };

          setUserDetails(userData);

          const complaintsQuery = query(
            collection(db, 'complaints'),
            where('mobileNo', '==', userPhoneNumber)
          );
          const complaintsSnapshot = await getDocs(complaintsQuery);

          let userComplaints: Complaint[] = [];

          if (!complaintsSnapshot.empty) {
            userComplaints = complaintsSnapshot.docs.map(doc => ({
              userId: doc.data().userId,
              problemId: doc.data().problemId,
              mobileNo: doc.data().mobileNo,
              complaintText: doc.data().complaintText,
              date: doc.data().incidentDate,
              severity: doc.data().severity,
              grievanceDescription: doc.data().grievanceDescription,
              fileUrl: doc.data().fileUrl,
              status: doc.data().status || 'N/A',
              pnr: doc.data().pnr,
            }));
          }

          setComplaints(userComplaints);
        }
      }
    };

    fetchComplaints();
  }, [user]);

  const handleComplaintClick = (complaint: Complaint) => {
    setComplaint(complaint);
    router.push(`/user/${complaint.problemId}`);
  };

  return (
    <div className="min-h-screen flex p-6 bg-gray-50">
      <Sidebar userDetails={userDetails} complaintsCount={complaints.length} />
      <div className="flex-grow p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Complaints</h1>
        <ComplaintsTable complaints={complaints} onComplaintClick={handleComplaintClick} />
      </div>
    </div>
  );
};

export default UserDashboard;
