import type { Event } from '@/hooks/event-logic';
import { useState } from 'react';

interface EventModalProps {
    event?: Event;
    onSave: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => void;
    onClose: () => void;
}

export function EventModal({ event, onSave, onClose }: EventModalProps) {    const [formData, setFormData] = useState<Partial<Event>>(() => {
        if (event) {
            return event;
        }
        return {
            registration_required: false,
            priority: 'Medium',
            status: 'Upcoming'
            // Don't set a default category - force user to select one
        };
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);    const categoryOptions: Event['category'][] = ['Conference', 'Workshop', 'Seminar', 'Grant', 'Competition', 'Networking', 'Others'];
    const priorityOptions: Event['priority'][] = ['High', 'Medium', 'Low'];
    const statusOptions: Event['status'][] = ['Upcoming', 'Registration Open', 'Registration Closed', 'Completed'];

    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category', 'organizer', 'contact_email'];    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        requiredFields.forEach(field => {
            if (!formData[field as keyof Event]) {
                newErrors[field] = 'This field is required';
                isValid = false;
            }
        });        // Special validation for category since it might be undefined
        if (!formData.category) {
            newErrors.category = 'Please select a category';
            isValid = false;
        }// Email validation
        if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
            newErrors.contact_email = 'Please enter a valid email address';
            isValid = false;
        }

        // Date validation
        if (formData.date && formData.registration_deadline) {
            const eventDate = new Date(formData.date);
            const regDeadline = new Date(formData.registration_deadline);
            if (regDeadline >= eventDate) {
                newErrors.registration_deadline = 'Registration deadline must be before event date';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData as Omit<Event, 'id' | 'created_at' | 'updated_at'>);
            onClose();
        } catch (error) {
            console.error('Error saving event:', error);
            // Show error to user
            if (error instanceof Error) {
                alert(`Error saving event: ${error.message}`);
            } else {
                alert('An unknown error occurred while saving the event');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {event ? 'Edit Event' : 'Add New Event'}
                    </h2>
                </div>                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Event ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event ID
                            <span className="ml-1 text-xs text-gray-500">
                                {event ? '(Cannot be changed)' : '(Optional - auto-generated if empty)'}
                            </span>
                        </label>
                        <input
                                type="text"
                                name="id"
                                value={formData.id ?? ''}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none ${
                                    event ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                                }`}
                                placeholder={event ? "Event ID (cannot be changed)" : "Enter event ID or leave blank for auto-generation"}
                                disabled={!!event}
                                style={{
                                    '--tw-ring-color': '#2B9167',
                                } as React.CSSProperties}
                                />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title ?? ''}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter event title"
                            />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description ?? ''}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter event description"
                            />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date ?? ''}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                    errors.date ? 'border-red-500' : 'border-gray-300'
                                }`}
                                />
                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Time *
                            </label>
                            <input
                            type="text"
                            name="time"
                            value={formData.time ?? ''}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                errors.time ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., 9:00 AM - 5:00 PM"
                            />

                            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                        </div>
                    </div>

                    {/* Location and Organizer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location ?? ''}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                    errors.location ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter event location"
                                />

                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Organizer *
                            </label>
                            <input
                                type="text"
                                name="organizer"
                                value={formData.organizer ?? ''}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                    errors.organizer ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter organizer name"
                                />

                            {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
                        </div>
                    </div>

                    {/* Category, Priority, Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>                            <select
                                        name="category"
                                        value={formData.category ?? ''}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167]"
                                        required
                                        >
                                <option value="" disabled>Select a category</option>
                                {categoryOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                    name="priority"
                                    value={formData.priority ?? 'Medium'}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167]"
                                    >

                                {priorityOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status ?? 'Upcoming'}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167]"
                                >

                                {statusOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Contact Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Email *
                        </label>                        <input
                                    type="email"
                                    name="contact_email"
                                    value={formData.contact_email ?? ''}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                        errors.contact_email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter contact email"
                                    />

                        {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
                    </div>     
                                   {/* Registration Required */}
                    <div className="flex items-center">
                        <input
                        type="checkbox"
                        name="registration_required"
                        checked={formData.registration_required ?? false}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#2B9167] focus:ring-[#2B9167] border-gray-300 rounded"
                        />

                        <label className="ml-2 block text-sm text-gray-900">
                            Registration Required
                        </label>
                    </div>

                    {/* Registration Deadline (only if registration required) */}
                    {formData.registration_required && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Registration Deadline
                            </label>
                            <input
                            type="date"
                            name="registration_deadline"
                            value={formData.registration_deadline ?? ''}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9167] ${
                                errors.registration_deadline ? 'border-red-500' : 'border-gray-300'
                            }`}
                            />

                            {errors.registration_deadline && <p className="text-red-500 text-sm mt-1">{errors.registration_deadline}</p>}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-[#2B9167] text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                            {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface DeleteConfirmationModalProps {
    event: Event;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmationModal({ event, onConfirm, onCancel }: DeleteConfirmationModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Delete Event
                        </h3>                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
