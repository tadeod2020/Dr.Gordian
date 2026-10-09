import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { InventoryItem, InventoryCategory, Pet, ClinicSettings } from '../types/veterinary';
import { InventoryItemModal } from './InventoryItemModal';
import { InventoryDeductModal } from './InventoryDeductModal';
import { supabase } from '../lib/supabase';
import { syncLocalToSupabase, clearAllInventoryRemoteAndLocal } from '../lib/supabaseSync';

import { MagicCard } from './magicui/MagicCard';
import { ShimmerButton } from './magicui/ShimmerButton';
import { NumberTicker } from './magicui/NumberTicker';
import { BorderBeam } from './magicui/BorderBeam';

import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  TrendingDown, 
  Barcode, 
  Calendar,
  Layers3,
  RefreshCw,
  MinusCircle
} from 'lucide-react';

interface InventoryManagerProps {
  pets: Pet[];
  clinicSettings: ClinicSettings;
}

const CATEGORIES: (InventoryCategory | 'Todos')[] = [
  'Todos',
  'Medicamentos',
  'Vacunas',
  'Alimentos',
  'Material Quirúrgico',
  'Accesorios',
  'Higiene & Estética'
];

export const InventoryManager: React.FC<InventoryManagerProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory | 'Todos'>('Todos');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const [deductTargetItem, setDeductTargetItem] = useState<InventoryItem | null>(null);

  // Load items reactively from Dexie DB
  const inventoryItems = useLiveQuery(() => db.inventory.toArray(), []) || [];

  // Metrics calculations
  const totalProducts = inventoryItems.length;
  const totalValuation = inventoryItems.reduce((acc, item) => acc + (item.price * item.stock), 0);
  const lowStockItems = inventoryItems.filter((item) => item.stock <= item.minStock);
  const lowStockCount = lowStockItems.length;
  const outOfStockCount = inventoryItems.filter((item) => item.stock <= 0).length;

  // Filtered Items
  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.barcode && item.barcode.includes(searchTerm)) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesLowStock = !onlyLowStock || item.stock <= item.minStock;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Handlers
  const handleSaveItem = async (itemPayload: Omit<InventoryItem, 'id'> | InventoryItem) => {
    if ('id' in itemPayload && itemPayload.id) {
      await db.inventory.put(itemPayload as InventoryItem);
    } else {
      await db.inventory.add(itemPayload as InventoryItem);
    }
    // Auto sync single item addition/edit with cloud
    try {
      await syncLocalToSupabase();
    } catch (e) {
      console.warn('Background sync on item save warning:', e);
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!item.id) return;
    if (confirm(`¿Estás seguro de que deseas eliminar "${item.name}" del inventario?`)) {
      await db.inventory.delete(item.id);
      try {
        await supabase.from('inventory').delete().eq('name', item.name).eq('category', item.category);
      } catch (err) {
        console.error('Error deleting item from Supabase:', err);
      }
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    const res = await syncLocalToSupabase();
    setIsSyncing(false);
    if (res.success) {
      alert('✅ Inventario sincronizado correctamente con Supabase.');
    } else {
      alert('⚠️ Ocurrió un detalle durante la sincronización.');
    }
  };

  const handleClearAllInventory = async () => {
    if (confirm('⚠️ ¿Estás seguro de que deseas VACIAR TODO EL INVENTARIO?\nEsta acción borrará permanentemente todos los productos tanto en la base de datos local como en Supabase.')) {
      setIsSyncing(true);
      await clearAllInventoryRemoteAndLocal();
      setIsSyncing(false);
      alert('✅ El inventario ha sido limpiado por completo.');
    }
  };

  // Quick 1-click deduction handler
  const handleQuickDeduct = async (item: InventoryItem, amount: number) => {
    if (!item.id) return;
    const newStock = Math.max(0, item.stock - amount);
    await db.inventory.update(item.id, {
      stock: newStock,
      updatedAt: new Date().toISOString()
    });
  };

  // Quick 1-click add stock handler
  const handleQuickAdd = async (item: InventoryItem, amount: number) => {
    if (!item.id) return;
    await db.inventory.update(item.id, {
      stock: item.stock + amount,
      updatedAt: new Date().toISOString()
    });
  };

  // Confirm custom deduction from modal
  const handleConfirmDeduct = async (itemId: number, quantity: number) => {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (!item) return;

    const newStock = Math.max(0, item.stock - quantity);
    await db.inventory.update(itemId, {
      stock: newStock,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-7xl mx-auto pb-12">
      {/* Top Banner with Magic UI styling */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 overflow-hidden relative">
        <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none">
          <Package className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Módulo de Control de Medicamentos & Nube
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Inventario & Productos Veterinarios
            </h1>
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
              Registra medicamentos, vacunas, insumos y alimentos con sus precios. Realiza descuentos rápidos de stock en 1-clic y mantén alertas automáticas de reabastecimiento sincronizados con Supabase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              title="Sincronizar inventario local con Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Nube'}</span>
            </button>

            <button
              onClick={handleClearAllInventory}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md border border-rose-300/40 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
              title="Borrar todos los productos del inventario en local y Supabase"
            >
              <Trash2 className="w-4 h-4" />
              <span>Vaciar Inventario</span>
            </button>

            <button
              onClick={() => {
                setDeductTargetItem(null);
                setIsDeductModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30 border border-rose-400/40"
              title="Registrar baja o descuento de inventario"
            >
              <MinusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Registrar Baja de Inventario</span>
            </button>

            <ShimmerButton
              onClick={() => {
                setEditingItem(null);
                setIsItemModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Agregar Producto</span>
            </ShimmerButton>
          </div>
        </div>
      </div>

      {/* Metrics Row using MagicCard components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Products */}
        <MagicCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Productos
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                <NumberTicker value={totalProducts} />
              </p>
              <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-1">
                En catálogo activo
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <Layers3 className="w-6 h-6" />
            </div>
          </div>
        </MagicCard>

        {/* Metric 2: Inventory Valuation */}
        <MagicCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Valor del Inventario
              </p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                $<NumberTicker value={totalValuation} decimalPlaces={2} />
              </p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                Precio venta acumulado
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </MagicCard>

        {/* Metric 3: Low Stock Warning (Highlighted with BorderBeam if low stock exists) */}
        <MagicCard className="p-5 relative">
          {lowStockCount > 0 && <BorderBeam colorFrom="#f59e0b" colorTo="#ef4444" />}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Stock Bajo / Alertas
              </p>
              <p className={`text-2xl font-black mt-1 ${lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                <NumberTicker value={lowStockCount} />
              </p>
              <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                Requieren reabastecimiento
              </p>
            </div>
            <div className={`p-3 rounded-2xl ${lowStockCount > 0 ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-500'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </MagicCard>

        {/* Metric 4: Out of Stock */}
        <MagicCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Agotados (Stock 0)
              </p>
              <p className={`text-2xl font-black mt-1 ${outOfStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                <NumberTicker value={outOfStockCount} />
              </p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                Sin existencias
              </p>
            </div>
            <div className={`p-3 rounded-2xl ${outOfStockCount > 0 ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </MagicCard>
      </div>

      {/* Filter and Search Bar Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 p-1.5 rounded-2xl overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar & Low Stock Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
              onlyLowStock
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Stock Bajo ({lowStockCount})</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar producto, código o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Inventory Products Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No se encontraron productos en el inventario
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Prueba ajustando los términos de búsqueda o registra nuevos medicamentos con el botón "Agregar Producto".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isLowStock = item.stock <= item.minStock;
            const isOutOfStock = item.stock <= 0;

            return (
              <MagicCard
                key={item.id}
                className={`p-5 flex flex-col justify-between group ${
                  isOutOfStock
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20'
                    : isLowStock
                    ? 'border-amber-300 dark:border-amber-900/60'
                    : ''
                }`}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>

                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        Stock Bajo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        En Stock
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {item.name}
                  </h3>

                  {item.supplier && (
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      Proveedor: {item.supplier}
                    </p>
                  )}

                  {/* Price & Stock Stats Box */}
                  <div className="bg-slate-50 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 my-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Precio Venta
                      </span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        ${item.price.toFixed(2)} <span className="text-[10px] font-semibold text-slate-400">MXN</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Existencia
                      </span>
                      <span className={`text-base font-black ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                        {item.stock} <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                      </span>
                    </div>
                  </div>

                  {/* Additional Product Meta */}
                  <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                    {item.barcode && (
                      <p className="flex items-center gap-1.5">
                        <Barcode className="w-3 h-3 text-slate-400" />
                        <span>Código: {item.barcode}</span>
                      </p>
                    )}
                    {item.expirationDate && (
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Caducidad: {item.expirationDate}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Stock Actions Bar */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-700/80">
                  {/* 1-Click Fast Stock Deduction & Add Buttons */}
                  <div className="flex items-center justify-between gap-1.5 bg-slate-100 dark:bg-slate-700/50 p-1.5 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 pl-2">
                      Rápido:
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuickDeduct(item, 1)}
                        disabled={item.stock <= 0}
                        className="px-2.5 py-1 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-all"
                        title="Descontar 1 pieza rápidamente"
                      >
                        -1
                      </button>

                      <button
                        onClick={() => handleQuickDeduct(item, 5)}
                        disabled={item.stock < 5}
                        className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-all"
                        title="Descontar 5 piezas rápidamente"
                      >
                        -5
                      </button>

                      <button
                        onClick={() => handleQuickAdd(item, 1)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                        title="Sumar 1 pieza al stock"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  {/* Main Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setDeductTargetItem(item);
                        setIsDeductModalOpen(true);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-all flex items-center justify-center gap-1.5"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      Descontar / Salida
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsItemModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-all"
                        title="Editar producto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </MagicCard>
            );
          })}
        </div>
      )}

      {/* Item Modal (Add/Edit) */}
      <InventoryItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />

      {/* Stock Deduction Modal */}
      <InventoryDeductModal
        isOpen={isDeductModalOpen}
        item={deductTargetItem}
        onClose={() => setIsDeductModalOpen(false)}
        onConfirmDeduct={handleConfirmDeduct}
      />
    </div>
  );
};
