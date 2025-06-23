import type { Event } from '@/hooks/event-logic';
import { REQUIRED_EVENT_FIELDS } from '@/constants/event-options';
import { useFormLogic } from './useFormLogic';

export function useEventForm(event?: Event) {
    const initialData = event || {
        registration_required: false,
        priority: 'Medium' as const,
        status: 'Upcoming' as const
    };

    const customValidation = (formData: Partial<Event>) => {
        const errors: Record<string, string> = {};

        // Special validation for category
        if (!formData.category) {
            errors.category = 'Please select a category';
        }

        // Date validation
        if (formData.date && formData.registration_deadline) {
            const eventDate = new Date(formData.date);
            const regDeadline = new Date(formData.registration_deadline);
            if (regDeadline >= eventDate) {
                errors.registration_deadline = 'Registration deadline must be before event date';
            }
        }

        return errors;
    };

    return useFormLogic<Event>({
        initialData,
        requiredFields: REQUIRED_EVENT_FIELDS,
        customValidation
    });
}