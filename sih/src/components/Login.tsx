"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";  // Using ShadCN
import { Button } from "@/components/ui/button"; // Using ShadCN

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Toggle between admin and user login
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // Check if it's an admin login
        if (isAdminLogin) {
          if (userData.isAdmin) {
            // Redirect to the admin dashboard
            router.push("/admin");
          } else {
            // Show error if not an admin
            setError("This account is not an admin account.");
          }
        } else {
          // Redirect to the user dashboard
          router.push("/user");
        }
      } else {
        setError("User not found in the database.");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Login as {isAdminLogin ? "Admin" : "User"}</h2>
        <Button onClick={() => setIsAdminLogin(!isAdminLogin)}>
          {isAdminLogin ? "Switch to User Login" : "Switch to Admin Login"}
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-gray-900"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>} {/* Error text in red */}

      <Button
        type="submit"
        className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
      >
        Login
      </Button>
    </form>
  );
};

export default Login;
