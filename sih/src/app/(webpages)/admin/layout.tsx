import React from 'react';
import { DepartmentProvider } from '@/lib/DepartementContext'; // Adjust the path based on your structure

export default function DepartmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DepartmentProvider>
      {children}
    </DepartmentProvider>
  );
}
