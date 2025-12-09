
import { PrismaClient } from '@prisma/client';
import { getItemsClient } from '../src/features/inventory/infrastructure/vessel/items.client';
import { getLocationClient } from '../src/features/inventory/infrastructure/vessel/locations.client';
import { getStockClient } from '../src/features/inventory/infrastructure/vessel/stock.client';
import { getMovementsClient } from '../src/features/inventory/infrastructure/vessel/movements.client';
import { useReservations } from '../src/features/inventory/presentation/hooks/use-reservations'; // Hook might not work in script, use Client directly
// Actually Reservations use a custom client or just StockClient?
// Look at formulario-reserva.tsx:
// import { useReservations } from '../../hooks/use-reservations';
// const { crear } = useReservations();
// Let's check use-reservations hook content or find the client.
// It seems reservations might use a 'ReservationClient' or similar.

// Plan:
// 1. Setup Clients.
// 2. Find Item & Location.
// 3. Add Stock (Movement).
// 4. Reserve Stock.

async function main() {
    console.log('=== VERIFYING STOCK & MOVEMENTS ===');

    const itemsClient = getItemsClient();
    const locationClient = getLocationClient();
    const movementsClient = getMovementsClient();
    const stockClient = getStockClient();

    // 1. Find Item
    console.log('1. Searching for "Browser Test Item"...');
    const items = await itemsClient.listar({ busqueda: 'Browser Test Item' });
    const item = items.items.find(i => i.nombre === 'Browser Test Item');

    if (!item) {
        console.error('!!! ITEM NOT FOUND. Run create-full-item or browser flow first.');
        process.exit(1);
    }
    console.log(`   Found Item: ${item.id} (${item.nombre})`);

    // 2. Find Location
    console.log('2. Searching for "Browser Test Warehouse"...');
    const locations = await locationClient.listar();
    const location = locations.find(l => l.nombre === 'Browser Test Warehouse');

    if (!location) {
        console.error('!!! LOCATION NOT FOUND.');
        process.exit(1);
    }
    console.log(`   Found Location: ${location.id} (${location.nombre})`);

    // 3. Add Stock (Entrada)
    console.log('3. Registering Stock Entry (100 units)...');
    try {
        await movementsClient.recepcion(
            item.id,
            location.id,
            100,
            'Script Verification'
        );
        console.log('   Stock Entry Successful.');
    } catch (error) {
        console.error('   !!! Stock Entry Failed:', error);
    }

    // 4. Verify Stock Level
    console.log('4. Verifying Stock Level...');
    let stockItems = await stockClient.listarItems({
        catalogoItemId: item.id,
        ubicacionId: location.id
    });
    let stock = stockItems[0];
    console.log(`   Stock: Total=${stock?.cantidad}, Available=${stock?.cantidadDisponible}`);

    if (stock?.cantidad !== 100) {
        console.error(`   !!! Stock Mismatch. Expected 100, got ${stock?.cantidad}`);
    } else {
        console.log('   Stock Level Correct.');
    }

    // 5. Reserve Stock
    console.log('5. Creating Reservation (20 units)...');
    try {
        // Assuming StockClient has reservarStock method or similar.
        // In stock.client.ts: async reservarStock(id: string, dto: ReservarStockDTO)
        // The ID is the STOCK ITEM ID, not Catalog Item ID.
        if (!stock) {
            // Fetch again if null
            stockItems = await stockClient.listarItems({ catalogoItemId: item.id, ubicacionId: location.id });
            stock = stockItems[0];
        }

        await stockClient.reservarStock(stock.id, { cantidad: 20 });
        console.log('   Reservation Successful.');
    } catch (error) {
        console.error('   !!! Reservation Failed:', error);
    }

    // 6. Verify Reservation Impact
    console.log('6. Verifying Reservation Impact...');
    stockItems = await stockClient.listarItems({
        catalogoItemId: item.id,
        ubicacionId: location.id
    });
    stock = stockItems[0];
    console.log(`   Stock: Total=${stock?.cantidad}, Reserved=${stock?.cantidadReservada}, Available=${stock?.cantidadDisponible}`);

    if (stock?.cantidadReservada !== 20) {
        console.error(`   !!! Reservation Check Failed. Expected 20, got ${stock?.cantidadReservada}`);
    } else if (stock?.cantidadDisponible !== 80) {
        console.error(`   !!! Availability Check Failed. Expected 80, got ${stock?.cantidadDisponible}`);
    } else {
        console.log('   Reservation Verified Correctly.');
    }

    console.log('=== VERIFICATION COMPLETE ===');
}

main().catch(console.error);
