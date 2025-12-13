import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { AppDispatch, RootState } from "@/store"; // Adjust import path if needed
import {
  fetchDeals,
  searchDeals,
  selectDeals,
  selectDealsLoading,
  selectDealsError,
  selectDealsPagination, // Added this selector here for convenience
} from "@/store/slices/dealsSlice"; // Ensure this matches your file name
import { QueryOptions } from "@/types/common.types";

export const useDeals = () => {
  const dispatch = useDispatch<AppDispatch>();

  const deals = useSelector(selectDeals) ?? [];
  const loading = useSelector(selectDealsLoading);
  const error = useSelector(selectDealsError);
  const pagination = useSelector(selectDealsPagination);

  const getDeals = useCallback(
    (options?: QueryOptions) => {
      // We cast the promise to void to avoid React useEffect cleanup warnings
      void dispatch(fetchDeals(options));
    },
    [dispatch]
  );

  const search = useCallback(
    (query: string, options?: QueryOptions) => {
      void dispatch(searchDeals({ name: query, ...options }));
    },
    [dispatch]
  );

  return {
    deals,
    loading,
    error,
    pagination,
    getDeals,
    search,
  };
};