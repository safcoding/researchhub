import type { Grant } from '@/hooks/grant-logic';
import { useState } from 'react';

interface GrantModalProps {
    grant?: Grant;
    onSave: (grant: Partial<Grant>) => void;
    onClose: () => void;
}

export function GrantModal({ grant, onSave, onClose }: GrantModalProps) {
    const [formData, setFormData] = useState<Partial<Grant>>(grant ?? {});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});
    const [successMessage, setSuccessMessage] = useState('');
      // Grant type options
    const grantTypeOptions = [
        "University Grant",
        "Government Grant",
        "Industrial Grant",
        "International Grant",
        "Research Contract",
        "Consulting",
        "Donation",
        "Endowment",
        "Fellowship",
        "Scholarship",
        "Other"
    ];

    // Generate year options (current year ± 10 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        yearOptions.push(year);
    }

    // Required fields
    const requiredFields = [
        "PROJECT_TITLE",
        "PL_NAME",
        "PRO_DATESTART",
        "PRO_DATEEND",
        "GRANT_TYPE",
        "PROJECT_STATUS",
        "PRO_APPROVED"
    ];
      // Field descriptions for tooltips
    const fieldDescriptions: Record<string, string> = {
        "PROJECTID": "Unique identifier for the project (auto-generated if left blank)",
        "COST_CENTER_CODE": "The financial cost center code associated with this grant",
        "PL_STAFF_NO": "Staff identification number of the principal investigator",
        "PL_NAME": "Full name of the principal investigator",
        "PTJ_RESEARCH_ALLIANCE": "Research alliance or department associated with this grant",
        "RESEARCH_GROUP": "Specific research group working on this project",        "PROJECT_TITLE": "Official title of the research project",
        "PRO_DATESTART": "Date when the project officially begins",
        "PRO_DATEEND": "Expected completion date of the project",
        "PROJECT_YEAR": "Year associated with this grant project",
        "GRANT_TYPE": "Category or type of funding for this grant",
        "PROJECT_STATUS": "Current status of the project",
        "SPONSOR_CATEGORY": "General category of the sponsoring organization",
        "SUBSPONSOR_NAME": "Specific name of the sponsoring organization",
        "PRO_APPROVED": "Total approved amount for this grant in MYR"
    };
    
    // Validate form on submit
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!formData[field as keyof Grant]) {
                newErrors[field] = 'This field is required';
                isValid = false;
            }
        });
        
        // Additional validation
        if (formData.PRO_DATESTART && formData.PRO_DATEEND) {
            const startDate = new Date(formData.PRO_DATESTART);
            const endDate = new Date(formData.PRO_DATEEND);
              if (endDate < startDate) {
                newErrors.PRO_DATEEND = 'End date cannot be before start date';
                isValid = false;
            }
        }
        
        if (formData.PRO_APPROVED !== undefined && formData.PRO_APPROVED <= 0) {
            newErrors.PRO_APPROVED = 'Amount must be greater than 0';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Mark field as touched
        setIsTouched(prev => ({
            ...prev,
            [name]: true
        }));
        
        // For numeric fields, convert string to number
        const numericFields = ['PL_STAFF_NO', 'PRO_APPROVED'];
        const parsedValue = numericFields.includes(name) && value !== '' ? parseFloat(value) : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
        
        // Clear error for this field when user changes the value
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
        
        // Validate all fields
        if (!validateForm()) {
            // Mark all fields as touched to show errors
            const allTouched: Record<string, boolean> = {};
            requiredFields.forEach(field => {
                allTouched[field] = true;
            });
            setIsTouched(allTouched);
            return;
        }
        
        setIsSubmitting(true);
        setSuccessMessage('');
          try {
            onSave(formData);
            setSuccessMessage('Grant saved successfully!');
            
            // Reset form after successful submission if this is a new grant
            if (!grant) {
                setFormData({});
                setIsTouched({});
            }
        } catch (error) {
            console.error('Error saving grant:', error);
            setErrors(prev => ({
                ...prev,
                form: 'Failed to save grant. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to determine if a field has an error
    const hasError = (fieldName: string) => {
        return isTouched[fieldName] && !!errors[fieldName];
    };

    // Helper to get the input class based on error state
    const getInputClass = (fieldName: string) => {
        return `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasError(fieldName) 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300'
    }`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {grant ? 'Edit Grant' : 'Add New Grant'}
                    </h2>
                    <button 
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
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Project ID Field - Only for editing or optional for new entries */}
                        <div className="mb-4">
                            <label htmlFor="PROJECTID" className="block text-sm font-medium text-gray-700 mb-1">
                                Project ID
                                <span className="ml-1 text-xs text-gray-500">({fieldDescriptions.PROJECTID})</span>
                            </label>
                            <input
                                type="text"
                                id="PROJECTID"
                                name="PROJECTID"
                                value={formData.PROJECTID ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PROJECTID')}
                                placeholder="Auto-generated if left blank"
                                disabled={!!grant} // Disable editing for existing grants
                            />
                            {hasError('PROJECTID') && (
                                <p className="mt-1 text-sm text-red-600">{errors.PROJECTID}</p>
                            )}
                        </div>
                        
                        {/* Project Title - Full width field */}
                        <div className="mb-4 md:col-span-2">
                            <label htmlFor="PROJECT_TITLE" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Title <span className="text-red-500">*</span>
                                <span className="ml-1 text-xs text-gray-500">({fieldDescriptions.PROJECT_TITLE})</span>
                            </label>
                            <input
                                type="text"
                                id="PROJECT_TITLE"
                                name="PROJECT_TITLE"
                                value={formData.PROJECT_TITLE ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PROJECT_TITLE')}
                                placeholder="Enter the full project title"
                                required
                            />
                            {hasError('PROJECT_TITLE') && (
                                <p className="mt-1 text-sm text-red-600">{errors.PROJECT_TITLE}</p>
                            )}
                        </div>
                        
                        {/* Principal Investigator Information */}
                        <div className="mb-4">
                            <label htmlFor="PL_NAME" className="block text-sm font-medium text-gray-700 mb-1">
                                Principal Investigator Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="PL_NAME"
                                name="PL_NAME"
                                value={formData.PL_NAME ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PL_NAME')}
                                placeholder="Full name of PI"
                                required
                            />
                            {hasError('PL_NAME') && (
                                <p className="mt-1 text-sm text-red-600">{errors.PL_NAME}</p>
                            )}
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PL_STAFF_NO" className="block text-sm font-medium text-gray-700 mb-1">
                                PI Staff Number
                            </label>
                            <input
                                type="number"
                                id="PL_STAFF_NO"
                                name="PL_STAFF_NO"
                                value={formData.PL_STAFF_NO ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PL_STAFF_NO')}
                                placeholder="Staff ID number"
                            />
                        </div>
                        
                        {/* Project Dates */}
                        <div className="mb-4">
                            <label htmlFor="PRO_DATESTART" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="PRO_DATESTART"
                                name="PRO_DATESTART"
                                value={formData.PRO_DATESTART ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PRO_DATESTART')}
                                required
                            />
                            {hasError('PRO_DATESTART') && (
                                <p className="mt-1 text-sm text-red-600">{errors.PRO_DATESTART}</p>
                            )}
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PRO_DATEEND" className="block text-sm font-medium text-gray-700 mb-1">
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="PRO_DATEEND"
                                name="PRO_DATEEND"
                                value={formData.PRO_DATEEND ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PRO_DATEEND')}
                                required
                            />
                            {hasError('PRO_DATEEND') && (
                                <p className="mt-1 text-sm text-red-600">{errors.PRO_DATEEND}</p>
                            )}
                        </div>

                        {/* Project Year */}
                        <div className="mb-4">
                            <label htmlFor="PROJECT_YEAR" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Year
                                <span className="ml-1 text-xs text-gray-500">(Year associated with this grant)</span>
                            </label>
                            <select
                                id="PROJECT_YEAR"
                                name="PROJECT_YEAR"
                                value={formData.PROJECT_YEAR ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PROJECT_YEAR')}
                            >
                                <option value="">Select Year</option>
                                {yearOptions.map((year) => (
                                    <option key={year} value={year.toString()}>{year}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Grant Type */}
                        <div className="mb-4">
                            <label htmlFor="GRANT_TYPE" className="block text-sm font-medium text-gray-700 mb-1">
                                Grant Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="GRANT_TYPE"
                                name="GRANT_TYPE"
                                value={formData.GRANT_TYPE ?? ''}
                                onChange={handleChange}
                                className={getInputClass('GRANT_TYPE')}
                                required
                            >
                                <option value="">Select Grant Type</option>
                                {grantTypeOptions.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                            {hasError('GRANT_TYPE') && (
                                <p className="mt-1 text-sm text-red-600">{errors.GRANT_TYPE}</p>
                            )}
                        </div>
                        
                        {/* Project Status */}
                        <div className="mb-4">
                            <label htmlFor="PROJECT_STATUS" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="PROJECT_STATUS"
                                name="PROJECT_STATUS"
                                value={formData.PROJECT_STATUS ?? ''}
                                onChange={handleChange}
                                className={getInputClass('PROJECT_STATUS')}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                            {hasError('PROJECT_STATUS') && (
                                <p className="mt-1 text-sm text-red-600">{errors.PROJECT_STATUS}</p>
                            )}
                        </div>
                        
                        {/* Research Information */}
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
                                className={getInputClass('PTJ_RESEARCH_ALLIANCE')}
                                placeholder="Research department or alliance"
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
                                className={getInputClass('RESEARCH_GROUP')}
                                placeholder="Specific research group"
                            />
                        </div>
                        
                        {/* Financial Information */}
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
                                className={getInputClass('COST_CENTER_CODE')}
                                placeholder="Financial cost center code"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="PRO_APPROVED" className="block text-sm font-medium text-gray-700 mb-1">
                                Approved Amount (MYR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="PRO_APPROVED"
                                name="PRO_APPROVED"
                                value={formData.PRO_APPROVED ?? ''}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={getInputClass('PRO_APPROVED')}
                                placeholder="Grant amount in MYR"
                                required
                            />
                            {hasError('PRO_APPROVED') && (
                                <p className="mt-1 text-sm text-red-600">{errors.PRO_APPROVED}</p>
                            )}
                        </div>
                        
                        {/* Sponsor Information */}
                        <div className="mb-4">
                            <label htmlFor="SPONSOR_CATEGORY" className="block text-sm font-medium text-gray-700 mb-1">
                                Sponsor Category
                            </label>
                            <select
                                id="SPONSOR_CATEGORY"
                                name="SPONSOR_CATEGORY"
                                value={formData.SPONSOR_CATEGORY ?? ''}
                                onChange={handleChange}
                                className={getInputClass('SPONSOR_CATEGORY')}
                            >
                                <option value="">Select Sponsor Category</option>
                                <option value="Government">Government</option>
                                <option value="University">University</option>
                                <option value="Industry">Industry</option>
                                <option value="Non-Profit">Non-Profit</option>
                                <option value="International">International</option>
                                <option value="Other">Other</option>
                            </select>
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
                                className={getInputClass('SUBSPONSOR_NAME')}
                                placeholder="Name of specific sponsoring organization"
                            />
                        </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                        <p>Fields marked with <span className="text-red-500">*</span> are required</p>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${
                                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white px-4 py-2 rounded flex items-center`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isSubmitting ? 'Saving...' : 'Save Grant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
