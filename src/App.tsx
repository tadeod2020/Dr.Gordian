import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, seedDatabase } from './db/database';
import type { Pet, VisitRecord, VaccineRecord, CloudConfig, UserSession, ClinicSettings } from './types/veterinary';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PetList } from './components/PetList';
import { PetModal } from './components/PetModal';
import { PetDetailModal } from './components/PetDetailModal';
import { VisitModal } from './components/VisitModal';
import { CloudSyncSettings } from './components/CloudSyncSettings';
import { MedicalPrintView } from './components/MedicalPrintView';
import { LoginModal } from './components/LoginModal';
import { DailyVisitsView } from './components/DailyVisitsView';
import { DocumentManager } from './components/DocumentManager';
import { InventoryManager } from './components/InventoryManager';
import { PrivacyPublicView } from './components/PrivacyPublicView';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pets' | 'daily-visits' | 'documents' | 'inventory'>('daily-visits');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'Perro' | 'Gato'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Privacy Public View state (triggered by ?doc=privacy or #privacidad URL)
  const [isPrivacyPublicView, setIsPrivacyPublicView] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get('doc') === 'privacy' || window.location.hash.includes('privacidad');
    }
    return false;
  });

  // Authentication & Session state (Always starts null on page reload)
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Modals state
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitPetTarget, setVisitPetTarget] = useState<Pet | null>(null);
  const [visitModalType, setVisitModalType] = useState<'visit' | 'vaccine'>('visit');

  const [isCloudSettingsOpen, setIsCloudSettingsOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [printPetTarget, setPrintPetTarget] = useState<Pet | null>(null);

  // Initialize DB seed and Auto-Sync on startup & periodic 30s interval
  useEffect(() => {
    seedDatabase()
      .then(async () => {
        const { syncLocalToSupabase } = await import('./lib/supabaseSync');
        await syncLocalToSupabase();
      })
      .catch((err) => console.error('Error seeding DB or initial sync:', err));

    const syncInterval = setInterval(async () => {
      try {
        const { syncLocalToSupabase } = await import('./lib/supabaseSync');
        await syncLocalToSupabase();
      } catch (err) {
        console.error('Periodic sync error:', err);
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, []);

  // Helper for background sync trigger
  const triggerAutoSync = async () => {
    try {
      const { syncLocalToSupabase } = await import('./lib/supabaseSync');
      await syncLocalToSupabase();
    } catch (err) {
      console.error('Auto sync error:', err);
    }
  };

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Reactive DB queries with Dexie
  const pets = useLiveQuery(() => db.pets.toArray(), []) || [];
  const visits = useLiveQuery(() => db.visits.toArray(), []) || [];
  const vaccines = useLiveQuery(() => db.vaccines.toArray(), []) || [];
  const cloudConfigs = useLiveQuery(() => db.cloudConfig.toArray(), []) || [];
  const clinicSettingsList = useLiveQuery(() => db.clinicSettings.toArray(), []) || [];

  const currentCloudConfig: CloudConfig = cloudConfigs[0] || {
    enabled: true,
    provider: 'supabase',
    apiUrl: 'https://zedkozfapgkloxofercm.supabase.co',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGtvemZhcGdrbG94b2ZlcmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDU3MzUsImV4cCI6MjEwMDkyMTczNX0.b_bz8t99nUUaM7x4hDkg3Z7W1QroYG0KU3tzKqI1SEo',
    lastSyncedAt: new Date().toLocaleString(),
    autoSync: true
  };

  const currentClinicSettings: ClinicSettings = clinicSettingsList[0] || {
    name: 'Dr. Gordian',
    subtitle: 'Clínica Veterinaria & Registro Perros/Gatos',
    phone: '+52 55 1234 5678',
    email: 'contacto@drgordian.com',
    address: 'Av. Principal 100, Ciudad',
    vetDirector: 'Dr. Gordian'
  };

  // Dynamic Document Title
  useEffect(() => {
    if (currentClinicSettings.name) {
      document.title = `${currentClinicSettings.name} - Sistema Veterinario`;
    }
  }, [currentClinicSettings.name]);

  const dogsCount = pets.filter((p) => p.species === 'Perro').length;
  const catsCount = pets.filter((p) => p.species === 'Gato').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisitsCount = visits.filter((v) => v.date === todayStr).length;

  // Session Handlers
  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setIsLocked(false);
    triggerAutoSync();
  };

  const handleLogout = () => {
    setUserSession(null);
    setIsLocked(false);
  };

  const handleLockSession = () => {
    setIsLocked(true);
  };

  // Pet & DB Handlers
  const handleSavePet = async (petData: Omit<Pet, 'id' | 'registeredAt'> & { id?: number }) => {
    if (petData.id) {
      await db.pets.update(petData.id, petData);
    } else {
      await db.pets.add({
        ...petData,
        registeredAt: new Date().toISOString()
      });
    }
    triggerAutoSync();
  };

  const handleDeletePet = async (petId: number) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de mascota? Se borrará también su historial médico.')) {
      await db.pets.delete(petId);
      await db.visits.where('petId').equals(petId).delete();
      await db.vaccines.where('petId').equals(petId).delete();
      if (selectedPet?.id === petId) {
        setIsDetailModalOpen(false);
        setSelectedPet(null);
      }
      triggerAutoSync();
    }
  };

  const handleSaveVisit = async (visitData: Omit<VisitRecord, 'id'>) => {
    await db.visits.add(visitData);
    if (visitData.weightKg && visitData.petId) {
      await db.pets.update(visitData.petId, { weightKg: visitData.weightKg });
    }
    triggerAutoSync();
  };

  const handleSavePetAndVisit = async (
    petData: Omit<Pet, 'id' | 'registeredAt'>,
    visitData: Omit<VisitRecord, 'id' | 'petId'>
  ) => {
    const newPetId = await db.pets.add({
      ...petData,
      registeredAt: new Date().toISOString()
    });
    await db.visits.add({
      ...visitData,
      petId: Number(newPetId)
    });
    triggerAutoSync();
  };

  const handleSaveVaccine = async (vaccineData: Omit<VaccineRecord, 'id'>) => {
    await db.vaccines.add(vaccineData);
    triggerAutoSync();
  };

  const handleSaveCloudConfig = async (newConfig: CloudConfig) => {
    if (newConfig.id) {
      await db.cloudConfig.update(newConfig.id, newConfig);
    } else {
      await db.cloudConfig.add(newConfig);
    }
  };

  const handleSaveClinicSettings = async (newSettings: ClinicSettings) => {
    if (newSettings.id) {
      await db.clinicSettings.update(newSettings.id, newSettings);
    } else {
      await db.clinicSettings.add(newSettings);
    }
  };

  const handleExportBackup = async () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      clinicSettings: currentClinicSettings,
      pets: await db.pets.toArray(),
      visits: await db.visits.toArray(),
      vaccines: await db.vaccines.toArray(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentClinicSettings.name.replace(/\s+/g, '_')}_Respaldo_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = async (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.pets && Array.isArray(data.pets)) {
        if (data.pets.length === 0) {
          alert('El archivo de respaldo no contiene ningún paciente.');
          return;
        }
        await db.pets.clear();
        await db.visits.clear();
        await db.vaccines.clear();

        await db.pets.bulkAdd(data.pets);
        if (data.visits && Array.isArray(data.visits) && data.visits.length > 0) {
          await db.visits.bulkAdd(data.visits);
        }
        if (data.vaccines && Array.isArray(data.vaccines) && data.vaccines.length > 0) {
          await db.vaccines.bulkAdd(data.vaccines);
        }
        if (data.clinicSettings) {
          await handleSaveClinicSettings(data.clinicSettings);
        }
      } else {
        alert('El archivo JSON importado no contiene una estructura válida de respaldo.');
      }
    } catch (err) {
      console.error('Error importing backup:', err);
      alert('El archivo JSON importado no tiene un formato válido.');
    }
  };

  const handleTriggerSync = async () => {
    const { syncLocalToSupabase } = await import('./lib/supabaseSync');
    await syncLocalToSupabase();
    await handleSaveCloudConfig({
      ...currentCloudConfig,
      lastSyncedAt: new Date().toLocaleString()
    });
  };

  // Public Privacy View accessible directly via QR Code scan
  if (isPrivacyPublicView) {
    return (
      <PrivacyPublicView
        clinicSettings={currentClinicSettings}
        onBackToApp={() => setIsPrivacyPublicView(false)}
      />
    );
  }

  // If user is not logged in or screen is locked, present Apple Login Modal
  if (!userSession || isLocked) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#0f172a] dark:text-[#f8fafc] flex print:bg-white print:text-black print:block print:p-0 print:m-0">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as 'dashboard' | 'pets' | 'daily-visits' | 'documents' | 'inventory')}
        speciesFilter={speciesFilter}
        setSpeciesFilter={setSpeciesFilter}
        totalPetsCount={pets.length}
        dogsCount={dogsCount}
        catsCount={catsCount}
        todayVisitsCount={todayVisitsCount}
        isCloudConnected={currentCloudConfig.enabled}
        onOpenCloudSettings={() => setIsCloudSettingsOpen(true)}
        clinicSettings={currentClinicSettings}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 min-h-screen flex flex-col pt-16 lg:pt-0 print:p-0 print:m-0 print:min-h-0 print:block">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            if (term && activeTab !== 'pets') {
              setActiveTab('pets');
            }
          }}
          onOpenAddPetModal={() => {
            setEditingPet(null);
            setIsPetModalOpen(true);
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isCloudConnected={currentCloudConfig.enabled}
          onOpenCloudSettings={() => setIsCloudSettingsOpen(true)}
          userSession={userSession}
          onLockSession={handleLockSession}
          onLogout={handleLogout}
        />

        {/* View Switcher */}
        <div className="px-4 lg:px-8 pb-12 flex-1 print:p-0 print:m-0 print:block">
          {activeTab === 'inventory' ? (
            <div className="no-print print:hidden">
              <InventoryManager pets={pets} clinicSettings={currentClinicSettings} />
            </div>
          ) : activeTab === 'documents' ? (
            <DocumentManager pets={pets} clinicSettings={currentClinicSettings} />
          ) : activeTab === 'daily-visits' ? (
            <div className="no-print print:hidden">
              <DailyVisitsView
                pets={pets}
                visits={visits}
                onSaveVisit={handleSaveVisit}
                onSavePetAndVisit={handleSavePetAndVisit}
                onSelectPet={(pet) => {
                  setSelectedPet(pet);
                  setIsDetailModalOpen(true);
                }}
              />
            </div>
          ) : activeTab === 'dashboard' ? (
            <div className="no-print print:hidden">
              <Dashboard
                pets={pets}
                visits={visits}
                vaccines={vaccines}
                onOpenAddPetModal={() => {
                  setEditingPet(null);
                  setIsPetModalOpen(true);
                }}
                onSelectPet={(pet) => {
                  setSelectedPet(pet);
                  setIsDetailModalOpen(true);
                }}
                onGoToPetsTab={(filter) => {
                  if (filter) setSpeciesFilter(filter);
                  setActiveTab('pets');
                }}
              />
            </div>
          ) : (
            <div className="no-print print:hidden">
              <PetList
                pets={pets}
                speciesFilter={speciesFilter}
                setSpeciesFilter={setSpeciesFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onOpenAddPetModal={() => {
                  setEditingPet(null);
                  setIsPetModalOpen(true);
                }}
                onSelectPet={(pet) => {
                  setSelectedPet(pet);
                  setIsDetailModalOpen(true);
                }}
                onEditPet={(pet) => {
                  setEditingPet(pet);
                  setIsPetModalOpen(true);
                }}
                onDeletePet={handleDeletePet}
                onAddVisitForPet={(pet) => {
                  setVisitPetTarget(pet);
                  setVisitModalType('visit');
                  setIsVisitModalOpen(true);
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <PetModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        onSave={handleSavePet}
        editingPet={editingPet}
        defaultSpecies={speciesFilter === 'Gato' ? 'Gato' : 'Perro'}
      />

      <PetDetailModal
        pet={selectedPet}
        visits={visits}
        vaccines={vaccines}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEditPet={(pet) => {
          setIsDetailModalOpen(false);
          setEditingPet(pet);
          setIsPetModalOpen(true);
        }}
        onAddVisit={(pet) => {
          setVisitPetTarget(pet);
          setVisitModalType('visit');
          setIsVisitModalOpen(true);
        }}
        onAddVaccine={(pet) => {
          setVisitPetTarget(pet);
          setVisitModalType('vaccine');
          setIsVisitModalOpen(true);
        }}
        onPrintMedicalReport={(pet) => {
          setPrintPetTarget(pet);
          setIsPrintViewOpen(true);
        }}
      />

      <VisitModal
        pet={visitPetTarget}
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        onSaveVisit={handleSaveVisit}
        onSaveVaccine={handleSaveVaccine}
        initialType={visitModalType}
      />

      <CloudSyncSettings
        isOpen={isCloudSettingsOpen}
        onClose={() => setIsCloudSettingsOpen(false)}
        config={currentCloudConfig}
        clinicSettings={currentClinicSettings}
        onSaveConfig={handleSaveCloudConfig}
        onSaveClinicSettings={handleSaveClinicSettings}
        onTriggerSync={handleTriggerSync}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {isPrintViewOpen && (
        <MedicalPrintView
          pet={printPetTarget}
          visits={visits}
          vaccines={vaccines}
          clinicSettings={currentClinicSettings}
          onClose={() => setIsPrintViewOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
