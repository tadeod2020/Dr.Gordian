import React from 'react';
import type { ClinicSettings } from '../types/veterinary';
import { 
  LayoutDashboard, 
  Dog, 
  Cat, 
  PawPrint, 
  ShieldCheck, 
  Menu, 
  X,
  Stethoscope,
  Settings,
  FileText,
  Package
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  speciesFilter: 'all' | 'Perro' | 'Gato';
  setSpeciesFilter: (filter: 'all' | 'Perro' | 'Gato') => void;
  totalPetsCount: number;
  dogsCount: number;
  catsCount: number;
  todayVisitsCount: number;
  isCloudConnected: boolean;
  onOpenCloudSettings: () => void;
  clinicSettings: ClinicSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  speciesFilter,
  setSpeciesFilter,
  totalPetsCount,
  dogsCount,
  catsCount,
  todayVisitsCount,
  isCloudConnected,
  onOpenCloudSettings,
  clinicSettings
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNavClick = (tab: string, filter?: 'all' | 'Perro' | 'Gato') => {
    setActiveTab(tab);
    if (filter !== undefined) {
      setSpeciesFilter(filter);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile / Tablet Toggle Header */}
      <div className="no-print lg:hidden fixed top-0 left-0 right-0 z-40 h-16 px-4 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src="/logo-transparent.png" alt="Dr. Gordian" className="h-9 w-auto object-contain dark:hidden" />
          <img src="/logo-transparent-white.png" alt="Dr. Gordian" className="h-9 w-auto object-contain hidden dark:block" />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay Backdrop for Mobile / Tablet */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="no-print lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`no-print fixed lg:sticky top-0 left-0 z-50 h-screen w-72 p-5 flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 shadow-sm transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo & Name */}
          <div 
            onClick={onOpenCloudSettings}
            className="flex items-center gap-3 px-2 py-1 cursor-pointer group hover:bg-blue-50/50 dark:hover:bg-slate-800/60 rounded-2xl transition-colors"
            title={`Personalizar ajustes de ${clinicSettings.name}`}
          >
            <div className="py-1">
              <img src="/logo-transparent.png" alt="Dr. Gordian" className="h-10 w-auto object-contain dark:hidden" />
              <img src="/logo-transparent-white.png" alt="Dr. Gordian" className="h-10 w-auto object-contain hidden dark:block" />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Menú Principal
            </p>

            {/* Dashboard */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Resumen General</span>
              </div>
            </button>

            {/* Consultas del Día */}
            <button
              onClick={() => handleNavClick('daily-visits')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'daily-visits'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Stethoscope className="w-4 h-4" />
                <span>Consultas del Día</span>
              </div>
              {todayVisitsCount > 0 && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'daily-visits'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {todayVisitsCount}
                </span>
              )}
            </button>

            {/* Documentos & Contratos */}
            <button
              onClick={() => handleNavClick('documents')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Documentos & Contratos</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  activeTab === 'documents'
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}
              >
                13
              </span>
            </button>

            {/* Inventario & Productos */}
            <button
              onClick={() => handleNavClick('inventory')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Inventario & Productos</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  activeTab === 'inventory'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                Nuevo
              </span>
            </button>

            {/* All Patients */}
            <button
              onClick={() => handleNavClick('pets', 'all')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'pets' && speciesFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <PawPrint className="w-4 h-4" />
                <span>Todas las Mascotas</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'pets' && speciesFilter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {totalPetsCount}
              </span>
            </button>

            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-4 mb-2">
              Filtro por Especie
            </p>

            {/* Perros */}
            <button
              onClick={() => handleNavClick('pets', 'Perro')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'pets' && speciesFilter === 'Perro'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Dog className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Perros</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'pets' && speciesFilter === 'Perro'
                    ? 'bg-white/20 text-white'
                    : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                }`}
              >
                {dogsCount}
              </span>
            </button>

            {/* Gatos */}
            <button
              onClick={() => handleNavClick('pets', 'Gato')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'pets' && speciesFilter === 'Gato'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cat className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Gatos</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'pets' && speciesFilter === 'Gato'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                {catsCount}
              </span>
            </button>

            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-4 mb-2">
              Personalización
            </p>

            {/* Clinic Personalization & Cloud Settings */}
            <button
              onClick={() => {
                onOpenCloudSettings();
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-blue-600" />
                <span>Ajustes de la Clínica</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                EDITAR
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Card - Cloud Sync Status */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div 
            onClick={onOpenCloudSettings}
            className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 cursor-pointer hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {isCloudConnected ? 'Nube Conectada' : 'Nube / Local'}
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
                CONFIG
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
              {isCloudConnected 
                ? 'Sincronizado con Supabase Cloud.' 
                : 'Conecta Supabase para sincronizar PCs y Tablets.'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
