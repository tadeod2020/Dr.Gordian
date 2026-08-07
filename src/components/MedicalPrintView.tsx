import React from 'react';
import type { Pet, VisitRecord, VaccineRecord, ClinicSettings } from '../types/veterinary';

interface MedicalPrintViewProps {
  pet: Pet | null;
  visits: VisitRecord[];
  vaccines: VaccineRecord[];
  clinicSettings: ClinicSettings;
  onClose: () => void;
}

export const MedicalPrintView: React.FC<MedicalPrintViewProps> = ({
  pet,
  visits,
  vaccines,
  clinicSettings,
  onClose
}) => {
  if (!pet) return null;

  const petVisits = visits.filter((v) => v.petId === pet.id);
  const petVaccines = vaccines.filter((v) => v.petId === pet.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 overflow-y-auto p-8">
      {/* Non-printable action header */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Vista Previa de Impresión - Ficha Médica de {clinicSettings.name}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            Volver
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
          >
            Imprimir Documento
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 border border-slate-300 rounded-lg shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-600 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-blue-900 tracking-tight uppercase">
              {clinicSettings.name}
            </h1>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              {clinicSettings.subtitle} • Tel: {clinicSettings.phone}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">{clinicSettings.address}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-bold text-slate-800">Fecha de Expedición</p>
            <p>{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Pet & Owner Specs Table */}
        <div className="grid grid-cols-2 gap-6 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <h3 className="text-xs font-bold uppercase text-blue-800 tracking-wider mb-2">
              Datos del Paciente
            </h3>
            <div className="space-y-1 text-xs">
              <p><strong className="text-slate-700">Nombre:</strong> {pet.name}</p>
              <p><strong className="text-slate-700">Especie:</strong> {pet.species} ({pet.breed})</p>
              <p><strong className="text-slate-700">Género:</strong> {pet.gender}</p>
              <p><strong className="text-slate-700">Edad:</strong> {pet.ageYears !== undefined || pet.ageMonths !== undefined ? `${pet.ageYears ?? 0} años ${pet.ageMonths ?? 0} meses` : 'N/A'}</p>
              <p><strong className="text-slate-700">Peso:</strong> {pet.weightKg !== undefined && pet.weightKg > 0 ? `${pet.weightKg} kg` : 'N/A'}</p>
              <p><strong className="text-slate-700">Nº Microchip:</strong> {pet.chipNumber || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-blue-800 tracking-wider mb-2">
              Datos del Propietario
            </h3>
            <div className="space-y-1 text-xs">
              <p><strong className="text-slate-700">Nombre:</strong> {pet.ownerName}</p>
              <p><strong className="text-slate-700">Teléfono:</strong> {pet.ownerPhone}</p>
              <p><strong className="text-slate-700">Correo:</strong> {pet.ownerEmail || 'N/A'}</p>
              <p><strong className="text-slate-700">Dirección:</strong> {pet.ownerAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Vaccine History Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase text-blue-800 tracking-wider mb-3">
            Carnet de Vacunación & Desparasitaciones
          </h3>
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="p-2 border-r border-slate-300">Vacuna / Tratamiento</th>
                <th className="p-2 border-r border-slate-300">Fecha Aplicación</th>
                <th className="p-2 border-r border-slate-300">Próximo Refuerzo</th>
                <th className="p-2 border-r border-slate-300">Lote</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {petVaccines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-slate-500 italic">
                    Sin vacunas registradas
                  </td>
                </tr>
              ) : (
                petVaccines.map((v) => (
                  <tr key={v.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 font-semibold">{v.vaccineName}</td>
                    <td className="p-2 border-r border-slate-200">{v.appliedDate}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-blue-700">{v.nextDueDate}</td>
                    <td className="p-2 border-r border-slate-200">{v.batchNumber || '-'}</td>
                    <td className="p-2 font-bold">{v.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clinical History Table */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase text-blue-800 tracking-wider mb-3">
            Historial de Consultas Médicas
          </h3>
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="p-2 border-r border-slate-300">Fecha</th>
                <th className="p-2 border-r border-slate-300">Motivo</th>
                <th className="p-2 border-r border-slate-300">Diagnóstico</th>
                <th className="p-2 border-r border-slate-300">Tratamiento</th>
                <th className="p-2">Veterinario</th>
              </tr>
            </thead>
            <tbody>
              {petVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-slate-500 italic">
                    Sin consultas registradas
                  </td>
                </tr>
              ) : (
                petVisits.map((v) => (
                  <tr key={v.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200">{v.date}</td>
                    <td className="p-2 border-r border-slate-200 font-semibold">{v.reason}</td>
                    <td className="p-2 border-r border-slate-200">{v.diagnosis}</td>
                    <td className="p-2 border-r border-slate-200">
                      {v.treatment}
                      {v.images && v.images.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {v.images.map((img, i) => (
                            <img key={i} src={img} alt="Evidencia" className="w-12 h-12 rounded object-cover border border-slate-300" />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-2">{v.vetName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature & Stamp Section */}
        <div className="mt-12 pt-8 border-t border-slate-300 flex justify-between items-end">
          <div className="text-[10px] text-slate-500">
            <p className="font-bold">{clinicSettings.name}</p>
            <p>{clinicSettings.subtitle}</p>
          </div>

          <div className="text-center w-52 border-t border-slate-800 pt-1">
            <p className="text-xs font-bold text-slate-900">{clinicSettings.vetDirector}</p>
            <p className="text-[10px] text-slate-500">Firma Médico Veterinario</p>
          </div>
        </div>
      </div>
    </div>
  );
};
