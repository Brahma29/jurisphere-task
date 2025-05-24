"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UserInfoModal } from "./(page_components)/user-info-modal";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CircleAlert,
  Loader2,
} from "lucide-react";
import { TUser, TUserStatus, USER_STATUSES } from "@/types/user";
import { TSortingDirection } from "@/types/common";
import { TableHead } from "@/components/table/table-head";
import { TableData } from "@/components/table/table-data";
import { useGetAllUsers } from "@/hooks/api/user";

type TCurrentSortConfig = {
  key: keyof TUser | null;
  direction: TSortingDirection;
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data, isLoading, error } = useGetAllUsers();

  const [currentSortConfig, setCurrentSortConfig] =
    useState<TCurrentSortConfig>({
      key: null,
      direction: "asc",
    });
  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TUserStatus | null>(null);

  const selectedUserId = searchParams.get("user");
  const selectedUser = selectedUserId
    ? data?.find((user) => user.id === parseInt(selectedUserId))
    : null;

  const handleUserClick = (userId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("user", userId.toString());
    router.replace(`?${params.toString()}`);
  };

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("user");
    router.replace(`?${params.toString()}`);
  };

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
    () => filterData(data || []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, nameFilter, statusFilter]
  );

  const filteredAndSortedData = useMemo(
    () => sortData(filteredData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredData, currentSortConfig]
  );

  const getSortIcon = (columnKey: keyof TUser) => {
    if (currentSortConfig.key !== columnKey) {
      return <ArrowUpDown size={12} />;
    }
    return currentSortConfig.direction === "asc" ? (
      <ArrowUp size={12} />
    ) : (
      <ArrowDown size={12} />
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>

        {isLoading ? (
          <div className="max-w-4xl mx-auto py-10 px-6">
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 size={30} className="animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Fetching your users...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto py-10 px-6">
            <div className="p-6 text-center">
              <div className="mb-2">
                <CircleAlert className="mx-auto" size={30} />
              </div>
              <h3 className="text-lg font-medium mb-2">Error Fetching Users</h3>
              <p>
                {error.message ||
                  "An unexpected error occurred while loading users."}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="my-6 flex gap-4 md:flex-row flex-col">
              <input
                id="nameFilter"
                type="text"
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />

              <select
                id="statusFilter"
                value={statusFilter || ""}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === ""
                      ? null
                      : (e.target.value as TUserStatus)
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none flex-1 min-w-36"
              >
                <option value="">All Status</option>

                {USER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <TableHead onClick={() => handleSort("id")}>
                      <span>ID</span> {getSortIcon("id")}
                    </TableHead>

                    <TableHead onClick={() => handleSort("name")}>
                      <span>Name</span> {getSortIcon("name")}
                    </TableHead>

                    <TableHead onClick={() => handleSort("email")}>
                      <span>Email</span> {getSortIcon("email")}
                    </TableHead>

                    <TableHead onClick={() => handleSort("status")}>
                      <span>Status</span> {getSortIcon("status")}
                    </TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {nameFilter || statusFilter
                          ? "No users match your filters."
                          : "No users found."}
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedData.map((user, index) => (
                      <tr
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className={`cursor-pointer transition-colors duration-150 hover:bg-blue-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                      >
                        <TableData>{user.id}</TableData>
                        <TableData>{user.name}</TableData>
                        <TableData>{user.email}</TableData>
                        <TableData>{user.status}</TableData>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedUser && (
        <UserInfoModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
}
