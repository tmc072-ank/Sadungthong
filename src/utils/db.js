import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getOrders = async () => {
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
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting order from Supabase:', error);
    throw error;
  }
};
