"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";  // Using ShadCN
import { Button } from "@/components/ui/button"; // Using ShadCN

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for Admin or User
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isAdmin) {
        // Query the admin collection to see if the email exists
        const adminCollectionRef = collection(db, "admin");
        const q = query(adminCollectionRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If admin email exists, proceed with signup
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Save admin data to Firestore
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            pin: pin,
            isAdmin: true,
          });

          router.push("/admin");
        } else {
          // Admin email not found
          setError("Admin not assigned. Please contact support.");
        }
      } else {
        // Normal user signup
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save normal user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          phoneNumber: phoneNumber,
          isAdmin: false,
        });

        router.push("/user");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Register as {isAdmin ? "Admin" : "User"}</h2>
        <Button onClick={() => setIsAdmin(!isAdmin)}>
          {isAdmin ? "Switch to User Signup" : "Switch to Admin Signup"}
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {isAdmin ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">PIN</label>
          <Input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            placeholder="Enter your admin PIN"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            pattern="[0-9]{10}" // Validates a 10-digit phone number
            maxLength={10}
            placeholder="Enter your phone number"
          />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit">Register</Button>
    </form>
  );
};

export default Register;
