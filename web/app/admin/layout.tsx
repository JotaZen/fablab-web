"use client";

import React from "react";
import { AuthProvider } from "@/shared/auth/AuthProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
