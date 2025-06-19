import type {Lab} from '@/hooks/lab-logic';
import { useState } from 'react';

export interface LabsTableProps {
    labs: Lab[];
    onEdit?: (lab: Lab) => void;
    onDelete?: (labId: string) => void;
}

export function LabTable({ labs, onEdit, onDelete }: LabsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    
    // Pagination settings
    const itemsPerPage = 10;
    const totalPages = Math.ceil(labs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLabs = labs.slice(indexOfFirstItem, indexOfLastItem);    const handleRowClick = (labId: string) => {
        if (expandedRow === labId) {
            setExpandedRow(null);
        } else {
            setExpandedRow(labId);
        }
    };

    // Function to parse and visualize equipment list
    const parseEquipmentList = (equipmentList: string | undefined) => {
        if (!equipmentList || equipmentList.trim() === '') {
            return [];
        }
        
        // Split by common delimiters and clean up
        return equipmentList
            .split(/[,;\n\r]+/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
    };

    // Component to display equipment as badges
    const EquipmentBadges = ({ equipmentList, maxVisible = 3 }: { equipmentList: string | undefined, maxVisible?: number }) => {
        const equipment = parseEquipmentList(equipmentList);
        
        if (equipment.length === 0) {
            return <span className="text-gray-400 text-sm">No equipment listed</span>;
        }

        const visibleEquipment = equipment.slice(0, maxVisible);
        const remainingCount = equipment.length - maxVisible;

        return (
            <div className="flex flex-wrap gap-1">
                {visibleEquipment.map((item, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        title={item}
                    >
                        {item.length > 15 ? `${item.substring(0, 15)}...` : item}
                    </span>
                ))}
                {remainingCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{remainingCount} more
                    </span>
                )}
            </div>
        );
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
                            onClick={() => handleRowClick(lab.LABID)}                        >
                            <h3 className="font-bold text-lg">{lab.LAB_NAME}</h3>
                            <p className="text-sm text-gray-600">Head: {lab.LAB_HEAD}</p>
                            <p className="text-sm text-gray-600">Type: {lab.LAB_TYPE}</p>
                            {lab.EQUIPMENT_LIST && parseEquipmentList(lab.EQUIPMENT_LIST).length > 0 && (
                                <p className="text-sm text-blue-600 font-medium">
                                    📋 {parseEquipmentList(lab.EQUIPMENT_LIST).length} equipment items
                                </p>
                            )}
                        </div>
                        
                        {expandedRow === lab.LABID && (
                            <div className="p-4 border-t">                                <div className="grid grid-cols-2 gap-2 mb-3">
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
                                        <span className="font-medium text-gray-600">Contact:</span>
                                        <p>{lab.CONTACT_PHONE}</p>
                                    </div>                                    {lab.EQUIPMENT_LIST && (
                                        <div className="col-span-2">
                                            <span className="font-medium text-gray-600">Equipment ({parseEquipmentList(lab.EQUIPMENT_LIST).length} items):</span>
                                            <div className="mt-2">
                                                <EquipmentBadges equipmentList={lab.EQUIPMENT_LIST} maxVisible={6} />
                                            </div>
                                        </div>
                                    )}
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

            {/* Desktop table view (for larger screens) */}            <div className="hidden md:block">                <table className="min-w-full bg-white border border-gray-300"><thead className="bg-gray-50"><tr><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Lab Name</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Lab Head</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Lab Type</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Research Area</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Equipment</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Location</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Status</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Contact</th><th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Actions</th></tr></thead><tbody>{currentLabs.map((lab) => (
                            <tr key={lab.LABID} className="hover:bg-gray-50"><td className="px-4 py-3 border-b">
                                    <div className="font-medium text-gray-900">{lab.LAB_NAME}</div>
                                    <div className="text-sm text-gray-500">ID: {lab.LABID}</div>
                                </td><td className="px-4 py-3 border-b">
                                    <div className="text-gray-900">{lab.LAB_HEAD}</div>
                                    <div className="text-sm text-gray-500">{lab.LAB_HEAD_EMAIL}</div>
                                </td><td className="px-4 py-3 border-b text-gray-900">{lab.LAB_TYPE}</td><td className="px-4 py-3 border-b text-gray-900">{lab.RESEARCH_AREA ?? 'Not specified'}</td><td className="px-4 py-3 border-b">
                                    <EquipmentBadges equipmentList={lab.EQUIPMENT_LIST} maxVisible={2} />
                                </td><td className="px-4 py-3 border-b text-gray-900">{lab.LOCATION}</td><td className="px-4 py-3 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        lab.LAB_STATUS === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : lab.LAB_STATUS === 'Inactive'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {lab.LAB_STATUS}
                                    </span>
                                </td><td className="px-4 py-3 border-b text-gray-900">{lab.CONTACT_PHONE}</td><td className="px-4 py-3 border-b">                                    <div className="flex gap-2">
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
                                        )}                                    </div>                                </td></tr>
                        ))}</tbody></table>
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
