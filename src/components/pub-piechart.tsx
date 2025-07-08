'use client';

import React, { useMemo } from 'react';
import { PUBLICATION_TYPES } from '@/constants/publication-options';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Publication } from '@/hooks/logic/publication-logic';

// Type for aggregated data from the server
export type AggregatedTypeCount = {
  name: string;
  value: number;
};

interface Props {
  publications?: Publication[];
  aggregatedData?: AggregatedTypeCount[];
}

const COLORS = [
  '#2B9167', // Green
  '#F97316', // Orange
  '#3F83F8', // Blue
  '#FBBF24', // Yellow
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#10B981', // Teal Green
  '#E11D48'  // Red
];

export const PublicationPieChart: React.FC<Props> = ({ publications, aggregatedData }) => {
  const data = useMemo(() => {
    // If aggregated data is provided, use it (server-side calculation)
    if (aggregatedData && aggregatedData.length > 0) {
      return aggregatedData;
    }

    // Fallback to client-side calculation if publications are provided
    if (!publications || publications.length === 0) {
      return [];
    }

    const typeCounts: Record<string, number> = {};

    const knownTypes = [
      'book chapter',
      'original book',
      'scopus',
      'publication in web of science',
      'conference paper',
      'proceedings'
    ];

    publications.forEach((pub) => {
      const rawType = pub.type || 'Unknown';
      const type = rawType.toLowerCase();

      const normalizedType = knownTypes.includes(type) ? rawType : 'Others';
      typeCounts[normalizedType] = (typeCounts[normalizedType] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }, [publications, aggregatedData]);

  if (data.length === 0) {
    return <p className="text-gray-500">No data to display.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
  <PieChart margin={{ top: 30, bottom: 10 }}>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="45%"
      outerRadius={80}
      paddingAngle={4}
      label
    >
      {data.map((_, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend verticalAlign="bottom" height={36} />
  </PieChart>
</ResponsiveContainer>

  );
};
