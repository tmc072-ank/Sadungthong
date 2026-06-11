import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials (Safe for public client-side use in static apps)
const supabaseUrl = 'https://qvhrwpjsrennhvzajthp.supabase.co';
const supabaseAnonKey = 'sb_publishable_E8BSSjCJme5or7-sw8Sp5Q_jkBflLm1';

export let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
} else {
  console.warn('Supabase credentials are missing!');
}

export const getOrders = async () => {
  if (!supabase) {
    console.error('Supabase is not initialized. Using empty array.');
    return [];
  }
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('id', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders from Supabase:', error);
    throw error;
  }
  return data || [];
};

export const addOrder = async (order) => {
  if (!supabase) {
    console.error('Supabase is not initialized. Cannot add order.');
    return null;
  }
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select();
  
  if (error) {
    console.error('Error adding order to Supabase:', error);
    throw error;
  }
  return data[0]?.id;
};

export const updateOrder = async (order) => {
  if (!supabase) {
    console.error('Supabase is not initialized. Cannot update order.');
    return null;
  }
  const { data, error } = await supabase
    .from('orders')
    .update(order)
    .eq('id', order.id)
    .select();
  
  if (error) {
    console.error('Error updating order on Supabase:', error);
    throw error;
  }
  return data[0]?.id;
};

export const deleteOrder = async (id) => {
  if (!supabase) {
    console.error('Supabase is not initialized. Cannot delete order.');
    return;
  }
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting order from Supabase:', error);
    throw error;
  }
};
