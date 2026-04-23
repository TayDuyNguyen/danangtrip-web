/**
 * API response parsing utilities
 */

/**
 * Extracts items from an API response data payload.
 * Handles both direct arrays and nested data objects from paginated responses.
 */
export function extractItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}
