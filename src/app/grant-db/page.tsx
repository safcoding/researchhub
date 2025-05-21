'use client';

import type { Grant } from '@/hooks/grant-logic';
import { GrantLogic } from '@/hooks/grant-logic';
import { GrantTable } from '@/components/grant-table';
import { GrantModal } from '@/components/grant-crud';
import { GrantFileUpload } from '@/components/grant-file-upload';
import { UploadedFilesModal } from '@/components/uploaded-files-modal';
import Navbar from '@/components/navbar';
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
    
    // Search and filter states, this is only the logic behind the thing
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<{
        field: 'PRO_DATESTART' | 'PRO_APPROVED';
        direction: 'asc' | 'desc';
    }>({ field: 'PRO_DATESTART', direction: 'desc' });

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

    // Filter and sort grants
    const filteredAndSortedGrants = () => {
        // First filter by search query
        let filtered = [...grants];
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(grant => 
                grant.PROJECT_TITLE?.toLowerCase().includes(query) || 
                grant.PL_NAME?.toLowerCase().includes(query)
            );
        }
        
        // Then sort
        return filtered.sort((a, b) => {
            if (sortOrder.field === 'PRO_DATESTART') {
                const dateA = new Date(a.PRO_DATESTART || '');
                const dateB = new Date(b.PRO_DATESTART || '');
                return sortOrder.direction === 'asc' 
                    ? dateA.getTime() - dateB.getTime() 
                    : dateB.getTime() - dateA.getTime();
            } else {
                const amountA = a.PRO_APPROVED || 0;
                const amountB = b.PRO_APPROVED || 0;
                return sortOrder.direction === 'asc' 
                    ? amountA - amountB 
                    : amountB - amountA;
            }
        });
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

                {/* Search and Filter Section, UI part */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Search by project title or PI name..."
                            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>                    <div className="flex gap-2">
                        <select 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={`${sortOrder.field}-${sortOrder.direction}`}
                            onChange={(e) => {
                                const [field, direction] = e.target.value.split('-');
                                setSortOrder({ 
                                    field: field as 'PRO_DATESTART' | 'PRO_APPROVED',
                                    direction: direction as 'asc' | 'desc'
                                });
                            }}
                            aria-label="Sort grants"
                        >
                            <option value="PRO_DATESTART-asc">Date (Oldest First)</option>
                            <option value="PRO_DATESTART-desc">Date (Newest First)</option>
                            <option value="PRO_APPROVED-asc">Amount (Low to High)</option>
                            <option value="PRO_APPROVED-desc">Amount (High to Low)</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}                {loading ? (
                    <p>Loading grants...</p>
                ) : (
                    <GrantTable
                        grants={filteredAndSortedGrants()}
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
                        grants={filteredAndSortedGrants()}
                        onClose={() => setShowChartModal(false)}
                    />
                )}
            </div>
        </>
    );
}