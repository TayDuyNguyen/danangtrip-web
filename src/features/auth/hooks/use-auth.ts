"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/types";

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
    async (credentials: LoginRequest) => {
      setLoading(true);
      clearError();

      try {
        const response: any = await authService.login(credentials);
        // Mapping based on source project response structure
        const userData = response.data?.user || response.user;
        const userToken = response.data?.token || response.token;

        if (userToken && userData) {
          storeLogin(userData, userToken);
          localStorage.setItem("token", userToken);
          if (response.data?.refreshToken || response.refreshToken) {
            localStorage.setItem("refreshToken", response.data?.refreshToken || response.refreshToken);
          }
          return { success: true };
        } else {
          setError(response.message || "Login failed");
          return { success: false, error: response.message };
        }
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || "An error occurred";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, setLoading, setError, clearError]
  );

  const register = useCallback(
    async (credentials: RegisterRequest) => {
      setLoading(true);
      clearError();

      try {
        const response: any = await authService.register(credentials);
        const userData = response.data?.user || response.user;
        const userToken = response.data?.token || response.token;

        if (userData) {
          if (userToken) {
            storeLogin(userData, userToken);
            localStorage.setItem("token", userToken);
          }
          return { success: true };
        } else {
          setError(response.message || "Registration failed");
          return { success: false, error: response.message };
        }
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || "An error occurred";
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
      localStorage.removeItem("refreshToken");
    }
  }, [storeLogout]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response: any = await authService.getMe();
      const userData = response.data || response;
      if (userData) {
        storeLogin(userData, token);
      } else {
        storeLogout();
      }
    } catch {
      storeLogout();
    } finally {
      setLoading(false);
    }
  }, [storeLogin, storeLogout, setLoading]);

  useEffect(() => {
    // Only check auth if we have a token but aren't authenticated in state
    if (localStorage.getItem("token") && !isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated]);

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
