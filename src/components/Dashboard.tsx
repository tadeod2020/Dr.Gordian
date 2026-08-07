import React from 'react';
import type { Pet, VisitRecord, VaccineRecord } from '../types/veterinary';
import { 
  PawPrint, 
  Dog, 
  Cat, 
  Stethoscope, 
  Syringe, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  pets: Pet[];
  visits: VisitRecord[];
  vaccines: VaccineRecord[];
  onOpenAddPetModal: () => void;
  onSelectPet: (pet: Pet) => void;
  onGoToPetsTab: (species?: 'all' | 'Perro' | 'Gato') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  pets,
  visits,
  vaccines,
  onOpenAddPetModal,
  onSelectPet,
  onGoToPetsTab
}) => {
  const totalPets = pets.length;
  const dogs = pets.filter((p) => p.species === 'Perro');
  const cats = pets.filter((p) => p.species === 'Gato');

  const pendingVaccines = vaccines.filter((v) => v.status === 'Próxima' || v.status === 'Vencida');
  const recentPets = [...pets]
    .sort((a, b) => {
      const tA = a.registeredAt ? new Date(a.registeredAt).getTime() : 0;
      const tB = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
      return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
    })
    .slice(0, 5);

  const dogPercentage = totalPets > 0 ? Math.round((dogs.length / totalPets) * 100) : 0;
  const catPercentage = totalPets > 0 ? Math.round((cats.length / totalPets) * 100) : 0;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Hero Banner - Royal Medical Blue */}
      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg shadow-blue-600/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Sistema Médico Veterinario • Dr. Gordian</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight drop-shadow-xs">
            Registro Clínico de Perros y Gatos
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed font-normal">
            Gestiona la atención médica, vacunas y consultas de tus pacientes desde cualquier computadora o tablet con respaldo en la nube.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddPetModal}
              className="px-5 py-2.5 rounded-2xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-all shadow-md transform hover:scale-105 active:scale-98 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Nueva Mascota</span>
            </button>
            <button
              onClick={() => onGoToPetsTab('all')}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition-all backdrop-blur-md flex items-center gap-2"
            >
              <span>Ver Pacientes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative subtle background light */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-sky-400/20 blur-3xl pointer-events-none rounded-full transform translate-x-1/4" />
      </div>

      {/* Metrics Row - High Contrast Clean Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Pets */}
        <div 
          onClick={() => onGoToPetsTab('all')}
          className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm hover:border-blue-500 transition-all cursor-pointer group transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Pacientes
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PawPrint className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalPets}
            </span>
            <span className="text-xs font-semibold text-slate-500">registrados</span>
          </div>
        </div>

        {/* Metric 2: Dogs */}
        <div 
          onClick={() => onGoToPetsTab('Perro')}
          className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm hover:border-sky-500 transition-all cursor-pointer group transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Perros Caninos
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dog className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {dogs.length}
            </span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {dogPercentage}% del total
            </span>
          </div>
        </div>

        {/* Metric 3: Cats */}
        <div 
          onClick={() => onGoToPetsTab('Gato')}
          className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm hover:border-indigo-500 transition-all cursor-pointer group transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Gatos Felinos
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cat className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {cats.length}
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {catPercentage}% del total
            </span>
          </div>
        </div>

        {/* Metric 4: Consultations & Vaccines */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Consultas Atendidas
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {visits.length}
              </span>
              <span className="text-xs text-slate-500 ml-1 font-semibold">consultas</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-100 dark:border-rose-900">
              <Syringe className="w-3.5 h-3.5" />
              <span>{pendingVaccines.length} pendientes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown & Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Species distribution & Quick Recent Pets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Species Distribution Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-blue-600" />
                <span>Distribución por Especie</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">Caninos vs Felinos</span>
            </div>

            {/* Visual Bar */}
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${dogPercentage}%` }}
                className="bg-sky-500 h-full transition-all duration-500"
                title={`Perros: ${dogPercentage}%`}
              />
              <div
                style={{ width: `${catPercentage}%` }}
                className="bg-indigo-600 h-full transition-all duration-500"
                title={`Gatos: ${catPercentage}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div 
                onClick={() => onGoToPetsTab('Perro')}
                className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex items-center justify-between cursor-pointer hover:border-sky-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-sky-500" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">Perros Caninos</p>
                    <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">{dogs.length} pacientes</p>
                  </div>
                </div>
                <Dog className="w-6 h-6 text-sky-500" />
              </div>

              <div 
                onClick={() => onGoToPetsTab('Gato')}
                className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-600" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">Gatos Felinos</p>
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{cats.length} pacientes</p>
                  </div>
                </div>
                <Cat className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Recent Registrations Table/Grid */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Últimos Pacientes Registrados</span>
              </h3>
              <button
                onClick={() => onGoToPetsTab('all')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Ver catálogo completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentPets.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No hay mascotas registradas aún.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {recentPets.map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => onSelectPet(pet)}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={pet.avatarUrl}
                        alt={pet.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pet.name}</h4>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              pet.species === 'Perro'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            }`}
                          >
                            {pet.species}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {pet.breed} • Dueño: <span className="font-semibold text-slate-700 dark:text-slate-300">{pet.ownerName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {pet.weightKg !== undefined && pet.weightKg > 0 ? `${pet.weightKg} kg` : '-'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {pet.ageYears !== undefined || pet.ageMonths !== undefined ? `${pet.ageYears ?? 0}a ${pet.ageMonths ?? 0}m` : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Vaccines Alert & Quick Tips */}
        <div className="space-y-6">
          {/* Vaccines Status Widget */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Syringe className="w-5 h-5 text-rose-500" />
              <span>Control de Vacunas</span>
            </h3>

            {pendingVaccines.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  ¡Todas las vacunas al día!
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  No hay esquemas de vacunación pendientes.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500">
                  Pacientes con vacunas próximas o vencidas:
                </p>

                {pendingVaccines.map((v) => {
                  const pet = pets.find((p) => p.id === v.petId);
                  return (
                    <div
                      key={v.id}
                      onClick={() => pet && onSelectPet(pet)}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {pet ? pet.name : 'Mascota'}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              v.status === 'Vencida'
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          {v.vaccineName} • Vence: {v.nextDueDate}
                        </p>
                      </div>
                      <AlertTriangle className={`w-4 h-4 ${v.status === 'Vencida' ? 'text-rose-600' : 'text-amber-500'}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick System Info Card */}
          <div className="p-6 rounded-3xl bg-blue-50/80 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 space-y-3">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <span>💡 Sincronización Dr. Gordian</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Todos los datos guardados en esta computadora o tablet se respaldan automáticamente en la nube. Conecta Supabase en la barra lateral para sincronizar todos tus dispositivos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
