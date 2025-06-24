'use client';

import React from 'react';


//ui for the filters on the publications page
type Props = {
  searchText: string;
  filterCategory: string;
  filterYear: string;
  filterType: string;
  availableYears: string[];

  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onYearChange: (val: string) => void;
  onTypeChange: (val: string) => void;
};

export const PublicationFilters: React.FC<Props> = ({
  searchText,
  filterCategory,
  filterYear,
  filterType,
  availableYears,
  onSearchChange,
  onCategoryChange,
  onYearChange,
  onTypeChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      <select
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">All Categories</option>
        <option value="INDEXED PUBLICATION">Indexed Publication</option>
        <option value="NON INDEXED PUBLICATION">Non-Indexed Publication</option>
        <option value="OTHERS PUBLICATION">Others</option>
      </select>

      <select
        value={filterYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">All Years</option>
        {availableYears.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        value={filterType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="All Types">All Types</option>
        <option value="BOOK CHAPTER">Book Chapter</option>
        <option value="ORIGINAL BOOK">Research Book</option>
        <option value="Scopus">Scopus</option>
        <option value="PUBLICATION IN WEB OF SCIENCE">Web of Science</option>
        <option value="CONFERENCE PAPER">Conference</option>
        <option value="PROCEEDINGS">Proceeding</option>
        <option value="Others">Others</option>
      </select>

      <input
        type="text"
        placeholder="Search titles or authors..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border px-3 py-2 rounded text-sm w-40"
      />
    </div>
  );
};
