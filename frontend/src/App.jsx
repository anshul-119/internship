import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from '@/routes';

/**
 * Root Application component.
 * Integrates global BrowserRouter, global AuthProvider,
 * and configures premium dark-themed Toast configurations.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Application route tables */}
        <AppRoutes />
        
        {/* Customized Premium Dark Toast alerts */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#18181b',
              color: '#f4f4f5',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              fontSize: '12px',
              padding: '12px 16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
              textAlign: 'left',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
