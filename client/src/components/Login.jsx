import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const { setUser, setShowUserLogin } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      setUser({ 
        name: 'User',
        email: "test@mystack.dev"});
      setShowUserLogin(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-md p-6 w-[90%] max-w-md"
        style={{
          border: '2px solid var(--color-primary)',
        }}
      >
        <h2
          className="text-xl font-semibold mb-4 text-center"
          style={{ color: 'var(--color-primary)' }}
        >
          Login to Your Account
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md focus:outline-none"
            style={{
              border: '2px solid var(--color-primary-dull)',
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md focus:outline-none"
            style={{
              border: '2px solid var(--color-primary-dull)',
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white py-2 rounded-full transition"
          style={{
            backgroundColor: 'var(--color-primary)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--color-primary-dull)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
          }
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setShowUserLogin(false)}
          className="w-full text-sm mt-3 transition-colors"
          style={{ color: 'var(--color-primary-dull)' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Login;
