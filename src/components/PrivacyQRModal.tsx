import React, { useState, useEffect } from 'react';
import type { ClinicSettings } from '../types/veterinary';
import { QrCode, Printer, Copy, Check, X, ShieldCheck, Download } from 'lucide-react';
import QRCode from 'qrcode';

interface PrivacyQRModalProps {
  clinicSettings: ClinicSettings;
  onClose: () => void;
}

export const PrivacyQRModal: React.FC<PrivacyQRModalProps> = ({ clinicSettings, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Public URL: when running from a local file (offline copy) always point the QR to production
  const originUrl =
    typeof window !== 'undefined' && window.location.protocol.startsWith('http')
      ? window.location.origin
      : 'https://drgordian.vercel.app';
  const privacyUrl = `${originUrl}/?doc=privacy`;

  // 100% Offline Base64 QR Data URL generation
  useEffect(() => {
    QRCode.toDataURL(privacyUrl, {
      width: 600,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error('Error generating offline QR:', err);
        // Fallback API if QRCode generation fails
        setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(privacyUrl)}`);
      });
  }, [privacyUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(privacyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR_Aviso_Privacidad_${clinicSettings.name.replace(/\s+/g, '_')}.png`;
    link.click();
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
            <h3 className="text-sm font-bold text-white">Código QR Imprimible del Aviso de Privacidad</h3>
            <p className="text-xs text-slate-400">Listo para imprimir o descargar como letrero</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar Enlace'}
          </button>
          
          <button
            onClick={handleDownloadQR}
            className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            Descargar Imagen
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
        <div className="flex flex-col items-center border-b-2 border-blue-900 pb-4 mb-4">
          <img src="./logo-transparent.png" alt="Dr. Gordian Logo" className="h-14 w-auto object-contain mb-2 print:h-12" />
          <h1 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight uppercase leading-tight">
            {clinicSettings.name}
          </h1>
          <p className="text-xs text-blue-700 font-bold mt-1">
            {clinicSettings.subtitle}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {clinicSettings.address} • Tel: {clinicSettings.phone}{clinicSettings.whatsapp ? ` • WA: ${clinicSettings.whatsapp}` : ''}
          </p>
        </div>

        {/* QR Badge & Title */}
        <div className="space-y-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-extrabold uppercase tracking-wider border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Aviso de Privacidad Oficial
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            ¡Escanea con tu Celular!
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Apunta la cámara de tu dispositivo móvil hacia el código QR para consultar nuestro Aviso de Privacidad y la protección de tus datos personales.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="my-4 p-5 bg-slate-50 border-2 border-dashed border-blue-300 rounded-3xl inline-block shadow-inner print:bg-white print:border-solid print:p-2">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Código QR Aviso de Privacidad"
              className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-xl shadow-md border border-slate-300 print:w-56 print:h-56 print:shadow-none"
            />
          ) : (
            <div className="w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center bg-slate-100 text-xs font-bold text-slate-400">
              Generando QR...
            </div>
          )}
        </div>

        {/* URL Text & Direct Link */}
        <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-500">
            O accede directamente desde tu navegador en:
          </p>
          <div className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-blue-900 print:bg-slate-50">
            {privacyUrl}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-200 text-[9px] text-slate-400 font-medium">
          {clinicSettings.name} • {clinicSettings.vetDirector} • Cumplimiento Ley Federal de Protección de Datos Personales
        </div>
      </div>
    </div>
  );
};
