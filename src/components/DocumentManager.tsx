import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { INITIAL_LEGAL_DOCUMENTS } from '../data/legalDocuments';
import type { LegalDocumentTemplate, DocumentCategory, Pet, ClinicSettings } from '../types/veterinary';
import { DocumentEditorModal } from './DocumentEditorModal';
import { DocumentPrintModal } from './DocumentPrintModal';
import { MagicCard } from './magicui/MagicCard';
import { FileText, Search, Edit3, Printer, CheckCircle, Sparkles } from 'lucide-react';

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
    <div className="space-y-6 animate-slide-up max-w-7xl mx-auto">
      {/* Main Document Manager UI (hidden when printing) */}
      <div className="no-print space-y-6">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 overflow-hidden relative">
          <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none">
            <FileText className="w-80 h-80 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Módulo Oficial Dr. Gordian
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Documentos & Contratos Legales
            </h1>
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
              Accede a las 13 plantillas oficiales de la clínica. Puedes modificarlas en tiempo real, autocompletar datos de tus pacientes e imprimirlos o guardarlos como PDF directamente.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 p-1.5 rounded-2xl w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => {
            const isCustomized = customDocsList.some((c) => c.id === doc.id);

            return (
              <MagicCard
                key={doc.id}
                className="p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-[11px] font-bold uppercase tracking-wider">
                      {doc.category}
                    </span>
                    {isCustomized && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Personalizado
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4 line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setEditingDoc(doc)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Modificar
                  </button>

                  <button
                    onClick={() => setPrintingDoc(doc)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimir / PDF
                  </button>
                </div>
              </MagicCard>
            );
          })}
        </div>
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
