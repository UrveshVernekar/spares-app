"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, AlertTriangle, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-muted rounded-md", className)} />
);

const ShimmerCard = () => (
  <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
    <CardContent className="p-6">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-10 w-24" />
    </CardContent>
  </Card>
);

const analyticsData = [
  { name: "ID911ELHTR060", score: 0.205, category: "Electrical" },
  { name: "ID921ELFUS040", score: 0.188, category: "Mechanical" },
  { name: "ID911ECPCB280", score: 0.108, category: "Control" },
  { name: "LM221ELHTR060", score: 0.102, category: "Electrical" },
  { name: "ID911ELCBL070", score: 0.098, category: "Electrical" },
  { name: "ID911PPHOS030", score: 0.091, category: "Hydraulic" },
  { name: "LM221ELLOK010", score: 0.088, category: "Mechanical" },
  { name: "ID911ELTPB030", score: 0.082, category: "Electrical" },
  { name: "ID911ELHTR040", score: 0.078, category: "Electrical" },
  { name: "ID921ELFUS020", score: 0.075, category: "Mechanical" },
  { name: "ID911ECPCB120", score: 0.071, category: "Control" },
  { name: "LM221ELHTR020", score: 0.068, category: "Electrical" },
  { name: "ID911ELCBL040", score: 0.065, category: "Electrical" },
  { name: "ID911PPHOS010", score: 0.061, category: "Hydraulic" },
  { name: "LM221ELLOK005", score: 0.058, category: "Mechanical" },
].sort((a, b) => b.score - a.score);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API loading (replace with real axios call later)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // ==================== LOADING UI ====================
  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 dark:bg-[#0a0a0a] min-h-screen">
        <div className="max-w-[1680px] mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-9 w-80" />
              <Skeleton className="h-4 w-96 mt-2" />
            </div>
            <Skeleton className="h-10 w-64 rounded-lg" />
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>

          {/* Main Chart Skeleton */}
          <Card className="border-none shadow-md bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-7 border-b">
              <div>
                <Skeleton className="h-7 w-80" />
                <Skeleton className="h-4 w-96 mt-2" />
              </div>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[600px] w-full flex items-center justify-center bg-muted/30 rounded-xl">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Rendering Analytics...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ==================== ERROR UI ====================
  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50/50 dark:bg-[#0a0a0a]">
        <div className="text-center max-w-md">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-950 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            Failed to Load Analytics
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} size="lg">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ==================== MAIN CONTENT ====================
  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 dark:bg-[#0a0a0a] min-h-screen">
      <div className="max-w-[1680px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inventory Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Deep dive into part aging scores and failure probabilities.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              System Efficiency: +12.4%
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center text-orange-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    High Risk Parts
                  </p>
                  <p className="text-2xl font-bold text-orange-600">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center text-blue-600">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Analyzed
                  </p>
                  <p className="text-2xl font-bold text-blue-600">1,284</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Aging Score
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">0.072</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart Section */}
        <Card className="border-none shadow-md bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 border-b border-gray-100 dark:border-zinc-800">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                Critical Aging Distribution
              </CardTitle>
              <CardDescription>
                Material-wise aging scores normalized for current inventory
                cycle.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-xs px-2 py-1 flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              Last Updated: Just Now
            </Badge>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[600px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData}
                  layout="vertical"
                  margin={{ top: 5, right: 40, left: 100, bottom: 5 }}
                  barSize={24}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 0.22]}
                    ticks={[0, 0.055, 0.11, 0.165, 0.22]}
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-zinc-950 border border-border p-3 rounded-lg shadow-xl">
                            <p className="text-sm font-bold">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Category:{" "}
                              <span className="font-medium text-foreground">
                                {payload[0].payload.category}
                              </span>
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <p className="text-sm font-semibold">
                                Aging Score:{" "}
                                <span className="text-blue-600 dark:text-blue-400">
                                  {payload[0].value}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {analyticsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index < 2
                            ? "#3b82f6"
                            : index < 5
                              ? "#60a5fa"
                              : "#93c5fd"
                        }
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
