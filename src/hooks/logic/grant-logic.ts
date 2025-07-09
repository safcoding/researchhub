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
}

export interface GrantFilters {
    searchText?: string;
    status?: string;
    grantType?: string;
    year?: string;
    month?: string;
    dateFrom?: string;
    dateTo?: string;
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
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGrants = useCallback(
        async ({
            page = 1,
            itemsPerPage = 10,
            filters = {},
        }: {
            page?: number;
            itemsPerPage?: number;
            filters?: GrantFilters;
        }) => {
            setLoading(true);
            setError(null);
            const supabase = createClient();

            let query = supabase
                .from('grant')
                .select('*', { count: 'exact' })
                .order('PRO_DATESTART', { ascending: false });

            // Search by project ID, project title, or PL name
            if (filters.searchText && filters.searchText.trim() !== '') {
                query = query.or(
                    `PROJECTID.ilike.%${filters.searchText}%,PROJECT_TITLE.ilike.%${filters.searchText}%,PL_NAME.ilike.%${filters.searchText}%`
                );
            }

            // Filter by status
            if (filters.status && filters.status !== 'all' && filters.status !== '') {
                query = query.eq('PROJECT_STATUS', filters.status);
            }

            // Filter by grant type
            if (filters.grantType && filters.grantType !== 'all' && filters.grantType !== '') {
                query = query.eq('GRANT_TYPE', filters.grantType);
            }

            // Filter by year
            if (filters.year && filters.year !== 'all' && filters.year !== '') {
                query = query.gte('PRO_DATESTART', `${filters.year}-01-01`).lte('PRO_DATESTART', `${filters.year}-12-31`);
            }

            // Filter by month (must also have year)
            if (
                filters.month &&
                filters.month !== 'all' &&
                filters.month !== '' &&
                filters.year &&
                filters.year !== 'all' &&
                filters.year !== ''
            ) {
                // Pad month to 2 digits
                const month = filters.month.padStart(2, '0');
                query = query.gte('PRO_DATESTART', `${filters.year}-${month}-01`).lte('PRO_DATESTART', `${filters.year}-${month}-31`);
            }

            // Filter by date range
            if (filters.dateFrom && filters.dateTo) {
                query = query.gte('PRO_DATESTART', filters.dateFrom).lte('PRO_DATESTART', filters.dateTo);
            } else if (filters.dateFrom) {
                query = query.gte('PRO_DATESTART', filters.dateFrom);
            } else if (filters.dateTo) {
                query = query.lte('PRO_DATESTART', filters.dateTo);
            }

            // Pagination
            const from = (page - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;
            const { data, error, count } = await query.range(from, to);

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }
            setGrants(data || []);
            setTotalCount(count || 0);
            setLoading(false);
        },
        []
    );

    const addGrant = async (
        newGrant: Omit<Grant, 'grant_id'>,
        fetchArgs: { page?: number; itemsPerPage?: number; filters?: GrantFilters }
    ) => {
        try {
            setError(null);
            const supabase = createClient();
            const { data, error } = await supabase
                .from('grant')
                .insert([newGrant])
                .select();

            if (error) throw error;
            await fetchGrants(fetchArgs); // Pass current page/filters
            return data;
        } catch (e) {
            console.error('Error adding grant!', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        }
    };

    const updateGrant = async (
        projectId: string,
        updatedGrant: Partial<Grant>,
        fetchArgs: { page?: number; itemsPerPage?: number; filters?: GrantFilters }
    ) => {
        try {
            setError(null);
            const supabase = createClient();
            const { data, error } = await supabase
                .from('grant')
                .update(updatedGrant)
                .eq('PROJECTID', projectId)
                .select();

            if (error) throw error;
            await fetchGrants(fetchArgs); // Pass current page/filters
            return data;
        } catch (e) {
            console.error('Error updating grant!', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        }
    };

    const deleteGrant = async (
        projectId: string,
        fetchArgs: { page?: number; itemsPerPage?: number; filters?: GrantFilters }
    ) => {
        try {
            setError(null);
            const supabase = createClient();
            const { error } = await supabase
                .from('grant')
                .delete()
                .eq('PROJECTID', projectId);

            if (error) throw error;
            await fetchGrants(fetchArgs); // Pass current page/filters
        } catch (e) {
            console.error('Error deleting grant!', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
            throw e;
        }
    };

    const refreshGrants = useCallback(fetchGrants, [fetchGrants]);

    // Optimized dashboard analytics functions that don't require all grants data
    const fetchDashboardStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        try {
            // Fetch all grants for analytics (we need all data for accurate analytics)
            const { data: allGrants, error } = await supabase
                .from('grant')
                .select('*')
                .order('PRO_DATESTART', { ascending: false });

            if (error) throw error;
            
            // Store grants for analytics
            setGrants(allGrants || []);
            setTotalCount(allGrants?.length || 0);
            
        } catch (e) {
            console.error('Error fetching dashboard stats:', e);
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    // Analytics functions that work with the grants data
    const getDashboardStats = (): GrantStats => {
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

    const getCumulativeTimelineData = (): TimelineData => {
        const currentYear = new Date().getFullYear();
        
        // Create monthly data for current year
        const monthlyAmounts: number[] = new Array(12).fill(0);
        
        // Aggregate grants by month for current year only
        grants.forEach(grant => {
            const date = new Date(grant.PRO_DATESTART);
            const year = date.getFullYear();
            const month = date.getMonth(); // 0-11
            
            if (year === currentYear && month >= 0 && month < 12) {
                monthlyAmounts[month] = (monthlyAmounts[month] || 0) + grant.PRO_APPROVED;
            }
        });

        // Create cumulative amounts - each month adds to the previous total
        const cumulativeAmounts: number[] = [];
        let runningTotal = 0;
        
        for (let i = 0; i < 12; i++) {
            runningTotal += (monthlyAmounts[i] || 0);
            cumulativeAmounts.push(runningTotal);
        }

        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        return {
            labels: monthNames,
            values: cumulativeAmounts
        };
    };

    const getGrantTypeData = (): GrantTypeData[] => {
        const typeMap: Map<string, { amount: number; count: number }> = new Map();
        
        grants.forEach(grant => {
            const type = grant.GRANT_TYPE || 'Unknown';
            const current = typeMap.get(type) || { amount: 0, count: 0 };
            typeMap.set(type, {
                amount: current.amount + grant.PRO_APPROVED,
                count: current.count + 1
            });
        });

        const totalAmount = grants.reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);
        
        return Array.from(typeMap.entries()).map(([type, data]) => ({
            type,
            amount: data.amount,
            count: data.count,
            percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
        }));
    };

    const getTimelineData = (): TimelineData => {
        const monthlyData: Map<string, number> = new Map();
        
        grants.forEach(grant => {
            const date = new Date(grant.PRO_DATESTART);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            const current = monthlyData.get(monthKey) || 0;
            monthlyData.set(monthKey, current + grant.PRO_APPROVED);
        });

        const sortedEntries = Array.from(monthlyData.entries()).sort();
        
        return {
            labels: sortedEntries.map(([date]) => date),
            values: sortedEntries.map(([, amount]) => amount)
        };
    };

    const getSponsorCategoryData = (): GrantTypeData[] => {
        const categoryMap: Map<string, { amount: number; count: number }> = new Map();
        
        grants.forEach(grant => {
            const category = grant.SPONSOR_CATEGORY || 'Unknown';
            const current = categoryMap.get(category) || { amount: 0, count: 0 };
            categoryMap.set(category, {
                amount: current.amount + grant.PRO_APPROVED,
                count: current.count + 1
            });
        });

        const totalAmount = grants.reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);
        
        return Array.from(categoryMap.entries()).map(([type, data]) => ({
            type,
            amount: data.amount,
            count: data.count,
            percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0
        }));
    };

    const getTotalApprovedAmount = (): number => {
        return grants.reduce((sum, grant) => sum + grant.PRO_APPROVED, 0);
    };

    useEffect(() => {
    }, []);

    return {
        grants,
        totalCount,
        loading,
        error,
        fetchGrants,
        refreshGrants,
        fetchDashboardStats,
        addGrant,
        updateGrant,
        deleteGrant,
        getGrantStats: getDashboardStats,
        getGrantTypeData,
        getTimelineData: getCumulativeTimelineData,
        getSponsorCategoryData,
        getTotalApprovedAmount,
    };
}
