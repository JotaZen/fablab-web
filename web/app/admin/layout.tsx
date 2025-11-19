"use client";

import React from "react";
import { AdminSidebar } from "@/shared/layout/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
}
