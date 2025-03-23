"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import useFetch from "./useFetch";
import { UserRole } from "@/types/prisma";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
  teams?: any[];
  projects?: any[];
}

interface Profile {
  id: string;
  bio: string;
  school: string;
  grade: string;
  skills: string;
  interests: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  userId: string;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (credentials: { email: string; password: string; role?: UserRole }) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<Profile | null>;
  getUser: (userId: string) => Promise<User | null>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  
  // Get current user role from session
  const role = session?.user?.role || null;
  
  const login = async (credentials: { email: string; password: string; role?: UserRole }): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });
      
      return !result?.error;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };
  
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await signIn("google", { redirect: false });
      return true;
    } catch (error) {
      console.error("Google login failed:", error);
      return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    await signOut({ redirect: false });
    setUserDetails(null);
  };
  
  const updateProfile = async (profileData: Partial<Profile>): Promise<Profile | null> => {
    if (!session?.user?.id) {
      console.error("Cannot update profile: No authenticated user");
      return null;
    }
    
    try {
      const response = await fetch(`/api/users/${session.user.id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update profile: ${response.status}`);
      }
      
      const updatedProfile = await response.json();
      
      // Update local user state with new profile data
      if (userDetails) {
        setUserDetails({
          ...userDetails,
          profile: updatedProfile,
        });
      }
      
      return updatedProfile;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return null;
    }
  };
  
  const getUser = async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      
      const userData = await response.json();
      
      // If this is the current user, update our local state
      if (session?.user?.id === userId) {
        setUserDetails(userData);
      }
      
      return userData;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  };
  
  // If we have a session but no user details, fetch the current user's details
  if (session?.user?.id && !userDetails && !isLoading) {
    getUser(session.user.id);
  }
  
  return {
    user: userDetails,
    isLoading,
    isAuthenticated,
    role,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    getUser,
  };
}
