// src/components/auth/LoginForm.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '../../lib/constants/routes';
import { isValidEmail, isRequired } from '../../lib/utils/validation';
import { VALIDATION_RULES } from '../../lib/constants/validation-rules';
import { LoginPayload } from '../../types/auth.types';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, loading, error } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!isRequired(email)) {
      setEmailError(VALIDATION_RULES.REQUIRED.MESSAGE);
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError(VALIDATION_RULES.EMAIL.MESSAGE);
      isValid = false;
    }

    if (!isRequired(password)) {
      setPasswordError(VALIDATION_RULES.REQUIRED.MESSAGE);
      isValid = false;
    } else if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      setPasswordError(VALIDATION_RULES.PASSWORD.MESSAGE);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const credentials: LoginPayload = { email, password };
    const success = await login(credentials);

    if (success) {
      router.push(AppRoutes.DASHBOARD);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${passwordError ? 'border-red-500' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href={AppRoutes.FORGOT_PASSWORD}
            >
              Forgot Password?
            </a>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a href={AppRoutes.REGISTER} className="text-blue-500 hover:text-blue-800 font-bold">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
