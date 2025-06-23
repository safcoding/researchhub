import type { Event } from '@/hooks/event-logic';
import { useState } from 'react';
import Image from 'next/image';

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
        }        setIsSubmitting(true);
        try {
            await Promise.resolve(onSave(formData as Omit<Event, 'id' | 'created_at' | 'updated_at'>));
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
                        </label>                        <input
                            type="text"
                            name="id"
                            value={formData.id ?? ''}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                event ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                            }`}
                            placeholder={event ? "Event ID (cannot be changed)" : "Enter event ID or leave blank for auto-generation"}
                            disabled={!!event} // Disable editing for existing events
                            aria-label="Event ID"
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
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                            </label>                            <input
                                type="date"
                                name="date"
                                value={formData.date ?? ''}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.date ? 'border-red-500' : 'border-gray-300'
                                }`}
                                aria-label="Event Date"
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
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                aria-label="Event Category"
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
                            </label>                            <select
                                name="priority"
                                value={formData.priority ?? 'Medium'}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Event Priority"
                            >
                                {priorityOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>                            <select
                                name="status"
                                value={formData.status ?? 'Upcoming'}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Event Status"
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
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.contact_email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter contact email"
                        />
                        {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
                    </div>                    {/* Registration Required */}
                    <div className="flex items-center">                        <input
                            type="checkbox"
                            name="registration_required"
                            checked={formData.registration_required ?? false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            aria-label="Registration Required"
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
                            </label>                            <input
                                type="date"
                                name="registration_deadline"
                                value={formData.registration_deadline ?? ''}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.registration_deadline ? 'border-red-500' : 'border-gray-300'
                                }`}
                                aria-label="Registration Deadline"
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
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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

interface EventInfoModalProps {
    event: Event;
    onClose: () => void;
}

export function EventInfoModal({ event, onClose }: EventInfoModalProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Registration Open': return 'bg-blue-100 text-blue-800';
            case 'Registration Closed': return 'bg-red-100 text-red-800';
            case 'Upcoming': return 'bg-purple-100 text-purple-800';
            case 'Completed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">                {/* Header with Image */}
                <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
                    {event.image && (
                        <Image 
                            src={event.image} 
                            alt={event.title}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    )}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={onClose}
                            className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-colors"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(event.priority)}`}>
                            {event.priority} Priority
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(event.status)}`}>
                            {event.status}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Title and Category */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                                {event.category}
                            </span>
                            <span className="text-sm text-gray-500">
                                Event ID: {event.id}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                        <p className="text-lg text-gray-600 leading-relaxed">{event.description}</p>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Date & Time */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Date & Time
                            </h3>
                            <p className="text-gray-700 mb-2">
                                <strong>Date:</strong> {formatDate(event.date)}
                            </p>
                            <p className="text-gray-700">
                                <strong>Time:</strong> {event.time}
                            </p>
                        </div>

                        {/* Location */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Location
                            </h3>
                            <p className="text-gray-700">{event.location}</p>
                        </div>

                        {/* Organizer */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Organizer
                            </h3>
                            <p className="text-gray-700">{event.organizer}</p>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact
                            </h3>
                            <a 
                                href={`mailto:${event.contact_email}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                {event.contact_email}
                            </a>
                        </div>
                    </div>

                    {/* Registration Information */}
                    {event.registration_required && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Registration Required
                            </h3>
                            <p className="text-orange-800">
                                This event requires registration to attend.
                                {event.registration_deadline && (
                                    <>
                                        <br />
                                        <strong>Registration Deadline:</strong> {formatDate(event.registration_deadline)}
                                    </>
                                )}
                            </p>
                        </div>                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <a 
                            href={`mailto:${event.contact_email}?subject=Inquiry about ${event.title}`}
                            className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Contact Organizer
                        </a>
                        {event.registration_required && (
                            <a 
                                href={`mailto:${event.contact_email}?subject=Registration for ${event.title}`}
                                className="flex-1 bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Register for Event
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
