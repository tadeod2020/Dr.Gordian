import React, { useState } from 'react';
import type { ClinicSettings } from '../types/veterinary';
import { ShieldCheck, ArrowLeft, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface PrivacyPublicViewProps {
  clinicSettings: ClinicSettings;
  onBackToApp?: () => void;
}

export const PrivacyPublicView: React.FC<PrivacyPublicViewProps> = ({ clinicSettings, onBackToApp }) => {
  const [activeTab, setActiveTab] = useState<'integral' | 'resumido'>('integral');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">{clinicSettings.name}</h1>
              <p className="text-xs text-slate-400">Aviso Oficial de Privacidad</p>
            </div>
          </div>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Sistema
            </button>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-900 p-5 rounded-3xl border border-blue-500/30 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-400/30">
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              Protección de Datos Personales
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Aviso de Privacidad & Salvaguarda
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              En {clinicSettings.name} protegemos tus datos personales y los de tu mascota conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('integral')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'integral'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Versión Integral (Completa)
          </button>
          <button
            onClick={() => setActiveTab('resumido')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'resumido'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Versión Resumida
          </button>
        </div>

        {/* Privacy Notice Document View */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm">
          {activeTab === 'integral' ? (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-base font-extrabold text-white">1. Identidad y Domicilio del Responsable</h3>
                <p className="mt-1">
                  <strong className="text-white">{clinicSettings.name}</strong>, con domicilio en {clinicSettings.address}, es responsable del tratamiento y protección de sus datos personales y los de sus mascotas de conformidad con la legislación aplicable.
                </p>
              </div>

              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-base font-extrabold text-white">2. Datos Personales Recabados</h3>
                <p className="mt-1">
                  Para brindar nuestros servicios médico-veterinarios, registro de expedientes clínicos, cartillas de vacunación y seguimiento médico, recabamos los siguientes datos:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                  <li>Nombre completo del propietario o responsable.</li>
                  <li>Teléfono de contacto ({clinicSettings.phone}).</li>
                  <li>Correo electrónico ({clinicSettings.email || 'N/A'}).</li>
                  <li>Dirección particular.</li>
                  <li>Datos clínicos, especie, raza y antecedentes de la mascota.</li>
                </ul>
              </div>

              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-base font-extrabold text-white">3. Finalidades del Tratamiento</h3>
                <p className="mt-1">
                  Los datos personales que recabamos son utilizados exclusivamente para:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                  <li>Integración y consulta de expedientes clínicos veterinarios.</li>
                  <li>Recordatorios de citas, consultas de seguimiento y esquemas de vacunación.</li>
                  <li>Emisión de recetas médicas, certificados de salud y comprobantes de atención.</li>
                  <li>Contacto de emergencia en procedimientos ambulatorios, quirúrgicos o de hospitalización.</li>
                </ul>
              </div>

              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-base font-extrabold text-white">4. Derechos ARCO y Revocación del Consentimiento</h3>
                <p className="mt-1">
                  Usted tiene derecho a conocer qué datos personales tenemos, para qué los utilizamos y las condiciones de su uso (Acceso). Asimismo, es su derecho solicitar la corrección de su información (Rectificación), su eliminación (Cancelación) u oponerse al uso de los mismos (Oposición).
                </p>
                <p className="mt-2 text-slate-400">
                  Para el ejercicio de cualquiera de los derechos ARCO, puede presentar la solicitud correspondiente en la recepción de nuestra clínica o enviando un correo a <strong className="text-white">{clinicSettings.email || clinicSettings.phone}</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">5. Transferencia de Datos</h3>
                <p className="mt-1 text-slate-400">
                  Sus datos personales no serán compartidos ni transferidos con terceros o empresas externas sin su previo consentimiento explícito, salvo los requerimientos estipulados por autoridades sanitarias o de salud animal.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h3 className="text-base font-extrabold text-white">AVISO DE PRIVACIDAD (VERSIÓN RESUMIDA)</h3>
              <p>
                <strong className="text-white">{clinicSettings.name}</strong> es responsable del tratamiento de sus datos personales, los cuales se utilizarán para la identificación, integración de expediente clínico veterinario de su mascota, contacto para dar seguimiento a tratamientos médicos, agendar citas y emisión de comprobantes de pago.
              </p>
              <p className="text-slate-400">
                Para conocer nuestro aviso de privacidad integral con el detalle completo de las finalidades y sus derechos ARCO, puede solicitar la versión impresa en la recepción de nuestro consultorio o consultarla en este mismo portal.
              </p>
            </div>
          )}
        </div>

        {/* Contact Info Footer */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Tel: {clinicSettings.phone}</span>
            </div>
            {clinicSettings.whatsapp && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WA: {clinicSettings.whatsapp}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{clinicSettings.address}</span>
            </div>
          </div>
          <div className="text-slate-500 font-semibold text-[11px]">
            {clinicSettings.name} • {clinicSettings.vetDirector}
          </div>
        </div>
      </main>
    </div>
  );
};
