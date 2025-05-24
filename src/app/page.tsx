"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UserInfoModal } from "./(page_components)/user-info-modal";
import { CircleAlert, Loader2 } from "lucide-react";
import { TUser, TUserStatus, USER_STATUSES } from "@/types/user";
import { useGetAllUsers } from "@/hooks/api/user";
import { DataTable } from "@/components/table/data-table";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [nameFilter, setNameFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<TUserStatus | null>(null);

  const { data, isLoading, error } = useGetAllUsers();

  const selectedUserId = searchParams.get("user");
  const selectedUser = selectedUserId
    ? data?.find((user) => user.id === parseInt(selectedUserId))
    : null;

  const handleUserClick = (user: TUser) => {
    const params = new URLSearchParams(searchParams);
    params.set("user", user.id.toString());
    router.replace(`?${params.toString()}`);
  };

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("user");
    router.replace(`?${params.toString()}`);
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

            <DataTable
              data={filteredData}
              columns={[
                {
                  key: "id" as keyof TUser,
                  label: "ID",
                },
                {
                  key: "name" as keyof TUser,
                  label: "Name",
                },
                {
                  key: "email" as keyof TUser,
                  label: "Email",
                },
                {
                  key: "status" as keyof TUser,
                  label: "Status",
                },
              ]}
              onRowClick={handleUserClick}
              emptyMessage={
                nameFilter || statusFilter
                  ? "No users match your filters."
                  : "No users found."
              }
            />
          </>
        )}
      </div>

      {selectedUser && (
        <UserInfoModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </>
  );
}
