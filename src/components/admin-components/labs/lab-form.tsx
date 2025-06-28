import { useState, useEffect } from 'react';
import type { Lab } from '@/hooks/logic/lab-logic';
import { useEquipmentLogic } from '@/hooks/logic/equipment-logic';
import { LAB_TYPES, LAB_STATUS } from '@/constants/lab-options';
import { useLabForm } from '@/hooks/forms/useLabForm';
import { useLabEquipmentLogic } from '@/hooks/logic/lab-equipment-logic';
import { FormField } from '@/components/reusable/formfield';
import { TextAreaField } from '@/components/reusable/textarea';
import { SelectField } from '@/components/reusable/selectfield';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/reusable/combobox';

interface LabModalProps {
    lab?: Lab;
    onSave: (labData: Partial<Lab>) => Promise<string>;
    onClose: () => void;
}

export function LabFormModal({ lab, onSave, onClose }: LabModalProps) {
    const { formData, errors, isSubmitting, handleChange } = useLabForm(lab);
    const { equipment } = useEquipmentLogic(); 
    const [selectedEquipment, setSelectedEquipment] = useState<{ id: string, name: string, quantity: number }[]>([]);
    const { assignEquipmentToLab, labEquipment, loading, fetchLabEquipment } = useLabEquipmentLogic();

    const handleEquipmentSelect = (equipmentId: string) => {
    if (!selectedEquipment.some(eq => eq.id === equipmentId)) {
        const eq = equipment.find(e => e.id === equipmentId);
        if (eq) {
        setSelectedEquipment([...selectedEquipment, { id: equipmentId, name: eq.name, quantity: 1 }]);
        }
    }
    };
    const handleQuantityChange = (equipmentId: string, quantity: number) => {
    setSelectedEquipment(selectedEquipment.map(eq =>
        eq.id === equipmentId ? { ...eq, quantity } : eq
    ));
    };

    const handleRemoveEquipment = (equipmentId: string) => {
    setSelectedEquipment(selectedEquipment.filter(eq => eq.id !== equipmentId));
    };

const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        console.log('Submitting formData:', formData);
        const labId = await onSave(formData);
        console.log('Lab ID returned from onSave:', labId);
        for (const eq of selectedEquipment) {
            await assignEquipmentToLab(labId, eq.id, eq.quantity);
        }
        onClose();
    } catch (err) {
        console.error('Error saving lab or assigning equipment:', err);
        alert('Error saving lab or assigning equipment: ' + (err instanceof Error ? err.message : JSON.stringify(err)));
    }
};

useEffect(() => {
  if (lab && labEquipment.length > 0) {
    setSelectedEquipment(
      labEquipment.map(eq => ({
        id: eq.equipment?.id || eq.equipment_id,
        name: eq.equipment?.name || 'Unknown',
        quantity: eq.quantity,
      }))
    );
  } else if (lab && labEquipment.length === 0) {
    setSelectedEquipment([]);
  }
}, [lab, labEquipment]);

useEffect(() => {
  if (lab?.LABID) {
    fetchLabEquipment(lab.LABID);
  }
}, [lab?.LABID, fetchLabEquipment]);

    return (
        <div
            className ="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
            onClick={e => {
            if (e.target === e.currentTarget) {
                onClose();
            }
            }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {lab ? 'Edit Lab' : 'Add New Lab'}
                    </h2>
                </div>
                <form onSubmit={handleLabSubmit} className="p-6 space-y-8">
                    {/* 🧪 Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            🧪 Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Lab Name"
                                name="LAB_NAME"
                                type="text"
                                value={formData.LAB_NAME ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.LAB_NAME}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Lab Head"
                                name="LAB_HEAD"
                                type="text"
                                value={formData.LAB_HEAD ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.LAB_HEAD}
                                onChange={handleChange}
                            />

                            <SelectField
                                label="Lab Type"
                                name="LAB_TYPE"
                                value={formData.LAB_TYPE ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                placeholder="Select Lab Type"
                                options={LAB_TYPES}
                                error={errors.LAB_TYPE}
                                onChange={handleChange}
                            />

                            <SelectField
                                label="Lab Status"
                                name="LAB_STATUS"
                                value={formData.LAB_STATUS ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                placeholder="Select Status"
                                options={LAB_STATUS}
                                error={errors.LAB_STATUS}
                                onChange={handleChange}
                            />
                        </div>

                        <FormField
                            label="Location"
                            name="LOCATION"
                            type="text"
                            value={formData.LOCATION ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.LOCATION}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 📞 Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            📞 Contact Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Contact Phone"
                                name="CONTACT_PHONE"
                                type="tel"
                                value={formData.CONTACT_PHONE ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                error={errors.CONTACT_PHONE}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Lab Head Email"
                                name="LAB_HEAD_EMAIL"
                                type="email"
                                value={formData.LAB_HEAD_EMAIL ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                error={errors.LAB_HEAD_EMAIL}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* 🔬 Research & Equipment */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            🔬 Research & Equipment
                        </h3>
                        
                        <FormField
                            label="Primary Research Area"
                            name="RESEARCH_AREA"
                            value={formData.RESEARCH_AREA ?? ''}
                            required={false}
                            disabled={isSubmitting}
                            placeholder="Select Research Area"
                            error={errors.RESEARCH_AREA}
                            onChange={handleChange}
                        />

                        <TextAreaField
                            label="Lab Description"
                            name="LAB_DESCRIPTION"
                            value={formData.LAB_DESCRIPTION ?? ''}
                            required={false}
                            disabled={isSubmitting}
                            error={errors.LAB_DESCRIPTION}
                            rows={4}
                            onChange={handleChange}
                            placeholder="Describe the lab's purpose, capabilities, and objectives..."
                        />
                        <Combobox
                            options={equipment
                                .filter(eq => !selectedEquipment.some(sel => sel.id === eq.id))
                                .map(eq => ({ value: eq.id, label: eq.name }))}
                            value=""
                            onChange={handleEquipmentSelect}
                            placeholder="Select equipment..."
                            />

                            {selectedEquipment.map(eq => (
                            <div key={eq.id} className="flex items-center gap-2 mt-2">
                                <span className="flex-1">{eq.name}</span>
                                <input
                                type="number"
                                min={1}
                                className="w-20 border rounded px-2 py-1"
                                value={eq.quantity}
                                onChange={e => handleQuantityChange(eq.id, Number(e.target.value))}
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleRemoveEquipment(eq.id)}
                                disabled={isSubmitting}
                                >
                                Remove
                             </Button>
                            </div>
                                ))}
                        </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="default"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting && (
                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isSubmitting ? 'Saving...' : (lab ? 'Update Lab' : 'Create Lab')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );


}