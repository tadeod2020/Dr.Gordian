import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { INITIAL_LEGAL_DOCUMENTS } from '../data/legalDocuments';
import type { LegalDocumentTemplate, DocumentCategory, Pet, ClinicSettings } from '../types/veterinary';
import { DocumentEditorModal } from './DocumentEditorModal';
import { DocumentPrintModal } from './DocumentPrintModal';

interface DocumentManagerProps {
  pets: Pet[];
  clinicSettings: ClinicSettings;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ pets, clinicSettings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'Todos'>('Todos');
  const [editingDoc, setEditingDoc] = useState<LegalDocumentTemplate | null>(null);
  const [printingDoc, setPrintingDoc] = useState<LegalDocumentTemplate | null>(null);

  // Load customized documents from Dexie IndexedDB
  const customDocsList = useLiveQuery(() => db.customDocuments.toArray(), []) || [];

  // Merge default templates with customized ones
  const documents: LegalDocumentTemplate[] = INITIAL_LEGAL_DOCUMENTS.map((defaultDoc) => {
    const custom = customDocsList.find((c) => c.id === defaultDoc.id);
    return custom ? custom : defaultDoc;
  });

  const categories: (DocumentCategory | 'Todos')[] = [
    'Todos',
    'Contratos',
    'Formatos Médicos',
    'Avisos de Privacidad',
    'Servicios',
    'Consentimientos'
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveDoc = async (updatedDoc: LegalDocumentTemplate) => {
    await db.customDocuments.put(updatedDoc);
    setEditingDoc(null);
  };

  const handleResetDoc = async (docId: string) => {
    await db.customDocuments.delete(docId);
    const defaultDoc = INITIAL_LEGAL_DOCUMENTS.find((d) => d.id === docId);
    if (defaultDoc) {
      setEditingDoc(defaultDoc);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider border border-blue-400/30 mb-3 inline-block">
            Módulo Oficial Dr. Gordian
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Documentos & Contratos Legales
          </h1>
          <p className="text-sm text-blue-100/90 font-medium">
            Accede a los 13 formatos oficiales de la clínica. Puedes modificarlos en tiempo real, autocompletar datos de tus pacientes e imprimirlos o guardarlos como PDF directamente.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocuments.map((doc) => {
          const isCustomized = customDocsList.some((c) => c.id === doc.id);

          return (
            <div
              key={doc.id}
              className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                    {doc.category}
                  </span>
                  {isCustomized && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      Personalizado
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors mb-1.5">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => setEditingDoc(doc)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modificar
                </button>

                <button
                  onClick={() => setPrintingDoc(doc)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir / PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {editingDoc && (
        <DocumentEditorModal
          document={editingDoc}
          pets={pets}
          onClose={() => setEditingDoc(null)}
          onSave={handleSaveDoc}
          onReset={handleResetDoc}
        />
      )}

      {/* Print View Modal */}
      {printingDoc && (
        <DocumentPrintModal
          document={printingDoc}
          clinicSettings={clinicSettings}
          onClose={() => setPrintingDoc(null)}
        />
      )}
    </div>
  );
};
