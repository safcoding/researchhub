'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'postgresql://postgres:7M%B@Mf20Ac$@db.fqtizehthryjvqxqvpkl.supabase.co:5432/postgres',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdGl6ZWh0aHJ5anZxeHF2cGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDQ5NzAsImV4cCI6MjA2MDUyMDk3MH0.ydPnhIFnCiUUaCIrSHyFNp49Fewd-QpZangTPleKc_o'
);


interface Grant {
    id: number;
    name: string;
    amount: number;
}

export default function GrantDBPage() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [newGrant, setNewGrant] = useState({ name: '', amount: 0 });
    const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGrants();
    }, []);

    const fetchGrants = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('grants').select('*');
        if (error) {
            console.error('Error fetching grants:', error);
        } else {
            setGrants(data || []);
        }
        setLoading(false);
    };

    const addGrant = async () => {
        const { error } = await supabase.from('grants').insert([newGrant]);
        if (error) {
            console.error('Error adding grant:', error);
        } else {
            fetchGrants();
            setNewGrant({ name: '', amount: 0 });
        }
    };

    const updateGrant = async (id: number) => {
        if (!editingGrant) return;
        const { error } = await supabase
            .from('grants')
            .update({ name: editingGrant.name, amount: editingGrant.amount })
            .eq('id', id);
        if (error) {
            console.error('Error updating grant:', error);
        } else {
            fetchGrants();
            setEditingGrant(null);
        }
    };

    const deleteGrant = async (id: number) => {
        if (confirm('Are you sure you want to delete this grant?')) {
            const { error } = await supabase.from('grants').delete().eq('id', id);
            if (error) {
                console.error('Error deleting grant:', error);
            } else {
                fetchGrants();
            }
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Grant Database</h1>
            
            {/* Add New Grant Form */}
            <div className="mb-8 p-4 bg-gray-50 rounded">
                <h2 className="text-xl mb-4">Add New Grant</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Grant Name"
                        value={newGrant.name}
                        onChange={(e) => setNewGrant({ ...newGrant, name: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newGrant.amount}
                        onChange={(e) => setNewGrant({ ...newGrant, amount: Number(e.target.value) })}
                        className="border p-2 rounded"
                    />
                    <button 
                        onClick={addGrant}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Grant
                    </button>
                </div>
            </div>

            {/* Grants Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Amount</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grants.map((grant) => (
                            <tr key={grant.id}>
                                <td className="border p-2">
                                    {editingGrant?.id === grant.id ? (
                                        <input
                                            type="text"
                                            value={editingGrant.name}
                                            onChange={(e) => setEditingGrant({
                                                ...editingGrant,
                                                name: e.target.value
                                            })}
                                            className="border p-1"
                                        />
                                    ) : (
                                        grant.name
                                    )}
                                </td>
                                <td className="border p-2">
                                    {editingGrant?.id === grant.id ? (
                                        <input
                                            type="number"
                                            value={editingGrant.amount}
                                            onChange={(e) => setEditingGrant({
                                                ...editingGrant,
                                                amount: Number(e.target.value)
                                            })}
                                            className="border p-1"
                                        />
                                    ) : (
                                        `$${grant.amount}`
                                    )}
                                </td>
                                <td className="border p-2">
                                    {editingGrant?.id === grant.id ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => updateGrant(grant.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingGrant(null)}
                                                className="bg-gray-500 text-white px-2 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setEditingGrant(grant)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteGrant(grant.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}