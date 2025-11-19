import { RequireAuth } from "@/shared/auth/RequireAuth";
import InventoryDashboard from "@/features/inventory/presentation/dashboard";

export default function AdminInventoryPage() {
  return (
    <RequireAuth>
      <InventoryDashboard />
    </RequireAuth>
  );
}