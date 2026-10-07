import React, { useState } from 'react';
import type { Pet, VisitRecord, VaccineRecord } from '../types/veterinary';
import { 
  X, 
  Dog, 
  Cat, 
  Phone, 
  Mail, 
  MapPin, 
  Stethoscope, 
  Syringe, 
  Plus, 
  Printer, 
  Edit3, 
  Scale, 
  Calendar,
  Sparkles,
  Camera
} from 'lucide-react';

interface PetDetailModalProps {
  pet: Pet | null;
  visits: VisitRecord[];
  vaccines: VaccineRecord[];
  isOpen: boolean;
  onClose: () => void;
  onEditPet: (pet: Pet) => void;
  onAddVisit: (pet: Pet) => void;
  onAddVaccine: (pet: Pet) => void;
  onPrintMedicalReport: (pet: Pet) => void;
}

export const PetDetailModal: React.FC<PetDetailModalProps> = ({
  pet,
  visits,
  vaccines,
  isOpen,
  onClose,
  onEditPet,
  onAddVisit,
  onAddVaccine,
  onPrintMedicalReport
}) => {
  const [activeTab, setActiveTab] = useState<'visits' | 'vaccines' | 'info'>('visits');

  if (!isOpen || !pet) return null;

  const petVisits = visits.filter((v) => v.petId === pet.id);
  const petVaccines = vaccines.filter((v) => v.petId === pet.id);

  return (
    <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Detail Card Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-apple-pop my-6 max-h-[90vh] flex flex-col">
        {/* Header Hero Banner - Royal Blue */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={pet.avatarUrl}
              alt={pet.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/30 shadow-xl"
            />

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-xs">{pet.name}</h2>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                    pet.species === 'Perro'
                      ? 'bg-sky-400 text-slate-950'
                      : 'bg-indigo-400 text-slate-950'
                  }`}
                >
                  {pet.species === 'Perro' ? <Dog className="w-3.5 h-3.5" /> : <Cat className="w-3.5 h-3.5" />}
                  <span>{pet.species}</span>
                </span>
              </div>

              <p className="text-sm text-blue-100 font-semibold">
                {pet.breed} • {pet.gender}{pet.ageYears !== undefined || pet.ageMonths !== undefined ? ` • ${pet.ageYears ?? 0} años ${pet.ageMonths ?? 0} meses` : ''}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-blue-100 font-medium">
                <span className="flex items-center gap-1 bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Scale className="w-3.5 h-3.5" />
                  <span>{pet.weightKg !== undefined && pet.weightKg > 0 ? `${pet.weightKg} kg` : 'Sin peso'}</span>
                </span>
                <span className="flex items-center gap-1 bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{pet.chipNumber || 'Sin Microchip'}</span>
                </span>
              </div>
            </div>

            {/* Print & Edit Header Buttons */}
            <div className="flex sm:flex-col gap-2">
              <button
                onClick={() => onPrintMedicalReport(pet)}
                className="px-3.5 py-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>

              <button
                onClick={() => onEditPet(pet)}
                className="px-3.5 py-2 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('visits')}
              className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 ${
                activeTab === 'visits'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Historial Clínico ({petVisits.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vaccines')}
              className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 ${
                activeTab === 'vaccines'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60'
              }`}
            >
              <Syringe className="w-4 h-4" />
              <span>Carnet de Vacunas ({petVaccines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 ${
                activeTab === 'info'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60'
              }`}
            >
              <Dog className="w-4 h-4" />
              <span>Propietario</span>
            </button>
          </div>

          {/* Quick Action Button */}
          {activeTab === 'visits' && (
            <button
              onClick={() => onAddVisit(pet)}
              className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nueva Consulta</span>
            </button>
          )}

          {activeTab === 'vaccines' && (
            <button
              onClick={() => onAddVaccine(pet)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Vacuna</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white dark:bg-slate-900">
          {/* TAB 1: VISITS */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              {petVisits.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <Stethoscope className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No hay consultas registradas para {pet.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Haz clic en "Nueva Consulta" para agregar la primera atención clínica.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {petVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs">
                            {visit.reason}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            {visit.date}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            ${visit.cost} MXN
                          </span>
                          <p className="text-[10px] text-slate-400 font-medium">Atendido por: {visit.vetName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-bold text-slate-400 uppercase text-[10px]">
                            Diagnóstico
                          </p>
                          <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{visit.diagnosis}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase text-[10px]">
                            Tratamiento Recetado
                          </p>
                          <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{visit.treatment}</p>
                        </div>
                      </div>

                      {/* Visit attached images if any */}
                      {visit.images && visit.images.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                          <p className="font-bold text-slate-400 uppercase text-[10px] flex items-center gap-1">
                            <Camera className="w-3 h-3 text-blue-500" />
                            <span>Fotos & Evidencias ({visit.images.length})</span>
                          </p>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {visit.images.map((img, idx) => (
                              <a
                                key={idx}
                                href={img}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 group hover:ring-2 hover:ring-blue-500 transition-all"
                              >
                                <img src={img} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VACCINES */}
          {activeTab === 'vaccines' && (
            <div className="space-y-4">
              {petVaccines.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <Syringe className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No hay registro de vacunas para {pet.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Registra la primera vacuna o desparasitación.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {petVaccines.map((vac) => (
                    <div
                      key={vac.id}
                      className="bg-slate-50 dark:bg-slate-800 p-4.5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {vac.vaccineName}
                        </h4>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            vac.status === 'Al día'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : vac.status === 'Próxima'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {vac.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1 font-medium">
                        <p>Fecha Aplicación: <strong className="text-slate-900 dark:text-white">{vac.appliedDate}</strong></p>
                        <p>Próxima Dosis / Vence: <strong className="text-blue-600 dark:text-blue-400">{vac.nextDueDate}</strong></p>
                        {vac.batchNumber && <p className="text-[10px] text-slate-400">Lote: {vac.batchNumber}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OWNER INFO & NOTES */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Dog className="w-4 h-4 text-blue-600" />
                  <span>Propietario Responsable</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Nombre</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{pet.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {pet.ownerPhone}
                    </p>
                  </div>
                  {pet.ownerEmail && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Correo Electrónico</p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        {pet.ownerEmail}
                      </p>
                    </div>
                  )}
                  {pet.ownerAddress && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Dirección</p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {pet.ownerAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Observaciones y Alergias</span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {pet.notes || 'Sin observaciones registradas.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
