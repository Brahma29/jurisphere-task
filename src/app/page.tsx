"use client";

import { data } from "@/constants/dummay-data";
import React, { useMemo, useState } from "react";

type TSortingDirection = "asc" | "desc";
type TUserStatus = "active" | "inactive";

type TCurrentSortConfig = {
  key: keyof TUser | null;
  direction: TSortingDirection;
};

export type TUser = {
  id: number;
  name: string;
  email: string;
  status: TUserStatus;
};

export default function Home() {
  const [currentSortConfig, setCurrentSortConfig] =
    useState<TCurrentSortConfig>({
      key: null,
      direction: "asc",
    });
  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TUserStatus | null>(null);

  const handleSort = (key: TCurrentSortConfig["key"]) => {
    let direction: TSortingDirection = "asc";
    if (
      currentSortConfig.key === key &&
      currentSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setCurrentSortConfig({ key, direction });
  };

  const sortData = (data: TUser[]) => {
    if (!currentSortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[currentSortConfig.key!];
      const bValue = b[currentSortConfig.key!];

      if (aValue < bValue) {
        return currentSortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return currentSortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filterData = (data: TUser[]) => {
    return data.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const statusMatch = statusFilter === null || item.status === statusFilter;
      return nameMatch && statusMatch;
    });
  };

  const filteredData = useMemo(
    () => filterData(data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, nameFilter, statusFilter]
  );

  const filteredAndSortedData = useMemo(
    () => sortData(filteredData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredData, currentSortConfig]
  );

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <div className="my-4 flex gap-4">
        <input
          id="nameFilter"
          type="text"
          placeholder="Search by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none "
        />

        <select
          id="statusFilter"
          value={statusFilter || ""}
          onChange={(e) =>
            setStatusFilter(
              e.target.value === "" ? null : (e.target.value as TUserStatus)
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none flex-1 min-w-36"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <table className="w-full">
          <thead>
            <tr>
              <TableHead onClick={() => handleSort("id")}>id</TableHead>
              <TableHead onClick={() => handleSort("name")}>name</TableHead>
              <TableHead onClick={() => handleSort("email")}>email</TableHead>
              <TableHead onClick={() => handleSort("status")}>status</TableHead>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedData.map((user) => (
              <tr key={user.id}>
                <TableData>{user.id}</TableData>
                <TableData>{user.name}</TableData>
                <TableData>{user.email}</TableData>
                <TableData>{user.status}</TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TableHead = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <th className="text-left py-2 bg-gray-400" onClick={onClick}>
    {children}
  </th>
);

const TableData = ({ children }: { children: React.ReactNode }) => (
  <td className="py-2">{children}</td>
);
