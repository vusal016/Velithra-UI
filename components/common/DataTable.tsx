/**
 * Velithra - Advanced Data Table Component
 * Enterprise-level table with server-side pagination, sorting, filtering
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  show?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  
  // Pagination
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  
  // Sorting
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  
  // Filtering
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  // Loading & Empty States
  loading?: boolean;
  emptyMessage?: string;
  
  // Row Selection
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  getRowId?: (row: T) => string;
  
  // Styling
  className?: string;
  compact?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  totalCount,
  pageNumber,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortDirection,
  onSortChange,
  searchValue = '',
  onSearchChange,
  loading = false,
  emptyMessage = 'No data found',
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row) => row.id,
  className,
  compact = false,
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  
  const totalPages = Math.ceil(totalCount / pageSize);
  const startRow = (pageNumber - 1) * pageSize + 1;
  const endRow = Math.min(pageNumber * pageSize, totalCount);

  // Handle sorting
  const handleSort = useCallback(
    (key: string) => {
      if (!onSortChange) return;
      
      const newDirection =
        sortBy === key && sortDirection === 'asc' ? 'desc' : 'asc';
      onSortChange(key, newDirection);
    },
    [sortBy, sortDirection, onSortChange]
  );

  // Handle search
  const handleSearchSubmit = useCallback(() => {
    onSearchChange?.(localSearch);
  }, [localSearch, onSearchChange]);

  const handleSearchClear = useCallback(() => {
    setLocalSearch('');
    onSearchChange?.('');
  }, [onSearchChange]);

  // Handle row selection
  const isRowSelected = useCallback(
    (row: T) => {
      const rowId = getRowId(row);
      return selectedRows.some((r) => getRowId(r) === rowId);
    },
    [selectedRows, getRowId]
  );

  const toggleRowSelection = useCallback(
    (row: T) => {
      if (!onSelectionChange) return;
      
      const rowId = getRowId(row);
      const isSelected = isRowSelected(row);
      
      if (isSelected) {
        onSelectionChange(selectedRows.filter((r) => getRowId(r) !== rowId));
      } else {
        onSelectionChange([...selectedRows, row]);
      }
    },
    [selectedRows, onSelectionChange, getRowId, isRowSelected]
  );

  const toggleAllSelection = useCallback(() => {
    if (!onSelectionChange) return;
    
    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data);
    }
  }, [data, selectedRows, onSelectionChange]);

  // Pagination controls
  const canGoBack = pageNumber > 1;
  const canGoForward = pageNumber < totalPages;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search & Filters */}
      {onSearchChange && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="pl-10 pr-10"
            />
            {localSearch && (
              <button
                onClick={handleSearchClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <Button onClick={handleSearchSubmit} variant="default">
            Search
          </Button>
          {selectedRows.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {selectedRows.length} selected
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && selectedRows.length === data.length}
                      onChange={toggleAllSelection}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    style={{ width: column.width }}
                    className={cn(
                      column.sortable && 'cursor-pointer select-none hover:text-foreground',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <span className="text-muted-foreground">
                          {sortBy === column.key && sortDirection === 'asc' && (
                            <ArrowUp size={14} />
                          )}
                          {sortBy === column.key && sortDirection === 'desc' && (
                            <ArrowDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {selectable && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                    {actions && <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                    className="text-center py-12 text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                // Data rows
                data.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    className={cn(
                      'cursor-pointer',
                      isRowSelected(row) && 'bg-accent/50'
                    )}
                  >
                    {selectable && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isRowSelected(row)}
                          onChange={() => toggleRowSelection(row)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const key = String(column.key);
                      const value = key.includes('.')
                        ? key.split('.').reduce((obj: any, k: string) => obj?.[k], row)
                        : row[column.key];

                      return (
                        <TableCell
                          key={String(column.key)}
                          className={cn(
                            compact && 'py-2',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {column.render ? column.render(value, row) : value}
                        </TableCell>
                      );
                    })}
                    {actions && actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {actions
                            .filter((action) => !action.show || action.show(row))
                            .map((action, idx) => {
                              const Icon = action.icon;
                              return (
                                <Button
                                  key={idx}
                                  variant={action.variant || 'ghost'}
                                  size="sm"
                                  onClick={() => action.onClick(row)}
                                >
                                  {Icon && React.createElement(Icon as any, { className: 'mr-1', size: 16 })}
                                  {action.label}
                                </Button>
                              );
                            })}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startRow}</span> to{' '}
            <span className="font-medium text-foreground">{endRow}</span> of{' '}
            <span className="font-medium text-foreground">{totalCount}</span> results
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(1)}
                disabled={!canGoBack || loading}
              >
                <ChevronsLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(pageNumber - 1)}
                disabled={!canGoBack || loading}
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="px-4 text-sm">
                Page <span className="font-medium">{pageNumber}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(pageNumber + 1)}
                disabled={!canGoForward || loading}
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(totalPages)}
                disabled={!canGoForward || loading}
              >
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
