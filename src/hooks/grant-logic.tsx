import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Grant {
    grant_id?: string;
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
    SPONSOR_NAME: string;
    file_path?: string;
}

export interface GrantStats {
    monthly: number;
    quarterly: number;
    yearly: number;
}

export interface GrantTypeData {
    type: string;
    percentage: number;
    amount: number;
    count: number;
}

export interface TimelineData {
    labels: string[];
    values: number[];
}

export function GrantLogic() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ FIXED: Fetch all grants without date restrictions
    const fetchGrants = useCallback(async () => {
        try {            setLoading(true);
            setError(null);
            
            console.log('🔍 Fetching ALL grants from database...');
            
            // ✅ CRITICAL: Remove any date filtering - fetch ALL data
            const supabase = createClient();
            const { data, error: fetchError } = await supabase
                .from('grant')
                .select('*')
                .order('PRO_DATESTART', { ascending: false }); // Just ordering, not filtering
            
            console.log('📊 Raw data count from Supabase:', data?.length);
            console.log('📊 Date range in data:', {
                earliest: data?.length ? Math.min(...data.map((g: any) => new Date(g.PRO_DATESTART || '').getFullYear())) : 'N/A',
                latest: data?.length ? Math.max(...data.map((g: any) => new Date(g.PRO_DATESTART || '').getFullYear())) : 'N/A'
            });
            
            if (fetchError) {
                console.error('❌ Supabase fetch error:', fetchError);
                throw fetchError;
            }
            
            setGrants(data || []);
            console.log('✅ Successfully loaded grants:', data?.length || 0);
            
        } catch (e) {
            console.error('❌ Error fetching grants:', e);
            setError(e instanceof Error ? e.message : 'Failed to fetch grants');
        } finally {
            setLoading(false);
        }
    }, []);
    
    const addGrant = async (newGrant: Partial<Grant>) => {
        try {            setLoading(true);
            console.log('Adding new grant:', newGrant);
     
            const { grant_id, ...grantData } = newGrant as Grant;
            const supabase = createClient();
            const { data, error: insertError } = await supabase
                .from('grant')
                .insert([grantData])
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
    };    
    
    const updateGrant = async (projectId: string, updatedData: Partial<Grant>) => {
        try {
            setLoading(true);
            console.log(`Updating grant with ID ${projectId}:`, updatedData);
            
            const supabase = createClient();
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
            
            const supabase = createClient();
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
    };    

    // Analytics functions
     const getGrantStats = (): GrantStats => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const currentQuarter = Math.floor(currentMonth / 3);

       const monthly = grants
            .filter(grant => {
                const grantDate = new Date(grant.PRO_DATESTART);
                return grantDate.getMonth() === currentMonth && 
                       grantDate.getFullYear() === currentYear;
            })
            .reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);

        const quarterly = grants
            .filter(grant => {
                const grantDate = new Date(grant.PRO_DATESTART);
                const grantQuarter = Math.floor(grantDate.getMonth() / 3);
                return grantQuarter === currentQuarter && 
                       grantDate.getFullYear() === currentYear;
            })
            .reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);

        const yearly = grants
            .filter(grant => {
                const grantDate = new Date(grant.PRO_DATESTART);
                return grantDate.getFullYear() === currentYear;
            })
            .reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);

        return { monthly, quarterly, yearly };
    };

       const getGrantTypeData = (): GrantTypeData[] => {
        const totalAmount = grants.reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);
        const typeGroups = grants.reduce((acc, grant) => {
            const type = grant.GRANT_TYPE || 'Unknown';
            if (!acc[type]) {
                acc[type] = { amount: 0, count: 0 };
            }
            acc[type].amount += grant.PRO_APPROVED;
            acc[type].count += 1;
            return acc;
        }, {} as Record<string, { amount: number; count: number }>);

        return Object.entries(typeGroups).map(([type, data]) => ({
            type,
            amount: data.amount,
            count: data.count,
            percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
        }));
    };

     const getSponsorCategoryData = (): GrantTypeData[] => {
        const totalAmount = grants.reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);
        const categoryGroups = grants.reduce((acc, grant) => {
            const category = grant.SPONSOR_CATEGORY || 'Unknown';
            if (!acc[category]) {
                acc[category] = { amount: 0, count: 0 };
            }
            acc[category].amount += grant.PRO_APPROVED;
            acc[category].count += 1;
            return acc;
        }, {} as Record<string, { amount: number; count: number }>);

        return Object.entries(categoryGroups).map(([type, data]) => ({
            type,
            amount: data.amount,
            count: data.count,
            percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
        }));
    };

        const getTimelineData = (): TimelineData => {
        const months = [];
        const values = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            months.push(monthName);

            const monthlyTotal = grants
                .filter(grant => {
                    const grantDate = new Date(grant.PRO_DATESTART);
                    return grantDate.getMonth() === date.getMonth() && 
                           grantDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);

            values.push(monthlyTotal / 1000); // Convert to thousands for display
        }

        return { labels: months, values };
    };

    const getActiveGrants = () => {
        return grants.filter(grant => 
            grant.PROJECT_STATUS?.toLowerCase() === 'active' || 
            grant.PROJECT_STATUS?.toLowerCase() === 'ongoing'
        );
    };

    const getTotalApprovedAmount = () => {
        return grants.reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);
    };

    useEffect(() => {
        void fetchGrants();
    }, [fetchGrants]);

    return {
        grants,
        loading,
        error,
        addGrant,
        updateGrant,
        deleteGrant,
        //Analytics functions
        getGrantStats,
        getGrantTypeData,
        getSponsorCategoryData,
        getTimelineData,
        getActiveGrants,
        getTotalApprovedAmount
    };
}