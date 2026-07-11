import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mentorService } from "../services/mentorService";

export const MENTOR_PROFILE_KEY = ["mentor", "profile"];

export function useMentorProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: MENTOR_PROFILE_KEY,
    queryFn: mentorService.getProfile,
    retry: false,
  });

  const saveProfile = useMutation({
    mutationFn: (payload) => mentorService.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(MENTOR_PROFILE_KEY, data);
      queryClient.invalidateQueries({ queryKey: MENTOR_PROFILE_KEY });
      toast.success("Mentor profile saved successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Profile could not be saved.");
    },
  });

  return useMemo(
    () => ({
      profile: profileQuery.data?.data ?? null,
      isMissingProfile:
        profileQuery.isError &&
        /not found|no rows|JSON object requested/i.test(
          profileQuery.error?.message || "",
        ),
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
