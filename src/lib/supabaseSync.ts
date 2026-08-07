import { supabase } from './supabase';
import { db } from '../db/database';

export async function syncLocalToSupabase() {
  try {
    // 1. SYNC PETS (Push & Pull)
    const localPets = await db.pets.toArray();
    for (const pet of localPets) {
      const { data: existing } = await supabase
        .from('pets')
        .select('id')
        .eq('name', pet.name)
        .eq('owner_name', pet.ownerName);

      if (!existing || existing.length === 0) {
        await supabase.from('pets').insert({
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          age_years: pet.ageYears || 0,
          age_months: pet.ageMonths || 0,
          weight_kg: pet.weightKg ?? 0,
          chip_number: pet.chipNumber || null,
          avatar_url: pet.avatarUrl,
          owner_name: pet.ownerName,
          owner_phone: pet.ownerPhone,
          owner_email: pet.ownerEmail || null,
          owner_address: pet.ownerAddress || null,
          notes: pet.notes || null,
          registered_at: pet.registeredAt
        });
      }
    }

    // Download remote pets from Supabase into local database
    const { data: remotePets } = await supabase.from('pets').select('*');
    if (remotePets && remotePets.length > 0) {
      for (const rPet of remotePets) {
        const existsLocally = localPets.some(
          (lp) => lp.name.toLowerCase() === rPet.name.toLowerCase() && lp.ownerName.toLowerCase() === rPet.owner_name.toLowerCase()
        );
        if (!existsLocally) {
          await db.pets.add({
            name: rPet.name,
            species: rPet.species,
            breed: rPet.breed,
            gender: rPet.gender,
            ageYears: rPet.age_years || undefined,
            ageMonths: rPet.age_months || undefined,
            weightKg: rPet.weight_kg || undefined,
            chipNumber: rPet.chip_number || undefined,
            avatarUrl: rPet.avatar_url || (rPet.species === 'Perro' 
              ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'
              : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'),
            ownerName: rPet.owner_name,
            ownerPhone: rPet.owner_phone,
            ownerEmail: rPet.owner_email || undefined,
            ownerAddress: rPet.owner_address || undefined,
            notes: rPet.notes || undefined,
            registeredAt: rPet.registered_at || new Date().toISOString()
          });
        }
      }
    }

    // 2. SYNC VISITS / CONSULTAS (Push & Pull)
    const localVisits = await db.visits.toArray();
    for (const v of localVisits) {
      const { data: existingV } = await supabase
        .from('visits')
        .select('id')
        .eq('date', v.date)
        .eq('reason', v.reason);

      if (!existingV || existingV.length === 0) {
        await supabase.from('visits').insert({
          pet_id: v.petId,
          date: v.date,
          reason: v.reason,
          diagnosis: v.diagnosis,
          treatment: v.treatment,
          vet_name: v.vetName,
          weight_kg: v.weightKg ?? 0,
          cost: v.cost,
          next_appointment_date: v.nextAppointmentDate || null,
          images: v.images || null
        });
      }
    }

    // Download remote visits from Supabase into local database
    const { data: remoteVisits } = await supabase.from('visits').select('*');
    if (remoteVisits && remoteVisits.length > 0) {
      const updatedLocalVisits = await db.visits.toArray();
      for (const rV of remoteVisits) {
        const existsLocally = updatedLocalVisits.some(
          (lv) => lv.date === rV.date && lv.reason === rV.reason && lv.cost === rV.cost
        );
        if (!existsLocally) {
          await db.visits.add({
            petId: rV.pet_id,
            date: rV.date,
            reason: rV.reason,
            diagnosis: rV.diagnosis,
            treatment: rV.treatment,
            vetName: rV.vet_name,
            weightKg: rV.weight_kg || undefined,
            cost: rV.cost,
            nextAppointmentDate: rV.next_appointment_date || undefined,
            images: rV.images || undefined
          });
        }
      }
    }

    // 3. SYNC VACCINES (Push & Pull)
    const localVaccines = await db.vaccines.toArray();
    for (const vac of localVaccines) {
      const { data: existingVac } = await supabase
        .from('vaccines')
        .select('id')
        .eq('vaccine_name', vac.vaccineName)
        .eq('applied_date', vac.appliedDate);

      if (!existingVac || existingVac.length === 0) {
        await supabase.from('vaccines').insert({
          pet_id: vac.petId,
          vaccine_name: vac.vaccineName,
          applied_date: vac.appliedDate,
          next_due_date: vac.nextDueDate,
          batch_number: vac.batchNumber || null,
          status: vac.status
        });
      }
    }

    // Download remote vaccines from Supabase into local database
    const { data: remoteVaccines } = await supabase.from('vaccines').select('*');
    if (remoteVaccines && remoteVaccines.length > 0) {
      const updatedLocalVac = await db.vaccines.toArray();
      for (const rVac of remoteVaccines) {
        const existsLocally = updatedLocalVac.some(
          (lvac) => lvac.vaccineName === rVac.vaccine_name && lvac.appliedDate === rVac.applied_date
        );
        if (!existsLocally) {
          await db.vaccines.add({
            petId: rVac.pet_id,
            vaccineName: rVac.vaccine_name,
            appliedDate: rVac.applied_date,
            nextDueDate: rVac.next_due_date,
            batchNumber: rVac.batch_number || undefined,
            status: rVac.status
          });
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Supabase sync error:', err);
    return { success: false, error: err };
  }
}
