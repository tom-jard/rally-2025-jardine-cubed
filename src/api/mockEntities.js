import apiClient from './apiClient';

// Mock data for development/demo purposes
const mockTasks = [
  {
    id: '1',
    title: 'Maintain Sleep Consistency',
    description: 'Show consistent sleep patterns for 5+ days this week',
    appName: 'Apple Health',
    reward: 100,
    iconUrl: 'apple-health',
    created_date: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Link your account',
    description: 'Connect your First Platypus Bank account',
    appName: 'First Platypus Bank',
    reward: 150,
    iconUrl: 'first-platypus-bank',
    created_date: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Complete Learning Quiz',
    description: 'Take a financial literacy or history quiz',
    appName: 'Self Learning',
    reward: 75,
    iconUrl: 'self-learning',
    created_date: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Review Investment Portfolio',
    description: 'Check your investment performance and rebalance if needed',
    appName: 'Fidelity',
    reward: 200,
    iconUrl: 'fidelity',
    created_date: new Date().toISOString(),
  },
];

const mockRewards = [
  {
    id: '1',
    gameName: 'Candy Crush',
    description: '100 Gold Bars',
    cost: 500,
    iconUrl: 'candy-crush',
    created_date: new Date().toISOString(),
  },
  {
    id: '2',
    gameName: 'Clash of Clans',
    description: '1000 Gems',
    cost: 750,
    iconUrl: 'clash-of-clans',
    created_date: new Date().toISOString(),
  },
  {
    id: '3',
    gameName: 'Roblox',
    description: '400 Robux',
    cost: 600,
    iconUrl: 'roblox',
    created_date: new Date().toISOString(),
  },
  {
    id: '4',
    gameName: 'Royal Match',
    description: '50 Boosters',
    cost: 300,
    iconUrl: 'royal-match',
    created_date: new Date().toISOString(),
  },
];

const mockUser = {
  id: 'demo-user-1',
  full_name: 'Sean Hise',
  darumas: 8880,
  streak: 7,
  email: 'sean@playd.app',
  created_date: new Date().toISOString(),
};

// Task entity replacement
export const Task = {
  async list(sortBy = '-created_date', limit = null) {
    try {
      // In a real app, this would make an API call
      // const response = await apiClient.get('/tasks', { params: { sort: sortBy, limit } });
      // return response.data;
      
      // For now, return mock data
      let tasks = [...mockTasks];
      
      if (sortBy === '-created_date') {
        tasks.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      }
      
      if (limit) {
        tasks = tasks.slice(0, limit);
      }
      
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async create(taskData) {
    try {
      // const response = await apiClient.post('/tasks', taskData);
      // return response.data;
      
      // Mock implementation
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        created_date: new Date().toISOString(),
      };
      mockTasks.push(newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      // const response = await apiClient.put(`/tasks/${id}`, updateData);
      // return response.data;
      
      // Mock implementation
      const taskIndex = mockTasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updateData };
        return mockTasks[taskIndex];
      }
      throw new Error('Task not found');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },
};

// GameReward entity replacement
export const GameReward = {
  async list(sortBy = '-created_date', limit = null) {
    try {
      // const response = await apiClient.get('/rewards', { params: { sort: sortBy, limit } });
      // return response.data;
      
      let rewards = [...mockRewards];
      
      if (sortBy === '-created_date') {
        rewards.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      }
      
      if (limit) {
        rewards = rewards.slice(0, limit);
      }
      
      return rewards;
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return [];
    }
  },

  async create(rewardData) {
    try {
      // const response = await apiClient.post('/rewards', rewardData);
      // return response.data;
      
      const newReward = {
        ...rewardData,
        id: Date.now().toString(),
        created_date: new Date().toISOString(),
      };
      mockRewards.push(newReward);
      return newReward;
    } catch (error) {
      console.error('Error creating reward:', error);
      throw error;
    }
  },
};

// User entity replacement
export const User = {
  async me() {
    try {
      // const response = await apiClient.get('/user/me');
      // return response.data;
      
      return { ...mockUser };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateMyUserData(updateData) {
    try {
      // const response = await apiClient.put('/user/me', updateData);
      // return response.data;
      
      Object.assign(mockUser, updateData);
      return { ...mockUser };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async create(userData) {
    try {
      // const response = await apiClient.post('/users', userData);
      // return response.data;
      
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        created_date: new Date().toISOString(),
        darumas: 0,
        streak: 0,
      };
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
};

// Export all entities
export { apiClient };
