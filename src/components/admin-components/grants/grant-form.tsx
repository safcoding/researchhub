import type { Grant } from "@/hooks/grant-logic";
import { GRANT_TYPES, GRANT_STATUSES, SPONSOR_CATEGORIES } from '@/constants/grant-options';
import { useGrantForm } from '@/hooks/forms/useGrantForm';
import { FormField } from "../../reusable/formfield";
import { SelectField } from "../../reusable/selectfield";
import { Button } from "../../ui/button";

interface GrantModalProps {
    grant?: Grant;
    onSave: (grant: Partial<Grant>) => Promise<void>;
    onClose: () => void;
}

export function GrantModal({ grant, onSave, onClose }: GrantModalProps) {
    const { formData, errors, isSubmitting, handleChange, handleSubmit } = useGrantForm(grant);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {grant ? 'Edit Grant' : 'Add New Grant'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

          <form onSubmit={(e) => handleSubmit(e, onSave, onClose)} className="p-6 space-y-8">
                    {/* 📝 Project Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            📝 Project Information
                        </h3>
                        
                        <FormField
                            label="Project ID"
                            name="PROJECTID"
                            type="text"
                            value={formData.PROJECTID ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.PROJECTID}
                            onChange={handleChange}
                        />

                        <FormField
                            label="Project Title"
                            name="PROJECT_TITLE"
                            type="text"
                            value={formData.PROJECT_TITLE ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.PROJECT_TITLE}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 👤 Principal Investigator */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            👤 Project Leader
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="PI Name"
                                name="PL_NAME"
                                type="text"
                                value={formData.PL_NAME ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.PL_NAME}
                                onChange={handleChange}
                            />

                            <FormField
                                label="PI Staff Number"
                                name="PL_STAFF_NO"
                                type="number"
                                value={formData.PL_STAFF_NO?.toString() ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                error={errors.PL_STAFF_NO}
                                onChange={handleChange}
                            />
                        </div>

                        <FormField
                            label="Research Group"
                            name="RESEARCH_GROUP"
                            type="text"
                            value={formData.RESEARCH_GROUP ?? ''}
                            required={false}
                            disabled={isSubmitting}
                            error={errors.RESEARCH_GROUP}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 📅 Timeline & Financial */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            📅 Timeline & Financial
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                label="Start Date"
                                name="PRO_DATESTART"
                                type="date"
                                value={formData.PRO_DATESTART ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.PRO_DATESTART}
                                onChange={handleChange}
                            />

                            <FormField
                                label="End Date"
                                name="PRO_DATEEND"
                                type="date"
                                value={formData.PRO_DATEEND ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.PRO_DATEEND}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Amount Approved (MYR)"
                                name="PRO_APPROVED"
                                type="number"
                                value={formData.PRO_APPROVED?.toString() ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.PRO_APPROVED}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* 🏷️ Classification */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            🏷️ Classification
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField
                                label="Grant Type"
                                name="GRANT_TYPE"
                                value={formData.GRANT_TYPE ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                placeholder="Select Grant Type"
                                options={GRANT_TYPES}
                                error={errors.GRANT_TYPE}
                                onChange={handleChange}
                            />

                            <SelectField
                                label="Project Status"
                                name="PROJECT_STATUS"
                                value={formData.PROJECT_STATUS ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                placeholder="Select Status"
                                options={GRANT_STATUSES}
                                error={errors.PROJECT_STATUS}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* 🏢 Sponsorship Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            🏢 Sponsorship Details
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField
                                label="Sponsor Category"
                                name="SPONSOR_CATEGORY"
                                value={formData.SPONSOR_CATEGORY ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                placeholder="Select Category"
                                options={SPONSOR_CATEGORIES}
                                error={errors.SPONSOR_CATEGORY}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Sponsor Name"
                                name="SPONSOR_NAME"
                                type="text"
                                value={formData.SPONSOR_NAME ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                error={errors.SPONSOR_NAME}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Subsponsor Name"
                                name="SUBSPONSOR_NAME"
                                type="text"
                                value={formData.SUBSPONSOR_NAME ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                error={errors.SUBSPONSOR_NAME}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Cost Center Code"
                                name="COST_CENTER_CODE"
                                type="text"
                                value={formData.COST_CENTER_CODE ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                error={errors.COST_CENTER_CODE}
                                onChange={handleChange}
                            />
                        </div>

                        <FormField
                            label="Research Alliance"
                            name="PTJ_RESEARCH_ALLIANCE"
                            type="text"
                            value={formData.PTJ_RESEARCH_ALLIANCE ?? ''}
                            required={false}
                            disabled={isSubmitting}
                            error={errors.PTJ_RESEARCH_ALLIANCE}
                            onChange={handleChange}
                        />
                    </div>
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
                            {isSubmitting ? 'Saving...' : (grant ? 'Update Grant' : 'Create Grant')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}