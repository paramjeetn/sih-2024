"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (email: string, enteredPin: string) => {
    try {
      // Fetch the admin document by email
      const adminQuery = query(
        collection(db, 'admin'),
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(adminQuery);

      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        const adminData = adminDoc.data();

        // Compare the entered pin with the stored pin
        if (adminData.pin.toString() === enteredPin) {
          const adminDetails = {
            name: adminData.name || "Admin",
            email: adminData.email,
            department: adminData.department,
            profileImage: adminData.profileImage || '/default-profile.png',
            totalComplaintsHandled: adminData.totalComplaintsHandled,
          };

          // Store admin details in local storage
          localStorage.setItem('adminDetails', JSON.stringify(adminDetails));

          // Redirect to admin dashboard
          router.push('/admin');
        } else {
          setError("Incorrect pin. Please try again.");
        }
      } else {
        setError("No admin found with this email.");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      setError("An error occurred while trying to log in. Please try again later.");
    }
  };

  const handleLogin = async () => {
    setError(null); // Reset any previous error messages

    // Call the handleAdminLogin function with the email and entered pin
    await handleAdminLogin(email, pin);
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Pin"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button onClick={handleLogin} className="bg-blue-500 text-white w-full py-2 rounded">
        Login
      </Button>
    </div>
  );
};

export default AdminLogin;
