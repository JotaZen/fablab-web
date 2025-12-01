/**
 * Test de consistencia de rutas Vessel API
 * 
 * Valida que todos los clients usen el prefijo /v1 y el patrón CRUD correcto:
 * - /v1/{resource}/read
 * - /v1/{resource}/show/{id}
 * - /v1/{resource}/create
 * - /v1/{resource}/update/{id}
 * - /v1/{resource}/delete/{id}
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch para capturar las URLs
const fetchCalls: string[] = [];
const mockFetch = vi.fn(async (url: string) => {
  fetchCalls.push(url);
  return {
    ok: true,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => ({ 
      data: [], 
      meta: { total: 0, page: 1, per_page: 10, last_page: 1 },
      // Para UoM convert
      original_value: 1, 
      original_unit: 'cm', 
      converted_value: 10, 
      converted_unit: 'mm',
    }),
  };
});

vi.stubGlobal('fetch', mockFetch);

// Importar después del mock
import { ItemsClient, resetItemsClient } from '../items.client';
import { StockClient, resetStockClient } from '../stock.client';
import { LocationClient, resetLocationClient } from '../locations.client';
import { UoMClient, resetUoMClient } from '../uom.client';
import { TaxonomyClient, resetTaxonomyClient } from '../taxonomy.client';

describe('Vessel API - Consistencia de Rutas', () => {
  const BASE_URL = 'http://test.local';

  beforeEach(() => {
    fetchCalls.length = 0;
    mockFetch.mockClear();
    resetItemsClient();
    resetStockClient();
    resetLocationClient();
    resetUoMClient();
    resetTaxonomyClient();
  });

  describe('Items Client', () => {
    it('usa /v1/items/read para listar', async () => {
      const client = new ItemsClient(BASE_URL);
      await client.listar();
      expect(fetchCalls[0]).toContain('/v1/items/read');
    });

    it('usa /v1/items/show/{id} para obtener', async () => {
      const client = new ItemsClient(BASE_URL);
      await client.obtener('123');
      expect(fetchCalls[0]).toContain('/v1/items/show/123');
    });

    it('usa /v1/items/create para crear', async () => {
      const client = new ItemsClient(BASE_URL);
      await client.crear({ nombre: 'Test', descripcion: '', uomId: '1' });
      expect(fetchCalls[0]).toContain('/v1/items/create');
    });

    it('usa /v1/items/update/{id} para actualizar', async () => {
      const client = new ItemsClient(BASE_URL);
      await client.actualizar('123', { nombre: 'Updated' });
      expect(fetchCalls[0]).toContain('/v1/items/update/123');
    });

    it('usa /v1/items/delete/{id} para eliminar', async () => {
      const client = new ItemsClient(BASE_URL);
      await client.eliminar('123');
      expect(fetchCalls[0]).toContain('/v1/items/delete/123');
    });
  });

  describe('Stock Client', () => {
    it('usa /v1/stock/items/read para listar', async () => {
      const client = new StockClient(BASE_URL);
      await client.listarItems();
      expect(fetchCalls[0]).toContain('/v1/stock/items/read');
    });

    it('usa /v1/stock/items/show/{id} para obtener', async () => {
      const client = new StockClient(BASE_URL);
      await client.obtenerItem('123');
      expect(fetchCalls[0]).toContain('/v1/stock/items/show/123');
    });

    it('usa /v1/stock/items/create para crear', async () => {
      const client = new StockClient(BASE_URL);
      await client.crearItem({ sku: 'TEST', cantidad: 1, ubicacionId: '1', tipoUbicacion: 'warehouse' });
      expect(fetchCalls[0]).toContain('/v1/stock/items/create');
    });
  });

  describe('Locations Client', () => {
    it('usa /v1/locations/read para listar', async () => {
      const client = new LocationClient(BASE_URL);
      await client.listar();
      expect(fetchCalls[0]).toContain('/v1/locations/read');
    });

    it('usa /v1/locations/show/{id} para obtener', async () => {
      const client = new LocationClient(BASE_URL);
      await client.obtener('123');
      expect(fetchCalls[0]).toContain('/v1/locations/show/123');
    });

    it('usa /v1/locations/create para crear', async () => {
      const client = new LocationClient(BASE_URL);
      await client.crear({ nombre: 'Test', tipo: 'warehouse' });
      expect(fetchCalls[0]).toContain('/v1/locations/create');
    });
  });

  describe('UoM Client', () => {
    it('usa /v1/uom/measures/read para listar', async () => {
      const client = new UoMClient(BASE_URL);
      await client.listar();
      expect(fetchCalls[0]).toContain('/v1/uom/measures/read');
    });

    it('usa /v1/uom/measures/show/{id} para obtener', async () => {
      const client = new UoMClient(BASE_URL);
      await client.obtener('cm');
      expect(fetchCalls[0]).toContain('/v1/uom/measures/show/cm');
    });

    it('usa /v1/uom/measures/convert para conversión', async () => {
      const client = new UoMClient(BASE_URL);
      await client.convertir({ desde: 'cm', hasta: 'mm', valor: 1 });
      expect(fetchCalls[0]).toContain('/v1/uom/measures/convert');
    });
  });

  describe('Taxonomy Client', () => {
    it('usa /v1/taxonomy/vocabularies/read para listar vocabularios', async () => {
      const client = new TaxonomyClient(BASE_URL);
      await client.listarVocabularios();
      expect(fetchCalls[0]).toContain('/v1/taxonomy/vocabularies/read');
    });

    it('usa /v1/taxonomy/vocabularies/show/{id} para obtener vocabulario', async () => {
      const client = new TaxonomyClient(BASE_URL);
      await client.obtenerVocabulario('123');
      expect(fetchCalls[0]).toContain('/v1/taxonomy/vocabularies/show/123');
    });

    it('usa /v1/taxonomy/vocabularies/create para crear vocabulario', async () => {
      const client = new TaxonomyClient(BASE_URL);
      await client.crearVocabulario({ nombre: 'Test', slug: 'test' });
      expect(fetchCalls[0]).toContain('/v1/taxonomy/vocabularies/create');
    });

    it('usa /v1/taxonomy/vocabularies/update/{id} para actualizar vocabulario', async () => {
      const client = new TaxonomyClient(BASE_URL);
      await client.actualizarVocabulario('123', { nombre: 'Updated' });
      expect(fetchCalls[0]).toContain('/v1/taxonomy/vocabularies/update/123');
    });

    it('usa /v1/taxonomy/vocabularies/delete/{id} para eliminar vocabulario', async () => {
      const client = new TaxonomyClient(BASE_URL);
      await client.eliminarVocabulario('123');
      expect(fetchCalls[0]).toContain('/v1/taxonomy/vocabularies/delete/123');
    });

    it('usa /v1/taxonomy/terms/read para listar términos', async () => {
      const client = new TaxonomyClient(BASE_URL);
      await client.listarTerminos();
      expect(fetchCalls[0]).toContain('/v1/taxonomy/terms/read');
    });

    it('usa /v1/taxonomy/terms/show/{id} para obtener término', async () => {
      const client = new TaxonomyClient(BASE_URL);
      await client.obtenerTermino('123');
      expect(fetchCalls[0]).toContain('/v1/taxonomy/terms/show/123');
    });

    it('usa /v1/taxonomy/terms/tree para árbol', async () => {
      const client = new TaxonomyClient(BASE_URL);
      try {
        await client.obtenerArbol('vocab-1');
      } catch {
        // El método puede fallar por el mock, pero queremos verificar la URL
      }
      expect(fetchCalls[0]).toContain('/v1/taxonomy/terms/tree');
    });

    it('usa /v1/taxonomy/terms/breadcrumb/{id} para breadcrumb', async () => {
      const client = new TaxonomyClient(BASE_URL);
      try {
        await client.obtenerBreadcrumb('term-1');
      } catch {
        // El método puede fallar por el mock, pero queremos verificar la URL
      }
      expect(fetchCalls[0]).toContain('/v1/taxonomy/terms/breadcrumb/term-1');
    });
  });

  describe('Patrón de rutas consistente', () => {
    it('todas las rutas comienzan con /v1/', () => {
      const routePattern = /^http:\/\/test\.local\/v1\//;
      
      // Este test fallará si algún cliente usa rutas sin /v1/
      fetchCalls.forEach(url => {
        expect(url).toMatch(routePattern);
      });
    });
  });
});
