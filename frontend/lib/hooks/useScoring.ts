import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  scoreDeal,
  getDealScoringHistory,
  batchScore,
  getBatchScoringJobStatus,
  recalculateAllScores,
  compareDealScores,
  selectDealScore,
  selectDealScoringHistory,
  selectBatchJobStatus,
  selectRecalculationJobStatus,
  selectComparisonResults,
  selectScoringLoading,
  selectScoringError,
} from '@/store/slices/scoringSlice';
import { useCallback } from 'react';
import { QueryOptions } from '@/types/common.types';
// import { CreateScorePayload } from '@/types/scoring.types'; // Not directly used in hook signature

export const useScoring = () => {
  const dispatch: AppDispatch = useDispatch();
  const dealScore = useSelector(selectDealScore);
  const dealScoringHistory = useSelector(selectDealScoringHistory);
  const batchJobStatus = useSelector(selectBatchJobStatus);
  const recalculationJobStatus = useSelector(selectRecalculationJobStatus);
  const comparisonResults = useSelector(selectComparisonResults);
  const loading = useSelector(selectScoringLoading);
  const error = useSelector(selectScoringError);

  const handleScoreDeal = useCallback(
    async (dealId: string, customWeights?: any) => {
      await dispatch(scoreDeal({ dealId, customWeights }));
    },
    [dispatch]
  );

  const handleGetDealScoringHistory = useCallback(
    async (dealId: string, queryOptions?: QueryOptions) => {
      await dispatch(getDealScoringHistory({ dealId, queryOptions }));
    },
    [dispatch]
  );

  const handleBatchScore = useCallback(
    async (dealIds: string[]) => {
      await dispatch(batchScore(dealIds));
    },
    [dispatch]
  );

  const handleGetBatchScoringJobStatus = useCallback(
    async (jobId: string) => {
      await dispatch(getBatchScoringJobStatus(jobId));
    },
    [dispatch]
  );

  const handleRecalculateAllScores = useCallback(async () => {
    await dispatch(recalculateAllScores());
  }, [dispatch]);

  const handleCompareDealScores = useCallback(
    async (dealIds: string[]) => {
      await dispatch(compareDealScores(dealIds));
    },
    [dispatch]
  );

  return {
    dealScore,
    dealScoringHistory,
    batchJobStatus,
    recalculationJobStatus,
    comparisonResults,
    loading,
    error,
    scoreDeal: handleScoreDeal,
    getDealScoringHistory: handleGetDealScoringHistory,
    batchScore: handleBatchScore,
    getBatchScoringJobStatus: handleGetBatchScoringJobStatus,
    recalculateAllScores: handleRecalculateAllScores,
    compareDealScores: handleCompareDealScores,
  };
};
