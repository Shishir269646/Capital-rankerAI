// src/components/auth/ForgotPasswordForm.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/lib/constants/routes';
import { isValidEmail, isRequired } from '@/lib/utils/validation';
import { VALIDATION_RULES } from '@/lib/constants/validation-rules';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');

    if (!isRequired(email)) {
      setEmailError(VALIDATION_RULES.REQUIRED.MESSAGE);
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError(VALIDATION_RULES.EMAIL.MESSAGE);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // In a real application, you would make an API call here
      // For now, simulate an API call
      console.log(`Password reset requested for: ${email}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      setMessage('If an account with that email exists, a password reset link has been sent.');
      // Optionally redirect after a delay
      // setTimeout(() => router.push(AppRoutes.LOGIN), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Forgot Password</h2>
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

          {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
          <div className="mt-4 text-center">
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href={AppRoutes.LOGIN}
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
