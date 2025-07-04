import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function SidebarLayout() {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = (path) =>
    `block px-4 py-2 rounded hover:bg-blue-600 hover:text-white ${
      pathname === path ? 'bg-blue-600 text-white' : 'text-gray-800'
    }`;

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 shadow">
        <Link to="/" className="text-2xl font-bold block mb-6 text-blue-700">DocSign</Link>
        <nav className="space-y-2">
          <Link to="/sign" className={linkStyle('/sign')}>Sign a Document</Link>
          <Link to="/documents" className={linkStyle('/documents')}>Documents</Link>
        </nav>
      </aside>

      {/* Top-right logout */}
      <div className="absolute top-4 right-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
    </div>
  );
}
