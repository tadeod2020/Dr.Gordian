import React, { useState, useEffect } from 'react';
import type { CloudConfig, ClinicSettings } from '../types/veterinary';
import { supabase } from '../lib/supabase';
import { 
  X, 
  Cloud, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Server, 
  Laptop, 
  Tablet,
  Sparkles,
  Building2,
  Phone,
  MapPin,
  UserCheck
} from 'lucide-react';

interface CloudSyncSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: CloudConfig;
  clinicSettings: ClinicSettings;
  onSaveConfig: (newConfig: CloudConfig) => Promise<void>;
  onSaveClinicSettings: (newSettings: ClinicSettings) => Promise<void>;
  onTriggerSync: () => Promise<void>;
  onExportBackup: () => Promise<void>;
  onImportBackup: (jsonData: string) => Promise<void>;
}

export const CloudSyncSettings: React.FC<CloudSyncSettingsProps> = ({
  isOpen,
  onClose,
  config,
  clinicSettings,
  onSaveConfig,
  onSaveClinicSettings,
  onTriggerSync,
  onExportBackup,
  onImportBackup
}) => {
  const [activeTab, setActiveTab] = useState<'clinic' | 'cloud'>('clinic');

  // Clinic Personalization State
  const [clinicName, setClinicName] = useState(clinicSettings.name || 'Dr. Gordian');
  const [subtitle, setSubtitle] = useState(clinicSettings.subtitle || 'Clínica Veterinaria & Registro Perros/Gatos');
  const [phone, setPhone] = useState(clinicSettings.phone || '687-24-70');
  const [whatsapp, setWhatsapp] = useState(clinicSettings.whatsapp || '664 673 9950');
  const [email, setEmail] = useState(clinicSettings.email || 'contacto@drgordian.com');
  const [address, setAddress] = useState(clinicSettings.address || 'Calle 3ra. Carrillo Puerto No. 7081 Z. Centro frente a AutoZone Tijuana B.C.');
  const [vetDirector, setVetDirector] = useState(clinicSettings.vetDirector || 'Dr. Manuel Gordian Rueda');

  // Cloud Config State
  const [provider, setProvider] = useState<'supabase' | 'custom_api'>(config.provider);
  const [apiUrl, setApiUrl] = useState(config.apiUrl);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [enabled, setEnabled] = useState(config.enabled);

  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  useEffect(() => {
    if (clinicSettings) {
      setClinicName(clinicSettings.name);
      setSubtitle(clinicSettings.subtitle);
      setPhone(clinicSettings.phone);
      setWhatsapp(clinicSettings.whatsapp || '664 673 9950');
      setEmail(clinicSettings.email);
      setAddress(clinicSettings.address);
      setVetDirector(clinicSettings.vetDirector);
    }
  }, [clinicSettings]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestSuccess(null);
    try {
      const { error } = await supabase.from('pets').select('id').limit(1);
      setTesting(false);
      if (!error) {
        setTestSuccess(true);
      } else {
        console.error('Connection test error:', error);
        setTestSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setTesting(false);
      setTestSuccess(false);
    }
  };

  const handleSave = async () => {
    // Save Clinic Customization
    await onSaveClinicSettings({
      ...clinicSettings,
      name: clinicName || 'Dr. Gordian',
      subtitle: subtitle || 'Clínica Veterinaria',
      phone,
      whatsapp,
      email,
      address,
      vetDirector
    });

    // Save Cloud Config
    await onSaveConfig({
      ...config,
      enabled,
      provider,
      apiUrl,
      apiKey,
      lastSyncedAt: new Date().toLocaleString()
    });

    onClose();
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncDone(false);
    await onTriggerSync();
    setSyncing(false);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        await onImportBackup(content);
        alert('¡Base de datos importada exitosamente!');
        onClose();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-apple-pop my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Personalización & Ajustes del Sistema
              </h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Dr. Gordian VET</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Toggle */}
        <div className="px-6 pt-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('clinic')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'clinic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Nombre & Datos de Clínica</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cloud')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'cloud'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Conexión Nube & Respaldos</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: CLINIC NAME & BRANDING CUSTOMIZATION */}
          {activeTab === 'clinic' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 space-y-1">
                <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Personalización del Nombre de la Veterinaria</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Cambia el nombre de tu clínica y datos de contacto. Se actualizarán en la barra lateral, certificados imprimibles e informes médicos.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Clínica Veterinaria *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600" />
                  <input
                    type="text"
                    required
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="Ej: Clínica Veterinaria San Francisco"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-sm font-extrabold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subtítulo / Eslogan de la Clínica
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ej: Registro Clínico de Perros y Gatos"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono Fijo
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="687-24-70"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número de WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="664 673 9950"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dirección Física
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Av. Las Palmas 102, Col. Centro"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Médico Veterinario Director / Cédula
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={vetDirector}
                    onChange={(e) => setVetDirector(e.target.value)}
                    placeholder="Dr. Gordian"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 focus:outline-none text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: CLOUD & BACKUPS */
            <div className="space-y-6">
              {/* Multi-Device Feature Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Acceso Multi-Dispositivo (Desktop & Tablets)</span>
                  </span>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Laptop className="w-4 h-4" />
                    <span className="text-xs font-bold">+</span>
                    <Tablet className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Conectado a tu proyecto real de Supabase en tiempo real.
                </p>
              </div>

              {/* Sync Trigger Action Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Sincronización Manual Inmediata
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Último respaldo: {config.lastSyncedAt || 'No realizado'}
                  </p>
                </div>

                <button
                  onClick={handleSyncNow}
                  disabled={syncing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Sincronizando...' : syncDone ? '¡Sincronizado!' : 'Sincronizar Nube'}</span>
                </button>
              </div>

              {/* Cloud API Configuration Form */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-600" />
                    <span>Parámetros de Servidor en la Nube</span>
                  </h4>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Proveedor de Nube
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value as 'supabase' | 'custom_api')}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-blue-600"
                    >
                      <option value="supabase">Supabase / PostgreSQL Cloud Database</option>
                      <option value="custom_api">Servidor REST API Personalizado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      URL del Proyecto / API Endpoint
                    </label>
                    <input
                      type="url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://su-proyecto.supabase.co"
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 text-xs text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Clave API Pública (Anon Key)
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 text-xs text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testing}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      {testing ? 'Verificando...' : 'Probar Conexión Nube'}
                    </button>

                    {testSuccess === true && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Conexión activa y funcionando</span>
                      </span>
                    )}
                    {testSuccess === false && (
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>Error al conectar con la Nube</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Backup JSON Import/Export Section */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Respaldo y Portabilidad de Datos (JSON)</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Exporta una copia de seguridad completa con todos los pacientes, consultas y vacunas para transferirla a otra computadora o tablet.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onExportBackup}
                    className="py-2.5 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 text-xs font-extrabold flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Respaldo</span>
                  </button>

                  <label className="py-2.5 px-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Importar Respaldo</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
