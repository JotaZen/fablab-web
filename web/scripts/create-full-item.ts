
import { getTaxonomyClient } from '../src/features/inventory/infrastructure/vessel/taxonomy.client';
import { getLocationClient } from '../src/features/inventory/infrastructure/vessel/locations.client';
import { getItemsClient } from '../src/features/inventory/infrastructure/vessel/items.client';

// Polyfill fetch for Node environment if needed (though npx tsx might have it, let's be safe or rely on global)
// VesselBaseClient uses 'fetch'. Node 18+ has native fetch.

async function main() {
    console.log("=== STARTING FULL ITEM VERIFICATION ===");

    const taxonomy = getTaxonomyClient();
    const locations = getLocationClient();
    const items = getItemsClient();

    // 1. Create Taxonomy (Category)
    console.log("\n1. Creating Category...");
    const vocabName = "Categorías Productos";
    const vocabSlug = "categorias-productos";

    // Find or Create Vocabulary manually (list all to be safe)
    console.log(`   Searching for vocabulary '${vocabSlug}'...`);
    const allVocabs = await taxonomy.listarVocabularios({ porPagina: 100 });
    let vocab = allVocabs.data.find(v => v.slug === vocabSlug || v.nombre === vocabName);

    if (!vocab) {
        console.log(`   Vocabulary '${vocabSlug}' not found in list. Creating...`);
        try {
            vocab = await taxonomy.crearVocabulario({ nombre: vocabName, slug: vocabSlug });
        } catch (e: any) {
            // Handle race condition or if it was created between list and create (unlikely in script)
            console.log(`   Creation failed (${e.message}). Re-checking list...`);
            const retryList = await taxonomy.listarVocabularios({ porPagina: 100 });
            vocab = retryList.data.find(v => v.slug === vocabSlug || v.nombre === vocabName);
            if (!vocab) throw e;
        }
    }
    console.log(`   Vocabulary ID: ${vocab!.id}`);

    // Create Term
    const termName = `Herramientas Manuales ${Date.now()}`;
    console.log(`   Creating Term '${termName}'...`);
    const term = await taxonomy.crearTermino({
        nombre: termName,
        vocabularioId: vocab.id,
        vocabularioSlug: vocabSlug
    });
    console.log(`   Term ID: ${term.id}`);


    // 2. Create Location
    console.log("\n2. Creating Location...");
    const locName = `Almacén Principal ${Date.now()}`;
    const location = await locations.crear({
        nombre: locName,
        tipo: 'warehouse',
        descripcion: 'Creado por script de verificación'
    });
    console.log(`   Location ID: ${location.id}`);


    // 3. Create Item
    console.log("\n3. Creating Item...");
    const itemName = `Martillo Premium ${Date.now()}`;
    const item = await items.crear({
        nombre: itemName,
        descripcion: "Un martillo de alta calidad verificado por script",
        terminoIds: [term.id], // Link to Category
        estado: 'active'
    });
    console.log(`   Item ID: ${item.id}`);
    console.log(`   Item Name: ${item.nombre}`);

    console.log("\n=== VERIFICATION SUCCESSFUL ===");
    console.log("Visual Verification:");
    console.log(`- Go to Catalog Dashboard -> Check '${termName}'`);
    console.log(`- Go to Locations Dashboard -> Check '${locName}'`);
    console.log(`- Go to Items Dashboard -> Check '${itemName}'`);
}

main().catch(err => {
    console.error("\n!!! VERIFICATION FAILED !!!");
    // console.error(err);
    if (err.statusCode) console.error(`Status: ${err.statusCode}`);
    if (err.message) console.error(`Message: ${err.message}`);
    // if (err.cause) console.error('Cause:', err.cause); 
    process.exit(1);
});
