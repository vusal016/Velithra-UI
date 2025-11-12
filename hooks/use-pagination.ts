/**
 * Velithra - usePagination Hook
 * Custom hook for pagination management
 */

'use client';

import { useState, useCallback } from 'react';

interface UsePaginationReturn {
  pageNumber: number;
  pageSize: number;
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  reset: () => void;
}

export const usePagination = (
  initialPageSize: number = 10,
  initialPageNumber: number = 1
): UsePaginationReturn => {
  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const nextPage = useCallback(() => {
    setPageNumber((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPageNumber(Math.max(1, page));
  }, []);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setPageNumber(1); // Reset to first page when changing page size
  }, []);

  const reset = useCallback(() => {
    setPageNumber(initialPageNumber);
    setPageSize(initialPageSize);
  }, [initialPageNumber, initialPageSize]);

  return {
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    reset,
  };
};

export default usePagination;
