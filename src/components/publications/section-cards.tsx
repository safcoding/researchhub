"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PublicationLogic } from "@/hooks/logic/publication-logic";
import { Loader2 } from "lucide-react";

export function SectionCards() {
  const { fetchPublicationsStats } = PublicationLogic();
  const [stats, setStats] = useState<null | {
    total: number;
    year: number;
    month: number;
    quarter: number;
  }>(null);

  useEffect(() => {
    const getStats = async () => {
      const res = await fetchPublicationsStats();
      setStats(res.stats);
    };
    getStats();
  }, [fetchPublicationsStats]);

  if (!stats) {
    return (
      <div className="flex gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="flex-1">
            <CardContent className="flex items-center justify-center h-24">
              <Loader2 className="animate-spin" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>This Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.year}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>This Quarter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.quarter}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.month}</div>
        </CardContent>
      </Card>
    </div>
  );
}