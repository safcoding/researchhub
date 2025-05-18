'use client';

import type { Grant } from '@/hooks/grant-logic';
import { GrantLogic } from '@/hooks/grant-logic';
import { GrantTable } from '@/components/grant-table';
import { GrantModal } from '@/components/grant-crud';
import { GrantFileUpload } from '@/components/grant-file-upload';
import { UploadedFilesModal } from '@/components/uploaded-files-modal';
import { Navbar } from '@/components/navbar';
import { GrantChartModal } from '@/components/grant-chart-modal';
import { useState } from 'react';

export default function GrantDBPage() {
    const { grants, loading, error, addGrant, addBulkGrants, updateGrant, deleteGrant } = GrantLogic();    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);
    const [showUploadedFilesModal, setShowUploadedFilesModal] = useState(false);
    const [showChartModal, setShowChartModal] = useState(false);
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);

    const handleAddGrant = async (newGrant: Partial<Grant>) => {
        await addGrant(newGrant as Omit<Grant, 'PROJECTID'>);
        setShowAddModal(false);
    };

    const handleUpdateGrant = async (updatedGrant: Partial<Grant>) => {
        if (selectedGrant?.PROJECTID) {
            await updateGrant(selectedGrant.PROJECTID, updatedGrant);
            setShowEditModal(false);
            setSelectedGrant(null);
        }
    };
    
    const handleFileUploadComplete = async (parsedGrants: Omit<Grant, 'PROJECTID'>[], filePath: string) => {
        await addBulkGrants(parsedGrants, filePath);
        setShowFileUploadModal(false);
    };

    const handleEditClick = (grant: Grant) => {
        setSelectedGrant(grant);
        setShowEditModal(true);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Grants Database</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFileUploadModal(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Upload Excel File
                        </button>                        
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Single Grant
                        </button>                          <button
                            onClick={() => setShowUploadedFilesModal(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            View Uploaded Files
                        </button>
                        <button
                            onClick={() => setShowChartModal(true)}
                            className="bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                            View Charts
                        </button>
                    </div>
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
                        onEdit={handleEditClick}
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
                {showFileUploadModal && (
                    <GrantFileUpload
                        onUploadComplete={handleFileUploadComplete}
                        onCancel={() => setShowFileUploadModal(false)}
                    />
                )}
                  {showUploadedFilesModal && (
                    <UploadedFilesModal 
                        onClose={() => setShowUploadedFilesModal(false)}
                    />
                )}
                
                {showChartModal && (
                    <GrantChartModal 
                        grants={grants}
                        onClose={() => setShowChartModal(false)}
                    />
                )}
            </div>
        </>
    );
}