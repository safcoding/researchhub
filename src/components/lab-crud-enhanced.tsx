import type { Lab } from '@/hooks/lab-logic';
import { useState } from 'react';

interface LabModalProps {
    lab?: Lab;
    onSave: (lab: Partial<Lab>) => void;
    onClose: () => void;
}

export function LabModal({ lab, onSave, onClose }: LabModalProps) {
    const [formData, setFormData] = useState<Partial<Lab>>(lab ?? {});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});
    const [successMessage, setSuccessMessage] = useState('');

    // Lab type options
    const labTypeOptions = [
        "Research Lab",
        "Teaching Lab",
        "Computer Lab",
        "Chemistry Lab",
        "Physics Lab",
        "Biology Lab",
        "Engineering Lab",
        "Mixed Use Lab",
        "Clean Room",
        "Workshop",
        "Other"
    ];

    // Lab status options
    const statusOptions = [
        "Active",
        "Inactive",
        "Under Maintenance",
        "Under Construction",
        "Renovation",
        "Planning"
    ];

    // Department options
    const departmentOptions = [
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Chemical Engineering",
        "Civil Engineering",
        "Biomedical Engineering",
        "Physics",
        "Chemistry",
        "Biology",
        "Mathematics",
        "Materials Science",
        "Other"
    ];

    // Required fields
    const requiredFields = [
        "LAB_NAME",
        "LAB_HEAD",
        "LAB_HEAD_EMAIL",
        "DEPARTMENT",
        "RESEARCH_AREA",
        "LOCATION",
        "LAB_STATUS",
        "LAB_TYPE"
    ];

    // Field descriptions for tooltips
    const fieldDescriptions: Record<string, string> = {
        "LABID": "Unique identifier for the lab (auto-generated if left blank)",
        "LAB_NAME": "Official name of the laboratory",
        "LAB_HEAD": "Name of the laboratory head or principal investigator",
        "LAB_HEAD_EMAIL": "Email address of the laboratory head",
        "DEPARTMENT": "Department or faculty the lab belongs to",
        "RESEARCH_AREA": "Primary research focus or area of the laboratory",
        "LAB_DESCRIPTION": "Detailed description of the lab's purpose and capabilities",
        "LOCATION": "Physical location of the laboratory (building, room number)",
        "ESTABLISHED_DATE": "Date when the laboratory was established",
        "LAB_STATUS": "Current operational status of the laboratory",
        "EQUIPMENT_COUNT": "Number of major equipment pieces in the lab",
        "STUDENT_CAPACITY": "Maximum number of students the lab can accommodate",
        "BUDGET": "Annual operating budget for the laboratory",
        "LAB_TYPE": "Category or type of laboratory",
        "CONTACT_PHONE": "Contact phone number for the laboratory"
    };
    
    // Validate form on submit
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!formData[field as keyof Lab]) {
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
        if (formData.LABID && formData.LABID.trim()) {
            const labIdTrimmed = formData.LABID.trim();
            if (labIdTrimmed.length < 3) {
                newErrors.LABID = 'Lab ID must be at least 3 characters long';
                isValid = false;
            } else if (!/^[A-Za-z0-9_-]+$/.test(labIdTrimmed)) {
                newErrors.LABID = 'Lab ID can only contain letters, numbers, hyphens, and underscores';
                isValid = false;
            }
        }
        
        // Numeric validations
        if (formData.EQUIPMENT_COUNT !== undefined && formData.EQUIPMENT_COUNT < 0) {
            newErrors.EQUIPMENT_COUNT = 'Equipment count cannot be negative';
            isValid = false;
        }
        
        if (formData.STUDENT_CAPACITY !== undefined && formData.STUDENT_CAPACITY < 0) {
            newErrors.STUDENT_CAPACITY = 'Student capacity cannot be negative';
            isValid = false;
        }
        
        if (formData.BUDGET !== undefined && formData.BUDGET < 0) {
            newErrors.BUDGET = 'Budget cannot be negative';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Mark field as touched
        setIsTouched(prev => ({ ...prev, [name]: true }));
        
        // Convert numeric fields
        let processedValue: any = value;
        if (['EQUIPMENT_COUNT', 'STUDENT_CAPACITY', 'BUDGET'].includes(name)) {
            processedValue = value === '' ? undefined : Number(value);
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
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
        }
        
        try {
            setIsSubmitting(true);
            await onSave(formData);
            setSuccessMessage(lab ? 'Lab updated successfully!' : 'Lab created successfully!');
            
            // Close modal after short delay to show success message
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error saving lab:', error);
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
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {lab ? 'Edit Lab' : 'Add New Lab'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
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
                    )}                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Lab ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lab ID {!lab && <span className="text-sm text-gray-500">(optional - auto-generated if empty)</span>}
                                </label>
                                <input
                                    type="text"
                                    name="LABID"
                                    value={formData.LABID || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.LABID ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder={lab ? "Lab ID (cannot be changed)" : "Enter lab ID or leave blank for auto-generation"}
                                    title={fieldDescriptions.LABID}
                                    disabled={!!lab} // Disable editing for existing labs
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
                                    value={formData.LAB_NAME || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.LAB_NAME ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter lab name"
                                    title={fieldDescriptions.LAB_NAME}
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
                                    value={formData.LAB_HEAD || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.LAB_HEAD ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter lab head name"
                                    title={fieldDescriptions.LAB_HEAD}
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
                                    value={formData.LAB_HEAD_EMAIL || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.LAB_HEAD_EMAIL ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter email address"
                                    title={fieldDescriptions.LAB_HEAD_EMAIL}
                                />
                                {errors.LAB_HEAD_EMAIL && (
                                    <p className="text-red-500 text-sm mt-1">{errors.LAB_HEAD_EMAIL}</p>
                                )}
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department *
                                </label>
                                <select
                                    name="DEPARTMENT"
                                    value={formData.DEPARTMENT || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.DEPARTMENT ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    title={fieldDescriptions.DEPARTMENT}
                                >
                                    <option value="">Select department</option>
                                    {departmentOptions.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                {errors.DEPARTMENT && (
                                    <p className="text-red-500 text-sm mt-1">{errors.DEPARTMENT}</p>
                                )}
                            </div>

                            {/* Research Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Research Area *
                                </label>
                                <input
                                    type="text"
                                    name="RESEARCH_AREA"
                                    value={formData.RESEARCH_AREA || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.RESEARCH_AREA ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter research area"
                                    title={fieldDescriptions.RESEARCH_AREA}
                                />
                                {errors.RESEARCH_AREA && (
                                    <p className="text-red-500 text-sm mt-1">{errors.RESEARCH_AREA}</p>
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
                                    value={formData.LOCATION || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.LOCATION ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Building A, Room 101"
                                    title={fieldDescriptions.LOCATION}
                                />
                                {errors.LOCATION && (
                                    <p className="text-red-500 text-sm mt-1">{errors.LOCATION}</p>
                                )}
                            </div>

                            {/* Established Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Established Date
                                </label>
                                <input
                                    type="date"
                                    name="ESTABLISHED_DATE"
                                    value={formData.ESTABLISHED_DATE || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    title={fieldDescriptions.ESTABLISHED_DATE}
                                />
                            </div>

                            {/* Lab Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lab Status *
                                </label>
                                <select
                                    name="LAB_STATUS"
                                    value={formData.LAB_STATUS || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.LAB_STATUS ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    title={fieldDescriptions.LAB_STATUS}
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
                                </label>
                                <select
                                    name="LAB_TYPE"
                                    value={formData.LAB_TYPE || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.LAB_TYPE ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    title={fieldDescriptions.LAB_TYPE}
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

                            {/* Equipment Count */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Equipment Count
                                </label>
                                <input
                                    type="number"
                                    name="EQUIPMENT_COUNT"
                                    value={formData.EQUIPMENT_COUNT || ''}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.EQUIPMENT_COUNT ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Number of equipment"
                                    title={fieldDescriptions.EQUIPMENT_COUNT}
                                />
                                {errors.EQUIPMENT_COUNT && (
                                    <p className="text-red-500 text-sm mt-1">{errors.EQUIPMENT_COUNT}</p>
                                )}
                            </div>

                            {/* Student Capacity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Student Capacity
                                </label>
                                <input
                                    type="number"
                                    name="STUDENT_CAPACITY"
                                    value={formData.STUDENT_CAPACITY || ''}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.STUDENT_CAPACITY ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Maximum students"
                                    title={fieldDescriptions.STUDENT_CAPACITY}
                                />
                                {errors.STUDENT_CAPACITY && (
                                    <p className="text-red-500 text-sm mt-1">{errors.STUDENT_CAPACITY}</p>
                                )}
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Annual Budget (USD)
                                </label>
                                <input
                                    type="number"
                                    name="BUDGET"
                                    value={formData.BUDGET || ''}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.BUDGET ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter budget amount"
                                    title={fieldDescriptions.BUDGET}
                                />
                                {errors.BUDGET && (
                                    <p className="text-red-500 text-sm mt-1">{errors.BUDGET}</p>
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
                                    value={formData.CONTACT_PHONE || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter phone number"
                                    title={fieldDescriptions.CONTACT_PHONE}
                                />
                            </div>
                        </div>

                        {/* Lab Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lab Description
                            </label>
                            <textarea
                                name="LAB_DESCRIPTION"
                                value={formData.LAB_DESCRIPTION || ''}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe the lab's purpose, capabilities, and research focus"
                                title={fieldDescriptions.LAB_DESCRIPTION}
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
