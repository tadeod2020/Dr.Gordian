import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { InventoryItem } from '../types/veterinary';
import { MinusCircle, X, AlertTriangle, CheckCircle2, ShoppingBag, Stethoscope, Trash2, RefreshCw, Package } from 'lucide-react';

interface InventoryDeductModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeduct: (itemId: number, quantity: number, reason: string) => Promise<void>;
}

export const InventoryDeductModal: React.FC<InventoryDeductModalProps> = ({
  item: initialItem,
  isOpen,
  onClose,
  onConfirmDeduct,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<number | string>(initialItem?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Uso en consulta médica');

  // Load all items from Dexie DB if needed
  const catalogItems = useLiveQuery(() => db.inventory.toArray(), []) || [];

  if (!isOpen) return null;

  // Determine active item (from props or from selector)
  const activeItem = initialItem || catalogItems.find((i) => String(i.id) === String(selectedItemId)) || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem || !activeItem.id || quantity <= 0) return;

    await onConfirmDeduct(activeItem.id, quantity, reason);
    onClose();
  };

  const isExceedingStock = activeItem ? quantity > activeItem.stock : false;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/90 dark:border-slate-700 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
              <MinusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Registrar Baja / Salida de Inventario
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                {activeItem ? activeItem.name : 'Selecciona un producto'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Selector if not pre-selected */}
        {!initialItem && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Producto a Descontar *
            </label>
            <div className="relative">
              <Package className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedItemId}
                onChange={(e) => {
                  setSelectedItemId(e.target.value);
                  setQuantity(1);
                }}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="">-- Seleccionar Producto del Inventario --</option>
                {catalogItems.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} ({prod.category}) — Stock: {prod.stock} {prod.unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Product Stock Card Banner */}
        {activeItem && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Stock Disponible
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {activeItem.stock} <span className="text-xs font-semibold text-slate-500">{activeItem.unit}</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Precio Unitario
              </span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                ${activeItem.price.toFixed(2)} MXN
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quantity selector */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Cantidad a descontar {activeItem ? `(${activeItem.unit})` : ''} *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-base text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center"
              >
                -
              </button>

              <input
                type="number"
                min="1"
                max={activeItem ? activeItem.stock : 999}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-black text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-base text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2 mt-2">
              {[1, 2, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuantity(num)}
                  className={`flex-1 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                    quantity === num
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-200'
                  }`}
                >
                  -{num}
                </button>
              ))}
            </div>
          </div>

          {/* Reason presets */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              Motivo de Salida / Baja *
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[
                { label: 'Uso en consulta médica', icon: Stethoscope },
                { label: 'Venta en mostrador', icon: ShoppingBag },
                { label: 'Producto caducado', icon: Trash2 },
                { label: 'Ajuste de inventario', icon: RefreshCw },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setReason(label)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    reason === label
                      ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] leading-tight">{label}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="O escribe un motivo personalizado..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Alert if exceeding stock */}
          {isExceedingStock && activeItem && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <p className="text-[11px] font-semibold">
                La cantidad ingresada supera el stock disponible actual ({activeItem.stock} {activeItem.unit}).
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!activeItem || isExceedingStock}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar Baja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
