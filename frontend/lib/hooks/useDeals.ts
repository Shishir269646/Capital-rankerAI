// src/lib/hooks/useDeals.ts

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchDeals, selectDeals, selectDealsLoading, selectDealsError } from '@/store/slices/dealsSlice';
import { useCallback } from 'react';
import { QueryOptions } from '@/types/common.types';
import { selectToken } from '@/store/slices/authSlice';

export const useDeals = () => {
  const dispatch: AppDispatch = useDispatch();
  const deals = useSelector(selectDeals);
  const loading = useSelector(selectDealsLoading);
  const error = useSelector(selectDealsError);

  const getDeals = useCallback(async (queryOptions?: QueryOptions) => {
    // The fetchDeals thunk now gets the token from getState() internally
    await dispatch(fetchDeals(queryOptions));
  }, [dispatch]);

  // You might want to add other deal-related actions here, e.g., createDeal, updateDeal, deleteDeal

  return {
    deals,
    loading,
    error,
    getDeals,
  };
};
