'use client';

import { Provider, useDispatch } from 'react-redux';
import { store } from './index';
import { ReactNode, useEffect } from 'react';
import { getAccessToken } from '@/lib/auth/token';
import { setToken } from './slices/authSlice';

// This component will be a child of the Redux Provider, so it can use useDispatch
function TokenInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return null; // This component doesn't render anything itself
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <TokenInitializer />
      {children}
    </Provider>
  );
}
