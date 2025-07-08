import { useCallback, useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

export interface Equipment {
    id: string;
    name: string;
}

export interface EquipmentFilters {
    searchText?: string;
    name?: string;
}

export function useEquipmentLogic(){
    const [equipment, setEquipment] = useState<Equipment[]>([])
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Server-side pagination, filtering, searching for equipment (1000+ records)
    const fetchEquipment = useCallback(async ({
        page = 1,
        itemsPerPage = 20, // Higher default for equipment
        filters = {},
    }: {
        page?: number;
        itemsPerPage?: number;
        filters?: EquipmentFilters;
    } = {}) => {
        try {            
            setLoading(true);
            setError(null);
            
            console.log('🔍 Fetching Equipment from database with filters:', filters);
            
            const supabase = createClient();
            let query = supabase
                .from('equipment')
                .select('*', { count: 'exact' })
                .order('name', { ascending: true });

            // Search by equipment name
            if (filters.searchText && filters.searchText.trim() !== '') {
                query = query.ilike('name', `%${filters.searchText}%`);
            }

            // Filter by specific name (exact match)
            if (filters.name && filters.name !== 'all' && filters.name !== '') {
                query = query.eq('name', filters.name);
            }

            // Pagination
            const from = (page - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;
            const { data, error: fetchError, count } = await query.range(from, to);
            
            console.log('📊 Raw data count from Supabase:', data?.length, 'Total:', count);
            
            if (fetchError) {
                console.error('❌ Supabase fetch error:', fetchError);
                throw fetchError;
            }
            
            setEquipment(data || []);
            setTotalCount(count || 0);
            console.log('✅ Successfully loaded Equipment:', data?.length || 0, 'of', count);
            
        } catch (e) {
            console.error('❌ Error fetching equipment:', e);
            setError(e instanceof Error ? e.message : 'Failed to fetch equipment');
        } finally {
            setLoading(false);
        }
    }, []);

    const addEquipment = async (newEquipment: Partial<Equipment>, fetchArgs: { page?: number; itemsPerPage?: number; filters?: EquipmentFilters } = {}) => {
        try {            
            setLoading(true);
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
            await fetchEquipment(fetchArgs);
        } catch (e) {
            console.error('Error in addEquipment:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };   

    const updateEquipment = async (id: string, updatedData: Partial<Equipment>, fetchArgs: { page?: number; itemsPerPage?: number; filters?: EquipmentFilters } = {}) => {
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
            await fetchEquipment(fetchArgs);
        } catch (e) {
            console.error('Error in updateEquipment:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deleteEquipment = async (id: string, fetchArgs: { page?: number; itemsPerPage?: number; filters?: EquipmentFilters } = {}) => {
        try {
            setLoading(true);
            console.log(`Deleting equipment with ID ${id}`);
            
            const supabase = createClient();
            const { error: deleteError } = await supabase
                .from('equipment')
                .delete()
                .eq('id', id);
                
            if (deleteError) {
                console.error('Error deleting equipment:', deleteError);
                throw deleteError;
            }
            
            console.log('Equipment deleted successfully');
            await fetchEquipment(fetchArgs);
        } catch (e) {
            console.error('Error in deleteEquipment:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };    

    // Remove auto-fetch - let parent components control when to fetch
        
    return {
        equipment,
        totalCount,
        loading,
        error,
        fetchEquipment,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        refreshEquipment: fetchEquipment, // Alias for consistency
    }
}