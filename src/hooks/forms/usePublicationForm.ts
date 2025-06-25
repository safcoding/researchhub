import type { Publication } from '../publication-logic';
import { REQUIRED_PUBLICATION_FIELDS } from '@/constants/publication-options';
import { useFormLogic } from './useFormLogic';

export function usePublicationForm(publication?: Publication) {

    return useFormLogic<Publication>({
        initialData: publication || {},
        requiredFields: REQUIRED_PUBLICATION_FIELDS,
        numericFields: ['author_id', 'impact'],
    });
}