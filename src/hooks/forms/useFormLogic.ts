import { useState } from 'react';

interface UseFormLogicOptions<T> {
    initialData?: Partial<T>;
    requiredFields?: readonly string[];
    numericFields?: string[];
    customValidation?: (data: Partial<T>) => Record<string, string>;
}

export function useFormLogic<T extends Record<string, any>>({
    initialData = {},
    requiredFields = [],
    numericFields = [],
    customValidation
}: UseFormLogicOptions<T>) {
    const [formData, setFormData] = useState<Partial<T>>(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Required field validation
        requiredFields.forEach(field => {
            if (!formData[field as keyof T]) {
                newErrors[field] = 'This field is required';
                isValid = false;
            }
        });

        // Custom validation
        if (customValidation) {
            const customErrors = customValidation(formData);
            Object.assign(newErrors, customErrors);
            if (Object.keys(customErrors).length > 0) {
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' 
                ? checked 
                : numericFields.includes(name)  // ✅ Handle numeric fields
                    ? Number(value) || 0
                    : value
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent,
        onSave: (data: Partial<T>) => void | Promise<void>,
        onSuccess?: () => void
    ) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error saving:', error);
            if (error instanceof Error) {
                alert(`Error saving: ${error.message}`);
            } else {
                alert('An unknown error occurred while saving');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setFormData,
        setErrors
    };
}