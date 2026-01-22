/**
 * API client with JWT authentication.
 */

import { getAuthToken } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = response.statusText;
    let errorCode = "UNKNOWN";

    try {
      const errorData = await response.json();
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      if (errorData.error) {
        errorCode = errorData.error;
      }
    } catch {
      // JSON parsing failed
    }

    throw new ApiError(response.status, errorCode, errorMessage);
  }

  // Handle 204 No Content responses (e.g., DELETE)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = await getAuthToken();
  // T004: Debug logging for auth flow
  if (process.env.NODE_ENV === "development") {
    console.log("[API] Auth token:", token ? "Present" : "Missing");
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("[API] No auth token available - request may fail with 401");
  }

  return headers;
}

function getBasicHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

export const api = {
  async get<T>(path: string, authenticated: boolean = false): Promise<T> {
    const headers = authenticated ? await getAuthHeaders() : getBasicHeaders();
    const response = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers,
    });
    return handleResponse<T>(response);
  },

  async post<T>(
    path: string,
    data?: unknown,
    authenticated: boolean = false
  ): Promise<T> {
    const headers = authenticated ? await getAuthHeaders() : getBasicHeaders();
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(
    path: string,
    data: unknown,
    authenticated: boolean = true
  ): Promise<T> {
    const headers = authenticated ? await getAuthHeaders() : getBasicHeaders();
    const response = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async patch<T>(
    path: string,
    data?: unknown,
    authenticated: boolean = true
  ): Promise<T> {
    const headers = authenticated ? await getAuthHeaders() : getBasicHeaders();
    const response = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete(path: string, authenticated: boolean = true): Promise<void> {
    const headers = authenticated ? await getAuthHeaders() : getBasicHeaders();
    const response = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers,
    });
    await handleResponse<void>(response);
  },
};
