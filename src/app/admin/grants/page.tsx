'use client';

import type { Grant } from '@/hooks/grant-logic';
import { GrantLogic } from '@/hooks/grant-logic';
import { GrantTable } from '@/components/admin-components/grant-table';
import { GrantModal } from '@/components/admin-components/grant-form';
import { useState } from 'react';

import { AdminSidebar } from "@/components/admin-sidebar/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default function GrantDBPage() {
    const { grants, loading, error, addGrant, updateGrant, deleteGrant } = GrantLogic();    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
      // Search and filter states, this is only the logic behind the thing
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<{
        field: 'PRO_DATESTART' | 'PRO_APPROVED';
        direction: 'asc' | 'desc';
    }>({ field: 'PRO_DATESTART', direction: 'desc' });const handleAddGrant = async (newGrant: Partial<Grant>) => {
        await addGrant(newGrant);
        setShowAddModal(false);
    };

    const handleUpdateGrant = async (updatedGrant: Partial<Grant>) => {
        if (selectedGrant?.PROJECTID) {
            await updateGrant(selectedGrant.PROJECTID, updatedGrant);
            setShowEditModal(false);
            setSelectedGrant(null);
        }
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
    
    // Filter by selected year
    if (selectedYear && selectedYear !== '') {
        filtered = filtered.filter(grant => {
            if (grant.PRO_DATESTART) {
                const grantYear = new Date(grant.PRO_DATESTART).getFullYear().toString();
                return grantYear === selectedYear;
            }
            return false;
        });
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

const getAvailableYears = () => {
    const years = new Set<string>();
    grants.forEach(grant => {
        if (grant.PRO_DATESTART) {
            const year = new Date(grant.PRO_DATESTART).getFullYear().toString();
            years.add(year);
        }
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
};

 return (
      <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>

            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Grants Database</h1>
                    <div className="flex gap-2">                      
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Single Grant
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
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            aria-label="Filter by year"
                        >
                            <option value="">All Years</option>
                            {getAvailableYears().map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
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
            </div>
      </SidebarInset>
    </SidebarProvider>
    );
}