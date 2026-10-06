import Dexie, { type Table } from 'dexie';
import type { Pet, VisitRecord, VaccineRecord, CloudConfig, ClinicSettings, LegalDocumentTemplate, InventoryItem } from '../types/veterinary';

export class DrGordianDatabase extends Dexie {
  pets!: Table<Pet>;
  visits!: Table<VisitRecord>;
  vaccines!: Table<VaccineRecord>;
  cloudConfig!: Table<CloudConfig>;
  clinicSettings!: Table<ClinicSettings>;
  customDocuments!: Table<LegalDocumentTemplate>;
  inventory!: Table<InventoryItem>;

  constructor() {
    super('DrGordianVetDB');
    this.version(4).stores({
      pets: '++id, name, species, breed, ownerName, chipNumber, registeredAt',
      visits: '++id, petId, date, reason',
      vaccines: '++id, petId, vaccineName, nextDueDate, status',
      cloudConfig: '++id',
      clinicSettings: '++id',
      customDocuments: 'id, fileName, title, category',
      inventory: '++id, name, category, barcode, stock, minStock'
    });
  }
}

export const db = new DrGordianDatabase();

// Pre-packaged high-quality avatar images for Dogs & Cats (Apple style clean illustrations/photos)
export const AVATAR_PRESETS = {
  dogs: [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80', // Beagle
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80', // Golden Retriever
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=300&q=80', // Puppy
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80', // French Bulldog
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80', // Lab
  ],
  cats: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80', // Ginger cat
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&q=80', // Cat close-up
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=300&q=80', // Cool cat
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=300&q=80', // Tabby
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=300&q=80', // White/grey cat
  ]
};



// Seed initial configuration if DB is empty and clear old sample data
export async function seedDatabase() {
  const clinicCount = await db.clinicSettings.count();
  if (clinicCount === 0) {
    await db.clinicSettings.add({
      name: 'Dr. Gordian',
      subtitle: 'Clínica Veterinaria & Registro Perros/Gatos',
      phone: '+52 55 1234 5678',
      email: 'contacto@drgordian.com',
      address: 'Av. Principal 100, Ciudad',
      vetDirector: 'Dr. Gordian'
    });
  }

  const cloudCount = await db.cloudConfig.count();
  if (cloudCount === 0) {
    await db.cloudConfig.add({
      enabled: true,
      provider: 'supabase',
      apiUrl: 'https://zedkozfapgkloxofercm.supabase.co',
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGtvemZhcGdrbG94b2ZlcmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDU3MzUsImV4cCI6MjEwMDkyMTczNX0.b_bz8t99nUUaM7x4hDkg3Z7W1QroYG0KU3tzKqI1SEo',
      lastSyncedAt: new Date().toLocaleString(),
      autoSync: true
    });
  }

  // Clear inventory table to leave it clean as requested
  if (!localStorage.getItem('dr_gordian_inventory_cleared_clean_v1')) {
    await db.inventory.clear();
    localStorage.setItem('dr_gordian_inventory_cleared_clean_v1', 'true');
  }

  // Clear existing sample pets once when requested
  if (!localStorage.getItem('dr_gordian_all_patients_cleared_v2')) {
    await db.pets.clear();
    await db.visits.clear();
    await db.vaccines.clear();
    localStorage.setItem('dr_gordian_all_patients_cleared_v2', 'true');
  }
}

