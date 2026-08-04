import Dexie, { type Table } from 'dexie';
import type { Pet, VisitRecord, VaccineRecord, CloudConfig, ClinicSettings } from '../types/veterinary';

export class DrGordianDatabase extends Dexie {
  pets!: Table<Pet>;
  visits!: Table<VisitRecord>;
  vaccines!: Table<VaccineRecord>;
  cloudConfig!: Table<CloudConfig>;
  clinicSettings!: Table<ClinicSettings>;

  constructor() {
    super('DrGordianVetDB');
    this.version(2).stores({
      pets: '++id, name, species, breed, ownerName, chipNumber, registeredAt',
      visits: '++id, petId, date, reason',
      vaccines: '++id, petId, vaccineName, nextDueDate, status',
      cloudConfig: '++id',
      clinicSettings: '++id'
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

// Seed initial data if DB is empty
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

  const petCount = await db.pets.count();
  if (petCount === 0) {
    const pet1Id = await db.pets.add({
      name: 'Max',
      species: 'Perro',
      breed: 'Golden Retriever',
      gender: 'Macho',
      ageYears: 3,
      ageMonths: 2,
      weightKg: 28.5,
      chipNumber: 'CHIP-9842103',
      avatarUrl: AVATAR_PRESETS.dogs[1],
      ownerName: 'Carlos Mendoza',
      ownerPhone: '+52 55 1234 5678',
      ownerEmail: 'carlos.mendoza@email.com',
      ownerAddress: 'Av. Las Palmas 402, Ciudad',
      registeredAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      notes: 'Muy amigable. Alérgico al pollo.'
    });

    const pet2Id = await db.pets.add({
      name: 'Luna',
      species: 'Gato',
      breed: 'Siamés',
      gender: 'Hembra',
      ageYears: 2,
      ageMonths: 5,
      weightKg: 4.2,
      chipNumber: 'CHIP-4410923',
      avatarUrl: AVATAR_PRESETS.cats[0],
      ownerName: 'Sofía Ramirez',
      ownerPhone: '+52 55 9876 5432',
      ownerEmail: 'sofia.ramirez@email.com',
      ownerAddress: 'Calle Roble 12, Ciudad',
      registeredAt: new Date(Date.now() - 40 * 86400000).toISOString(),
      notes: 'Tímida en revisión física.'
    });

    const pet3Id = await db.pets.add({
      name: 'Rocky',
      species: 'Perro',
      breed: 'Bulldog Francés',
      gender: 'Macho',
      ageYears: 1,
      ageMonths: 8,
      weightKg: 11.4,
      chipNumber: 'CHIP-7731049',
      avatarUrl: AVATAR_PRESETS.dogs[3],
      ownerName: 'Alejandro Gomez',
      ownerPhone: '+52 55 4567 8901',
      ownerEmail: 'alessandro@email.com',
      ownerAddress: 'Colonia Del Valle 89',
      registeredAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      notes: 'Requiere revisión respiratoria periódica.'
    });

    const pet5Id = await db.pets.add({
      name: 'Thor',
      species: 'Perro',
      breed: 'Pastor Alemán',
      gender: 'Macho',
      ageYears: 2,
      ageMonths: 4,
      weightKg: 32.8,
      chipNumber: 'CHIP-9988110',
      avatarUrl: AVATAR_PRESETS.dogs[0],
      ownerName: 'Elena Rostova',
      ownerPhone: '+52 55 9988 7766',
      ownerEmail: 'elena.rostova@email.com',
      ownerAddress: 'Av. Insurgentes Sur 1200',
      registeredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      notes: 'Dermatitis leve controlada. Vacunación completa.'
    });

    await db.pets.add({
      name: 'Mimi',
      species: 'Gato',
      breed: 'Persa',
      gender: 'Hembra',
      ageYears: 4,
      ageMonths: 0,
      weightKg: 3.8,
      chipNumber: 'CHIP-3391820',
      avatarUrl: AVATAR_PRESETS.cats[2],
      ownerName: 'Laura Torres',
      ownerPhone: '+52 55 2233 4455',
      ownerEmail: 'laura.torres@email.com',
      ownerAddress: 'Paseo de la Reforma 500',
      registeredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      notes: 'Cepillado de pelo continuo recomendado.'
    });

    // Seed visits
    await db.visits.bulkAdd([
      {
        petId: pet1Id as number,
        date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
        reason: 'Chequeo General',
        diagnosis: 'Paciente saludable, excelente condición física.',
        treatment: 'Continuar con dieta equilibrada y ejercicio diario.',
        vetName: 'Dr. Gordian',
        weightKg: 28.5,
        cost: 450
      },
      {
        petId: pet2Id as number,
        date: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
        reason: 'Vacunación Anual',
        diagnosis: 'Aplicación de refuerzo Triple Felina.',
        treatment: 'Reposo relativo por 24 horas.',
        vetName: 'Dr. Gordian',
        weightKg: 4.2,
        cost: 380
      },
      {
        petId: pet5Id as number,
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        reason: 'Revisión Dermatológica & Desparasitación',
        diagnosis: 'Dermatitis alérgica leve por picadura de pulga.',
        treatment: 'Champú antiséptico c/3 días y Apoquel 16mg. Tratamiento antiparasitario Simparica Trio.',
        vetName: 'Dr. Gordian',
        weightKg: 32.8,
        cost: 650
      }
    ]);

    // Seed vaccines
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0];
    const pastMonth = new Date(today.getTime() - 15 * 86400000).toISOString().split('T')[0];

    await db.vaccines.bulkAdd([
      {
        petId: pet1Id as number,
        vaccineName: 'Rabia',
        appliedDate: pastMonth,
        nextDueDate: new Date(today.getTime() + 350 * 86400000).toISOString().split('T')[0],
        batchNumber: 'LOTE-RB889',
        status: 'Al día'
      },
      {
        petId: pet5Id as number,
        vaccineName: 'Rabia & Séctuple Canina',
        appliedDate: new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0],
        nextDueDate: new Date(today.getTime() + 363 * 86400000).toISOString().split('T')[0],
        batchNumber: 'LOTE-SC2026-X',
        status: 'Al día'
      },
      {
        petId: pet1Id as number,
        vaccineName: 'Séctuple Canina',
        appliedDate: pastMonth,
        nextDueDate: nextMonth,
        batchNumber: 'LOTE-SC102',
        status: 'Próxima'
      },
      {
        petId: pet2Id as number,
        vaccineName: 'Triple Felina',
        appliedDate: pastMonth,
        nextDueDate: new Date(today.getTime() + 330 * 86400000).toISOString().split('T')[0],
        batchNumber: 'LOTE-TF501',
        status: 'Al día'
      },
      {
        petId: pet3Id as number,
        vaccineName: 'Parvovirus',
        appliedDate: new Date(today.getTime() - 380 * 86400000).toISOString().split('T')[0],
        nextDueDate: new Date(today.getTime() - 15 * 86400000).toISOString().split('T')[0],
        batchNumber: 'LOTE-PV220',
        status: 'Vencida'
      }
    ]);

    // Seed cloud config default (Live Supabase Connected)
    await db.cloudConfig.add({
      enabled: true,
      provider: 'supabase',
      apiUrl: 'https://zedkozfapgkloxofercm.supabase.co',
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGtvemZhcGdrbG94b2ZlcmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDU3MzUsImV4cCI6MjEwMDkyMTczNX0.b_bz8t99nUUaM7x4hDkg3Z7W1QroYG0KU3tzKqI1SEo',
      lastSyncedAt: new Date().toLocaleString(),
      autoSync: true
    });
  }
}
