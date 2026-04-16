import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { PasswordReset } from './pages/auth/PasswordReset';
import { LnDManagerDashboard } from './pages/LnDManager/Dashboard';
import { ProgramManagerDashboard } from './pages/ProgramManager/Dashboard';
import { BatchOwnerDashboard } from './pages/BatchOwner/Dashboard';
import { UserManagement } from './pages/LnDManager/UserManagement';
import './App.css'

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'L&D Manager':
        return <LnDManagerDashboard />;
      case 'Program Manager':
        return <ProgramManagerDashboard />;
      case 'Batch Owner':
        return <BatchOwnerDashboard />;
      default:
        return <LnDManagerDashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/reset-password"
        element={
          <ProtectedRoute>
            <PasswordReset />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lnd-manager/users"
        element={
          <ProtectedRoute allowedRoles={['L&D Manager']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {getDashboardComponent()}
          </ProtectedRoute>
        }
      />

      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

