
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { EmployeeProvider } from '../contexts/EmployeeContext';

const Index = () => {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <MainApp />
      </EmployeeProvider>
    </AuthProvider>
  );
};

const MainApp = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  );
};

export default Index;
