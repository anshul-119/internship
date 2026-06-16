import api from './api';
import { storage } from '@/utils/helpers';

const LOCAL_STORAGE_KEY = 'aura_sprints_data';

// Helper to seed localStorage mock data
const seedMockSprints = () => {
  const mockSprints = [
    {
      _id: 'mock-sprint-1',
      name: 'Sprint 1: Core Portal Setup',
      durationDays: 10,
      totalEffort: 50,
      dailyRemaining: [
        { day: 0, remaining: 50 },
        { day: 1, remaining: 48 },
        { day: 2, remaining: 42 },
        { day: 3, remaining: 35 },
        { day: 4, remaining: 28 },
        { day: 5, remaining: 22 },
        { day: 6, remaining: null },
        { day: 7, remaining: null },
        { day: 8, remaining: null },
        { day: 9, remaining: null },
        { day: 10, remaining: null }
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'mock-sprint-2',
      name: 'Sprint 2: Premium Visual Dashboards',
      durationDays: 10,
      totalEffort: 80,
      dailyRemaining: [
        { day: 0, remaining: 80 },
        { day: 1, remaining: 75 },
        { day: 2, remaining: 78 },
        { day: 3, remaining: 65 },
        { day: 4, remaining: 52 },
        { day: 5, remaining: 45 },
        { day: 6, remaining: 38 },
        { day: 7, remaining: 25 },
        { day: 8, remaining: 18 },
        { day: 9, remaining: 8 },
        { day: 10, remaining: 0 }
      ],
      createdAt: new Date().toISOString()
    }
  ];
  storage.set(LOCAL_STORAGE_KEY, mockSprints);
  return mockSprints;
};

// Local storage simulation actions
const localService = {
  getSprints: () => {
    let data = storage.get(LOCAL_STORAGE_KEY);
    if (!data || data.length === 0) {
      data = seedMockSprints();
    }
    return data;
  },
  createSprint: (sprintData) => {
    const data = localService.getSprints();
    const duration = parseInt(sprintData.durationDays) || 10;
    const effort = parseInt(sprintData.totalEffort) || 50;

    const dailyRemaining = [{ day: 0, remaining: effort }];
    for (let i = 1; i <= duration; i++) {
      dailyRemaining.push({ day: i, remaining: null });
    }

    const newSprint = {
      _id: `mock-sprint-${Date.now()}`,
      name: sprintData.name,
      durationDays: duration,
      totalEffort: effort,
      dailyRemaining,
      createdAt: new Date().toISOString()
    };

    const updated = [newSprint, ...data];
    storage.set(LOCAL_STORAGE_KEY, updated);
    return newSprint;
  },
  updateSprint: (id, updateData) => {
    const data = localService.getSprints();
    let updatedSprint = null;
    
    const updated = data.map((s) => {
      if (s._id === id) {
        updatedSprint = { ...s };
        if (updateData.name !== undefined) updatedSprint.name = updateData.name;
        if (updateData.dailyRemaining !== undefined) updatedSprint.dailyRemaining = updateData.dailyRemaining;
        
        if (updateData.totalEffort !== undefined || updateData.durationDays !== undefined) {
          const newEffort = updateData.totalEffort !== undefined ? parseInt(updateData.totalEffort) : s.totalEffort;
          const newDuration = updateData.durationDays !== undefined ? parseInt(updateData.durationDays) : s.durationDays;
          
          if (newEffort !== s.totalEffort || newDuration !== s.durationDays) {
            updatedSprint.totalEffort = newEffort;
            updatedSprint.durationDays = newDuration;
            
            const daily = [{ day: 0, remaining: newEffort }];
            for (let i = 1; i <= newDuration; i++) {
              daily.push({ day: i, remaining: null });
            }
            updatedSprint.dailyRemaining = daily;
          }
        }
        return updatedSprint;
      }
      return s;
    });

    storage.set(LOCAL_STORAGE_KEY, updated);
    return updatedSprint;
  },
  deleteSprint: (id) => {
    const data = localService.getSprints();
    const filtered = data.filter((s) => s._id !== id);
    storage.set(LOCAL_STORAGE_KEY, filtered);
    return true;
  }
};

export const sprintService = {
  /**
   * Fetch all sprints. Falls back to localStorage.
   */
  getSprints: async () => {
    try {
      const response = await api.get('/sprints');
      return response.data.data;
    } catch (error) {
      console.warn('Sprints API failed, falling back to local simulation:', error.message || error);
      return localService.getSprints();
    }
  },

  /**
   * Create a new sprint. Falls back to localStorage.
   */
  createSprint: async (sprintData) => {
    try {
      const response = await api.post('/sprints', sprintData);
      return response.data.data;
    } catch (error) {
      console.warn('Sprints API create failed, falling back to local simulation:', error.message || error);
      return localService.createSprint(sprintData);
    }
  },

  /**
   * Update sprint details or log daily values. Falls back to localStorage.
   */
  updateSprint: async (id, updateData) => {
    try {
      // If mock ID, directly use local storage
      if (id.startsWith('mock-sprint-')) {
        return localService.updateSprint(id, updateData);
      }
      const response = await api.put(`/sprints/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      console.warn(`Sprints API update for ID ${id} failed, falling back to local simulation:`, error.message || error);
      return localService.updateSprint(id, updateData);
    }
  },

  /**
   * Delete a sprint. Falls back to localStorage.
   */
  deleteSprint: async (id) => {
    try {
      if (id.startsWith('mock-sprint-')) {
        return localService.deleteSprint(id);
      }
      await api.delete(`/sprints/${id}`);
      return true;
    } catch (error) {
      console.warn(`Sprints API delete for ID ${id} failed, falling back to local simulation:`, error.message || error);
      return localService.deleteSprint(id);
    }
  }
};
