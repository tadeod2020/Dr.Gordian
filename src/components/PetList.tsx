import React, { useState } from 'react';
import type { Pet } from '../types/veterinary';
import { MagicCard } from './magicui/MagicCard';
import { ShimmerButton } from './magicui/ShimmerButton';

import { 
  Dog, 
  Cat, 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Phone, 
  Calendar, 
  Scale, 
  FileText, 
  Trash2, 
  Edit3,
  Stethoscope
} from 'lucide-react';

interface PetListProps {
  pets: Pet[];
  speciesFilter: 'all' | 'Perro' | 'Gato';
  setSpeciesFilter: (filter: 'all' | 'Perro' | 'Gato') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenAddPetModal: () => void;
  onSelectPet: (pet: Pet) => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (petId: number) => void;
  onAddVisitForPet: (pet: Pet) => void;
}

export const PetList: React.FC<PetListProps> = ({
  pets,
  speciesFilter,
  setSpeciesFilter,
  searchTerm,
  setSearchTerm,
  onOpenAddPetModal,
  onSelectPet,
  onEditPet,
  onDeletePet,
  onAddVisitForPet
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter logic
  const filteredPets = pets.filter((pet) => {
    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;
    const term = searchTerm.toLowerCase().trim();
    const nameMatch = (pet.name || '').toLowerCase().includes(term);
    const breedMatch = (pet.breed || '').toLowerCase().includes(term);
    const ownerMatch = (pet.ownerName || '').toLowerCase().includes(term);
    const chipMatch = pet.chipNumber ? (pet.chipNumber || '').toLowerCase().includes(term) : false;
    const matchesSearch = !term || nameMatch || breedMatch || ownerMatch || chipMatch;

    return matchesSpecies && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm">
        {/* Species Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setSpeciesFilter('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              speciesFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Todos ({pets.length})
          </button>
          <button
            onClick={() => setSpeciesFilter('Perro')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              speciesFilter === 'Perro'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-sky-600'
            }`}
          >
            <Dog className="w-3.5 h-3.5" />
            <span>Perros ({pets.filter((p) => p.species === 'Perro').length})</span>
          </button>
          <button
            onClick={() => setSpeciesFilter('Gato')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              speciesFilter === 'Gato'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Cat className="w-3.5 h-3.5" />
            <span>Gatos ({pets.filter((p) => p.species === 'Gato').length})</span>
          </button>
        </div>

        {/* Right view switcher & add button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-slate-700 dark:text-slate-300 transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
              title="Vista en Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-slate-700 dark:text-slate-300 transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-xs' : 'opacity-60 hover:opacity-100'
              }`}
              title="Vista en Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <ShimmerButton
            onClick={onOpenAddPetModal}
            className="flex items-center gap-1.5 px-4 py-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Registrar</span>
          </ShimmerButton>
        </div>
      </div>

      {/* Search results banner if searching */}
      {searchTerm && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
          <span>
            Resultados de búsqueda para: <strong className="text-slate-900 dark:text-white">"{searchTerm}"</strong>
          </span>
          <button onClick={() => setSearchTerm('')} className="text-blue-600 hover:underline font-bold">
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredPets.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No se encontraron mascotas</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              No hay registros que coincidan con la búsqueda o filtro actual.
            </p>
          </div>
          <button
            onClick={onOpenAddPetModal}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Paciente Ahora</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (Apple Clean White Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <MagicCard
              key={pet.id}
              className="group flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
            >
              <div>
                {/* Card Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={pet.avatarUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Species Badge Top Left */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                        pet.species === 'Perro'
                          ? 'bg-sky-500 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {pet.species === 'Perro' ? <Dog className="w-3.5 h-3.5" /> : <Cat className="w-3.5 h-3.5" />}
                      <span>{pet.species}</span>
                    </span>
                  </div>

                  {/* Weight Pill Top Right */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                    <Scale className="w-3 h-3 text-sky-300" />
                    <span>{pet.weightKg !== undefined && pet.weightKg > 0 ? `${pet.weightKg} kg` : 'Sin peso'}</span>
                  </div>

                  {/* Pet Name & Breed Bottom Left */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight drop-shadow-sm">{pet.name}</h3>
                    <p className="text-xs text-slate-200 font-medium">{pet.breed} • {pet.gender}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Edad</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {pet.ageYears !== undefined || pet.ageMonths !== undefined
                            ? `${pet.ageYears ?? 0}a ${pet.ageMonths ?? 0}m`
                            : 'Sin edad'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Microchip</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {pet.chipNumber || 'Sin chip'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Owner info box */}
                  <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-700/40 border border-blue-100 dark:border-slate-700 space-y-1">
                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      Propietario
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{pet.ownerName}</p>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>{pet.ownerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700/60 mt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectPet(pet)}
                  className="flex-1 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Ficha</span>
                </button>

                <button
                  onClick={() => onAddVisitForPet(pet)}
                  className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                  title="Nueva Consulta"
                >
                  <Stethoscope className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEditPet(pet)}
                  className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  title="Editar Mascota"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => pet.id && onDeletePet(pet.id)}
                  className="p-2 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                  title="Eliminar Mascota"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </MagicCard>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/60">
                  <th className="py-3.5 px-4">Mascota</th>
                  <th className="py-3.5 px-4">Especie / Raza</th>
                  <th className="py-3.5 px-4">Edad / Peso</th>
                  <th className="py-3.5 px-4">Dueño</th>
                  <th className="py-3.5 px-4">Teléfono</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                {filteredPets.map((pet) => (
                  <tr
                    key={pet.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pet.avatarUrl}
                          alt={pet.name}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{pet.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{pet.chipNumber || 'Sin chip'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            pet.species === 'Perro'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {pet.species}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{pet.breed}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {pet.ageYears !== undefined || pet.ageMonths !== undefined ? `${pet.ageYears ?? 0}a ${pet.ageMonths ?? 0}m` : 'N/A'} • <span className="font-bold text-slate-900 dark:text-white">{pet.weightKg !== undefined && pet.weightKg > 0 ? `${pet.weightKg} kg` : 'Sin peso'}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {pet.ownerName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {pet.ownerPhone}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectPet(pet)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xs"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => onEditPet(pet)}
                          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => pet.id && onDeletePet(pet.id)}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
