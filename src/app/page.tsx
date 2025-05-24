"use client";

import { data } from "@/constants/dummay-data";
import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UserInfoModal } from "./(components)/user-info-modal";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TUser, TUserStatus, USER_STATUSES } from "@/types/user";
import { TSortingDirection } from "@/types/common";

type TCurrentSortConfig = {
  key: keyof TUser | null;
  direction: TSortingDirection;
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentSortConfig, setCurrentSortConfig] =
    useState<TCurrentSortConfig>({
      key: null,
      direction: "asc",
    });
  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TUserStatus | null>(null);

  const selectedUserId = searchParams.get("user");
  const selectedUser = selectedUserId
    ? data.find((user) => user.id === parseInt(selectedUserId))
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
    () => filterData(data),
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
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      {selectedUser && (
        <UserInfoModal user={selectedUser} onClose={handleCloseModal} />
      )}

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

          {USER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <table className="w-full">
          <thead>
            <tr>
              <TableHead onClick={() => handleSort("id")}>
                <div className="flex justify-between items-center">
                  <span>ID</span> {getSortIcon("id")}
                </div>
              </TableHead>

              <TableHead onClick={() => handleSort("name")}>
                <div className="flex justify-between items-center">
                  <span>Name</span> {getSortIcon("name")}
                </div>
              </TableHead>

              <TableHead onClick={() => handleSort("email")}>
                <div className="flex justify-between items-center">
                  <span>Email</span> {getSortIcon("email")}
                </div>
              </TableHead>

              <TableHead onClick={() => handleSort("status")}>
                <div className="flex justify-between items-center">
                  <span>Status</span> {getSortIcon("status")}
                </div>
              </TableHead>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedData.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
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
  <th
    className="text-left py-2 bg-gray-400 gap-2 items-center px-3 cursor-pointer"
    onClick={onClick}
  >
    {children}
  </th>
);

const TableData = ({ children }: { children: React.ReactNode }) => (
  <td className="py-2 px-3">{children}</td>
);
