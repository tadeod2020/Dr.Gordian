import React, { useState } from 'react';
import type { ClinicSettings } from '../types/veterinary';
import { QrCode, Printer, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface PrivacyQRModalProps {
  clinicSettings: ClinicSettings;
  onClose: () => void;
}

export const PrivacyQRModal: React.FC<PrivacyQRModalProps> = ({ clinicSettings, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Dynamic public URL (defaults to production URL or window origin)
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drgordian.vercel.app';
  const privacyUrl = `${originUrl}/?doc=privacy`;

  // QR API Image URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(privacyUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(privacyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintSign = () => {
    window.print();
  };

  return (
    <div className="print-modal-container fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md overflow-y-auto p-4 sm:p-8 print:p-0 print:bg-white print:static print:overflow-visible print:block">
      {/* Action Header Bar (Hidden during print) */}
      <div className="no-print print:hidden max-w-2xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800 text-white rounded-2xl shadow-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Código QR del Aviso de Privacidad</h3>
            <p className="text-xs text-slate-400">Escaneable por clientes en recepción</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar Enlace'}
          </button>
          <button
            onClick={handlePrintSign}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir Letrero
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Poster Sheet for Clinic Reception */}
      <div className="printable-sheet max-w-2xl mx-auto bg-white text-slate-900 p-8 sm:p-12 border border-slate-200 rounded-2xl shadow-2xl print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:rounded-none text-center">
        {/* Clinic Header */}
        <div className="flex flex-col items-center border-b-2 border-blue-900 pb-6 mb-6">
          <img src="/logo-transparent.png" alt="Dr. Gordian Logo" className="h-16 w-auto object-contain mb-2" />
          <h1 className="text-2xl font-black text-blue-900 tracking-tight uppercase leading-tight">
            {clinicSettings.name}
          </h1>
          <p className="text-xs text-blue-700 font-bold mt-1">
            {clinicSettings.subtitle}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {clinicSettings.address} • Tel: {clinicSettings.phone}{clinicSettings.whatsapp ? ` • WA: ${clinicSettings.whatsapp}` : ''}
          </p>
        </div>

        {/* QR Badge & Title */}
        <div className="space-y-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-extrabold uppercase tracking-wider border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Aviso de Privacidad Oficial
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ¡Escanea con tu Celular!
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Apunta la cámara de tu dispositivo móvil hacia el código QR para consultar nuestro Aviso de Privacidad y la protección de tus datos personales.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="my-6 p-6 bg-slate-50 border-2 border-dashed border-blue-200 rounded-3xl inline-block shadow-inner">
          <img
            src={qrImageUrl}
            alt="Código QR Aviso de Privacidad"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl shadow-md border border-slate-300"
          />
        </div>

        {/* URL Text & Direct Link */}
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
          <p className="text-[11px] font-semibold text-slate-500">
            O accede directamente desde tu navegador en:
          </p>
          <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-blue-900">
            {privacyUrl}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-medium">
          {clinicSettings.name} • {clinicSettings.vetDirector} • Cumplimiento Ley de Protección de Datos
        </div>
      </div>
    </div>
  );
};
