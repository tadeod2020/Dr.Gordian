import React, { useState } from 'react';
import type { LegalDocumentTemplate, ClinicSettings, Pet } from '../types/veterinary';

interface DocumentPrintModalProps {
  document: LegalDocumentTemplate;
  clinicSettings: ClinicSettings;
  pets?: Pet[];
  onClose: () => void;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  document: doc,
  clinicSettings,
  pets = [],
  onClose
}) => {
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [documentContent, setDocumentContent] = useState<string>(doc.content);

  const handlePrint = () => {
    window.print();
  };

  const handleApplyPet = (petIdStr: string) => {
    setSelectedPetId(petIdStr);
    if (!petIdStr) {
      setDocumentContent(doc.content);
      return;
    }

    const targetPet = pets.find((p) => String(p.id) === petIdStr);
    if (!targetPet) return;

    let updated = doc.content;
    updated = updated.replace(/\[Nombre del Cliente\]/g, targetPet.ownerName || '________________');
    updated = updated.replace(/\[Nombre de la Mascota\]/g, targetPet.name || '________________');
    updated = updated.replace(/\[Especie\]/g, targetPet.species || '________________');
    updated = updated.replace(/\[Raza\]/g, targetPet.breed || '________________');
    setDocumentContent(updated);
  };

  // Split lines while preserving empty line spacing
  const lines = documentContent.split('\n');

  return (
    <div className="print-modal-container fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md overflow-y-auto p-4 sm:p-8 print:p-0 print:bg-white print:static print:overflow-visible print:block">
      {/* Non-printable action header toolbar */}
      <div className="no-print print:hidden max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800 text-white rounded-2xl shadow-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{doc.title}</h3>
            <p className="text-xs text-slate-400">Vista Previa de Impresión • {clinicSettings.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {pets.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-700/60 px-3 py-1.5 rounded-xl border border-slate-600">
              <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Paciente:</span>
              <select
                value={selectedPetId}
                onChange={(e) => handleApplyPet(e.target.value)}
                className="bg-slate-800 text-white text-xs font-semibold rounded-lg px-2 py-1 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Sin Rellenar --</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} - Propietario: {p.ownerName})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Documento / PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet - Strictly formatted for clean paper printing */}
      <div className="printable-sheet max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 border border-slate-200 rounded-xl shadow-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:rounded-none">
        {/* Official Letterhead Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-900 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo-transparent.png" alt="Dr. Gordian Logo" className="h-14 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-black text-blue-900 tracking-tight uppercase">
                {clinicSettings.name}
              </h1>
              <p className="text-xs text-blue-700 font-bold mt-0.5">
                {clinicSettings.subtitle}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {clinicSettings.address} • Tel: {clinicSettings.phone}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-bold text-slate-800">Fecha de Expedición</p>
            <p className="text-slate-600">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Document Title */}
        <h2 className="text-base font-bold text-slate-900 text-center uppercase tracking-wide border-b border-slate-300 pb-2 mb-6">
          {doc.title}
        </h2>

        {/* Document Body Lines */}
        <div className="space-y-2.5 text-xs leading-relaxed text-slate-800 text-justify">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) {
              return <div key={idx} className="h-2" />;
            }

            const isMainHeading = trimmed.toUpperCase() === trimmed && trimmed.length < 55 && !trimmed.includes('____');
            const isClauseHeader = trimmed.startsWith('PRIMERA') || trimmed.startsWith('SEGUNDA') || trimmed.startsWith('TERCERA') || trimmed.startsWith('CUARTA') || trimmed.startsWith('I.-') || trimmed.startsWith('II.-') || trimmed.startsWith('D E C L A R A C I O N E S') || trimmed.startsWith('C L Á U S U L A S');

            if (isMainHeading) {
              return (
                <h3 key={idx} className="text-xs font-extrabold text-blue-950 uppercase text-center mt-4 mb-2 tracking-wide border-b border-slate-200 pb-1">
                  {trimmed}
                </h3>
              );
            }

            return (
              <p key={idx} className={isClauseHeader ? 'font-bold text-slate-900 mt-3' : 'text-slate-800'}>
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Signature & Stamp Section */}
        <div className="mt-14 pt-8 border-t border-slate-300 flex justify-between items-end text-center avoid-break print:page-break-inside-avoid signature-block">
          <div className="w-5/12 border-t border-slate-900 pt-2 text-center">
            <p className="text-xs font-bold text-slate-900">EL PROFESIONISTA / VETERINARIO</p>
            <p className="text-[11px] text-slate-600 mt-0.5">{clinicSettings.vetDirector}</p>
            <p className="text-[9px] text-slate-400 mt-1">Cédula y Firma Autorizada</p>
          </div>

          <div className="w-5/12 border-t border-slate-900 pt-2 text-center">
            <p className="text-xs font-bold text-slate-900">EL CLIENTE / PROPIETARIO</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Firma de Conformidad</p>
            <p className="text-[9px] text-slate-400 mt-1">Nombre y Firma del Propietario</p>
          </div>
        </div>
      </div>
    </div>
  );
};
