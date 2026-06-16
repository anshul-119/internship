export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  BURNDOWN: '/burndown',
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  USER_PROFILE: '/auth/profile',
  ACTIVITIES: '/dashboard/activities',
};

export const STORAGE_KEYS = {
  TOKEN: 'aura_auth_token',
  USER: 'aura_user_profile',
  THEME: 'aura_theme',
};

export const MOCK_USER = {
  EMAIL: 'admin@auraportal.com',
  PASSWORD: 'Password123!',
  NAME: 'Austin Carter',
  ROLE: 'System Administrator',
};
