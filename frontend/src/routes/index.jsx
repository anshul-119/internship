import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Page Views
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyRegisterOtp from '@/pages/VerifyRegisterOtp';
import VerifyLoginOtp from '@/pages/VerifyLoginOtp';
import Dashboard from '@/pages/Dashboard';
import BurnDown from '@/pages/BurnDown';
import NotFound from '@/pages/NotFound';

/**
 * Declares the application route hierarchy.
 * Wraps routes inside the global animated Layout (MainLayout).
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Core application routes wrapped inside MainLayout */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-register-otp" element={<VerifyRegisterOtp />} />
        <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/burndown" 
          element={
            <ProtectedRoute>
              <BurnDown />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
