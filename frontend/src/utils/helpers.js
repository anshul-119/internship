import { format, parseISO } from 'date-fns';

/**
 * Conditionally joins CSS class strings together.
 * Safe fallback for dynamic Tailwind classes.
 * @param  {...any} classes 
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ').trim();
}

/**
 * Safely formats a date string or object using date-fns format.
 * Prevents throwing errors if the date is invalid or undefined.
 * @param {Date|string|number} date 
 * @param {string} formatStr 
 * @returns {string}
 */
export function formatDate(date, formatStr = 'MMM dd, yyyy hh:mm a') {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(d, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * LocalStorage wrapper with error handling for secure execution.
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  }
};
