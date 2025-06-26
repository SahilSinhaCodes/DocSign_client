import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Simple SVG icon for each feature
const FeatureIcon = ({ children }) => (
  <div className="bg-blue-50 text-blue-500 p-2 rounded-full inline-flex items-center justify-center mb-2 shadow">
    {children}
  </div>
);

export default function Home() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      {/* Logout button top-right - adjusted for mobile */}
      <div className="absolute top-4 right-4 sm:right-6 z-10">
        <button
          onClick={handleLogout}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm sm:text-base"
        >
          Logout
        </button>
      </div>

      {/* Centered home hero - adjusted padding for mobile */}
      <div className="flex-grow flex flex-col justify-center items-center px-4 py-12 sm:py-20">
        {/* Logo placeholder */}
        <div className="mb-4 sm:mb-5">
          <div className="bg-blue-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow">DC</div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-900 text-center">DocSign</h1>
        <p className="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8 max-w-md text-center px-2">
          E-sign documents securely, easily, and efficiently. Manage your paperwork seamlessly in one place.
        </p>

        {/* Feature highlight - stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 w-full max-w-4xl px-4">
          <div className="text-center p-4 sm:p-0">
            <FeatureIcon>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 11V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6"/><polyline points="8 17 3 12 8 7"/></svg>
            </FeatureIcon>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Upload PDFs</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Securely upload and manage your PDF files.</p>
          </div>
          <div className="text-center p-4 sm:p-0">
            <FeatureIcon>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 17h6M9 13h6"/><path d="M9 9h6"/></svg>
            </FeatureIcon>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Sign Online</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Drag and drop your signature on documents instantly.</p>
          </div>
          <div className="text-center p-4 sm:p-0">
            <FeatureIcon>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 8v13H7v-6H3V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/><path d="m7 2 10 6"/></svg>
            </FeatureIcon>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Share & Track</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Share signed docs and track their status in real-time.</p>
          </div>
        </div>

        {/* How it works - adjusted for mobile */}
        <div className="mt-2 mb-8 sm:mb-16 w-full max-w-2xl px-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">How it works</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="flex flex-col items-center flex-1">
              <div className="mb-1 sm:mb-2 text-blue-500">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 11V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6"/><polyline points="8 17 3 12 8 7"/></svg>
              </div>
              <span className="font-semibold text-gray-700 text-sm sm:text-base">1. Upload PDF</span>
            </div>
            <div className="h-6 w-2 md:w-8 md:h-2 bg-blue-100 md:mx-4 my-2 sm:my-4 md:my-0 rounded-full"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="mb-1 sm:mb-2 text-blue-500">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 17h6M9 13h6"/><path d="M9 9h6"/></svg>
              </div>
              <span className="font-semibold text-gray-700 text-sm sm:text-base">2. Sign Document</span>
            </div>
            <div className="h-6 w-2 md:w-8 md:h-2 bg-blue-100 md:mx-4 my-2 sm:my-4 md:my-0 rounded-full"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="mb-1 sm:mb-2 text-blue-500">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 8v13H7v-6H3V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/><path d="m7 2 10 6"/></svg>
              </div>
              <span className="font-semibold text-gray-700 text-sm sm:text-base">3. Share & Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - adjusted padding and text size */}
      <footer className="text-center text-xs sm:text-sm text-gray-400 py-4 sm:py-6 border-t border-gray-100 mt-auto bg-white px-4">
        © {new Date().getFullYear()} DocSign — Secure E-signatures for everyone.
      </footer>
    </div>
  );
}