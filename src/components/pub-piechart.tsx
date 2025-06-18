'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Publication } from '@/hooks/publication-logic';

interface Props {
  publications: Publication[];
}

const COLORS = ['#1E40AF', '#1C64F2', '#3F83F8', '#76A9FA', '#22C55E', '#10B981', '#FBBF24', '#F97316'];

export const PublicationPieChart: React.FC<Props> = ({ publications }) => {
  const data = useMemo(() => {
    const typeCounts: Record<string, number> = {};

    publications.forEach((pub) => {
      const type = pub.type || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }, [publications]);

  if (data.length === 0) {
    return <p className="text-gray-500">No data to display.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
