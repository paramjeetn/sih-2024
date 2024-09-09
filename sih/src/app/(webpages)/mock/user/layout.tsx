import React from 'react';
import { ComplaintProvider } from '@/lib/ComplaintContext'; // Adjust the path based on your structure

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ComplaintProvider>
      <div className="min-h-screen flex flex-col">
        {/* You can add a Navbar or Sidebar here if needed */}
        {children}
      </div>
    </ComplaintProvider>
  );
}
