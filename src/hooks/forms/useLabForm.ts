import type { Lab } from '@/hooks/lab-logic';
import { REQUIRED_LAB_FIELDS } from '@/constants/lab-options';
import { useFormLogic } from './useFormLogic';

export function useLabForm(lab?: Lab) {
    return useFormLogic<Lab>({
        initialData: lab || {},
        requiredFields: REQUIRED_LAB_FIELDS,
        numericFields: [], // No numeric fields in lab form
        customValidation: (data) => {
            const errors: Record<string, string> = {};

            // Validate email format
            if (data.LAB_HEAD_EMAIL && !/\S+@\S+\.\S+/.test(data.LAB_HEAD_EMAIL)) {
                errors.LAB_HEAD_EMAIL = 'Please enter a valid email address';
            }

            // Validate phone number (basic validation)
            if (data.CONTACT_PHONE && !/^\+?[\d\s\-\(\)]+$/.test(data.CONTACT_PHONE)) {
                errors.CONTACT_PHONE = 'Please enter a valid phone number';
            }

            // Validate lab name length
            if (data.LAB_NAME && data.LAB_NAME.length < 3) {
                errors.LAB_NAME = 'Lab name must be at least 3 characters long';
            }

            // Validate lab head name
            if (data.LAB_HEAD && data.LAB_HEAD.length < 2) {
                errors.LAB_HEAD = 'Lab head name must be at least 2 characters long';
            }

            return errors;
        }
    });
}