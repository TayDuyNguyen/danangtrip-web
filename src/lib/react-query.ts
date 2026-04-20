import type { ApiResponse } from "@/types";

type QueryError = ApiResponse | Error | { status?: number };

const getErrorStatus = (error: QueryError) => {
  if (typeof error === "object" && error !== null && "status" in error) {
    return typeof error.status === "number" ? error.status : undefined;
  }

  return undefined;
};

export const shouldRetryQuery = (failureCount: number, error: QueryError) => {
  const status = getErrorStatus(error);

  if (status === undefined || status < 500) {
    return false;
  }

  return failureCount < 2;
};
