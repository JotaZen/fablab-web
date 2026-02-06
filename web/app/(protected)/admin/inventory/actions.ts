"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export interface InventoryStats {
    totalEquipment: number;
    availableEquipment: number;
    inUseEquipment: number;
    maintenanceEquipment: number;
    totalInventoryItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    activeUsages: number;
    visibleInTecnologias: number;
}

export interface RecentActivity {
    id: string;
    type: 'usage' | 'inventory' | 'equipment';
    title: string;
    description: string;
    timestamp: string;
    status?: string;
}

export async function getInventoryStats(): Promise<InventoryStats> {
    try {
        const payload = await getPayload({ config });

        const [equipResult, invResult, usageResult] = await Promise.all([
            payload.find({ collection: 'equipment', limit: 500, overrideAccess: true }),
            payload.find({ collection: 'inventory-items', limit: 500, overrideAccess: true }),
            payload.find({ collection: 'equipment-usage', where: { status: { equals: 'active' } }, limit: 500, overrideAccess: true }),
        ]);

        const equipDocs = equipResult.docs as any[];
        const invDocs = invResult.docs as any[];

        return {
            totalEquipment: equipDocs.length,
            availableEquipment: equipDocs.filter(d => d.status === 'available').length,
            inUseEquipment: equipDocs.filter(d => d.status === 'in-use').length,
            maintenanceEquipment: equipDocs.filter(d => d.status === 'maintenance' || d.status === 'out-of-service').length,
            totalInventoryItems: invDocs.length,
            lowStockItems: invDocs.filter(d => d.status === 'low-stock').length,
            outOfStockItems: invDocs.filter(d => d.status === 'out-of-stock').length,
            activeUsages: usageResult.docs.length,
            visibleInTecnologias: equipDocs.filter(d => d.showInTecnologias).length,
        };
    } catch (error) {
        console.error('Error getting inventory stats:', error);
        return {
            totalEquipment: 0, availableEquipment: 0, inUseEquipment: 0, maintenanceEquipment: 0,
            totalInventoryItems: 0, lowStockItems: 0, outOfStockItems: 0, activeUsages: 0, visibleInTecnologias: 0,
        };
    }
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
    try {
        const payload = await getPayload({ config });

        const [usages, items] = await Promise.all([
            payload.find({ collection: 'equipment-usage', sort: '-createdAt', limit: 5, depth: 1, overrideAccess: true }),
            payload.find({ collection: 'inventory-items', sort: '-updatedAt', limit: 5, overrideAccess: true }),
        ]);

        const activities: RecentActivity[] = [];

        for (const u of usages.docs as any[]) {
            activities.push({
                id: String(u.id),
                type: 'usage',
                title: `Uso de equipo: ${u.equipmentName || 'Equipo'}`,
                description: u.userName ? `por ${u.userName}` : '',
                timestamp: u.createdAt || u.startTime || '',
                status: u.status,
            });
        }

        for (const item of items.docs as any[]) {
            activities.push({
                id: String(item.id),
                type: 'inventory',
                title: item.name,
                description: `${item.quantity || 0} ${item.unit || 'unidades'} — ${item.category || 'general'}`,
                timestamp: item.updatedAt || '',
                status: item.status,
            });
        }

        return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
    } catch (error) {
        console.error('Error getting recent activity:', error);
        return [];
    }
}
