import { useState, useCallback } from 'react';
import { createClient } from "@/utils/supabase/client";

export interface LabEquipment {
  id: string;        
  lab_id: string;       
  equipment_id: string; 
  quantity: number;
  equipment?: { id: string; name: string };
}

export function useLabEquipmentLogic() {
  const [labEquipment, setLabEquipment] = useState<LabEquipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLabEquipment = useCallback(async (labId: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('lab_equipment')
        .select('id, lab_id, equipment_id, quantity, equipment(id, name)')
        .eq('lab_id', labId);

      if (fetchError) throw fetchError;
      setLabEquipment(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const assignEquipmentToLab = async (
    lab_id: string,
    equipment_id: string,
    quantity: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from('lab_equipment')
        .insert([{ lab_id, equipment_id, quantity }]);
      if (insertError) throw insertError;
      await fetchLabEquipment(lab_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateLabEquipment = async (
    id: string,
    quantity: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError, data } = await supabase
        .from('lab_equipment')
        .update({ quantity })
        .eq('id', id)
        .select();
      if (updateError) throw updateError;
      if (data && data[0]?.lab_id) await fetchLabEquipment(data[0].lab_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const removeLabEquipment = async (id: string, lab_id: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('lab_equipment')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      await fetchLabEquipment(lab_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    labEquipment,
    loading,
    error,
    fetchLabEquipment,
    assignEquipmentToLab,
    updateLabEquipment,
    removeLabEquipment,
  };
}