'use client';

import type { Grant } from '@/hooks/grant-logic';
import { GrantLogic } from '@/hooks/grant-logic';
import { GrantTable } from '@/components/grant-table';
import { GrantModal } from '@/components/grant-crud';  // Add this line
import { Navbar } from '@/components/navbar';
import { useState } from 'react';

export default function GrantDBPage() {
    const { grants, loading, error, addGrant, updateGrant, deleteGrant } = GrantLogic();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Grants Database</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Add New Grant
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

{loading ? (
                    <p>Loading grants...</p>
                ) : (
                    <GrantTable
                        grants={grants}
                        onEdit={setSelectedGrant}
                        onDelete={deleteGrant}
                    />
                )}

                {showAddModal && (
                    <GrantModal
                        onSave={handleAddGrant}
                        onClose={() => setShowAddModal(false)}
                    />
                )}

                {showEditModal && selectedGrant && (
                    <GrantModal
                        grant={selectedGrant}
                        onSave={handleUpdateGrant}
                        onClose={() => setShowEditModal(false)}
                    />
                )}
            </div>
        </>
    );
}