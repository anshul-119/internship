import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Accesses active global Auth context safely.
 * @returns {object} Auth state functions.
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed inside an AuthProvider');
  }
  return context;
}
