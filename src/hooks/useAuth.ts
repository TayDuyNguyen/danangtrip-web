"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginCredentials, RegisterCredentials } from "@/services/auth.service";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      clearError();

      try {
        const response = await authService.login(credentials);

        if (response.success && response.data) {
          storeLogin(response.data.user, response.data.token);
          localStorage.setItem("token", response.data.token);
          return { success: true };
        } else {
          setError(response.error || "Login failed");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, setLoading, setError, clearError]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setLoading(true);
      clearError();

      try {
        const response = await authService.register(credentials);

        if (response.success && response.data) {
          storeLogin(response.data.user, response.data.token);
          localStorage.setItem("token", response.data.token);
          return { success: true };
        } else {
          setError(response.error || "Registration failed");
          return { success: false, error: response.error };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, setLoading, setError, clearError]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
      localStorage.removeItem("token");
    }
  }, [storeLogout]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        storeLogin(response.data, token);
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
};
