import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { studentService } from "../services/studentService";

export const studentProfileKey = ["student", "profile"];

export function useStudentProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: studentProfileKey,
    queryFn: studentService.getProfile,
    retry: false,
  });

  const saveProfile = useMutation({
    mutationFn: async ({ mode, payload }) => {
      if (mode === "create") {
        return studentService.createProfile(payload);
      }
      return studentService.updateProfile(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(studentProfileKey, data);
      queryClient.invalidateQueries({ queryKey: studentProfileKey });
      toast.success("Student profile saved.");
    },
    onError: (error) => {
      toast.error(error.message || "Profile could not be saved.");
    },
  });

  return useMemo(
    () => ({
      profile: profileQuery.data?.data || null,
      isMissingProfile:
        profileQuery.isError &&
        /not found|no rows|JSON object requested|coerce the result/i.test(profileQuery.error?.message || ""),
      isLoading: profileQuery.isLoading,
      isFetching: profileQuery.isFetching,
      isError: profileQuery.isError,
      error: profileQuery.error,
      refetch: profileQuery.refetch,
      saveProfile,
    }),
    [profileQuery, saveProfile],
  );
}
