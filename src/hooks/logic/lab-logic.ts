'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export type Lab = {
    LABID: string;
    LAB_NAME: string;
    LAB_HEAD: string;
    LAB_HEAD_EMAIL: string;
    RESEARCH_AREA?: string;
    LAB_DESCRIPTION: string;
    LOCATION: string;
    LAB_STATUS: string;
    LAB_TYPE: string;
    CONTACT_PHONE: string;
}

export function LabLogic() {
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);    const fetchLabs = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching labs from database...');
            
            const supabase = createClient();
            const { data, error } = await supabase
                .from('labs')
                .select(`
                    LABID,
                    LAB_NAME,
                    LAB_HEAD,
                    LAB_HEAD_EMAIL,
                    RESEARCH_AREA,
                    LAB_DESCRIPTION,
                    LOCATION,
                    LAB_STATUS,
                    LAB_TYPE,
                    CONTACT_PHONE
                `);
            
            if (error) {
                console.error('Error fetching labs:', error);
                throw error;
            }
            
            console.log(`Successfully fetched ${data?.length || 0} labs`);
            setLabs(data || []);
        } catch (e) {
            console.error('Error in fetchLabs:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };
    
const addLab = async (newLab: Partial<Lab>) => {
    try {
        setLoading(true);
        const { LABID, ...labToInsert } = newLab;
        Object.keys(labToInsert).forEach(
            key => (labToInsert[key] === undefined || labToInsert[key] === null) && delete labToInsert[key]
        );
        console.log('Inserting lab:', labToInsert);
        const supabase = createClient();
        const { data, error } = await supabase.from('labs').insert([labToInsert]).select().single();
        if (error) {
            console.error('Error adding lab:', error);
            throw error;
        }
        console.log('Lab added successfully:', data);
        setLabs(prevLabs => [...prevLabs, data]);
        return data.LABID;
    } catch (e) {
        console.error('Error in addLab:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
        throw e;
    } finally {
        setLoading(false);
    }
};

    const updateLab = async (labId: string, updatedLab: Partial<Lab>) => {        try {
            setLoading(true);
            console.log(`Updating lab ${labId}:`, updatedLab);
            const supabase = createClient();
            const { data, error } = await supabase
                .from('labs')
                .update(updatedLab)
                .eq('LABID', labId)
                .select()
                .single();
            
            if (error) {
                console.error('Error updating lab:', error);
                throw error;
            }
            
            console.log('Lab updated successfully:', data);
            setLabs(prevLabs => 
                prevLabs.map(lab => lab.LABID === labId ? data : lab)
            );
            return data;
        } catch (e) {
            console.error('Error in updateLab:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deleteLab = async (labId: string) => {        try {
            setLoading(true);
            console.log(`Deleting lab ${labId}`);
            
            const supabase = createClient();
            const { error } = await supabase.from('labs').delete().eq('LABID', labId);
            
            if (error) {
                console.error('Error deleting lab:', error);
                throw error;
            }
            
            console.log('Lab deleted successfully');
            setLabs(prevLabs => prevLabs.filter(lab => lab.LABID !== labId));
        } catch (e) {
            console.error('Error in deleteLab:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {
    const fetchLabs = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('labs')
          .select(`
            LABID,
            LAB_NAME,
            LAB_HEAD,
            LAB_HEAD_EMAIL,
            RESEARCH_AREA,
            LAB_DESCRIPTION,
            LOCATION,
            LAB_STATUS,
            LAB_TYPE,
            CONTACT_PHONE
          `)
          .order('LAB_NAME');
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        console.log('Fetched labs:', data); // Debug log
        setLabs(data || []);
      } catch (error) {
        console.error('Error fetching labs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
}, []);

    return {
        labs,
        loading,
        error,
        addLab,
        updateLab,
        deleteLab,
        refetch: fetchLabs
    };
}
