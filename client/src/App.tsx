import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

// A layout for pages that have the main header and container
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
    <Header />
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {children}
    </Container>
  </Box>
);

const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignupPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}