export type PetSpecies = 'Perro' | 'Gato';
export type PetGender = 'Macho' | 'Hembra';

export interface Pet {
  id?: number;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  ageYears?: number;
  ageMonths?: number;
  weightKg?: number;
  chipNumber?: string;
  avatarUrl: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  ownerAddress?: string;
  registeredAt: string;
  notes?: string;
}

export interface VisitRecord {
  id?: number;
  petId: number;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  vetName: string;
  weightKg: number;
  cost: number;
  nextAppointmentDate?: string;
  images?: string[];
}

export interface VaccineRecord {
  id?: number;
  petId: number;
  vaccineName: string;
  appliedDate: string;
  nextDueDate: string;
  batchNumber?: string;
  status: 'Al día' | 'Próxima' | 'Vencida';
}

export interface CloudConfig {
  id?: number;
  enabled: boolean;
  provider: 'supabase' | 'custom_api';
  apiUrl: string;
  apiKey: string;
  lastSyncedAt: string | null;
  autoSync: boolean;
}

export interface ClinicSettings {
  id?: number;
  name: string;
  subtitle: string;
  phone: string;
  email: string;
  address: string;
  vetDirector: string;
}

export interface DashboardStats {
  totalPets: number;
  totalDogs: number;
  totalCats: number;
  recentVisitsCount: number;
  pendingVaccinesCount: number;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Veterinario' | 'Recepción';
  avatarUrl: string;
}

export type DocumentCategory = 'Contratos' | 'Formatos Médicos' | 'Avisos de Privacidad' | 'Servicios' | 'Consentimientos';

export interface LegalDocumentTemplate {
  id: string;
  fileName: string;
  title: string;
  category: DocumentCategory;
  description: string;
  content: string;
  updatedAt?: string;
}

