import { api } from "@/lib/api";
import { TUser } from "@/types/user";
import { QueryOptions, useQuery } from "@tanstack/react-query";

/**
 * Functions
 */
const getAllUsers = (): Promise<TUser[]> => {
  return api.get("/api/users");
};

/**
 * Hooks
 */
export const useGetAllUsers = (options?: QueryOptions<TUser[]>) => {
  return useQuery({
    queryKey: ["useGetAllUsers"],
    queryFn: getAllUsers,
    ...options,
  });
};
