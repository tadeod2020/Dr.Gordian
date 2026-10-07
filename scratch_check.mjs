import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zedkozfapgkloxofercm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGtvemZhcGdrbG94b2ZlcmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDU3MzUsImV4cCI6MjEwMDkyMTczNX0.b_bz8t99nUUaM7x4hDkg3Z7W1QroYG0KU3tzKqI1SEo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkRemoteData() {
  console.log('--- CHECKING SUPABASE REMOTE DATABASE ---');

  const { data: pets, error: petsErr } = await supabase.from('pets').select('*');
  console.log('Pets count:', pets ? pets.length : 0, petsErr ? `(Error: ${petsErr.message})` : '');
  if (pets && pets.length > 0) {
    console.log('Sample Pets:', pets.map(p => ({ id: p.id, name: p.name, owner: p.owner_name, species: p.species })));
  }

  const { data: visits, error: visitsErr } = await supabase.from('visits').select('*');
  console.log('Visits count:', visits ? visits.length : 0, visitsErr ? `(Error: ${visitsErr.message})` : '');
  if (visits && visits.length > 0) {
    console.log('Sample Visits:', visits.map(v => ({ id: v.id, pet_id: v.pet_id, reason: v.reason, date: v.date })));
  }

  const { data: vaccines, error: vaccinesErr } = await supabase.from('vaccines').select('*');
  console.log('Vaccines count:', vaccines ? vaccines.length : 0, vaccinesErr ? `(Error: ${vaccinesErr.message})` : '');

  const { data: inventory, error: inventoryErr } = await supabase.from('inventory').select('*');
  console.log('Inventory count:', inventory ? inventory.length : 0, inventoryErr ? `(Error: ${inventoryErr.message})` : '');
  if (inventory && inventory.length > 0) {
    console.log('Sample Inventory:', inventory.map(i => ({ id: i.id, name: i.name, stock: i.stock, category: i.category })));
  }
}

checkRemoteData();
