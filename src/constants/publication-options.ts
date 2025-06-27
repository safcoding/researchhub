import type { Publication } from "@/hooks/logic/publication-logic";

export const PUBLICATION_TYPES: Publication['type'][] =[
    'BOOK CHAPTER',
    'ORIGINAL BOOK',
    'SCOPUS',
    'WEB OF SCIENCE',
    'CONFERENCE PAPER',
    'PROCEEDINGS',
    'OTHERS'
] as const;

export const PUBLICATION_CATEGORIES: Publication['category'][] =[
    'INDEXED PUBLICATION',
    'NON-INDEXED PUBLICATION',
    'OTHERS',
] as const;

export const REQUIRED_PUBLICATION_FIELDS = [
    'pub_refno',
    'title',
    'journal', 
    'impact',
    'date',
    'level',
] as const;