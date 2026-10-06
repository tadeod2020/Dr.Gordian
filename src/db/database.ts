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

const INITIAL_INVENTORY_ITEMS: Omit<InventoryItem, 'id'>[] = [
  {
    name: 'Amoxicilina + Ácido Clavulánico 500mg',
    category: 'Medicamentos',
    barcode: '7501234567891',
    price: 320,
    cost: 180,
    stock: 24,
    minStock: 10,
    unit: 'Cajas',
    supplier: 'Laboratorios Vetoquinol',
    expirationDate: '2027-08-15',
    notes: 'Antibiótico de amplio espectro para caninos y felinos',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Meloxicam Suspension 0.5mg/ml (10ml)',
    category: 'Medicamentos',
    barcode: '7501234567892',
    price: 240,
    cost: 130,
    stock: 8,
    minStock: 10,
    unit: 'Frascos',
    supplier: 'Boehringer Ingelheim',
    expirationDate: '2027-04-20',
    notes: 'Antiinflamatorio no esteroideo analgésico',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Bravecto M (Perros 10-20kg)',
    category: 'Medicamentos',
    barcode: '7501234567893',
    price: 890,
    cost: 580,
    stock: 15,
    minStock: 5,
    unit: 'Tabletas',
    supplier: 'MSD Animal Health',
    expirationDate: '2028-01-10',
    notes: 'Desparasitante externo pulgas y garrapatas (3 meses de protección)',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Vacuna Rabia Monovalente 1ml',
    category: 'Vacunas',
    barcode: '7501234567894',
    price: 250,
    cost: 95,
    stock: 45,
    minStock: 15,
    unit: 'Frascos',
    supplier: 'Zoetis',
    expirationDate: '2026-12-30',
    notes: 'Mantener en cadena de frío 2ºC a 8ºC',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Vacuna Múltiple Canina (Sextuple)',
    category: 'Vacunas',
    barcode: '7501234567895',
    price: 420,
    cost: 210,
    stock: 4,
    minStock: 10,
    unit: 'Frascos',
    supplier: 'Zoetis Vanguard',
    expirationDate: '2026-11-15',
    notes: 'Parvovirus, Moquillo, Hepatitis, Adenovirus, Parainfluenza, Leptospira',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Jeringas Desechables 3ml c/Aguja 21G',
    category: 'Material Quirúrgico',
    barcode: '7501234567896',
    price: 15,
    cost: 4.5,
    stock: 150,
    minStock: 30,
    unit: 'Piezas',
    supplier: 'BD Medical',
    expirationDate: '2029-05-01',
    notes: 'Estériles de un solo uso',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Alimento Pro Plan Adulto Raza Mediana 3kg',
    category: 'Alimentos',
    barcode: '7501234567897',
    price: 680,
    cost: 490,
    stock: 12,
    minStock: 4,
    unit: 'Bolsas',
    supplier: 'Purina Pro Plan',
    expirationDate: '2027-02-28',
    notes: 'Fórmula sabor pollo y arroz',
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Shampoo Antiséptico Clorhexidina 250ml',
    category: 'Higiene & Estética',
    barcode: '7501234567898',
    price: 210,
    cost: 110,
    stock: 3,
    minStock: 8,
    unit: 'Frascos',
    supplier: 'PetPharma',
    expirationDate: '2027-10-12',
    notes: 'Para tratamiento de piodermia y afecciones dermatológicas',
    updatedAt: new Date().toISOString()
  }
];

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

  // Seed inventory if empty
  const inventoryCount = await db.inventory.count();
  if (inventoryCount === 0) {
    await db.inventory.bulkAdd(INITIAL_INVENTORY_ITEMS);
  }

  // Clear existing sample pets once when requested
  if (!localStorage.getItem('dr_gordian_all_patients_cleared_v2')) {
    await db.pets.clear();
    await db.visits.clear();
    await db.vaccines.clear();
    localStorage.setItem('dr_gordian_all_patients_cleared_v2', 'true');
  }
}

