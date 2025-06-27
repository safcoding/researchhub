import { useState, useRef, type ChangeEvent } from 'react';
import type { Event } from '@/hooks/logic/event-logic';
import { FormField } from '../../reusable/formfield';
import { TextAreaField } from '../../reusable/textarea';
import { SelectField } from '../../reusable/selectfield';
import { EVENT_CATEGORIES, EVENT_PRIORITIES, EVENT_STATUSES } from '@/constants/event-options';
import { useEventForm } from '@/hooks//forms/useEventForm';
import { Button } from '../../ui/button';

import { uploadImage } from '@/utils/supabase/storage/client';
import Image from "next/image";

interface EventModalProps {
    event?: Event;
    onSave: (eventData: Partial<Event>) => void;
    onClose: () => void;
}

export function EventModal({ event, onSave, onClose }: EventModalProps) {
    const { formData, setFormData, errors, isSubmitting, handleChange } = useEventForm(event);

   // Image logic
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
            setImageUrls(filesArray.map(file => URL.createObjectURL(file)));
        }
    };

    // Custom submit handler to upload image before saving event
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let imagePath = formData.image; // fallback to existing image if editing

        if (selectedFiles.length > 0) {
            // Only handle the first image for now
            const { path, error } = await uploadImage({
                file: selectedFiles[0],
                bucket: "event-pics",
            });
            if (error) {
                alert("Image upload failed: " + error);
                return;
            }
            imagePath = path; // Store only the path in your DB
        }

        onSave({ ...formData, image: imagePath });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {event ? 'Edit Event' : 'Add New Event'}
                    </h2>
                </div>
                <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                    <FormField
                        label="Title"
                        name="title"
                        type="text"
                        value={formData.title ?? ''}
                        required={true}
                        disabled={isSubmitting}
                        error={errors.title}
                        onChange={handleChange}
                    />
                    <TextAreaField
                        label="Description"
                        name="description"
                        value={formData.description ?? ''}
                        required={true}
                        disabled={isSubmitting}
                        error={errors.description}
                        rows={4}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Date"
                        name="date"
                        type="date"
                        value={formData.date ?? ''}
                        required={true}
                        disabled={isSubmitting}
                        error={errors.date}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Time"
                        name="time"
                        type="time"
                        value={formData.time ?? ''}
                        required={false}
                        disabled={isSubmitting}
                        error={errors.time}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Location"
                        name="location"
                        type="text"
                        value={formData.location ?? ''}
                        required={false}
                        disabled={isSubmitting}
                        error={errors.location}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Organizer"
                        name="organizer"
                        type="text"
                        value={formData.organizer ?? ''}
                        required={false}
                        disabled={isSubmitting}
                        error={errors.organizer}
                        onChange={handleChange}
                    />
                    <SelectField
                        label="Category"
                        name="category"
                        value={formData.category ?? ''}
                        required={true}
                        disabled={isSubmitting}
                        placeholder='Select Event Category'
                        options={EVENT_CATEGORIES}
                        error={errors.category}
                        onChange={handleChange}
                    />
                    <SelectField
                        label="Priority"
                        name="priority"
                        value={formData.priority ?? ''}
                        required={true}
                        disabled={isSubmitting}
                        placeholder='Select Priority'
                        options={EVENT_PRIORITIES}
                        error={errors.priority}
                        onChange={handleChange}
                    />
                    <SelectField
                        label="Status"
                        name="status"
                        value={formData.status ?? ''}
                        required={true}
                        disabled={isSubmitting}
                        placeholder='Select Status'
                        options={EVENT_STATUSES}
                        error={errors.status}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Contact Email"
                        name="contact_email"
                        type="email"
                        value={formData.contact_email ?? ''}
                        required={false}
                        disabled={isSubmitting}
                        error={errors.contact_email}
                        onChange={handleChange}
                    />

                    {/* Image upload */}
                    <input
                        type="file"
                        hidden
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        className="bg-slate-600 py-2 w-40 rounded-lg"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isSubmitting}
                    >
                        Select Image
                    </button>
                    <div className="flex gap-4">
                        {imageUrls.map((url, index) => (
                            <Image
                                key={url}
                                src={url}
                                width={300}
                                height={300}
                                alt={`img-${index}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            size="default"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className='flex-1'
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            size="default"
                            disabled={isSubmitting}
                            className='flex-1'
                        >
                            {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}