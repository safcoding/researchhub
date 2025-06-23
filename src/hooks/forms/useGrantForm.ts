import type { Grant } from '@/hooks/grant-logic';
import { REQUIRED_GRANT_FIELDS } from '@/constants/grant-options';
import { useFormLogic } from './useFormLogic';

export function useGrantForm(grant?: Grant) {
    // ✅ Now using your generic hook properly!
    return useFormLogic<Grant>({
        initialData: grant || {},
        requiredFields: REQUIRED_GRANT_FIELDS,
        numericFields: ['PL_STAFF_NO', 'PRO_APPROVED'],  // ✅ Specify numeric fields
        customValidation: (data) => {
            const errors: Record<string, string> = {};

            // Validate dates
            if (data.PRO_DATESTART && data.PRO_DATEEND) {
                if (new Date(data.PRO_DATESTART) >= new Date(data.PRO_DATEEND)) {
                    errors.PRO_DATEEND = 'End date must be after start date';
                }
            }

            // Validate amount
            if (data.PRO_APPROVED && data.PRO_APPROVED <= 0) {
                errors.PRO_APPROVED = 'Amount must be greater than 0';
            }

            // Validate staff number
            if (data.PL_STAFF_NO && data.PL_STAFF_NO <= 0) {
                errors.PL_STAFF_NO = 'Staff number must be a positive number';
            }

            return errors;
        }
    });
}