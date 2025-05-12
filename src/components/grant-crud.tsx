import type { Grant } from '@/hooks/grant-logic';
import { useState } from 'react';

interface GrantModalProps {
    grant?: Grant;
    onSave: (grant: Partial<Grant>) => void;
    onClose: () => void;
}

export function GrantModal({ grant, onSave, onClose }: GrantModalProps) {
    const [formData, setFormData] = useState<Partial<Grant>>(grant || {});

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">
                    {grant ? 'Edit Grant' : 'Add New Grant'}
                </h2>
                {/* Add your form fields here */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}