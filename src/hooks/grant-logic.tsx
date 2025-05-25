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
    file_path?: string;
}

export function GrantLogic() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);    const fetchGrants = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching grants from database...');
            
            const { data, error } = await supabase.from('grant').select('*');
            
            if (error) {
                console.error('Error fetching grants:', error);
                throw error;
            }
            
            console.log(`Successfully fetched ${data?.length || 0} grants`);
            setGrants(data || []);
        } catch (e) {
            console.error('Error in fetchGrants:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };const addGrant = async (newGrant: Partial<Grant>) => {
        try {
            setLoading(true);
            console.log('Adding new grant:', newGrant);
            
            // Ensure PROJECTID is provided or generate a new one
            if (!newGrant.PROJECTID) {
                // Generate a unique PROJECTID if not provided
                newGrant.PROJECTID = `PRJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                console.log('Generated PROJECTID:', newGrant.PROJECTID);
            }
            
            const { data, error: insertError } = await supabase
                .from('grant')
                .insert([newGrant])
                .select();
                
            if (insertError) {
                console.error('Error adding grant:', insertError);
                throw insertError;
            }
            
            console.log('Grant added successfully:', data);
            await fetchGrants();
        } catch (e) {
            console.error('Error in addGrant:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };    const addBulkGrants = async (grants: Omit<Grant, 'PROJECTID'>[], filePath?: string) => {
        try {
            setLoading(true);
            console.log(`Adding ${grants.length} grants with file path:`, filePath);
            
            // Create a new array with optional file path
            const grantsWithFilePath = grants.map(grant => ({
                ...grant,
                file_path: filePath ?? null
            }));

            const { data, error: insertError } = await supabase
                .from('grant')
                .insert(grantsWithFilePath)
                .select();
                
            if (insertError) {
                console.error('Error adding bulk grants:', insertError);
                throw insertError;
            }
            
            console.log(`${data?.length || 0} grants added successfully`);
            await fetchGrants();
        } catch (e) {
            console.error('Error in addBulkGrants:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };    const updateGrant = async (projectId: string, updatedData: Partial<Grant>) => {
        try {
            setLoading(true);
            console.log(`Updating grant with ID ${projectId}:`, updatedData);
            
            const { data, error: updateError } = await supabase
                .from('grant')
                .update(updatedData)
                .eq('PROJECTID', projectId)
                .select();
                
            if (updateError) {
                console.error('Error updating grant:', updateError);
                throw updateError;
            }
            
            console.log('Grant updated successfully:', data);
            await fetchGrants();
        } catch (e) {
            console.error('Error in updateGrant:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };    const deleteGrant = async (projectId: string) => {
        try {
            setLoading(true);
            console.log(`Deleting grant with ID ${projectId}`);
            
            const { data, error: deleteError } = await supabase
                .from('grant')
                .delete()
                .eq('PROJECTID', projectId)
                .select();
                
            if (deleteError) {
                console.error('Error deleting grant:', deleteError);
                throw deleteError;
            }
            
            console.log('Grant deleted successfully:', data);
            await fetchGrants();
        } catch (e) {
            console.error('Error in deleteGrant:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        } finally {
            setLoading(false);
        }
    };    const getFileUrl = (filePath: string | null | undefined, bucket = 'grants'): string => {
        if (!filePath) {
            return '';
        }
        
        try {
            // Get the public URL for the file
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);
            
            if (!data?.publicUrl) {
                console.warn('No public URL returned for file:', filePath);
                return '';
            }
            
            console.log('Generated public URL:', data.publicUrl);    
            return data.publicUrl;
        } catch (e) {
            console.error('Error getting file URL:', e);
            return '';
        }
    };

    useEffect(() => {
        void fetchGrants();
    }, []);

    return {
        grants,
        loading,
        error,
        addGrant,
        addBulkGrants,
        updateGrant,
        deleteGrant,
        getFileUrl
    };
}