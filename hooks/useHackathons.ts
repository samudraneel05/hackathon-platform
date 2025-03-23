"use client";

import { useState } from 'react';
import useFetch from './useFetch';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxTeamSize: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    image: string;
  };
  _count?: {
    participants: number;
    teams: number;
    projects: number;
  };
}

interface UseHackathonsReturn {
  hackathons: Hackathon[] | null;
  hackathon: Hackathon | null;
  isLoading: boolean;
  error: Error | null;
  fetchHackathon: (id: string) => Promise<Hackathon | null>;
  createHackathon: (hackathon: Partial<Hackathon>) => Promise<Hackathon | null>;
  updateHackathon: (id: string, updates: Partial<Hackathon>) => Promise<Hackathon | null>;
  deleteHackathon: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useHackathons(isActive?: boolean): UseHackathonsReturn {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);

  const url = isActive !== undefined 
    ? `/api/hackathons?isActive=${isActive}` 
    : '/api/hackathons';
    
  const { data: hackathons, isLoading, error, refetch } = useFetch<Hackathon[]>(url);

  const fetchHackathon = async (id: string): Promise<Hackathon | null> => {
    try {
      const response = await fetch(`/api/hackathons/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hackathon: ${response.status}`);
      }
      
      const data = await response.json();
      setHackathon(data);
      return data;
    } catch (err) {
      console.error("Error fetching hackathon:", err);
      return null;
    }
  };

  const createHackathon = async (newHackathon: Partial<Hackathon>): Promise<Hackathon | null> => {
    try {
      const response = await fetch('/api/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHackathon),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create hackathon: ${response.status}`);
      }

      const data = await response.json();
      refetch(); // Refresh the list
      return data;
    } catch (err) {
      console.error("Error creating hackathon:", err);
      return null;
    }
  };

  const updateHackathon = async (id: string, updates: Partial<Hackathon>): Promise<Hackathon | null> => {
    try {
      const response = await fetch(`/api/hackathons/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update hackathon: ${response.status}`);
      }

      const data = await response.json();
      refetch(); // Refresh the list
      
      // Update the single hackathon if it's the currently viewed one
      if (hackathon && hackathon.id === id) {
        setHackathon(data);
      }
      
      return data;
    } catch (err) {
      console.error("Error updating hackathon:", err);
      return null;
    }
  };

  const deleteHackathon = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/hackathons/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete hackathon: ${response.status}`);
      }

      refetch(); // Refresh the list
      
      // Clear the single hackathon if it's the deleted one
      if (hackathon && hackathon.id === id) {
        setHackathon(null);
      }
      
      return true;
    } catch (err) {
      console.error("Error deleting hackathon:", err);
      return false;
    }
  };

  return {
    hackathons,
    hackathon,
    isLoading,
    error,
    fetchHackathon,
    createHackathon,
    updateHackathon,
    deleteHackathon,
    refetch,
  };
}
