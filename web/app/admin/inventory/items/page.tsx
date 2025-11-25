import { Card, CardContent } from "@/shared/ui/cards/card";
import { Construction } from "lucide-react";

export default function ItemsPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Items del Inventario</h1>
          <p className="text-muted-foreground">
            Gestión de items físicos del FabLab
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-yellow-100 p-4 mb-4">
              <Construction className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
            <p className="text-muted-foreground text-center max-w-md">
              El módulo de gestión de items está en desarrollo. 
              Pronto podrás agregar y gestionar los items físicos del inventario del FabLab.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
