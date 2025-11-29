/**
 * Página de Movimientos de Stock
 */
import { MovimientosPanel } from '@/features/inventory/presentation/components/movimientos';

export default function MovimientosPage() {
  return (
    <div className="container mx-auto py-6">
      <MovimientosPanel />
    </div>
  );
}
