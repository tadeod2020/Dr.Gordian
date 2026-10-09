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
    <div className="print-modal-container fixed inset-0 z-50 bg-white dark:bg-slate-900 overflow-y-auto p-8 print:p-0 print:bg-white print:static print:overflow-visible print:block">
      {/* Non-printable action header */}
      <div className="no-print print:hidden max-w-4xl mx-auto mb-6 flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Vista Previa de Impresión - Ficha Médica de {pet.name} ({clinicSettings.name})
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Documento / PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="printable-sheet max-w-4xl mx-auto bg-white text-slate-900 p-6 sm:p-8 border border-slate-300 rounded-lg shadow-sm print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:rounded-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-900 pb-2 mb-3">
          <div className="flex items-center gap-3">
            <img src="/logo-transparent.png" alt="Dr. Gordian Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-base font-black text-blue-900 tracking-tight uppercase leading-none">
                {clinicSettings.name}
              </h1>
              <p className="text-[11px] text-blue-700 font-bold mt-0.5 leading-tight">
                {clinicSettings.subtitle} • Tel: {clinicSettings.phone}{clinicSettings.whatsapp ? ` • WA: ${clinicSettings.whatsapp}` : ''}
              </p>
              <p className="text-[9px] text-slate-500 font-medium leading-tight">{clinicSettings.address}</p>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-500 leading-tight">
            <p className="font-bold text-slate-800">Fecha de Expedición</p>
            <p>{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Pet & Owner Specs Table */}
        <div className="grid grid-cols-2 gap-4 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 avoid-break print:bg-slate-50">
          <div>
            <h3 className="text-[10px] font-bold uppercase text-blue-900 tracking-wider mb-1">
              Datos del Paciente
            </h3>
            <div className="space-y-0.5 text-[10px] leading-tight">
              <p><strong className="text-slate-700">Nombre:</strong> {pet.name}</p>
              <p><strong className="text-slate-700">Especie:</strong> {pet.species} ({pet.breed})</p>
              <p><strong className="text-slate-700">Género:</strong> {pet.gender}</p>
              <p><strong className="text-slate-700">Edad:</strong> {pet.ageYears !== undefined || pet.ageMonths !== undefined ? `${pet.ageYears ?? 0} años ${pet.ageMonths ?? 0} meses` : 'N/A'}</p>
              <p><strong className="text-slate-700">Peso:</strong> {pet.weightKg !== undefined && pet.weightKg > 0 ? `${pet.weightKg} kg` : 'N/A'}</p>
              <p><strong className="text-slate-700">Nº Microchip:</strong> {pet.chipNumber || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase text-blue-900 tracking-wider mb-1">
              Datos del Propietario
            </h3>
            <div className="space-y-0.5 text-[10px] leading-tight">
              <p><strong className="text-slate-700">Nombre:</strong> {pet.ownerName}</p>
              <p><strong className="text-slate-700">Teléfono:</strong> {pet.ownerPhone}</p>
              <p><strong className="text-slate-700">Correo:</strong> {pet.ownerEmail || 'N/A'}</p>
              <p><strong className="text-slate-700">Dirección:</strong> {pet.ownerAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Vaccine History Table */}
        <div className="mb-3 avoid-break">
          <h3 className="text-[10px] font-bold uppercase text-blue-900 tracking-wider mb-1.5">
            Carnet de Vacunación & Desparasitaciones
          </h3>
          <table className="w-full text-left text-[10px] leading-tight border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="p-1 px-1.5 border-r border-slate-300">Vacuna / Tratamiento</th>
                <th className="p-1 px-1.5 border-r border-slate-300">Fecha Aplicación</th>
                <th className="p-1 px-1.5 border-r border-slate-300">Próximo Refuerzo</th>
                <th className="p-1 px-1.5 border-r border-slate-300">Lote</th>
                <th className="p-1 px-1.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {petVaccines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-1.5 text-center text-slate-500 italic">
                    Sin vacunas registradas
                  </td>
                </tr>
              ) : (
                petVaccines.map((v) => (
                  <tr key={v.id} className="border-b border-slate-200">
                    <td className="p-1 px-1.5 border-r border-slate-200 font-semibold">{v.vaccineName}</td>
                    <td className="p-1 px-1.5 border-r border-slate-200">{v.appliedDate}</td>
                    <td className="p-1 px-1.5 border-r border-slate-200 font-bold text-blue-800">{v.nextDueDate}</td>
                    <td className="p-1 px-1.5 border-r border-slate-200">{v.batchNumber || '-'}</td>
                    <td className="p-1 px-1.5 font-bold">{v.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clinical History Table */}
        <div className="mb-4 avoid-break">
          <h3 className="text-[10px] font-bold uppercase text-blue-900 tracking-wider mb-1.5">
            Historial de Consultas Médicas
          </h3>
          <table className="w-full text-left text-[10px] leading-tight border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="p-1 px-1.5 border-r border-slate-300">Fecha</th>
                <th className="p-1 px-1.5 border-r border-slate-300">Motivo</th>
                <th className="p-1 px-1.5 border-r border-slate-300">Diagnóstico</th>
                <th className="p-1 px-1.5 border-r border-slate-300">Tratamiento</th>
                <th className="p-1 px-1.5">Veterinario</th>
              </tr>
            </thead>
            <tbody>
              {petVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-1.5 text-center text-slate-500 italic">
                    Sin consultas registradas
                  </td>
                </tr>
              ) : (
                petVisits.map((v) => (
                  <tr key={v.id} className="border-b border-slate-200">
                    <td className="p-1 px-1.5 border-r border-slate-200">{v.date}</td>
                    <td className="p-1 px-1.5 border-r border-slate-200 font-semibold">{v.reason}</td>
                    <td className="p-1 px-1.5 border-r border-slate-200">{v.diagnosis}</td>
                    <td className="p-1 px-1.5 border-r border-slate-200">
                      {v.treatment}
                      {v.images && v.images.length > 0 && (
                        <div className="flex gap-1.5 mt-1 no-print print:hidden">
                          {v.images.map((img, i) => (
                            <img key={i} src={img} alt="Evidencia" className="w-10 h-10 rounded object-cover border border-slate-300" />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-1 px-1.5">{v.vetName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature & Stamp Section */}
        <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between items-end avoid-break signature-block">
          <div className="text-[9px] text-slate-500 leading-tight">
            <p className="font-bold text-slate-900">{clinicSettings.name}</p>
            <p>{clinicSettings.subtitle}</p>
          </div>

          <div className="text-center w-52 border-t border-slate-800 pt-1">
            <p className="text-[11px] font-bold text-slate-900">{clinicSettings.vetDirector}</p>
            <p className="text-[9px] text-slate-500">Firma Médico Veterinario</p>
          </div>
        </div>
      </div>
    </div>
  );
};
