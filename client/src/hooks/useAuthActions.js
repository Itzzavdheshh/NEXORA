import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { useAuth } from "./useAuth";

export function useLogin() {
  const { persistSession } = useAuth();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      persistSession(data);
      toast.success("Welcome back to Nexora.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const { persistSession } = useAuth();

  return useMutation({
    mutationFn: async (payload) => {
      await authService.register(payload);
      return authService.login({
        email: payload.email,
        password: payload.password,
      });
    },
    onSuccess: (data) => {
      persistSession(data);
      toast.success("Your Nexora account is ready.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      toast.success("Signed out successfully.");
    },
  });
}
