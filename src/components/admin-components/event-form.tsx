import type { Event } from '@/hooks/event-logic';
import { useState } from 'react';
import { FormField } from '../reusable/formfield';
import { TextAreaField } from '../reusable/textarea';
import { SelectField } from '../reusable/selectfield';
import { EVENT_CATEGORIES,
         EVENT_PRIORITIES,
         EVENT_STATUSES,
         REQUIRED_EVENT_FIELDS,
 } from '@/constants/event-options';

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
    const [isSubmitting, setIsSubmitting] = useState(false);   
    const validateForm = () => {
    const newErrors: Record<string, string> = {};
        let isValid = true;
        REQUIRED_EVENT_FIELDS.forEach(field => {
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
    };    
    
    const handleSubmit = async (e: React.FormEvent) => {
        
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

                </div>                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <FormField
                        label= "Event ID"
                        name= "id"
                        type= "text"
                        value= {formData.id ?? ''}
                        required= {true}
                        disabled={!!event}
                        error= {errors.id}
                        onChange={handleChange}
                    />

                    <FormField
                        label= "Title"
                        name= "title"
                        type= "text"
                        value= {formData.title ?? ''}
                        required= {true}
                        disabled={!event}
                        error= {errors.title}
                        onChange={handleChange}
                    />                   

                    <TextAreaField
                        label= "Description"
                        name= "description"
                        value= {formData.description ?? ''}
                        required= {true}
                        disabled={false}
                        error= {errors.description}
                        rows={4}
                        onChange={handleChange}
                    />    
                    <FormField
                        label= "Date"
                        name= "date"
                        type= "date"
                        value= {formData.date ?? ''}
                        required= {true}
                        disabled={!event}
                        error= {errors.date}
                        onChange={handleChange}
 />    
                    <FormField
                        label= "Time"
                        name= "time"
                        type= "time"
                        value= {formData.time ?? ''}
                        required= {false}
                        disabled={!event}
                        error= {errors.time}
                        onChange={handleChange}                        
                    />    
                     <FormField
                        label= "Location"
                        name= "location"
                        type= "text"
                        value= {formData.location ?? ''}
                        required= {false}
                        disabled={!!event}
                        error= {errors.location}
                        onChange={handleChange}                        
                    />    
                     <FormField
                        label= "Organizer"
                        name= "organizer"
                        type= "text"
                        value= {formData.organizer ?? ''}
                        required= {false}
                        disabled={!event}
                        error= {errors.organizer}
                        onChange={handleChange}                        
                    />    
                    <SelectField
                        label="Category"
                        name="category"
                        value={formData.category ?? ''}
                        required={true}
                        disabled={false}
                        placeholder='Select Event Category'
                        options={EVENT_CATEGORIES}
                        error= {errors.category}                       
                        onChange={handleChange}
                    />
                    <SelectField
                        label="Priority"
                        name="priority"
                        value={formData.priority ?? ''}
                        required={true}
                        disabled={false}
                        placeholder='Select Priority'
                        options={EVENT_PRIORITIES}
                        error= {errors.priority}                           
                        onChange={handleChange}
                    />
                    <SelectField
                        label="Status"
                        name="status"
                        value={formData.status ?? ''}
                        required={true}
                        disabled={false}
                        placeholder='Select Status'
                        options={EVENT_STATUSES}
                        error= {errors.status}                        
                        onChange={handleChange}
                    />

                    <FormField
                        label= "Contact Email"
                        name= "contact_email"
                        type= "email"
                        value= {formData.contact_email ?? ''}
                        required= {true}
                        disabled={false}
                        error= {errors.contact_email}
                        onChange={handleChange}
                    /> 

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
