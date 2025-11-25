"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./AuthProvider";

/**
 * Hook para acceder al contexto de autenticación
 * 
 * @returns AuthContextValue con user, login, logout, etc.
 * @throws Error si se usa fuera de AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />;
 *   }
 *   
 *   return <div>Hola {user.username}</div>;
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  
  if (!ctx) {
    throw new Error(
      "useAuth debe usarse dentro de un AuthProvider. " +
      "Asegúrate de envolver tu app con <AuthProvider>."
    );
  }
  
  return ctx;
}
