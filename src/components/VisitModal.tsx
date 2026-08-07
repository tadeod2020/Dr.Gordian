import React, { useState, useEffect } from 'react';
import type { Pet, VisitRecord, VaccineRecord } from '../types/veterinary';
import { X, Stethoscope, Syringe } from 'lucide-react';

interface VisitModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveVisit: (visit: Omit<VisitRecord, 'id'>) => Promise<void>;
  onSaveVaccine: (vaccine: Omit<VaccineRecord, 'id'>) => Promise<void>;
  initialType?: 'visit' | 'vaccine';
}

export const VisitModal: React.FC<VisitModalProps> = ({
  pet,
  isOpen,
  onClose,
  onSaveVisit,
  onSaveVaccine,
  initialType = 'visit'
}) => {
  const [entryType, setEntryType] = useState<'visit' | 'vaccine'>(initialType);

  // Visit state
  const [reason, setReason] = useState('Consulta General');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [vetName, setVetName] = useState('Dr. Gordian');
  const [weightKg, setWeightKg] = useState<number | string>(pet?.weightKg || 5.0);
  const [cost, setCost] = useState<number | string>(450);

  // Vaccine state
  const [vaccineName, setVaccineName] = useState(
    pet?.species === 'Perro' ? 'Séctuple Canina' : 'Triple Felina'
  );
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState(
    new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
  );
  const [batchNumber, setBatchNumber] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && pet) {
      setEntryType(initialType);
      setReason('Consulta General');
      setDiagnosis('');
      setTreatment('');
      setVetName('Dr. Gordian');
      setWeightKg(pet.weightKg ?? '');
      setCost(450);
      setVaccineName(pet.species === 'Perro' ? 'Séctuple Canina' : 'Triple Felina');
      setAppliedDate(new Date().toISOString().split('T')[0]);
      setNextDueDate(new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]);
      setBatchNumber('');
    }
  }, [isOpen, pet, initialType]);

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (entryType === 'visit') {
        await onSaveVisit({
          petId: pet.id!,
          date: appliedDate,
          reason,
          diagnosis: diagnosis || 'Sin diagnóstico registrado',
          treatment: treatment || 'Ninguno',
          vetName: vetName || 'Dr. Gordian',
          weightKg: Math.max(0.01, Number(weightKg) || 1.0),
          cost: Math.max(0, Number(cost) || 0)
        });
      } else {
        const due = new Date(nextDueDate).getTime();
        const now = new Date().getTime();
        const diffDays = (due - now) / 86400000;
        let status: 'Al día' | 'Próxima' | 'Vencida' = 'Al día';
        if (diffDays < 0) status = 'Vencida';
        else if (diffDays <= 30) status = 'Próxima';

        await onSaveVaccine({
          petId: pet.id!,
          vaccineName,
          appliedDate,
          nextDueDate,
          batchNumber: batchNumber || undefined,
          status
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-apple-pop my-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <img src={pet.avatarUrl} alt={pet.name} className="w-9 h-9 rounded-2xl object-cover ring-2 ring-slate-200" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Atención para {pet.name}
              </h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Clínica Dr. Gordian</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector toggle */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setEntryType('visit')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                entryType === 'visit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Consulta Clínica</span>
            </button>
            <button
              type="button"
              onClick={() => setEntryType('vaccine')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                entryType === 'vaccine'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Syringe className="w-4 h-4" />
              <span>Vacuna / Desparasitación</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {entryType === 'visit' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motivo de Consulta *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Consulta General, Vacunación, Alergia"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Atención
                  </label>
                  <input
                    type="date"
                    required
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Peso Actual (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Diagnóstico Médico
                </label>
                <textarea
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Hallazgos clínicos..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
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
                  placeholder="Medicamentos y dosis..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Veterinario Tratante
                  </label>
                  <input
                    type="text"
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Costo ($ MXN)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Vacuna *
                </label>
                <select
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:outline-none text-sm text-slate-900 dark:text-white font-bold"
                >
                  {pet.species === 'Perro' ? (
                    <>
                      <option value="Séctuple Canina">Séctuple Canina (DHPPI+L)</option>
                      <option value="Rabia">Vacuna Antirrábica</option>
                      <option value="Parvovirus Canino">Parvovirus Canino</option>
                      <option value="Bordetella (Tos de las perreras)">Bordetella</option>
                      <option value="Desparasitación Interna/Externa">Desparasitación Canina</option>
                    </>
                  ) : (
                    <>
                      <option value="Triple Felina">Triple Felina (Calicivirus, Panleucopenia)</option>
                      <option value="Leucemia Felina">Leucemia Felina (FeLV)</option>
                      <option value="Rabia Felina">Vacuna Antirrábica Felina</option>
                      <option value="Desparasitación Interna Felina">Desparasitación Felina</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Aplicación
                  </label>
                  <input
                    type="date"
                    required
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Próximo Refuerzo / Vence
                  </label>
                  <input
                    type="date"
                    required
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Lote (Opcional)
                </label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="Ej: LOTE-VAC-9021"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md transition-all ${
                entryType === 'visit'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
              }`}
            >
              {saving ? 'Guardando...' : 'Guardar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
