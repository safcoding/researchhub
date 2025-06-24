import { useMemo } from 'react';


//recycle the filtering logic from the publications page
export function useFilteredPublications(publications: any[], filters: {
  searchText?: string;
  filterCategory?: string;
  filterYear?: string;
  filterType?: string;
}) {
  const knownTypes = [
    'book chapter',
    'original book',
    'publication in web of science',
    'conference paper',
    'proceedings',
    'scopus'
  ];

  return useMemo(() => {
    return publications.filter(pub => {
      const matchesSearch = !filters.searchText ||
        pub.title?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        pub.journal?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        pub.author_name?.toLowerCase().includes(filters.searchText.toLowerCase());

      const matchesCategory = !filters.filterCategory ||
        pub.category?.toLowerCase() === filters.filterCategory.toLowerCase();

      const matchesYear = !filters.filterYear ||
        new Date(pub.date).getFullYear().toString() === filters.filterYear;

      const pubType = pub.type?.toLowerCase();
      const matchesType = !filters.filterType ||
        filters.filterType === 'All Types' ||
        (filters.filterType === 'Others'
          ? !knownTypes.includes(pubType)
          : pubType === filters.filterType.toLowerCase());

      return matchesSearch && matchesCategory && matchesYear && matchesType;
    });
  }, [publications, filters]);
}
