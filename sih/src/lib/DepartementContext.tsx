"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface Complaint {
  id: string;
  userId: number;
  problemId: number;
  phone: number;
  pnr: number;
  enhancedComplaint: string;
  severity?: 'High' | 'Mid' | 'Low';
  date: string;
  status: boolean;
  email: string;
  fileUrl?: string;
  department?: string;
}

interface Admin {
  name: string;
  email: string;
  department: string;
  profileImage: string;
}

interface DepartmentContextType {
  admin: Admin | null;
  complaints: Complaint[];
  fetchComplaints: () => void;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
};

export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const storedAdminDetails = localStorage.getItem('adminDetails');
    if (storedAdminDetails) {
      setAdmin(JSON.parse(storedAdminDetails));
    }
  }, []);

  const fetchComplaints = async () => {
    if (admin && admin.department) {
      const complaintsQuery = query(
        collection(db, 'complaints'),
        where('department', '==', admin.department)
      );
      const complaintsSnapshot = await getDocs(complaintsQuery);

      const departmentComplaints: Complaint[] = complaintsSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        problemId: doc.data().problemId,
        phone: doc.data().phone,
        pnr: doc.data().pnr,
        enhancedComplaint: doc.data().enhancedComplaint,
        severity: doc.data().severity,
        date: doc.data().date,
        status: doc.data().status || 'Pending',
        email: doc.data().email,
        fileUrl: doc.data().fileUrl,
        department: doc.data().department,
      }));

      setComplaints(departmentComplaints);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchComplaints();
    }
  }, [admin]);

  return (
    <DepartmentContext.Provider value={{ admin, complaints, fetchComplaints }}>
      {children}
    </DepartmentContext.Provider>
  );
};