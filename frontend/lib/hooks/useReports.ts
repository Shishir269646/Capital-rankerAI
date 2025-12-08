import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  generateReport,
  downloadReport,
  getDealReport,
  selectGeneratedReports,
  selectDealReport,
  selectReportsLoading,
  selectReportsError,
} from '@/store/slices/reportsSlice';
import { useCallback } from 'react';
import { GenerateReportPayload } from '@/types/report.types';

export const useReports = () => {
  const dispatch: AppDispatch = useDispatch();
  const generatedReports = useSelector(selectGeneratedReports);
  const dealReport = useSelector(selectDealReport);
  const loading = useSelector(selectReportsLoading);
  const error = useSelector(selectReportsError);

  const handleGenerateReport = useCallback(
    async (payload: GenerateReportPayload) => {
      await dispatch(generateReport(payload));
    },
    [dispatch]
  );

  const handleDownloadReport = useCallback(
    async (reportId: string, format: 'pdf' | 'csv' | 'xlsx') => {
      await dispatch(downloadReport({ reportId, format }));
    },
    [dispatch]
  );

  const handleGetDealReport = useCallback(
    async (dealId: string) => {
      await dispatch(getDealReport(dealId));
    },
    [dispatch]
  );

  return {
    generatedReports,
    dealReport,
    loading,
    error,
    generateReport: handleGenerateReport,
    downloadReport: handleDownloadReport,
    getDealReport: handleGetDealReport,
  };
};