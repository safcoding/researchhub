export const PUBLICATION_TYPES = [
    'Book Chapter',
    'Original Book',
    'Scopus',
    'Web of Science',
    'Conference Paper',
    'Proceedings',
    'Others'
] as const;

export const PUBLICATION_CATEGORIES = [
    'Indexed Publication',
    'Non Indexed Publication',
    'Other Publication',
] as const;

export const REQUIRED_PUBLICATION_FIELDS = [
    'pub_refno',
    'title',
    'journal', 
    'impact',
    'date',
    'level',
] as const;