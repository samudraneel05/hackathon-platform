"use client";

import { useState } from 'react';
import useFetch from './useFetch';

interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  submissionDate: string;
  hackathonId: string;
  teamId?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  hackathon?: {
    id: string;
    title: string;
  };
  team?: {
    id: string;
    name: string;
    members: {
      id: string;
      name: string;
      image: string;
    }[];
  };
  creator?: {
    id: string;
    name: string;
    image: string;
  };
  contributors?: {
    id: string;
    name: string;
    image: string;
  }[];
  feedbacks?: any[];
  _count?: {
    feedbacks: number;
  };
}

interface UseProjectsReturn {
  projects: Project[] | null;
  project: Project | null;
  isLoading: boolean;
  error: Error | null;
  fetchProject: (id: string) => Promise<Project | null>;
  createProject: (project: Partial<Project> & { contributorIds?: string[] }) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project> & { contributorIds?: string[] }) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useProjects(hackathonId?: string, teamId?: string): UseProjectsReturn {
  const [project, setProject] = useState<Project | null>(null);

  // Construct the URL based on provided filters
  let url = '/api/projects';
  if (hackathonId) {
    url += `?hackathonId=${hackathonId}`;
    if (teamId) {
      url += `&teamId=${teamId}`;
    }
  } else if (teamId) {
    url += `?teamId=${teamId}`;
  }

  const { data: projects, isLoading, error, refetch } = useFetch<Project[]>(url);

  const fetchProject = async (id: string): Promise<Project | null> => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch project: ${response.status}`);
      }
      
      const data = await response.json();
      setProject(data);
      return data;
    } catch (err) {
      console.error("Error fetching project:", err);
      return null;
    }
  };

  const createProject = async (newProject: Partial<Project> & { contributorIds?: string[] }): Promise<Project | null> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create project: ${response.status}`);
      }

      const data = await response.json();
      refetch(); // Refresh the list
      return data;
    } catch (err) {
      console.error("Error creating project:", err);
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project> & { contributorIds?: string[] }): Promise<Project | null> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update project: ${response.status}`);
      }

      const data = await response.json();
      refetch(); // Refresh the list
      
      // Update the single project if it's the currently viewed one
      if (project && project.id === id) {
        setProject(data);
      }
      
      return data;
    } catch (err) {
      console.error("Error updating project:", err);
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete project: ${response.status}`);
      }

      refetch(); // Refresh the list
      
      // Clear the single project if it's the deleted one
      if (project && project.id === id) {
        setProject(null);
      }
      
      return true;
    } catch (err) {
      console.error("Error deleting project:", err);
      return false;
    }
  };

  return {
    projects,
    project,
    isLoading,
    error,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    refetch,
  };
}
