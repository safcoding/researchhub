import type { Grant } from '@/hooks/grant-logic';
import { useState } from 'react';

interface GrantModalProps {
    grant?: Grant;
    onSave: (grant: Partial<Grant>) => void;
    onClose: () => void;
}

export function GrantModal({ grant, onSave, onClose }: GrantModalProps) {
    const [formData, setFormData] = useState<Partial<Grant>>(grant || {});    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // For numeric fields, convert string to number
        const numericFields = ['PL_STAFF_NO', 'PRO_APPROVED'];
        const parsedValue = numericFields.includes(name) && value !== '' ? parseFloat(value) : value;
        
        setFormData({
            ...formData,
            [name]: parsedValue
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {grant ? 'Edit Grant' : 'Add New Grant'}
                    </h2>                    <button 
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Close"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="COST_CENTER_CODE" className="block text-sm font-medium text-gray-700 mb-1">
                                Cost Center Code
                            </label>
                            <input
                                type="text"
                                id="COST_CENTER_CODE"
                                name="COST_CENTER_CODE"
                                value={formData.COST_CENTER_CODE ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PL_STAFF_NO" className="block text-sm font-medium text-gray-700 mb-1">
                                PL Staff Number
                            </label>
                            <input
                                type="number"
                                id="PL_STAFF_NO"
                                name="PL_STAFF_NO"
                                value={formData.PL_STAFF_NO ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PL_NAME" className="block text-sm font-medium text-gray-700 mb-1">
                                PL Name
                            </label>
                            <input
                                type="text"
                                id="PL_NAME"
                                name="PL_NAME"
                                value={formData.PL_NAME ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PTJ_RESEARCH_ALLIANCE" className="block text-sm font-medium text-gray-700 mb-1">
                                Research Alliance
                            </label>
                            <input
                                type="text"
                                id="PTJ_RESEARCH_ALLIANCE"
                                name="PTJ_RESEARCH_ALLIANCE"
                                value={formData.PTJ_RESEARCH_ALLIANCE ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="RESEARCH_GROUP" className="block text-sm font-medium text-gray-700 mb-1">
                                Research Group
                            </label>
                            <input
                                type="text"
                                id="RESEARCH_GROUP"
                                name="RESEARCH_GROUP"
                                value={formData.RESEARCH_GROUP ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4 md:col-span-2">
                            <label htmlFor="PROJECT_TITLE" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Title
                            </label>
                            <input
                                type="text"
                                id="PROJECT_TITLE"
                                name="PROJECT_TITLE"
                                value={formData.PROJECT_TITLE ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PRO_DATESTART" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="PRO_DATESTART"
                                name="PRO_DATESTART"
                                value={formData.PRO_DATESTART ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PRO_DATEEND" className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="PRO_DATEEND"
                                name="PRO_DATEEND"
                                value={formData.PRO_DATEEND ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="GRANT_TYPE" className="block text-sm font-medium text-gray-700 mb-1">
                                Grant Type
                            </label>
                            <input
                                type="text"
                                id="GRANT_TYPE"
                                name="GRANT_TYPE"
                                value={formData.GRANT_TYPE ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PROJECT_STATUS" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Status
                            </label>
                            <select
                                id="PROJECT_STATUS"
                                name="PROJECT_STATUS"
                                value={formData.PROJECT_STATUS ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="SPONSOR_CATEGORY" className="block text-sm font-medium text-gray-700 mb-1">
                                Sponsor Category
                            </label>
                            <input
                                type="text"
                                id="SPONSOR_CATEGORY"
                                name="SPONSOR_CATEGORY"
                                value={formData.SPONSOR_CATEGORY ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="SUBSPONSOR_NAME" className="block text-sm font-medium text-gray-700 mb-1">
                                Subsponsor Name
                            </label>
                            <input
                                type="text"
                                id="SUBSPONSOR_NAME"
                                name="SUBSPONSOR_NAME"
                                value={formData.SUBSPONSOR_NAME ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PRO_APPROVED" className="block text-sm font-medium text-gray-700 mb-1">
                                Approved Amount
                            </label>
                            <input
                                type="number"
                                id="PRO_APPROVED"
                                name="PRO_APPROVED"
                                value={formData.PRO_APPROVED ?? ''}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}