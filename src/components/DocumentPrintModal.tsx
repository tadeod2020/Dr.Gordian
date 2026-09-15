import React from 'react';
import type { LegalDocumentTemplate, ClinicSettings } from '../types/veterinary';

interface DocumentPrintModalProps {
  document: LegalDocumentTemplate;
  clinicSettings: ClinicSettings;
  onClose: () => void;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({
  document: doc,
  clinicSettings,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const paragraphs = doc.content.split('\n').filter((p) => p.trim());

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md overflow-y-auto p-4 sm:p-8">
      {/* Non-printable action header toolbar */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between p-4 bg-slate-800 text-white rounded-2xl shadow-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold">{doc.title}</h3>
            <p className="text-xs text-slate-400">Vista Previa de Impresión • {clinicSettings.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            Imprimir Documento / Guardar PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-10 border border-slate-200 rounded-xl shadow-2xl print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-900 pb-3 mb-6">
          <img src="/logo-transparent.png" alt="Dr. Gordian Logo" className="h-12 w-auto object-contain" />
          <div className="text-right">
            <h1 className="text-xl font-black text-blue-900 tracking-tight uppercase">
              {clinicSettings.name}
            </h1>
            <p className="text-xs text-blue-600 font-bold mt-0.5">
              {clinicSettings.subtitle}
            </p>
          </div>
        </div>

        {/* Document Title */}
        <h2 className="text-base font-bold text-slate-900 text-center uppercase tracking-wide border-b border-slate-300 pb-2 mb-6">
          {doc.title}
        </h2>

        {/* Content Paragraphs */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-800 text-justify">
          {paragraphs.map((p, idx) => {
            const isHeading = p.toUpperCase() === p && p.length < 50;
            const isClause = p.startsWith('PRIMERA') || p.startsWith('SEGUNDA') || p.startsWith('TERCERA') || p.startsWith('I.-') || p.startsWith('II.-');

            if (isHeading) {
              return (
                <h3 key={idx} className="text-xs font-bold text-blue-900 uppercase bg-slate-100 p-1.5 rounded text-center my-3">
                  {p}
                </h3>
              );
            }

            return (
              <p key={idx} className={isClause ? 'font-semibold text-slate-900 mt-2' : ''}>
                {p}
              </p>
            );
          })}
        </div>

        {/* Signature & Stamp Section */}
        <div className="mt-12 pt-6 border-t border-slate-300 flex justify-around items-end text-center print:page-break-inside-avoid">
          <div className="w-5/12 border-t border-slate-900 pt-2">
            <p className="text-xs font-bold text-slate-900">EL PROFESIONISTA / VETERINARIO</p>
            <p className="text-[11px] text-slate-600">{clinicSettings.vetDirector}</p>
          </div>

          <div className="w-5/12 border-t border-slate-900 pt-2">
            <p className="text-xs font-bold text-slate-900">EL CLIENTE / PROPIETARIO</p>
            <p className="text-[11px] text-slate-600">Firma de Conformidad</p>
          </div>
        </div>
      </div>
    </div>
  );
};
