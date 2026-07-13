import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import { toast } from "react-hot-toast";

export function useUserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [verified, setVerified] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 8;

  const queryKey = ["admin", "users", { search, role, status, verified, sort, page }];

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () => adminService.getUsers({ search, role, status, verified, sort, page, limit }),
    placeholderData: (previousData) => previousData, // Maintain screen during next page loading
  });

  const users = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit };

  // Status mutation (deactivate/activate)
  const statusMutation = useMutation({
    mutationFn: ({ id, status: newStatus }) => adminService.updateUserStatus(id, newStatus),
    onMutate: async ({ id, status: newStatus }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      // Optimistically update status in lists
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
        };
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error(err.message || "Failed to update user status.");
    },
    onSuccess: (_, variables) => {
      toast.success(`User successfully ${variables.status === "active" ? "activated" : "deactivated"}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  // Helper to handle filter/search changes and reset page to 1
  const updateSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const updateRole = (val) => {
    setRole(val);
    setPage(1);
  };

  const updateStatus = (val) => {
    setStatus(val);
    setPage(1);
  };

  const updateVerified = (val) => {
    setVerified(val);
    setPage(1);
  };

  const updateSort = (val) => {
    setSort(val);
    setPage(1);
  };

  return {
    users,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    search,
    setSearch: updateSearch,
    role,
    setRole: updateRole,
    status,
    setStatus: updateStatus,
    verified,
    setVerified: updateVerified,
    sort,
    setSort: updateSort,
    page,
    setPage,
    updateUserStatus: statusMutation.mutate,
    isUpdatingStatus: statusMutation.isPending,
    updatingId: statusMutation.variables?.id,
  };
}
