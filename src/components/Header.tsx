import React from 'react';
import type { UserSession } from '../types/veterinary';
import { Search, Plus, Sun, Moon, CloudCheck, HardDrive, Lock, LogOut } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenAddPetModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isCloudConnected: boolean;
  onOpenCloudSettings: () => void;
  userSession: UserSession | null;
  onLockSession: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onOpenAddPetModal,
  darkMode,
  setDarkMode,
  isCloudConnected,
  onOpenCloudSettings,
  userSession,
  onLockSession,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-30 px-4 lg:px-8 py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
      {/* Search Input Bar */}
      <div className="relative w-full md:w-80 group">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar paciente, dueño o chip..."
          className="w-full pl-10 pr-8 py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/15 text-xs text-slate-900 dark:text-white placeholder-slate-400 font-medium transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full w-5 h-5 flex items-center justify-center hover:opacity-80 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Action Buttons & Session Controls */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
        {/* User Session Badge */}
        {userSession && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
            <img
              src={userSession.avatarUrl}
              alt={userSession.name}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div className="text-left leading-none">
              <p className="text-xs font-extrabold text-slate-900 dark:text-white">{userSession.name}</p>
              <p className="text-[10px] text-blue-600 font-bold mt-0.5">{userSession.role}</p>
            </div>
          </div>
        )}

        {/* Lock Screen Button (for tablets) */}
        <button
          onClick={onLockSession}
          className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
          title="Bloquear pantalla (Modo Tablet)"
        >
          <Lock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="p-2 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all border border-rose-100 dark:border-rose-900"
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Cloud Status Pill */}
        <button
          onClick={onOpenCloudSettings}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
          title="Estado de conexión en la nube"
        >
          {isCloudConnected ? (
            <>
              <CloudCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="hidden lg:inline text-emerald-700 dark:text-emerald-400 font-bold">Nube Activa</span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4 text-blue-500" />
              <span className="hidden lg:inline font-bold">Nube / Local</span>
            </>
          )}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
        </button>

        {/* Primary Action Button: Add Pet */}
        <button
          onClick={onOpenAddPetModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nueva Mascota</span>
        </button>
      </div>
    </header>
  );
};
