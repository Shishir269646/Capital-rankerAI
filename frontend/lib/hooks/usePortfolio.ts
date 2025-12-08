// src/lib/hooks/usePortfolio.ts

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchPortfolios, selectPortfolios, selectPortfolioLoading, selectPortfolioError } from '@/store/slices/portfolioSlice';
import { useCallback } from 'react';
import { QueryOptions } from '@/types/common.types';
// import { selectToken } from '@/store/slices/authSlice'; // Token handled by thunk internally
// import { portfolioApi } from '../api/portfolio.api'; // API call handled by thunk
import { CreatePortfolioPayload, UpdatePortfolioPayload } from '@/types/portfolio.types';

export const usePortfolio = () => {
  const dispatch: AppDispatch = useDispatch();
  const portfolios = useSelector(selectPortfolios);
  const loading = useSelector(selectPortfolioLoading);
  const error = useSelector(selectPortfolioError);
  // const token = useSelector(selectToken); // Token handled by thunk internally

  const getPortfolios = useCallback(async (queryOptions?: QueryOptions) => {
    await dispatch(fetchPortfolios(queryOptions));
  }, [dispatch]);

  // The following functions (getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio, getPortfolioPerformance)
  // are currently making direct API calls. For consistency, these should ideally
  // also be implemented as Redux Thunks in the portfolioSlice and dispatched from here.
  // For now, I will leave them as direct API calls.

  // NOTE: This part needs to be refactored to use thunks if the goal is full Redux integration.
  // For the current review, I will leave them as direct API calls.

  return {
    portfolios,
    loading,
    error,
    getPortfolios,
    // getPortfolioById,
    // createPortfolio,
    // updatePortfolio,
    // deletePortfolio,
    // getPortfolioPerformance,
  };
};
