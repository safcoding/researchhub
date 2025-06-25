import { type Publication } from '@/hooks/publication-logic';
import { PUBLICATION_TYPES, PUBLICATION_CATEGORIES } from '@/constants/publication-options';
import { usePublicationForm } from '@/hooks/forms/usePublicationForm';
import { FormField } from "../../reusable/formfield";
import { SelectField } from "../../reusable/selectfield";
import { Button } from "../../ui/button";

interface PublicationModalProps {
    publication?: Publication;
    onSave: (publication: Partial<Publication>) => Promise<void>;
    onClose: () => void;
}

export function PublicationModal({ publication, onSave, onClose }: PublicationModalProps) {
    const { formData, errors, isSubmitting, handleChange, handleSubmit } = usePublicationForm(publication);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {publication ? 'Edit Grant' : 'Add New Grant'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

          <form onSubmit={(e) => handleSubmit(e, onSave, onClose)} className="p-6 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            📝 Project Information
                        </h3>
                        
                        <FormField
                            label="Publication Reference Number"
                            name="pub_refno"
                            type="text"
                            value={formData.pub_refno ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.pub_refno}
                            onChange={handleChange}
                        />

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
                        <FormField
                            label="Status"
                            name="status"
                            type="text"
                            value={formData.status ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.status}
                            onChange={handleChange}
                        />
                        <SelectField
                            label="Publication Type"
                            name="type"
                            value={formData.type ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            placeholder="Select Publication Type"
                            options={PUBLICATION_TYPES}
                            error={errors.type}
                            onChange={handleChange}
                        />
                        <SelectField
                            label="Publication Category"
                            name="category"
                            value={formData.category ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            placeholder="Select Publication Category"
                            options={PUBLICATION_CATEGORIES}
                            error={errors.category}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Journal"
                            name="journal"
                            type="text"
                            value={formData.journal ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.journal}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Impact"
                            name="impact"
                            type="number"
                            value={formData.impact?.toString() ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.impact}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Level"
                            name="level"
                            type="text"
                            value={formData.level ?? ''}
                            required={true}
                            disabled={isSubmitting}
                            error={errors.level}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            Author
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Author"
                                name="author_name"
                                type="text"
                                value={formData.author_name ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.author_name}
                                onChange={handleChange}
                            />

                            <FormField
                                label="Author ID"
                                name="author_id"
                                type="number"
                                value={formData.author_id?.toString() ?? ''}
                                required={false}
                                disabled={isSubmitting}
                                error={errors.PL_STAFF_NO}
                                onChange={handleChange}
                            />
                        </div>

                        <FormField
                            label="Research Alliance"
                            name="research_alliance"
                            type="text"
                            value={formData.research_alliance ?? ''}
                            required={false}
                            disabled={isSubmitting}
                            error={errors.RESEARCH_GROUP}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Research Group"
                            name="rg_name"
                            type="text"
                            value={formData.rg_name ?? ''}
                            required={false}
                            disabled={isSubmitting}
                            error={errors.rg_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                            📅 Timeline
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                label="Publication Date"
                                name="date"
                                type="date"
                                value={formData.date ?? ''}
                                required={true}
                                disabled={isSubmitting}
                                error={errors.date}
                                onChange={handleChange}
                            />
                        </div>
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
                            {isSubmitting ? 'Saving...' : (publication ? 'Update Publication' : 'Create Publication')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}