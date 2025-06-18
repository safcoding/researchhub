import type {Grant} from '@/hooks/grant-logic';
import { GrantLogic } from '@/hooks/grant-logic';
import { useState } from 'react';

export interface GrantsTableProps {
    grants: Grant[];
    onEdit?: (grant: Grant) => void;
    onDelete?: (projectId: string) => void;
}

export function GrantTable({ grants, onEdit, onDelete }: GrantsTableProps) {
    const { getFileUrl } = GrantLogic();
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
    };return (
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
                                <th className="px-6 py-3 text-left">GRANT TYPE</th>                                <th className="px-6 py-3 text-left">PROJECT STATUS</th>                                <th className="px-6 py-3 text-left">SPONSOR CATEGORY</th>
                                <th className="px-6 py-3 text-left">SUBSPONSOR NAME</th>
                                <th className="px-6 py-3 text-left">APPROVED AMOUNT</th>
                                <th className="px-6 py-3 text-left">FILE</th>
                                {(onEdit ?? onDelete) && <th className="px-6 py-3 text-left">Actions</th>}
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
                                    <td className="px-6 py-4">{grant.PROJECT_STATUS}</td>                                    <td className="px-6 py-4">{grant.SPONSOR_CATEGORY}</td>
                                    <td className="px-6 py-4">{grant.SUBSPONSOR_NAME}</td>
                                    <td className="px-6 py-4">${grant.PRO_APPROVED}</td>                                    <td className="px-6 py-4">
                                        {grant.file_path ? (
                                            <a 
                                                href={getFileUrl(grant.file_path)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                                aria-label={`View file for ${grant.PROJECT_TITLE}`}
                                            >
                                                View File
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">No file</span>
                                        )}
                                    </td>
                                    {(onEdit ?? onDelete) && (
                                        <td className="px-6 py-4">
                                            {onEdit && (
                                                <button 
                                                    onClick={() => onEdit(grant)}
                                                    className="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button 
                                                    onClick={() => onDelete(grant.PROJECTID)}
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
    );
}