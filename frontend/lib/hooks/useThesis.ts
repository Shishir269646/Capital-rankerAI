import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  createThesis,
  updateThesis,
  getThesisMatches,
  getInvestorMatches,
  getInvestorTheses,
  analyzeAlignment,
  deactivateThesis,
  selectCurrentThesis,
  selectInvestorTheses,
  selectThesisMatches,
  selectInvestorMatches,
  selectAlignmentAnalysis,
  selectThesisLoading,
  selectThesisError,
} from '@/store/slices/thesisSlice';
import { useCallback } from 'react';
import { QueryOptions } from '@/types/common.types';
import { CreateInvestorThesisPayload, UpdateInvestorThesisPayload } from '@/types/thesis.types';

export const useThesis = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentThesis = useSelector(selectCurrentThesis);
  const investorTheses = useSelector(selectInvestorTheses);
  const thesisMatches = useSelector(selectThesisMatches);
  const investorMatches = useSelector(selectInvestorMatches);
  const alignmentAnalysis = useSelector(selectAlignmentAnalysis);
  const loading = useSelector(selectThesisLoading);
  const error = useSelector(selectThesisError);

  const handleCreateThesis = useCallback(
    async (thesisData: CreateInvestorThesisPayload) => {
      await dispatch(createThesis(thesisData));
    },
    [dispatch]
  );

  const handleUpdateThesis = useCallback(
    async (thesisId: string, thesisData: UpdateInvestorThesisPayload) => {
      await dispatch(updateThesis({ thesisId, thesisData }));
    },
    [dispatch]
  );

  const handleGetThesisMatches = useCallback(
    async (dealId: string) => {
      await dispatch(getThesisMatches(dealId));
    },
    [dispatch]
  );

  const handleGetInvestorMatches = useCallback(
    async (investorId: string, queryOptions?: QueryOptions) => {
      await dispatch(getInvestorMatches({ investorId, queryOptions }));
    },
    [dispatch]
  );

  const handleGetInvestorTheses = useCallback(
    async (investorId: string, queryOptions?: QueryOptions) => {
      await dispatch(getInvestorTheses({ investorId, queryOptions }));
    },
    [dispatch]
  );

  const handleAnalyzeAlignment = useCallback(
    async (payload: { thesisId: string; dealId: string }) => {
      await dispatch(analyzeAlignment(payload));
    },
    [dispatch]
  );

  const handleDeactivateThesis = useCallback(
    async (thesisId: string) => {
      await dispatch(deactivateThesis(thesisId));
    },
    [dispatch]
  );

  return {
    currentThesis,
    investorTheses,
    thesisMatches,
    investorMatches,
    alignmentAnalysis,
    loading,
    error,
    createThesis: handleCreateThesis,
    updateThesis: handleUpdateThesis,
    getThesisMatches: handleGetThesisMatches,
    getInvestorMatches: handleGetInvestorMatches,
    getInvestorTheses: handleGetInvestorTheses,
    analyzeAlignment: handleAnalyzeAlignment,
    deactivateThesis: handleDeactivateThesis,
  };
};

