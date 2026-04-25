"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  MapPin,
  ClipboardCheck,
  BellOff,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Skeleton Components
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-muted rounded-md", className)} />
);

const ShimmerCard = () => (
  <Card className="shadow-sm border-border">
    <CardContent className="p-5">
      <Skeleton className="h-4 w-28 mb-3" />
      <Skeleton className="h-9 w-32" />
    </CardContent>
  </Card>
);

type PoolSource = {
  branch: string;
  qty: string;
  distance: string;
  isMuted: boolean;
};

type Indent = {
  id1: string;
  id2: string;
  id3: string;
  material1: string;
  material2: string;
  raisedBy: string;
  requested: number;
  fromPool: number;
  fromNpc: string;
  source: string;
  priority: string;
  status: string;
  requiredBy: string;
  poolSources: PoolSource[];
};

export default function InventoryDashboard() {
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 1, name: "Branch Indent" },
    { id: 2, name: "Pool Check & Allocation" },
    { id: 3, name: "NPC Routing" },
    { id: 4, name: "Approval Queue" },
    { id: 5, name: "Tracking Timeline" },
    { id: 6, name: "Fulfillment Analytics" },
  ];

  const indents: Indent[] = [
    {
      id1: "IND-",
      id2: "AUTO-",
      id3: "001",
      material1: "CD211ELEHT010",
      material2: "CD211ELEHT010",
      raisedBy: "Pune",
      requested: 7,
      fromPool: 7,
      fromNpc: "-",
      source: "Pool",
      priority: "High",
      status: "Pool Check",
      requiredBy: "2026-04-29",
      poolSources: [
        { branch: "Pune", qty: "3u", distance: "0km", isMuted: false },
        { branch: "Satara", qty: "1u", distance: "115km", isMuted: false },
        { branch: "Panvel", qty: "1u", distance: "120km", isMuted: true },
        { branch: "Ahmednagar", qty: "1u", distance: "120km", isMuted: false },
        { branch: "Mumbai", qty: "1u", distance: "150km", isMuted: false },
      ],
    },
    {
      id1: "IND-",
      id2: "AUTO-",
      id3: "002",
      material1: "CD211ELEHT010",
      material2: "CD211ELEHT010",
      raisedBy: "Mumbai",
      requested: 17,
      fromPool: 17,
      fromNpc: "-",
      source: "Pool",
      priority: "High",
      status: "Pool Check",
      requiredBy: "2026-04-29",
      poolSources: [
        { branch: "Thane", qty: "3u", distance: "25km", isMuted: false },
        { branch: "Panvel", qty: "1u", distance: "45km", isMuted: false },
        { branch: "Pune", qty: "1u", distance: "150km", isMuted: false },
        { branch: "Nashik", qty: "1u", distance: "170km", isMuted: false },
        { branch: "Aurangabad", qty: "1u", distance: "340km", isMuted: false },
        { branch: "Kolhapur", qty: "1u", distance: "400km", isMuted: false },
        { branch: "Nagpur", qty: "2u", distance: "840km", isMuted: false },
        { branch: "Satara", qty: "1u", distance: "--", isMuted: false },
        { branch: "Palghar", qty: "1u", distance: "--", isMuted: false },
        { branch: "Raigarh", qty: "1u", distance: "--", isMuted: false },
      ],
    },
  ];

  // Simulate API/Data Loading (Remove this later when connecting real API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  // ==================== LOADING UI ====================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50/70 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 font-sans">
        <div className="max-w-[1680px] mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-80" />
              <Skeleton className="h-4 w-96 mt-2" />
            </div>
            <Skeleton className="h-10 w-52" />
          </div>

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>

          {/* Stepper Skeleton */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-14 w-52 rounded-xl flex-shrink-0"
              />
            ))}
          </div>

          {/* Table Skeleton */}
          <Card className="shadow-sm border-border overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <Skeleton className="h-8 w-64" />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/60">
                  <TableRow>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-5 w-28" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, row) => (
                    <TableRow key={row}>
                      {Array.from({ length: 12 }).map((_, col) => (
                        <TableCell key={col}>
                          <Skeleton className="h-7 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ==================== ERROR UI ====================
  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50/70 dark:bg-zinc-950">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Failed to Load Inventory Data
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} size="lg">
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/70 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-[1680px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Inventory Flow
            </h1>
            <p className="text-muted-foreground mt-1">
              End-to-end indent management and fulfillment tracking
            </p>
          </div>
          <Button className="gap-2">
            <ClipboardCheck className="w-4 h-4" />
            New Manual Indent
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Indents", value: "24", color: "" },
            { label: "Pending", value: "24", color: "text-orange-600" },
            { label: "Fulfilled", value: "0", color: "text-emerald-600" },
            { label: "Pool vs NPC Rate", value: "100%", color: "" },
            {
              label: "Cost Savings",
              value: "₹14.0K",
              color: "text-emerald-600",
            },
            { label: "Overdue", value: "0", color: "text-emerald-600" },
          ].map((card, i) => (
            <Card
              key={i}
              className="shadow-sm border-border hover:shadow transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="text-xs font-medium text-muted-foreground tracking-widest uppercase mb-1">
                  {card.label}
                </div>
                <div
                  className={cn(
                    "text-3xl font-semibold tracking-tighter",
                    card.color,
                  )}
                >
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stepper Navigation - Modern & Clean */}
        <div className="border-b border-border pb-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-xl transition-all whitespace-nowrap group",
                  activeStep === step.id
                    ? "bg-white dark:bg-zinc-900 shadow-sm border border-border"
                    : "hover:bg-muted/60",
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold border transition-all",
                    activeStep === step.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground group-hover:border-muted-foreground",
                  )}
                >
                  {step.id}
                </div>
                <div>
                  <div
                    className={cn(
                      "font-medium text-sm",
                      activeStep === step.id
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content - Branch Indent (Step 1) */}
        {activeStep === 1 && (
          <Card className="shadow-sm border-border overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Branch Indent
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    Indents raised by branches based on system-suggested orders.
                    All indents are automatically checked against the Central
                    Pool before routing to NPC.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs px-3 py-1">
                  Auto-Routed Workflow
                </Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/60 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="pl-6 py-4 text-xs font-medium text-muted-foreground">
                      Indent ID
                    </TableHead>
                    <TableHead className="py-4 text-xs font-medium text-muted-foreground">
                      Material
                    </TableHead>
                    <TableHead className="py-4 text-xs font-medium text-muted-foreground">
                      Raised By
                    </TableHead>
                    <TableHead className="text-center py-4 text-xs font-medium text-muted-foreground">
                      Requested
                    </TableHead>
                    <TableHead className="text-center py-4 text-xs font-medium text-muted-foreground">
                      From Pool
                    </TableHead>
                    <TableHead className="py-4 text-xs font-medium text-muted-foreground">
                      Pool Sources
                    </TableHead>
                    <TableHead className="text-center py-4 text-xs font-medium text-muted-foreground">
                      From NPC
                    </TableHead>
                    <TableHead className="text-center py-4 text-xs font-medium text-muted-foreground">
                      Source
                    </TableHead>
                    <TableHead className="text-center py-4 text-xs font-medium text-muted-foreground">
                      Priority
                    </TableHead>
                    <TableHead className="text-center py-4 text-xs font-medium text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-center py-4 text-xs font-medium text-muted-foreground">
                      Required By
                    </TableHead>
                    <TableHead className="text-center py-4 pr-6 text-xs font-medium text-muted-foreground">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {indents.map((indent, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      {/* Indent ID */}
                      <TableCell className="pl-6 py-6 align-top">
                        <div className="font-mono text-xs leading-tight font-semibold text-foreground">
                          <div>
                            {indent.id1}
                            {indent.id3}
                          </div>
                          <div className="text-muted-foreground">
                            {indent.id2}
                          </div>
                        </div>
                      </TableCell>

                      {/* Material */}
                      <TableCell className="py-6 align-top">
                        <div className="font-mono text-sm">
                          <div className="font-semibold text-foreground">
                            {indent.material1}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {indent.material2}
                          </div>
                        </div>
                      </TableCell>

                      {/* Raised By */}
                      <TableCell className="py-6 align-top font-medium text-sm">
                        {indent.raisedBy}
                      </TableCell>

                      {/* Requested */}
                      <TableCell className="text-center py-6 align-top font-semibold text-lg">
                        {indent.requested}
                      </TableCell>

                      {/* From Pool */}
                      <TableCell className="text-center py-6 align-top">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                          {indent.fromPool}
                        </span>
                      </TableCell>

                      {/* Pool Sources - Enhanced Layout */}
                      <TableCell className="py-6 align-top min-w-[240px]">
                        <div className="flex flex-col gap-2">
                          {indent.poolSources.map((source, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors",
                                source.isMuted
                                  ? "opacity-60"
                                  : "hover:bg-muted/80",
                              )}
                            >
                              <MapPin
                                className={cn(
                                  "w-4 h-4 flex-shrink-0",
                                  source.isMuted
                                    ? "text-muted-foreground"
                                    : "text-blue-500",
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <div
                                  className={cn(
                                    "font-medium truncate",
                                    source.isMuted &&
                                      "line-through text-muted-foreground",
                                  )}
                                >
                                  {source.branch}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {source.qty} • {source.distance}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      {/* From NPC */}
                      <TableCell className="text-center py-6 align-top font-mono text-muted-foreground">
                        {indent.fromNpc}
                      </TableCell>

                      {/* Source */}
                      <TableCell className="text-center py-6 align-top">
                        <Badge variant="secondary" className="font-medium">
                          {indent.source}
                        </Badge>
                      </TableCell>

                      {/* Priority */}
                      <TableCell className="text-center py-6 align-top">
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4">
                          {indent.priority}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center py-6 align-top">
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Pool Check
                        </div>
                      </TableCell>

                      {/* Required By */}
                      <TableCell className="text-center py-6 align-top font-mono text-sm text-muted-foreground">
                        {indent.requiredBy}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-center py-6 pr-6 align-top">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t bg-muted/40 flex items-center justify-between text-sm text-muted-foreground">
              <div>Showing 2 active indents • All routed via Pool first</div>
              <div className="flex items-center gap-4 text-xs">
                <span>Page 1 of 1</span>
                <span className="text-emerald-600">
                  • All indents under Pool Check
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Placeholder for other steps */}
        {activeStep !== 1 && (
          <Card className="p-16 text-center border-dashed border-border">
            <div className="mx-auto w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Step {activeStep}: {steps[activeStep - 1]?.name}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This workflow step is under active development. The enhanced UI
              framework is ready for integration.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
