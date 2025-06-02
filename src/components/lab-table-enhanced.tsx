import type {Lab} from '@/hooks/lab-logic';
import { LabLogic } from '@/hooks/lab-logic';
import { useState } from 'react';

export interface LabsTableProps {
    labs: Lab[];
    onEdit?: (lab: Lab) => void;
    onDelete?: (labId: string) => void;
}

export function LabTable({ labs, onEdit, onDelete }: LabsTableProps) {
    const { getFileUrl } = LabLogic();
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    
    // Pagination settings
    const itemsPerPage = 10;
    const totalPages = Math.ceil(labs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLabs = labs.slice(indexOfFirstItem, indexOfLastItem);
    
    const handleRowClick = (labId: string) => {
        if (expandedRow === labId) {
            setExpandedRow(null);
        } else {
            setExpandedRow(labId);
        }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };
    
    return (
        <div className="overflow-x-auto">
            <div className="mb-4 text-sm text-gray-600">
                Showing {currentLabs.length} of {labs.length} labs
            </div>

            {/* Mobile view (for small screens) */}
            <div className="md:hidden">
                {currentLabs.map((lab) => (
                    <div key={lab.LABID} className="mb-4 bg-white rounded-lg shadow">
                        <div 
                            className="p-4 cursor-pointer" 
                            onClick={() => handleRowClick(lab.LABID)}
                        >
                            <h3 className="font-bold text-lg">{lab.LAB_NAME}</h3>
                            <p className="text-sm text-gray-600">Head: {lab.LAB_HEAD}</p>
                            <p className="text-sm text-gray-600">Department: {lab.DEPARTMENT}</p>
                        </div>
                        
                        {expandedRow === lab.LABID && (
                            <div className="p-4 border-t">
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div>
                                        <span className="font-medium text-gray-600">Lab ID:</span>
                                        <p>{lab.LABID}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Research Area:</span>
                                        <p>{lab.RESEARCH_AREA}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Location:</span>
                                        <p>{lab.LOCATION}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Status:</span>
                                        <p>{lab.LAB_STATUS}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Type:</span>
                                        <p>{lab.LAB_TYPE}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Capacity:</span>
                                        <p>{lab.STUDENT_CAPACITY} students</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Equipment Count:</span>
                                        <p>{lab.EQUIPMENT_COUNT}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Budget:</span>
                                        <p>{formatCurrency(lab.BUDGET)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Established:</span>
                                        <p>{new Date(lab.ESTABLISHED_DATE).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Contact:</span>
                                        <p>{lab.CONTACT_PHONE}</p>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <span className="font-medium text-gray-600">Description:</span>
                                    <p className="mt-1 text-sm">{lab.LAB_DESCRIPTION}</p>
                                </div>
                                
                                <div className="flex gap-2">
                                    {onEdit && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(lab);
                                            }}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to delete this lab?')) {
                                                    onDelete(lab.LABID);
                                                }
                                            }}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop table view (for larger screens) */}
            <div className="hidden md:block">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Lab Name</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Lab Head</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Department</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Research Area</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Location</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Budget</th>
                            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLabs.map((lab) => (
                            <tr key={lab.LABID} className="hover:bg-gray-50">
                                <td className="px-4 py-3 border-b">
                                    <div className="font-medium text-gray-900">{lab.LAB_NAME}</div>
                                    <div className="text-sm text-gray-500">ID: {lab.LABID}</div>
                                </td>
                                <td className="px-4 py-3 border-b">
                                    <div className="text-gray-900">{lab.LAB_HEAD}</div>
                                    <div className="text-sm text-gray-500">{lab.LAB_HEAD_EMAIL}</div>
                                </td>
                                <td className="px-4 py-3 border-b text-gray-900">{lab.DEPARTMENT}</td>
                                <td className="px-4 py-3 border-b text-gray-900">{lab.RESEARCH_AREA}</td>
                                <td className="px-4 py-3 border-b text-gray-900">{lab.LOCATION}</td>
                                <td className="px-4 py-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        lab.LAB_STATUS === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : lab.LAB_STATUS === 'Inactive'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {lab.LAB_STATUS}
                                    </span>
                                </td>
                                <td className="px-4 py-3 border-b text-gray-900">{formatCurrency(lab.BUDGET)}</td>
                                <td className="px-4 py-3 border-b">
                                    <div className="flex gap-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(lab)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this lab?')) {
                                                        onDelete(lab.LABID);
                                                    }
                                                }}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
