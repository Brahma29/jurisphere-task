import { data } from "@/constants/dummay-data";
import React from "react";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold">Users</h1>

      <div>
        <table className="w-full">
          <thead>
            <tr>
              <TableHead>id</TableHead>
              <TableHead>name</TableHead>
              <TableHead>email</TableHead>
              <TableHead>status</TableHead>
            </tr>
          </thead>

          <tbody>
            {data.map((user) => (
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

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left py-2 bg-gray-400">{children}</th>
);

const TableData = ({ children }: { children: React.ReactNode }) => (
  <td className="py-2">{children}</td>
);
