'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db-connect';

interface Grant {
    PROJECTID: string; // Primary Key
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

export default function GrantDBPage() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch grants on component mount
    useEffect(() => {
        const fetchGrants = async () => {
            setLoading(true);
            console.log('Fetching grants...');
            
            const { data, error } = await supabase
                .from('grant')
                .select('*');
    
            if (error) {
                console.error('Error fetching grants:', error);
                return;
            }
    
            console.log('Fetched data:', data);
            setGrants(data || []);
            setLoading(false);
        };
    
        void fetchGrants();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Grants Database</h1>

            {loading ? (
                <p>Loading grants...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left">COST CENTER CODE</th>
                                <th className="px-6 py-3 text-left">PL STAFF NUMBER</th>
                                <th className="px-6 py-3 text-left">PL NAME</th>
                                <th className="px-6 py-3 text-left">PROJECT RESEARCH ALLIANCE</th>
                                <th className="px-6 py-3 text-left">RESEARCH GROUP</th>
                                <th className="px-6 py-3 text-left">PROJECT TITLE</th>
                                <th className="px-6 py-3 text-left">DATE START</th>
                                <th className="px-6 py-3 text-left">DATE END</th>
                                <th className="px-6 py-3 text-left">GRANT TYPE</th>
                                <th className="px-6 py-3 text-left">PROJECT STATUS</th>
                                <th className="px-6 py-3 text-left">SPONSOR CATEGORY</th>
                                <th className="px-6 py-3 text-left">SUBSPONSOR NAME</th>
                                <th className="px-6 py-3 text-left">APPROVED AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grants.map((grant) => (
                                <tr key={grant.PROJECTID} className="border-b">
                                    <td className="px-6 py-4">{grant.COST_CENTER_CODE}</td>
                                    <td className="px-6 py-4">{grant.PL_STAFF_NO}</td>
                                    <td className="px-6 py-4">{grant.PL_NAME}</td>
                                    <td className="px-6 py-4">{grant.PTJ_RESEARCH_ALLIANCE}</td>
                                    <td className="px-6 py-4">{grant.RESEARCH_GROUP}</td>
                                    <td className="px-6 py-4">{grant.PROJECT_TITLE}</td>
                                    <td className="px-6 py-4">{grant.PRO_DATESTART}</td>
                                    <td className="px-6 py-4">{grant.PRO_DATEEND}</td>
                                    <td className="px-6 py-4">{grant.GRANT_TYPE}</td>
                                    <td className="px-6 py-4">{grant.PROJECT_STATUS}</td>
                                    <td className="px-6 py-4">{grant.SPONSOR_CATEGORY}</td>
                                    <td className="px-6 py-4">{grant.SUBSPONSOR_NAME}</td>
                                    <td className="px-6 py-4">${grant.PRO_APPROVED}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}