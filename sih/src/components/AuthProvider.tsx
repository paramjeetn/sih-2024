"use client";

import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user || null);
      if (user) {
        // Check if the user is an admin
        const adminQuery = query(collection(db, 'admin'), where('email', '==', user.email));
        const querySnapshot = await getDocs(adminQuery);

        if (!querySnapshot.empty) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
