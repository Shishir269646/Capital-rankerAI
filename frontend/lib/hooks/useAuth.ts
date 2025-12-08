// src/lib/hooks/useAuth.ts

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { login, logout, selectAuthError, selectAuthLoading, selectToken, selectUser } from '@/store/slices/authSlice';
import { LoginPayload } from '@/types/auth.types';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleLogin = useCallback(async (credentials: LoginPayload) => {
    try {
      const resultAction = await dispatch(login(credentials));
      if (login.fulfilled.match(resultAction)) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const isAuthenticated = !!token;

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
