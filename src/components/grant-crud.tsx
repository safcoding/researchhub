import type { Grant } from '@/hooks/grant-logic';
import { useState } from 'react';

type AddModalProps = {
    grant?: never;
    onSave: (grant: Omit<Grant, 'PROJECTID'>) => Promise<void>;
    onClose: () => void;
    isEdit: false;
};

type EditModalProps = {
    grant: Grant;
    onSave: (grant: Partial<Grant>) => Promise<void>;
    onClose: () => void;
    isEdit: true;
};

type GrantModalProps = AddModalProps | EditModalProps;

export function GrantModal({ grant, onSave, onClose, isEdit }: GrantModalProps) {
    const [formData, setFormData] = useState<Partial<Grant>>(grant || {});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async () => {
        if (isEdit) {
            await onSave(formData);
        } else {
            // Cast to remove optional properties when adding a new grant
            const newGrant = formData as Omit<Grant, 'PROJECTID'>;
            await onSave(newGrant);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {grant ? 'Edit Grant' : 'Add New Grant'}
                </h2>
                <form className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Cost Center Code
                        </label>
                        <input
                            type="text"
                            name="COST_CENTER_CODE"
                            value={formData.COST_CENTER_CODE || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            PL Staff Number
                        </label>
                        <input
                            type="number"
                            name="PL_STAFF_NO"
                            value={formData.PL_STAFF_NO || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            PL Name
                        </label>
                        <input
                            type="text"
                            name="PL_NAME"
                            value={formData.PL_NAME || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Research Alliance
                        </label>
                        <input
                            type="text"
                            name="PTJ_RESEARCH_ALLIANCE"
                            value={formData.PTJ_RESEARCH_ALLIANCE || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Research Group
                        </label>
                        <input
                            type="text"
                            name="RESEARCH_GROUP"
                            value={formData.RESEARCH_GROUP || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Project Title
                        </label>
                        <input
                            type="text"
                            name="PROJECT_TITLE"
                            value={formData.PROJECT_TITLE || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="PRO_DATESTART"
                            value={formData.PRO_DATESTART || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="PRO_DATEEND"
                            value={formData.PRO_DATEEND || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Grant Type
                        </label>
                        <input
                            type="text"
                            name="GRANT_TYPE"
                            value={formData.GRANT_TYPE || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Project Status
                        </label>
                        <input
                            type="text"
                            name="PROJECT_STATUS"
                            value={formData.PROJECT_STATUS || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sponsor Category
                        </label>
                        <input
                            type="text"
                            name="SPONSOR_CATEGORY"
                            value={formData.SPONSOR_CATEGORY || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Subsponsor Name
                        </label>
                        <input
                            type="text"
                            name="SUBSPONSOR_NAME"
                            value={formData.SUBSPONSOR_NAME || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Approved Amount
                        </label>
                        <input
                            type="number"
                            name="PRO_APPROVED"
                            value={formData.PRO_APPROVED || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                </form>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}