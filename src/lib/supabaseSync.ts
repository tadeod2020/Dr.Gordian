import { supabase } from './supabase';
import { db } from '../db/database';

export async function syncLocalToSupabase() {
  try {
    const localPets = await db.pets.toArray();
    if (localPets.length > 0) {
      for (const pet of localPets) {
        let query = supabase.from('pets').select('id').eq('name', pet.name);
        if (pet.chipNumber) {
          query = query.eq('chip_number', pet.chipNumber);
        }
        const { data: existing } = await query;

        if (!existing || existing.length === 0) {
          await supabase.from('pets').insert({
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            gender: pet.gender,
            age_years: pet.ageYears,
            age_months: pet.ageMonths,
            weight_kg: pet.weightKg,
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
    }

    return { success: true };
  } catch (err) {
    console.error('Supabase sync error:', err);
    return { success: false, error: err };
  }
}
