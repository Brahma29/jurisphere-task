"use client";

import React, { useState, useMemo } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "./table-head";
import { TableCell } from "./table-cell";
import { TSortingDirection } from "@/types/common";

export type TColumnConfig<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

type TSortConfig<T> = {
  key: keyof T | null;
  direction: TSortingDirection;
};

type TDataTableProps<T> = {
  data: T[];
  columns: TColumnConfig<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
};

export const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data found.",
  className = "",
}: TDataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<TSortConfig<T>>({
    key: null,
    direction: "asc",
  });

  /**
   * Function to set the sorting config
   */
  const handleSort = (key: keyof T) => {
    let direction: TSortingDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  /**
   * On Change of sortConfig this function will sort the data
   */
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  /**
   * This function returns the sorting arrow icon based on the selected column
   */
  const getSortIcon = (columnKey: keyof T) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={12} />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={12} />
    ) : (
      <ArrowDown size={12} />
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto ${className}`}
    >
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                onClick={
                  column.sortable !== false
                    ? () => handleSort(column.key)
                    : undefined
                }
              >
                <span>{column.label}</span>
                {column.sortable !== false && getSortIcon(column.key)}
              </TableHead>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
              <tr
                key={String(item.id || index)}
                onClick={() => onRowClick?.(item)}
                className={`cursor-pointer transition-colors duration-150 hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                } ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])}
                  </TableCell>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
