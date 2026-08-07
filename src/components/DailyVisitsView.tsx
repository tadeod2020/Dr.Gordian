import React, { useState } from 'react';
import type { Pet, VisitRecord } from '../types/veterinary';
import { 
  Calendar, 
  Stethoscope, 
  Plus, 
  Search, 
  Dog, 
  Cat, 
  DollarSign, 
  User, 
  Camera, 
  X, 
  Upload, 
  UserPlus,
  CheckCircle2,
  Sparkles,
  Eye
} from 'lucide-react';
import { CameraModal } from './CameraModal';

interface DailyVisitsViewProps {
  pets: Pet[];
  visits: VisitRecord[];
  onSaveVisit: (visit: Omit<VisitRecord, 'id'>) => Promise<void>;
  onSavePetAndVisit: (
    petData: Omit<Pet, 'id' | 'registeredAt'>,
    visitData: Omit<VisitRecord, 'id' | 'petId'>
  ) => Promise<void>;
  onSelectPet: (pet: Pet) => void;
}

export const DailyVisitsView: React.FC<DailyVisitsViewProps> = ({
  pets,
  visits,
  onSaveVisit,
  onSavePetAndVisit,
  onSelectPet
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState(false);

  // Form State inside Modal
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>('existing');
  const [selectedPetId, setSelectedPetId] = useState<number | string>('');

  // Quick New Pet Form (Required: name, breed, gender, ownerName, ownerPhone)
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'Perro' | 'Gato'>('Perro');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetGender, setNewPetGender] = useState<'Macho' | 'Hembra'>('Macho');
  const [newPetOwnerName, setNewPetOwnerName] = useState('');
  const [newPetOwnerPhone, setNewPetOwnerPhone] = useState('');
  const [newPetWeight, setNewPetWeight] = useState<string | number>('');

  // Visit Form State
  const [reason, setReason] = useState('Consulta General');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [vetName, setVetName] = useState('Dr. Gordian');
  const [visitWeight, setVisitWeight] = useState<string | number>('');
  const [cost, setCost] = useState<string | number>(450);
  const [images, setImages] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  // Filter visits for selected date (defaults to Today)
  const dayVisits = visits.filter((v) => v.date === selectedDate);
  const isTodaySelected = selectedDate === todayStr;

  const totalCost = dayVisits.reduce((acc, v) => acc + (Number(v.cost) || 0), 0);

  // Match visits with pet data
  const visitsWithPets = dayVisits.map((v) => {
    const pet = pets.find((p) => p.id === v.petId);
    return { visit: v, pet };
  });

  const filteredVisits = visitsWithPets.filter(({ visit, pet }) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      visit.reason.toLowerCase().includes(term) ||
      visit.diagnosis.toLowerCase().includes(term) ||
      (pet && pet.name.toLowerCase().includes(term)) ||
      (pet && pet.ownerName.toLowerCase().includes(term))
    );
  });

  const dogsCount = visitsWithPets.filter(({ pet }) => pet?.species === 'Perro').length;
  const catsCount = visitsWithPets.filter(({ pet }) => pet?.species === 'Gato').length;

  const handleOpenModal = () => {
    setPatientMode('existing');
    setSelectedPetId(pets.length > 0 ? pets[0].id || '' : '');
    setNewPetName('');
    setNewPetSpecies('Perro');
    setNewPetBreed('');
    setNewPetGender('Macho');
    setNewPetOwnerName('');
    setNewPetOwnerPhone('');
    setNewPetWeight('');
    setReason('Consulta General');
    setDiagnosis('');
    setTreatment('');
    setVetName('Dr. Gordian');
    setVisitWeight('');
    setCost(450);
    setImages([]);
    setIsNewVisitModalOpen(true);
  };

  const handleSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (patientMode === 'existing') {
        if (!selectedPetId) {
          alert('Por favor selecciona un paciente existente o cambia a registrar mascota nueva.');
          setSaving(false);
          return;
        }
        await onSaveVisit({
          petId: Number(selectedPetId),
          date: selectedDate,
          reason: reason.trim() || 'Consulta General',
          diagnosis: diagnosis.trim() || 'Sin diagnóstico registrado',
          treatment: treatment.trim() || 'Ninguno',
          vetName: vetName.trim() || 'Dr. Gordian',
          weightKg: Number(visitWeight) || 0,
          cost: Number(cost) || 0,
          images: images.length > 0 ? images : undefined
        });
      } else {
        // Validation for new pet (strictly required: name, breed, gender, ownerName, ownerPhone)
        if (!newPetName.trim() || !newPetBreed.trim() || !newPetGender || !newPetOwnerName.trim() || !newPetOwnerPhone.trim()) {
          alert('Campos obligatorios de la mascota: Nombre, Raza, Sexo, Nombre del dueño y Número del dueño.');
          setSaving(false);
          return;
        }

        await onSavePetAndVisit(
          {
            name: newPetName.trim(),
            species: newPetSpecies,
            breed: newPetBreed.trim(),
            gender: newPetGender,
            weightKg: Number(newPetWeight) || undefined,
            ownerName: newPetOwnerName.trim(),
            ownerPhone: newPetOwnerPhone.trim(),
            avatarUrl: newPetSpecies === 'Perro' 
              ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80' 
              : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'
          },
          {
            date: selectedDate,
            reason: reason.trim() || 'Consulta General',
            diagnosis: diagnosis.trim() || 'Sin diagnóstico registrado',
            treatment: treatment.trim() || 'Ninguno',
            vetName: vetName.trim() || 'Dr. Gordian',
            weightKg: Number(visitWeight) || Number(newPetWeight) || 0,
            cost: Number(cost) || 0,
            images: images.length > 0 ? images : undefined
          }
        );
      }

      setIsNewVisitModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const formattedDateString = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 rounded-3xl p-6 lg:p-8 text-white shadow-lg shadow-blue-700/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              <span className="capitalize">{formattedDateString}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              {isTodaySelected ? 'Registro de Consultas del Día' : `Consultas del ${selectedDate}`}
            </h2>
            <p className="text-xs text-blue-100 font-normal leading-relaxed">
              {isTodaySelected
                ? 'Esta ventana se limpia automáticamente cada día. Registra atenciones rápidamente y agrega mascotas nuevas al catálogo en el mismo paso.'
                : 'Consulta el historial de atenciones registradas en esta fecha.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Date Selector */}
            <div className="bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center gap-2">
              <Calendar className="w-4 h-4 ml-2 text-blue-200" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none pr-2 cursor-pointer"
              />
              {!isTodaySelected && (
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className="px-2.5 py-1 rounded-xl bg-white text-blue-800 text-[10px] font-extrabold hover:bg-blue-50 transition-colors"
                >
                  Ver Hoy
                </button>
              )}
            </div>

            <button
              onClick={handleOpenModal}
              className="px-5 py-3 rounded-2xl bg-white text-blue-800 font-extrabold text-xs shadow-md hover:bg-blue-50 transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Consulta de Hoy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Visits Today */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isTodaySelected ? 'Consultas de Hoy' : 'Consultas en Fecha'}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {dayVisits.length}
              </span>
              <span className="text-xs font-bold text-blue-600">atenciones</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Today's Revenue */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ingresos Totales
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${totalCost}
              </span>
              <span className="text-xs font-semibold text-slate-400">MXN</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Dogs */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Caninos Atendidos</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
                {dogsCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">perros</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
            <Dog className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Cats */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Felinos Atendidos</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {catsCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">gatos</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <Cat className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Consultations List Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Historial de Consultas del Día
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en consultas del día..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 max-w-md mx-auto my-6">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              No hay consultas registradas para esta fecha
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Haz clic en "Registrar Consulta de Hoy" para ingresar la primera atención del día.
            </p>
            <button
              onClick={handleOpenModal}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Consulta Ahora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVisits.map(({ visit, pet }) => (
              <div
                key={visit.id}
                className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all space-y-4 shadow-xs group"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    {pet?.avatarUrl ? (
                      <img src={pet.avatarUrl} alt={pet.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                        <Dog className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {pet ? pet.name : 'Paciente'}
                        </h4>
                        {pet?.species && (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              pet.species === 'Perro'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            }`}
                          >
                            {pet.species}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-semibold">
                        {pet ? `${pet.breed} • Dueño: ${pet.ownerName}` : 'Paciente sin ficha'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      ${visit.cost} MXN
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium">Dr: {visit.vetName}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Motivo</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{visit.reason}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Diagnóstico</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-2">{visit.diagnosis}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tratamiento</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-2">{visit.treatment}</p>
                    </div>
                  </div>

                  {/* Evidence Thumbnails */}
                  {visit.images && visit.images.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 overflow-x-auto">
                      {visit.images.map((img, idx) => (
                        <a
                          key={idx}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        >
                          <img src={img} alt="Evidencia" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {visit.date}
                  </span>

                  {pet && (
                    <button
                      onClick={() => onSelectPet(pet)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Ficha Mascota</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: REGISTRAR CONSULTA DEL DÍA */}
      {isNewVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setIsNewVisitModalOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
          />

          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-apple-pop my-6 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Registrar Consulta del Día
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Clínica Dr. Gordian</p>
                </div>
              </div>

              <button
                onClick={() => setIsNewVisitModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scrollable Content */}
            <form onSubmit={handleSubmitVisit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* STEP 1: PATIENT SELECTION TYPE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ¿La mascota ya está registrada en el sistema?
                </label>

                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPatientMode('existing')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      patientMode === 'existing'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Paciente Existente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPatientMode('new')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      patientMode === 'new'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Registrar Mascota Nueva</span>
                  </button>
                </div>
              </div>

              {/* PATIENT SELECTOR OR INLINE PET REGISTRATION */}
              {patientMode === 'existing' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seleccionar Mascota Registrada *
                  </label>
                  {pets.length === 0 ? (
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                      No hay mascotas registradas aún. Selecciona <strong>+ Registrar Mascota Nueva</strong> arriba.
                    </div>
                  ) : (
                    <select
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 text-sm font-bold text-slate-900 dark:text-white"
                    >
                      {pets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.species} - {p.breed}) • Dueño: {p.ownerName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                /* INLINE NEW PET REGISTRATION FORM */
                <div className="p-4 rounded-3xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="font-extrabold text-xs uppercase tracking-wider">
                      Datos de la Nueva Mascota (Se guardará automáticamente)
                    </h4>
                  </div>

                  {/* Species toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPetSpecies('Perro')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                        newPetSpecies === 'Perro'
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Dog className="w-4 h-4" />
                      <span>Perro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPetSpecies('Gato')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                        newPetSpecies === 'Gato'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Cat className="w-4 h-4" />
                      <span>Gato</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre de la Mascota *
                      </label>
                      <input
                        type="text"
                        required={patientMode === 'new'}
                        value={newPetName}
                        onChange={(e) => setNewPetName(e.target.value)}
                        placeholder="Ej: Toby, Pelusa"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Raza *
                      </label>
                      <input
                        type="text"
                        required={patientMode === 'new'}
                        value={newPetBreed}
                        onChange={(e) => setNewPetBreed(e.target.value)}
                        placeholder={newPetSpecies === 'Perro' ? 'Ej: Labrador, Mestizo' : 'Ej: Siamés, Común'}
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Sexo *
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setNewPetGender('Macho')}
                          className={`py-1.5 rounded-lg text-xs font-bold ${
                            newPetGender === 'Macho' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          Macho
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPetGender('Hembra')}
                          className={`py-1.5 rounded-lg text-xs font-bold ${
                            newPetGender === 'Hembra' ? 'bg-pink-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          Hembra
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Peso (kg) (Opcional)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newPetWeight}
                        onChange={(e) => setNewPetWeight(e.target.value)}
                        placeholder="Ej: 8.5"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre del Dueño *
                      </label>
                      <input
                        type="text"
                        required={patientMode === 'new'}
                        value={newPetOwnerName}
                        onChange={(e) => setNewPetOwnerName(e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Número del Dueño *
                      </label>
                      <input
                        type="tel"
                        required={patientMode === 'new'}
                        value={newPetOwnerPhone}
                        onChange={(e) => setNewPetOwnerPhone(e.target.value)}
                        placeholder="Ej: +52 55 1234 5678"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CONSULTATION DETAILS */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Detalles de la Consulta Médica
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo de Consulta *
                  </label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej: Consulta General, Alergia, Revisión"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Diagnóstico Médico
                    </label>
                    <textarea
                      rows={2}
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Hallazgos clínicos..."
                      className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tratamiento Recetado
                    </label>
                    <textarea
                      rows={2}
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      placeholder="Medicamentos recetados..."
                      className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Veterinario
                    </label>
                    <input
                      type="text"
                      value={vetName}
                      onChange={(e) => setVetName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Costo ($ MXN)
                    </label>
                    <input
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Evidence Photos */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span>Fotos y Evidencia Médica (Opcional)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Tomar foto</span>
                      </button>
                      <label className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const res = event.target?.result as string;
                                if (res) setImages((prev) => [...prev, res]);
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 group">
                          <img src={img} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewVisitModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Guardando...' : patientMode === 'new' ? 'Guardar Mascota & Consulta' : 'Guardar Consulta'}</span>
                </button>
              </div>
            </form>
          </div>

          <CameraModal
            isOpen={isCameraOpen}
            onClose={() => setIsCameraOpen(false)}
            onCapture={(dataUrl) => setImages((prev) => [...prev, dataUrl])}
            title="Fotografía para Consulta Médica"
          />
        </div>
      )}
    </div>
  );
};
