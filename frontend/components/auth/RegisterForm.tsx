// src/components/auth/RegisterForm.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/lib/constants/routes';
import { isValidEmail, isRequired } from '@/lib/utils/validation';
import { VALIDATION_RULES } from '@/lib/constants/validation-rules';
import { RegisterPayload } from '@/types/auth.types';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [role, setRole] = useState<'investor' | 'analyst'>('analyst'); // Default role
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [firmNameError, setFirmNameError] = useState('');

  const { loading, error } = useAuth(); // Assuming register function will be added to useAuth or directly called
  const router = useRouter();

  // For now, directly call the API. In a real app, this might be a thunk or part of useAuth.
  const handleRegister = async (userData: RegisterPayload) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return true;
    } catch (err: any) {
      console.error('Registration failed:', err);
      // set some error state
      return false;
    }
  };


  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFirmNameError('');

    if (!isRequired(name)) {
      setNameError(VALIDATION_RULES.REQUIRED.MESSAGE);
      isValid = false;
    } else if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH || name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
      setNameError(VALIDATION_RULES.NAME.MESSAGE);
      isValid = false;
    }

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

    if (!isRequired(confirmPassword)) {
      setConfirmPasswordError(VALIDATION_RULES.REQUIRED.MESSAGE);
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!isRequired(firmName)) {
      setFirmNameError(VALIDATION_RULES.REQUIRED.MESSAGE);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const userData: RegisterPayload = {
      name,
      email,
      password,
      firm_name: firmName,
      role,
    };

    const success = await handleRegister(userData); // Call the placeholder register function

    if (success) {
      router.push(AppRoutes.LOGIN); // Redirect to login page after successful registration
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nameError ? 'border-red-500' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
          </div>

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

          <div className="mb-4">
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

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${confirmPasswordError ? 'border-red-500' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            {confirmPasswordError && <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firmName">
              Firm Name
            </label>
            <input
              type="text"
              id="firmName"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${firmNameError ? 'border-red-500' : ''}`}
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              disabled={loading}
            />
            {firmNameError && <p className="text-red-500 text-xs italic">{firmNameError}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={role}
              onChange={(e) => setRole(e.target.value as 'investor' | 'analyst')}
              disabled={loading}
            >
              <option value="analyst">Analyst</option>
              <option value="investor">Investor</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a href={AppRoutes.LOGIN} className="text-blue-500 hover:text-blue-800 font-bold">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
