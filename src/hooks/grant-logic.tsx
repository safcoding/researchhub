import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db-connect';

export interface Grant {
    PROJECTID: string;
    COST_CENTER_CODE: string;
    PL_STAFF_NO: number;
    PL_NAME: string;
    PTJ_RESEARCH_ALLIANCE: string;
    RESEARCH_GROUP: string;
    PROJECT_TITLE: string;
    PRO_DATESTART: string;
    PRO_DATEEND: string;
    GRANT_TYPE: string;
    PROJECT_STATUS: string;
    SPONSOR_CATEGORY: string;
    SUBSPONSOR_NAME: string;
    PRO_APPROVED: number;
}

export function GrantLogic() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGrants = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('grant').select('*');
            if (error) throw error;
            setGrants(data || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const addGrant = async (newGrant: Omit<Grant, 'PROJECTID'>) => {
        try {
            const { error: insertError } = await supabase
                .from('grant')
                .insert([newGrant]);
            if (insertError) throw insertError;
            await fetchGrants();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
    };

    const updateGrant = async (projectId: string, updatedData: Partial<Grant>) => {
        try {
            const { error: updateError } = await supabase
                .from('grant')
                .update(updatedData)
                .eq('PROJECTID', projectId);
            if (updateError) throw updateError;
            await fetchGrants();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        }
    };

    const deleteGrant = async (projectId: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('grant')
                .delete()
                .eq('PROJECTID', projectId);
            if (deleteError) throw deleteError;
            await fetchGrants();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        }
    };

    useEffect(() => {
        fetchGrants();
    }, []);

    return {
        grants,
        loading,
        error,
        addGrant,
        updateGrant,
        deleteGrant
    };
}