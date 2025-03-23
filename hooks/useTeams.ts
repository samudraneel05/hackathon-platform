"use client";

import { useState } from 'react';
import useFetch from './useFetch';

interface TeamMember {
  id: string;
  name: string;
  image: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  hackathonId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  hackathon?: {
    id: string;
    title: string;
  };
  creator?: TeamMember;
  members?: TeamMember[];
  project?: {
    id: string;
    title: string;
  };
}

interface UseTeamsReturn {
  teams: Team[] | null;
  team: Team | null;
  isLoading: boolean;
  error: Error | null;
  fetchTeam: (id: string) => Promise<Team | null>;
  createTeam: (team: Partial<Team> & { memberIds?: string[] }) => Promise<Team | null>;
  updateTeam: (id: string, updates: Partial<Team> & { memberIds?: string[] }) => Promise<Team | null>;
  deleteTeam: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useTeams(hackathonId?: string): UseTeamsReturn {
  const [team, setTeam] = useState<Team | null>(null);

  const url = hackathonId
    ? `/api/teams?hackathonId=${hackathonId}`
    : '/api/teams';

  const { data: teams, isLoading, error, refetch } = useFetch<Team[]>(url);

  const fetchTeam = async (id: string): Promise<Team | null> => {
    try {
      const response = await fetch(`/api/teams/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch team: ${response.status}`);
      }
      
      const data = await response.json();
      setTeam(data);
      return data;
    } catch (err) {
      console.error("Error fetching team:", err);
      return null;
    }
  };

  const createTeam = async (newTeam: Partial<Team> & { memberIds?: string[] }): Promise<Team | null> => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create team: ${response.status}`);
      }

      const data = await response.json();
      refetch(); // Refresh the list
      return data;
    } catch (err) {
      console.error("Error creating team:", err);
      return null;
    }
  };

  const updateTeam = async (id: string, updates: Partial<Team> & { memberIds?: string[] }): Promise<Team | null> => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update team: ${response.status}`);
      }

      const data = await response.json();
      refetch(); // Refresh the list
      
      // Update the single team if it's the currently viewed one
      if (team && team.id === id) {
        setTeam(data);
      }
      
      return data;
    } catch (err) {
      console.error("Error updating team:", err);
      return null;
    }
  };

  const deleteTeam = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete team: ${response.status}`);
      }

      refetch(); // Refresh the list
      
      // Clear the single team if it's the deleted one
      if (team && team.id === id) {
        setTeam(null);
      }
      
      return true;
    } catch (err) {
      console.error("Error deleting team:", err);
      return false;
    }
  };

  return {
    teams,
    team,
    isLoading,
    error,
    fetchTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    refetch,
  };
}
