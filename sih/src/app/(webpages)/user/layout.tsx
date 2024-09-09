// src/app/(webpages)/user/layout.tsx

import React from 'react';
import { ComplaintProvider } from '../../../lib/ComplaintContext';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ComplaintProvider>
      {children}
    </ComplaintProvider>
  );
}
