"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest, ApiResponse } from "@/types";
import Cookies from "js-cookie";

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
        const response = await authService.login(credentials);

        if (response.success && response.data) {
          const { user: userData, token: userToken } = response.data;

          if (userToken && userData) {
            storeLogin(userData, userToken);
            return { success: true };
          }
        }

        setError(response.message || "Login failed");
        return { success: false, error: response.message };
      } catch (err) {
        const apiError = err as ApiResponse;
        const message = apiError.message || apiError.error || "Login failed";
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
        const response = await authService.register(credentials);

        if (response.success && response.data) {
          const { user: userData, token: userToken } = response.data;
          if (userData) {
            if (userToken) {
              storeLogin(userData, userToken);
            }
            return { success: true };
          }
        }

        setError(response.message || "Registration failed");
        return { success: false, error: response.message };
      } catch (err) {
        const apiError = err as ApiResponse;
        const message = apiError.message || apiError.error || "Registration failed";
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
      Cookies.remove("token", { path: "/" });
      localStorage.removeItem("token");
    }
  }, [storeLogout]);

  const checkAuth = useCallback(async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await authService.getMe();
      if (response.success && response.data) {
        storeLogin(response.data, token);
      } else {
        // Only logout on definitive 401 Unauthorized
        if (response.status === 401) {
          storeLogout();
          Cookies.remove("token", { path: "/" });
          localStorage.removeItem("token");
        }
      }
      } catch (err) {
      const apiError = err as ApiResponse;
      // Only logout on definitive 401 Unauthorized from the interceptor
      if (apiError.status === 401) {
        storeLogout();
        Cookies.remove("token", { path: "/" });
        localStorage.removeItem("token");
      }
      // Network failures or 5xx errors should not revoke the session
    } finally {
      setLoading(false);
    }
  }, [storeLogin, storeLogout, setLoading]);

  useEffect(() => {
    // Re-verify session on mount if a token exists
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token && !isLoading) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

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
