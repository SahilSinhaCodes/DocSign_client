import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Logout button top-right */}
      <div className="absolute top-4 right-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Centered content */}
      <div className="flex items-center justify-center h-full pt-32">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to DocuSign Clone</h1>
          <p className="text-gray-600">You are successfully logged in.</p>
        </div>
      </div>
    </div>
  );
}
