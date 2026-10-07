import { supabase } from './supabase';
import { db } from '../db/database';

export async function syncLocalToSupabase() {
  try {
    // ---------------------------------------------------------
    // 1. SYNC PETS (Push Local -> Supabase, Pull Supabase -> Local)
    // ---------------------------------------------------------
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
      } else if (existing[0]?.id) {
        // Update remote pet details if it already exists
        await supabase.from('pets').update({
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          age_years: pet.ageYears || 0,
          age_months: pet.ageMonths || 0,
          weight_kg: pet.weightKg ?? 0,
          chip_number: pet.chipNumber || null,
          avatar_url: pet.avatarUrl,
          owner_phone: pet.ownerPhone,
          owner_email: pet.ownerEmail || null,
          owner_address: pet.ownerAddress || null,
          notes: pet.notes || null
        }).eq('id', existing[0].id);
      }
    }

    // Download remote pets from Supabase into local database
    const { data: remotePets } = await supabase.from('pets').select('*');
    if (remotePets && remotePets.length > 0) {
      for (const rPet of remotePets) {
        const existsLocally = localPets.some(
          (lp) => (lp.name || '').toLowerCase().trim() === (rPet.name || '').toLowerCase().trim() &&
                  (lp.ownerName || '').toLowerCase().trim() === (rPet.owner_name || '').toLowerCase().trim()
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

    // Map helper to resolve remote pet ID by name & owner
    const allRemotePets = (await supabase.from('pets').select('id, name, owner_name')).data || [];
    const updatedLocalPets = await db.pets.toArray();

    // ---------------------------------------------------------
    // 2. SYNC VISITS / CONSULTAS (Push & Pull)
    // ---------------------------------------------------------
    const localVisits = await db.visits.toArray();
    for (const v of localVisits) {
      const parentLocalPet = updatedLocalPets.find(p => p.id === v.petId);
      const remotePetMatch = parentLocalPet 
        ? allRemotePets.find(rp => rp.name.toLowerCase().trim() === parentLocalPet.name.toLowerCase().trim() && rp.owner_name.toLowerCase().trim() === parentLocalPet.ownerName.toLowerCase().trim())
        : null;

      const remotePetId = remotePetMatch ? remotePetMatch.id : v.petId;

      const { data: existingV } = await supabase
        .from('visits')
        .select('id')
        .eq('date', v.date)
        .eq('reason', v.reason);

      if (!existingV || existingV.length === 0) {
        await supabase.from('visits').insert({
          pet_id: remotePetId,
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
      const currentLocalVisits = await db.visits.toArray();
      for (const rV of remoteVisits) {
        // Find remote pet details to match local pet
        const remotePet = allRemotePets.find(p => p.id === rV.pet_id);
        const localPet = remotePet 
          ? updatedLocalPets.find(lp => lp.name.toLowerCase().trim() === remotePet.name.toLowerCase().trim() && lp.ownerName.toLowerCase().trim() === remotePet.owner_name.toLowerCase().trim())
          : updatedLocalPets[0];

        const localPetId = localPet ? localPet.id : rV.pet_id;

        const existsLocally = currentLocalVisits.some(
          (lv) => lv.date === rV.date && lv.reason === rV.reason && lv.cost === rV.cost
        );
        if (!existsLocally && localPetId) {
          await db.visits.add({
            petId: localPetId,
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

    // ---------------------------------------------------------
    // 3. SYNC VACCINES (Push & Pull)
    // ---------------------------------------------------------
    const localVaccines = await db.vaccines.toArray();
    for (const vac of localVaccines) {
      const parentLocalPet = updatedLocalPets.find(p => p.id === vac.petId);
      const remotePetMatch = parentLocalPet 
        ? allRemotePets.find(rp => rp.name.toLowerCase().trim() === parentLocalPet.name.toLowerCase().trim() && rp.owner_name.toLowerCase().trim() === parentLocalPet.ownerName.toLowerCase().trim())
        : null;

      const remotePetId = remotePetMatch ? remotePetMatch.id : vac.petId;

      const { data: existingVac } = await supabase
        .from('vaccines')
        .select('id')
        .eq('vaccine_name', vac.vaccineName)
        .eq('applied_date', vac.appliedDate);

      if (!existingVac || existingVac.length === 0) {
        await supabase.from('vaccines').insert({
          pet_id: remotePetId,
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
      const currentLocalVac = await db.vaccines.toArray();
      for (const rVac of remoteVaccines) {
        const remotePet = allRemotePets.find(p => p.id === rVac.pet_id);
        const localPet = remotePet 
          ? updatedLocalPets.find(lp => lp.name.toLowerCase().trim() === remotePet.name.toLowerCase().trim() && lp.ownerName.toLowerCase().trim() === remotePet.owner_name.toLowerCase().trim())
          : updatedLocalPets[0];

        const localPetId = localPet ? localPet.id : rVac.pet_id;

        const existsLocally = currentLocalVac.some(
          (lvac) => lvac.vaccineName === rVac.vaccine_name && lvac.appliedDate === rVac.applied_date
        );
        if (!existsLocally && localPetId) {
          await db.vaccines.add({
            petId: localPetId,
            vaccineName: rVac.vaccine_name,
            appliedDate: rVac.applied_date,
            nextDueDate: rVac.next_due_date,
            batchNumber: rVac.batch_number || undefined,
            status: rVac.status
          });
        }
      }
    }

    // ---------------------------------------------------------
    // 4. SYNC INVENTORY (Safe Try-Catch)
    // ---------------------------------------------------------
    try {
      const localInventory = await db.inventory.toArray();
      for (const item of localInventory) {
        const { data: existingInv } = await supabase
          .from('inventory')
          .select('id')
          .eq('name', item.name)
          .eq('category', item.category);

        if (!existingInv || existingInv.length === 0) {
          await supabase.from('inventory').insert({
            name: item.name,
            category: item.category,
            barcode: item.barcode || null,
            price: item.price,
            cost: item.cost || 0,
            stock: item.stock,
            min_stock: item.minStock,
            unit: item.unit,
            supplier: item.supplier || null,
            expiration_date: item.expirationDate || null,
            notes: item.notes || null,
            updated_at: item.updatedAt || new Date().toISOString()
          });
        } else {
          await supabase
            .from('inventory')
            .update({
              price: item.price,
              cost: item.cost || 0,
              stock: item.stock,
              min_stock: item.minStock,
              barcode: item.barcode || null,
              supplier: item.supplier || null,
              expiration_date: item.expirationDate || null,
              notes: item.notes || null,
              updated_at: item.updatedAt || new Date().toISOString()
            })
            .eq('id', existingInv[0].id);
        }
      }

      const { data: remoteInventory } = await supabase.from('inventory').select('*');
      if (remoteInventory && remoteInventory.length > 0) {
        const updatedLocalInv = await db.inventory.toArray();
        for (const rItem of remoteInventory) {
          const localMatch = updatedLocalInv.find(
            (lItem) => (lItem.name || '').toLowerCase() === (rItem.name || '').toLowerCase() && lItem.category === rItem.category
          );
          if (!localMatch) {
            await db.inventory.add({
              name: rItem.name,
              category: rItem.category,
              barcode: rItem.barcode || undefined,
              price: rItem.price,
              cost: rItem.cost || undefined,
              stock: rItem.stock,
              minStock: rItem.min_stock,
              unit: rItem.unit || 'Piezas',
              supplier: rItem.supplier || undefined,
              expirationDate: rItem.expiration_date || undefined,
              notes: rItem.notes || undefined,
              updatedAt: rItem.updated_at || new Date().toISOString()
            });
          } else if (localMatch.id) {
            await db.inventory.update(localMatch.id, {
              stock: rItem.stock,
              price: rItem.price,
              cost: rItem.cost || undefined,
              minStock: rItem.min_stock,
              updatedAt: rItem.updated_at || new Date().toISOString()
            });
          }
        }
      }
    } catch (invErr) {
      console.warn('Inventory sync skipped or table missing:', invErr);
    }

    return { success: true };
  } catch (err) {
    console.error('Supabase sync error:', err);
    return { success: false, error: err };
  }
}

export async function clearAllInventoryRemoteAndLocal() {
  try {
    await db.inventory.clear();
    try {
      await supabase.from('inventory').delete().neq('id', 0);
    } catch (err) {
      console.warn('Remote inventory clear skipped:', err);
    }
    return { success: true };
  } catch (err) {
    console.error('Error clearing inventory:', err);
    return { success: false, error: err };
  }
}
