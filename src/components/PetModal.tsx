import React, { useState, useEffect } from 'react';
import type { Pet, PetSpecies, PetGender } from '../types/veterinary';
import { AVATAR_PRESETS } from '../db/database';
import confetti from 'canvas-confetti';
import { X, Dog, Cat, Camera, User, Check, Sparkles } from 'lucide-react';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (petData: Omit<Pet, 'id' | 'registeredAt'> & { id?: number }) => Promise<void>;
  editingPet?: Pet | null;
  defaultSpecies?: PetSpecies;
}

export const PetModal: React.FC<PetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPet,
  defaultSpecies = 'Perro'
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>(defaultSpecies);
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('Macho');
  const [ageYears, setAgeYears] = useState(1);
  const [ageMonths, setAgeMonths] = useState(0);
  const [weightKg, setWeightKg] = useState(5.0);
  const [chipNumber, setChipNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingPet) {
      setName(editingPet.name);
      setSpecies(editingPet.species);
      setBreed(editingPet.breed);
      setGender(editingPet.gender);
      setAgeYears(editingPet.ageYears);
      setAgeMonths(editingPet.ageMonths);
      setWeightKg(editingPet.weightKg);
      setChipNumber(editingPet.chipNumber || '');
      setAvatarUrl(editingPet.avatarUrl);
      setOwnerName(editingPet.ownerName);
      setOwnerPhone(editingPet.ownerPhone);
      setOwnerEmail(editingPet.ownerEmail || '');
      setOwnerAddress(editingPet.ownerAddress || '');
      setNotes(editingPet.notes || '');
    } else {
      setName('');
      setSpecies(defaultSpecies);
      setBreed('');
      setGender('Macho');
      setAgeYears(1);
      setAgeMonths(0);
      setWeightKg(defaultSpecies === 'Perro' ? 12.0 : 4.0);
      setChipNumber('');
      setAvatarUrl(
        defaultSpecies === 'Perro' ? AVATAR_PRESETS.dogs[0] : AVATAR_PRESETS.cats[0]
      );
      setOwnerName('');
      setOwnerPhone('');
      setOwnerEmail('');
      setOwnerAddress('');
      setNotes('');
    }
  }, [editingPet, isOpen, defaultSpecies]);

  const handleSpeciesChange = (newSpecies: PetSpecies) => {
    setSpecies(newSpecies);
    if (!editingPet) {
      setAvatarUrl(
        newSpecies === 'Perro' ? AVATAR_PRESETS.dogs[0] : AVATAR_PRESETS.cats[0]
      );
      setBreed(newSpecies === 'Perro' ? 'Mestizo / Criollo' : 'Común Europeo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ownerName || !ownerPhone) return;

    setSaving(true);
    try {
      await onSave({
        ...(editingPet?.id ? { id: editingPet.id } : {}),
        name,
        species,
        breed: breed || (species === 'Perro' ? 'Mestizo' : 'Mestizo Felino'),
        gender,
        ageYears: Math.max(0, Math.floor(Number(ageYears) || 0)),
        ageMonths: Math.max(0, Math.min(11, Math.floor(Number(ageMonths) || 0))),
        weightKg: Math.max(0.01, Number(weightKg) || 1.0),
        chipNumber: chipNumber || undefined,
        avatarUrl: avatarUrl || (species === 'Perro' ? AVATAR_PRESETS.dogs[0] : AVATAR_PRESETS.cats[0]),
        ownerName,
        ownerPhone,
        ownerEmail: ownerEmail || undefined,
        ownerAddress: ownerAddress || undefined,
        notes: notes || undefined
      });

      if (!editingPet) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentPresets = species === 'Perro' ? AVATAR_PRESETS.dogs : AVATAR_PRESETS.cats;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* iOS Style Sheet Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-apple-pop my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {editingPet ? 'Editar Ficha de Mascota' : 'Registrar Nueva Mascota'}
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Clínica Dr. Gordian</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Especie Selection (Perro / Gato) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Especie de la Mascota *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSpeciesChange('Perro')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  species === 'Perro'
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25 scale-[1.01]'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Dog className="w-5 h-5" />
                <span>Perro (Canino)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpeciesChange('Gato')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  species === 'Gato'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 scale-[1.01]'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Cat className="w-5 h-5" />
                <span>Gato (Felino)</span>
              </button>
            </div>
          </div>

          {/* Section: General Info */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Dog className="w-4 h-4" />
              <span>Información de la Mascota</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Mascota *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Max, Luna, Toby"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Raza
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder={species === 'Perro' ? 'Ej: Golden Retriever, Criollo' : 'Ej: Siamés, Persa'}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Género
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('Macho')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      gender === 'Macho'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Macho
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('Hembra')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      gender === 'Hembra'
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Hembra
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Edad
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={ageYears}
                      onChange={(e) => setAgeYears(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">Años</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={ageMonths}
                      onChange={(e) => setAgeMonths(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">Meses</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nº de Microchip (Opcional)
                </label>
                <input
                  type="text"
                  value={chipNumber}
                  onChange={(e) => setChipNumber(e.target.value)}
                  placeholder="Ej: CHIP-998822"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Foto de Perfil</span>
            </label>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {currentPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(preset)}
                  className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-transform flex-shrink-0 ${
                    avatarUrl === preset
                      ? 'border-blue-600 scale-105 ring-4 ring-blue-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  {avatarUrl === preset && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="O pega la URL de una foto personalizada..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:border-blue-600"
            />
          </div>

          {/* Section: Owner Info */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Datos del Propietario</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Dueño *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ej: Ana María Torres"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teléfono de Contacto *
                </label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="Ej: +52 55 1234 5678"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="dueno@ejemplo.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dirección (Opcional)
                </label>
                <input
                  type="text"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                  placeholder="Calle, Número, Colonia"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notas Médicas / Alergias
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alergias a medicamentos, comportamiento o datos relevantes..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : editingPet ? 'Guardar Cambios' : 'Registrar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
