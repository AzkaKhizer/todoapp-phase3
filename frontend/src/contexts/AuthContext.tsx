"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
} from "@/lib/auth-client";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, error: sessionError } = useSession();

  // Map Better Auth user to our User type
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.createdAt?.toString() || new Date().toISOString(),
      }
    : null;

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn.email({
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message || "Login failed");
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const result = await signUp.email({
      email,
      password,
      name: email.split("@")[0], // Use email prefix as name
    });

    if (result.error) {
      throw new Error(result.error.message || "Registration failed");
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        isAuthenticated: !!session?.user,
        login,
        register,
        logout,
        error: sessionError?.message || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
