"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";  
import { signOut } from "firebase/auth";  
import { auth } from "@/lib/firebaseConfig";  
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Login from "@/components/Login";
import Register from "@/components/Register";

const Navbar: React.FC = () => {
  const router = useRouter(); 
  const { user } = useAuth();
  console.log(user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const adminDetails = localStorage.getItem('adminDetails');
    if (adminDetails) {
      console.log(adminDetails)
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (isAdminLoggedIn) {
        localStorage.removeItem('adminDetails');
        setIsAdminLoggedIn(false);
      } else {
        await signOut(auth);
      }
      router.push('/home');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLoginClick = () => {
    console.log('Opening Login Modal');
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    console.log('Opening Register Modal');
    setIsRegisterModalOpen(true);
  };

  return (
    <nav className="flex items-center justify-between bg-blue-700 text-white pl-2 pr-2">
      <div className="flex items-center">
        {/* <FiMenu className="mr-2" /> */}
        <img
          src="/download.png" 
          alt="RAIL MADAD LOGO"
          width={50}
          height={50}
          className="m-2 mr-4"

        />
        <span
          className="text-4xl"
          style={{ fontFamily: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif" }}
        >
          <b>RAIL MADAD</b>
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {(user || isAdminLoggedIn) ? (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-white">{user ? user.email : 'Admin'}</span>
            </div>
            <Button
  onClick={handleLogout}
  variant="outline"
  className="text-blue-900 bg-white border-blue-900 hover:bg-blue-900 hover:text-white hover:border-white"
>
  Logout
</Button>

          </>
        ) : (
          <>
           <Button
  onClick={handleLoginClick}
  variant="outline"
  className="text-blue-900 bg-white border-blue-900 hover:bg-blue-900 hover:text-white hover:border-white"
>
  Login
</Button>

            <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                </DialogHeader>
                <Login />
              </DialogContent>
            </Dialog>

            <Button
  onClick={handleRegisterClick}
  variant="outline"
  className="text-blue-900 bg-white border-blue-900 hover:bg-blue-900 hover:text-white hover:border-white"
>
  Sign Up
</Button>

            <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Up</DialogTitle>
                </DialogHeader>
                <Register />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
