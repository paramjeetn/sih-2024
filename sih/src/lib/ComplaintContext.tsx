"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

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

interface ComplaintContextType {
  complaint: Complaint | null;
  setComplaint: (complaint: Complaint) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaint = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaint must be used within a ComplaintProvider');
  }
  return context;
};

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  return (
    <ComplaintContext.Provider value={{ complaint, setComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
};
