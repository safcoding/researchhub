import type { Lab } from '@/hooks/lab-logic';
import { useState } from 'react';

interface LabModalProps {
    lab?: Lab;
    onSave: (lab: Partial<Lab>) => Promise<void>;
    onClose: () => void;
}

export function LabModal({ lab, onSave, onClose }: LabModalProps) {
    const [formData, setFormData] = useState<Partial<Lab>>(lab ?? {});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');    // Lab type options
    const labTypeOptions = [
        "i-Kohza",
        "Service Lab",
        "Research Lab",
        "Teaching Lab",
        "Satellite Lab"
    ];

    // Lab status options
    const statusOptions = [
        "Active",
        "Inactive", 
        "Under Maintenance",
        "Under Construction",
        "Renovation",        "Planning"
    ];    // Required fields - only fields that exist in Lab type
    const requiredFields: (keyof Lab)[] = [
        "LAB_NAME",
        "LAB_HEAD",
        "LAB_HEAD_EMAIL", 
        "LOCATION",
        "LAB_STATUS",
        "LAB_TYPE"
    ];

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
                isValid = false;
            }
        });

        // Email validation
        if (formData.LAB_HEAD_EMAIL) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.LAB_HEAD_EMAIL)) {
                newErrors.LAB_HEAD_EMAIL = 'Please enter a valid email address';
                isValid = false;
            }
        }

        // LABID validation (if provided)
        if (formData.LABID?.trim()) {
            const labIdTrimmed = formData.LABID.trim();
            if (labIdTrimmed.length < 3) {
                newErrors.LABID = 'Lab ID must be at least 3 characters long';
                isValid = false;
            } else if (!/^[A-Za-z0-9_-]+$/.test(labIdTrimmed)) {
                newErrors.LABID = 'Lab ID can only contain letters, numbers, hyphens, and underscores';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field if it was previously invalid
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }        setIsSubmitting(true);
        setSuccessMessage('');
        
        try {
            await onSave(formData);
            setSuccessMessage(lab ? 'Lab updated successfully!' : 'Lab created successfully!');
            
            // Close modal after short delay to show success message
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error saving lab:', error);
            setErrors(prev => ({
                ...prev,
                form: 'Failed to save lab. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {lab ? 'Edit Lab' : 'Add New Lab'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                            title="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    {errors.form && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Lab ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab ID {!lab && <span className="text-sm text-gray-500">(optional - auto-generated if empty)</span>}
                            </label>
                            <input
                                type="text"
                                name="LABID"
                                value={formData.LABID ?? ''}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.LABID ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder={lab ? "Lab ID (cannot be changed)" : "Enter lab ID or leave blank for auto-generation"}
                                disabled={!!lab}
                            />
                            {errors.LABID && (
                                <p className="text-red-500 text-sm mt-1">{errors.LABID}</p>
                            )}
                        </div>

                        {/* Lab Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab Name *
                            </label>
                            <input
                                type="text"
                                name="LAB_NAME"
                                value={formData.LAB_NAME ?? ''}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.LAB_NAME ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter lab name"
                            />
                            {errors.LAB_NAME && (
                                <p className="text-red-500 text-sm mt-1">{errors.LAB_NAME}</p>
                            )}
                        </div>

                        {/* Lab Head */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab Head *
                            </label>
                            <input
                                type="text"
                                name="LAB_HEAD"
                                value={formData.LAB_HEAD ?? ''}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.LAB_HEAD ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter lab head name"
                            />
                            {errors.LAB_HEAD && (
                                <p className="text-red-500 text-sm mt-1">{errors.LAB_HEAD}</p>
                            )}
                        </div>

                        {/* Lab Head Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab Head Email *
                            </label>
                            <input
                                type="email"
                                name="LAB_HEAD_EMAIL"
                                value={formData.LAB_HEAD_EMAIL ?? ''}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.LAB_HEAD_EMAIL ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter email address"
                            />
                            {errors.LAB_HEAD_EMAIL && (
                                <p className="text-red-500 text-sm mt-1">{errors.LAB_HEAD_EMAIL}</p>                            )}
                        </div>                        {/* Research Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Research Area (Optional)
                            </label>
                            <input
                                type="text"
                                name="RESEARCH_AREA"
                                value={formData.RESEARCH_AREA ?? ''}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.RESEARCH_AREA ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter research area"
                            />
                            {errors.RESEARCH_AREA && (
                                <p className="text-red-500 text-sm mt-1">{errors.RESEARCH_AREA}</p>
                            )}
                        </div>

                        {/* Equipment List */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Equipment List
                            </label>                            <textarea
                                name="EQUIPMENT_LIST"
                                value={formData.EQUIPMENT_LIST ?? ''}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.EQUIPMENT_LIST ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="List equipment available in this lab (e.g., Microscopes, Centrifuge, PCR machines, etc.)"
                                rows={3}
                            />
                            {errors.EQUIPMENT_LIST && (
                                <p className="text-red-500 text-sm mt-1">{errors.EQUIPMENT_LIST}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="LOCATION"
                                value={formData.LOCATION ?? ''}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.LOCATION ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., Building A, Room 101"
                            />
                            {errors.LOCATION && (
                                <p className="text-red-500 text-sm mt-1">{errors.LOCATION}</p>
                            )}
                        </div>

                        {/* Lab Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab Status *
                            </label>                            <select
                                name="LAB_STATUS"
                                value={formData.LAB_STATUS ?? ''}
                                onChange={handleChange}
                                title="Select lab status"
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.LAB_STATUS ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select status</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            {errors.LAB_STATUS && (
                                <p className="text-red-500 text-sm mt-1">{errors.LAB_STATUS}</p>
                            )}
                        </div>

                        {/* Lab Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab Type *
                            </label>                            <select
                                name="LAB_TYPE"
                                value={formData.LAB_TYPE ?? ''}
                                onChange={handleChange}
                                title="Select lab type"
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.LAB_TYPE ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select lab type</option>
                                {labTypeOptions.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.LAB_TYPE && (
                                <p className="text-red-500 text-sm mt-1">{errors.LAB_TYPE}</p>
                            )}
                        </div>

                        {/* Contact Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                name="CONTACT_PHONE"
                                value={formData.CONTACT_PHONE ?? ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Lab Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab Description
                            </label>
                            <textarea
                                name="LAB_DESCRIPTION"
                                value={formData.LAB_DESCRIPTION ?? ''}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe the lab's purpose, capabilities, and research focus"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : (lab ? 'Update Lab' : 'Create Lab')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
