"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { favoriteService } from "@/services/favorite.service";
import type { LoginRequest, RegisterRequest, RegisterResponse, ApiResponse, User } from "@/types";
import { clearTokens, getAccessToken } from "@/utils/auth.helper";
import { getApiErrorMessage } from "@/utils";
import { normalizeAuthUser } from "@/utils/normalize-user";
import { localFavoriteLocations } from "@/utils/local-favorites";

const mergeLocalFavoritesToAccount = async () => {
  const locationIds = localFavoriteLocations.list();
  if (locationIds.length === 0) return;

  await Promise.allSettled(
    locationIds.map((locationId) => favoriteService.addFavorite({ location_id: locationId }))
  );
  localFavoriteLocations.clear();
};

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

  const extractRegisteredUser = (payload: RegisterResponse): { user: User; token?: string } | null => {
    if ("user" in payload && payload.user) {
      return {
        user: normalizeAuthUser(payload.user),
        token: payload.token,
      };
    }

    if ("id" in payload) {
      return { user: normalizeAuthUser(payload) };
    }

    return null;
  };

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      clearError();

      try {
        const response = await authService.login(credentials);

        if (response.success && response.data) {
          const { user: userData, token: userToken } = response.data;

          if (userToken && userData) {
            storeLogin(normalizeAuthUser(userData), userToken, credentials.remember);
            await mergeLocalFavoritesToAccount();
            return { success: true };
          }
        }

        const message = getApiErrorMessage(response, "Login failed");
        setError(message);
        return { success: false, error: message };
      } catch (err) {
        const message = getApiErrorMessage(err, "Login failed");
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
          const registered = extractRegisteredUser(response.data);
          if (registered?.user) {
            const { user: userData, token: userToken } = registered;
            if (userToken) {
              storeLogin(normalizeAuthUser(userData), userToken);
            }
            return { success: true };
          }
        }

        const message = getApiErrorMessage(response, "Registration failed");
        setError(message);
        return { success: false, error: message };
      } catch (err) {
        const message = getApiErrorMessage(err, "Registration failed");
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
      clearTokens();
    }
  }, [storeLogout]);

  const checkAuth = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await authService.getMe();
      if (response.success && response.data) {
        storeLogin(normalizeAuthUser(response.data), token);
      } else {
        // Only logout on definitive 401 Unauthorized
        if (response.status === 401) {
          storeLogout();
          clearTokens();
        }
      }
      } catch (err) {
      const apiError = err as ApiResponse;
      // Only logout on definitive 401 Unauthorized from the interceptor
      if (apiError.status === 401) {
        storeLogout();
        clearTokens();
      }
      // Network failures or 5xx errors should not revoke the session
    } finally {
      setLoading(false);
    }
  }, [storeLogin, storeLogout, setLoading]);

  useEffect(() => {
    // Re-verify session on mount if a token exists and we are not already authenticated
    const token = getAccessToken();
    if (!token) {
      if (isAuthenticated) {
        storeLogout();
      }
      return;
    }

    if (token && !isAuthenticated && !isLoading) {
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
