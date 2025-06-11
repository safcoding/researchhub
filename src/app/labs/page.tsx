'use client';

import { LabLogic, type Lab } from '@/hooks/lab-logic';
import { LabTable } from '@/components/lab-table-enhanced';
import { LabModal } from '@/components/lab-crud-enhanced';
import { LabChartModal } from '@/components/lab-chart-modal';
import Navbar from '@/components/navbar';
import { useState } from 'react';

export default function LabsPage() {
    const { labs, loading, error, addLab, updateLab, deleteLab } = LabLogic();    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);
    const [showUploadedFilesModal, setShowUploadedFilesModal] = useState(false);
    const [showChartModal, setShowChartModal] = useState(false);
    const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
    
    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedLabType, setSelectedLabType] = useState<string>('');    const [sortOrder, setSortOrder] = useState<{
        field: 'LAB_NAME' | 'LAB_TYPE';
        direction: 'asc' | 'desc';
    }>({ field: 'LAB_NAME', direction: 'asc' });const handleAddLab = async (newLab: Partial<Lab>) => {
        try {
            await addLab(newLab);
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding lab:', error);
            // Error will be handled by the modal component
        }
    };

    const handleUpdateLab = async (updatedLab: Partial<Lab>) => {
        if (selectedLab?.LABID) {
            try {
                await updateLab(selectedLab.LABID, updatedLab);
                setShowEditModal(false);
                setSelectedLab(null);
            } catch (error) {
                console.error('Error updating lab:', error);
                // Error will be handled by the modal component
            }
        }
    };
      const handleEditClick = (lab: Lab) => {
        setSelectedLab(lab);
        setShowEditModal(true);
    };

    // Filter and sort labs
    const filteredAndSortedLabs = () => {
        // First filter by search query
        let filtered = [...labs];
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(lab => 
                lab.LAB_NAME?.toLowerCase().includes(query) || 
                lab.LAB_HEAD?.toLowerCase().includes(query) ||
                lab.RESEARCH_AREA?.toLowerCase().includes(query)
            );
        }
          // Filter by selected department
        if (selectedDepartment && selectedDepartment !== '') {
            filtered = filtered.filter(lab => lab.DEPARTMENT === selectedDepartment);
        }

        // Filter by selected lab type
        if (selectedLabType && selectedLabType !== '') {
            filtered = filtered.filter(lab => lab.LAB_TYPE === selectedLabType);
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            const direction = sortOrder.direction === 'asc' ? 1 : -1;
            const aValue = String(a[sortOrder.field] ?? '');
            const bValue = String(b[sortOrder.field] ?? '');
            return direction * aValue.localeCompare(bValue);
        });
    };

    // Get available departments from labs for the filter dropdown
    const getAvailableDepartments = () => {
        const departments = new Set<string>();
        labs.forEach(lab => {
            if (lab.DEPARTMENT) {
                departments.add(lab.DEPARTMENT);
            }
        });
        return Array.from(departments).sort();
    };

    // Get available lab types from labs for the filter dropdown
    const getAvailableLabTypes = () => {
        const labTypes = new Set<string>();
        labs.forEach(lab => {
            if (lab.LAB_TYPE) {
                labTypes.add(lab.LAB_TYPE);
            }
        });
        return Array.from(labTypes).sort();
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Laboratory Database</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFileUploadModal(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                            Upload Excel File
                        </button>                        
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Add Lab
                        </button>                          
                        <button
                            onClick={() => setShowUploadedFilesModal(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                        >
                            View Uploaded Files
                        </button>
                        <button
                            onClick={() => setShowChartModal(true)}
                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                        >
                            View Charts
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                    <div className="relative w-full lg:w-96">
                        <input
                            type="text"
                            placeholder="Search by lab name, head, or research area..."
                            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>                    
                    <div className="flex flex-wrap gap-2">
                        <select 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            aria-label="Filter by department"
                        >
                            <option value="">All Departments</option>
                            {getAvailableDepartments().map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        <select 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedLabType}
                            onChange={(e) => setSelectedLabType(e.target.value)}
                            aria-label="Filter by lab type"
                        >
                            <option value="">All Lab Types</option>
                            {getAvailableLabTypes().map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <select 
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={`${sortOrder.field}-${sortOrder.direction}`}
                            onChange={(e) => {
                                const [field, direction] = e.target.value.split('-');
                                setSortOrder({ 
                                    field: field as  'LAB_NAME' | 'LAB_TYPE',
                                    direction: direction as 'asc' | 'desc'
                                });
                            }}
                            aria-label="Sort labs"
                        >
                            <option value="LAB_NAME-asc">Name (A-Z)</option>
                            <option value="LAB_NAME-desc">Name (Z-A)</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading laboratories...</span>
                    </div>
                ) : (
                    <LabTable
                        labs={filteredAndSortedLabs()}
                        onEdit={handleEditClick}
                        onDelete={deleteLab}
                    />
                )}

                {showAddModal && (
                    <LabModal
                        onSave={handleAddLab}
                        onClose={() => setShowAddModal(false)}
                    />
                )}

                {showEditModal && selectedLab && (
                    <LabModal
                        lab={selectedLab}
                        onSave={handleUpdateLab}
                        onClose={() => setShowEditModal(false)}
                    />
                )}                
                
                {/* TODO: Implement remaining modals when components are created */}
                {showFileUploadModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">File Upload</h2>
                            <p className="text-gray-600 mb-4">Lab file upload component will be implemented next.</p>
                            <button
                                onClick={() => setShowFileUploadModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {showUploadedFilesModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>
                            <p className="text-gray-600 mb-4">Uploaded files modal will be implemented next.</p>
                            <button
                                onClick={() => setShowUploadedFilesModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}                {showChartModal && (
                    <LabChartModal
                        labs={labs}
                        onClose={() => setShowChartModal(false)}
                    />
                )}
            </div>
        </>
    );
}
