import type {Grant} from '@/hooks/grant-logic';
import { GrantLogic } from '@/hooks/grant-logic';
import { useState } from 'react';

export interface GrantsTableProps {
    grants: Grant[];
    onEdit?: (grant: Grant) => void;
    onDelete?: (projectId: string) => void;
}

export function GrantTable({ grants, onEdit, onDelete }: GrantsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    
    // Pagination settings
    const itemsPerPage = 10;
    const totalPages = Math.ceil(grants.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGrants = grants.slice(indexOfFirstItem, indexOfLastItem);
    
    const handleRowClick = (projectId: string) => {
        if (expandedRow === projectId) {
            setExpandedRow(null);
        } else {
            setExpandedRow(projectId);
        }
    };
    
    return (
        <div className="overflow-x-auto">
            <div className="mb-4 text-sm text-gray-600">
                Showing {currentGrants.length} of {grants.length} grants
            </div>

            {/* Mobile view (for small screens) */}
            <div className="md:hidden">
                {currentGrants.map((grant) => (
                    <div key={grant.PROJECTID} className="mb-4 bg-white rounded-lg shadow">
                        <div 
                            className="p-4 cursor-pointer" 
                            onClick={() => handleRowClick(grant.PROJECTID)}
                        >
                            <h3 className="font-bold text-lg">{grant.PROJECT_TITLE}</h3>
                            <p className="text-sm text-gray-600">PI: {grant.PL_NAME}</p>
                        </div>
                        
                        {expandedRow === grant.PROJECTID && (
                            <div className="p-4 border-t">
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="text-gray-600 text-sm">COST CENTER:</div>
                                    <div>{grant.COST_CENTER_CODE}</div>
                                    
                                    <div className="text-gray-600 text-sm">STAFF NO:</div>
                                    <div>{grant.PL_STAFF_NO}</div>
                                    
                                    <div className="text-gray-600 text-sm">RESEARCH GROUP:</div>
                                    <div>{grant.RESEARCH_GROUP}</div>
                                    
                                    <div className="text-gray-600 text-sm">DATES:</div>
                                    <div>{grant.PRO_DATESTART} to {grant.PRO_DATEEND}</div>
                                    
                                    <div className="text-gray-600 text-sm">TYPE:</div>
                                    <div>{grant.GRANT_TYPE}</div>
                                    
                                    <div className="text-gray-600 text-sm">STATUS:</div>
                                    <div>{grant.PROJECT_STATUS}</div>
                                    
                                    <div className="text-gray-600 text-sm">SPONSOR:</div>
                                    <div>{grant.SPONSOR_CATEGORY} - {grant.SUBSPONSOR_NAME}</div>
                                    
                                    <div className="text-gray-600 text-sm">AMOUNT:</div>
                                    <div>${grant.PRO_APPROVED}</div>
                                </div>
                                
                                {(onEdit || onDelete) && (
                                    <div className="mt-4 flex gap-2">
                                        {onEdit && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(grant);
                                                }}
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(grant.PROJECTID);
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop view (for medium screens and larger) */}
            <div className="hidden md:block">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">COST CENTER CODE</th>
                            <th className="px-6 py-3 text-left">PL NAME</th>
                            <th className="px-6 py-3 text-left">PROJECT TITLE</th>
                            <th className="px-6 py-3 text-left">DATE START</th>
                            <th className="px-6 py-3 text-left">GRANT TYPE</th>
                            <th className="px-6 py-3 text-left">STATUS</th>
                            <th className="px-6 py-3 text-left">AMOUNT</th>
                            {(onEdit ?? onDelete) && <th className="px-6 py-3 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentGrants.map((grant) => (
                            <tr 
                                key={grant.PROJECTID} 
                                className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRowClick(grant.PROJECTID)}
                            >
                                <td className="px-6 py-4">{grant.COST_CENTER_CODE}</td>
                                <td className="px-6 py-4">{grant.PL_NAME}</td>
                                <td className="px-6 py-4">{grant.PROJECT_TITLE}</td>
                                <td className="px-6 py-4">{grant.PRO_DATESTART}</td>
                                <td className="px-6 py-4">{grant.GRANT_TYPE}</td>
                                <td className="px-6 py-4">{grant.PROJECT_STATUS}</td>
                                <td className="px-6 py-4">${grant.PRO_APPROVED}</td>
                                {(onEdit ?? onDelete) && (
                                    <td className="px-6 py-4">
                                        {onEdit && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(grant);
                                                }}
                                                className="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(grant.PROJECTID);
                                                }}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .map((pageNum, i, arr) => {
                                    const elements = [];                       
                                    // Add ellipsis if there are skipped pages
                                    if (i > 0 && pageNum - arr[i - 1] > 1) {
                                        elements.push(
                                            <span key={`ellipsis-before-${pageNum}`} className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500">
                                                ...
                                            </span>
                                        );
                                    }
                                    // Add the page number button
                                    elements.push(
                                        <button
                                            key={`page-${pageNum}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 border border-gray-300 ${
                                                currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                    
                                    return elements;
                                }).flat()}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}
