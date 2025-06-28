import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Sign from './pages/Sign';
import Documents from './pages/Documents';
import SidebarLayout from './components/SidebarLayout';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-10 text-gray-800">Loading...</div>;
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} /> {/* ✅ This is your / route now */}
        <Route path="sign" element={<Sign />} />
        <Route path="documents" element={<Documents />} />
      </Route>
    </Routes>
  );
}
