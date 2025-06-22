'use client';

import { useState } from 'react';
import type { Grant } from '@/hooks/grant-logic';

interface GrantModalProps {
    grant?: Grant;
    onSave: (grant: Partial<Grant>) => Promise<void>;
    onClose: () => void;
}

export function GrantModal({ grant, onSave, onClose }: GrantModalProps) {
    const [formData, setFormData] = useState<Partial<Grant>>(grant || {});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            if (!grant) onClose(); // Close modal for new grants
        } catch (error) {
            console.error('Error saving grant:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericFields = ['PL_STAFF_NO', 'PRO_APPROVED'];
        
        setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? Number(value) || 0 : value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {grant ? 'Edit Grant' : 'Add New Grant'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Project ID *
                            </label>
                            <input
                                name="PROJECTID"
                                value={formData.PROJECTID || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Project Title *
                            </label>
                            <input
                                name="PROJECT_TITLE"
                                value={formData.PROJECT_TITLE || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">PI Name *</label>
                            <input
                                name="PL_NAME"
                                value={formData.PL_NAME || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">PI Staff No</label>
                            <input
                                type="number"
                                name="PL_STAFF_NO"
                                value={formData.PL_STAFF_NO || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date *</label>
                            <input
                                type="date"
                                name="PRO_DATESTART"
                                value={formData.PRO_DATESTART || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">End Date *</label>
                            <input
                                type="date"
                                name="PRO_DATEEND"
                                value={formData.PRO_DATEEND || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Grant Type *</label>
                            <select
                                name="GRANT_TYPE"
                                value={formData.GRANT_TYPE || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="University Grant">University Grant</option>
                                <option value="Government Grant">Government Grant</option>
                                <option value="Industrial Grant">Industrial Grant</option>
                                <option value="Research Contract">Research Contract</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status *</label>
                            <select
                                name="PROJECT_STATUS"
                                value={formData.PROJECT_STATUS || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Amount (MYR) *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="PRO_APPROVED"
                                value={formData.PRO_APPROVED || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Sponsor Category</label>
                            <select
                                name="SPONSOR_CATEGORY"
                                value={formData.SPONSOR_CATEGORY || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                <option value="Government">Government</option>
                                <option value="University">University</option>
                                <option value="Industry">Industry</option>
                                <option value="International">International</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Sponsor Name</label>
                            <input
                                name="SPONSOR_NAME"
                                value={formData.SPONSOR_NAME || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter sponsor name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Project Research Alliance</label>
                            <input
                                name="PTJ_RESEARCH_ALLIANCE"
                                value={formData.PTJ_RESEARCH_ALLIANCE || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subsponsor Name</label>
                            <input
                                name="SUBSPONSOR_NAME"
                                value={formData.SUBSPONSOR_NAME || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Cost Center</label>
                            <input
                                name="COST_CENTER_CODE"
                                value={formData.COST_CENTER_CODE || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Grant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}