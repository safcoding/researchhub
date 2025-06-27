import { useCallback, useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

export interface Equipment {
    id: string;
    name: string;
}

export function useEquipmentLogic(){
    const [equipment, setEquipment] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEquipment = useCallback(async () => {
        try {            setLoading(true);
            setError(null);
            
            console.log('🔍 Fetching All Equipments from database...');
            
            const supabase = createClient();
            const { data, error: fetchError } = await supabase
                .from('equipment')
                .select('*')
                .order('name', { ascending: true });
            
            console.log('📊 Raw data count from Supabase:', data?.length);
            
            if (fetchError) {
                console.error('❌ Supabase fetch error:', fetchError);
                throw fetchError;
            }
            
            setEquipment(data || []);
            console.log('✅ Successfully loaded Equipments:', data?.length || 0);
            
        } catch (e) {
            console.error('❌ Error fetching equipments:', e);
            setError(e instanceof Error ? e.message : 'Failed to fetch equipments');
        } finally {
            setLoading(false);
        }
    }, []);

    const addEquipment = async (newEquipment: Partial<Equipment>) => {
        try {            setLoading(true);
            console.log('Adding new equipment:', newEquipment);
     
            const supabase = createClient();
            const { data, error: insertError } = await supabase
                .from('equipment')
                .insert([newEquipment])
                .select();
                
            if (insertError) {
                console.error('Error adding equipment:', insertError);
                throw insertError;
            }
            
            console.log('Equipment added successfully:', data);
            await fetchEquipment();
        } catch (e) {
            console.error('Error in addEquipment:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };   
    const updateEquipment = async (id: string, updatedData: Partial<Equipment>) => {
        try {
            setLoading(true);
            console.log(`Updating equipment with ID ${id}:`, updatedData);
            
            const supabase = createClient();
            const { data, error: updateError } = await supabase
                .from('equipment')
                .update(updatedData)
                .eq('id', id)
                .select();
                
            if (updateError) {
                console.error('Error updating equipment:', updateError);
                throw updateError;
            }
            
            console.log('Equipment updated successfully:', data);
            await fetchEquipment();
        } catch (e) {
            console.error('Error in updateEquipment:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };
    const deleteEquipment = async (id: string) => {
        try {
            setLoading(true);
            console.log(`Deleting equipment with ID ${id}`);
            
            const supabase = createClient();
            const { data, error: deleteError } = await supabase
                .from('equipment')
                .delete()
                .eq('id', id)
                .select();
                
            if (deleteError) {
                console.error('Error deleting equipment:', deleteError);
                throw deleteError;
            }
            
            console.log('Equipment deleted successfully:', data);
            await fetchEquipment();
        } catch (e) {
            console.error('Error in deleteEquipment:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };    

    useEffect(() => {
        fetchEquipment();
        }, [fetchEquipment]);
        
    return {
        equipment,
        loading,
        error,
        addEquipment,
        updateEquipment,
        deleteEquipment,
    }
}