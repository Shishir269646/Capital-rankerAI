import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  getAllAlerts,
  configureAlerts,
  markAsRead,
  deleteAlert,
  selectCurrentAlerts,
  selectAlertsPagination,
  selectAlertsLoading,
  selectAlertsError,
} from '@/store/slices/alertsSlice';
import { useCallback } from 'react';
import { QueryOptions } from '@/types/common.types';
// import { UpdateAlertPayload } from '@/types/alert.types'; // Not directly used in hook signature

export const useAlerts = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentAlerts = useSelector(selectCurrentAlerts);
  const pagination = useSelector(selectAlertsPagination);
  const loading = useSelector(selectAlertsLoading);
  const error = useSelector(selectAlertsError);

  const handleGetAllAlerts = useCallback(
    async (queryOptions?: QueryOptions) => {
      await dispatch(getAllAlerts(queryOptions));
    },
    [dispatch]
  );

  const handleConfigureAlerts = useCallback(
    async (payload: any) => { // Payload type needs to be defined
      await dispatch(configureAlerts(payload));
    },
    [dispatch]
  );

  const handleMarkAsRead = useCallback(
    async (alertId: string) => {
      await dispatch(markAsRead(alertId));
    },
    [dispatch]
  );

  const handleDeleteAlert = useCallback(
    async (alertId: string) => {
      await dispatch(deleteAlert(alertId));
    },
    [dispatch]
  );

  return {
    currentAlerts,
    pagination,
    loading,
    error,
    getAllAlerts: handleGetAllAlerts,
    configureAlerts: handleConfigureAlerts,
    markAsRead: handleMarkAsRead,
    deleteAlert: handleDeleteAlert,
  };
};
