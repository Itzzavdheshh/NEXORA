import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mentorService } from "../services/mentorService";
import { toast } from "react-hot-toast";

export function useMentorVerification() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["mentors", "pending"],
    queryFn: () => mentorService.getPendingMentors(),
  });

  const pendingMentors = data?.data || [];

  // Verify mentor mutation
  const verifyMutation = useMutation({
    mutationFn: (id) => mentorService.verifyMentor(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["mentors", "pending"] });
      const previous = queryClient.getQueryData(["mentors", "pending"]);

      // Optimistically filter out the verified mentor from the pending list
      queryClient.setQueryData(["mentors", "pending"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((m) => m.id !== id),
        };
      });

      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["mentors", "pending"], context.previous);
      }
      toast.error(err.message || "Failed to verify mentor.");
    },
    onSuccess: () => {
      toast.success("Mentor verified successfully.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  // Reject mentor mutation
  const rejectMutation = useMutation({
    mutationFn: (id) => mentorService.rejectMentor(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["mentors", "pending"] });
      const previous = queryClient.getQueryData(["mentors", "pending"]);

      // Optimistically filter out the rejected mentor from the pending list
      queryClient.setQueryData(["mentors", "pending"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((m) => m.id !== id),
        };
      });

      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["mentors", "pending"], context.previous);
      }
      toast.error(err.message || "Failed to reject mentor.");
    },
    onSuccess: () => {
      toast.success("Mentor application rejected.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  return {
    pendingMentors,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    verifyMentor: verifyMutation.mutate,
    isVerifying: verifyMutation.isPending,
    verifyingId: verifyMutation.variables,
    rejectMentor: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,
    rejectingId: rejectMutation.variables,
  };
}
