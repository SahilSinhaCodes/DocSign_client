import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);

  // Focus on email field on mount
  useEffect(() => { emailRef.current.focus(); }, []);

  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // clear error as user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid(form.email)) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }
      login(data.token);
      navigate('/');
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded-lg shadow" aria-live="polite">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={emailRef}
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={form.email}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded ${error && !isEmailValid(form.email) ? 'border-red-500' : ''}`}
          aria-invalid={!!error}
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded pr-10"
            minLength={6}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-gray-500 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Not registered?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}