"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Info,
  Search,
  Pencil,
  TrendingUp,
  ArrowUpDown,
  Download,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have this from shadcn

type SafetyStock = {
  min: number;
  max: number;
  fill: number;
  color: string;
};

type Item = {
  id: number;
  material: string;
  description: string;
  branch: string;
  abc: string;
  stock: number;
  netAvl: number;
  safetyStock: SafetyStock;
  weekly: number;
  avg6M: number;
  lySm: number;
  sugQty: number;
  value: string;
  status: string;
  trend: boolean;
};

export default function SparesDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedABC, setSelectedABC] = useState("all");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: "asc" | "desc";
  } | null>(null);
  const [tableDensity, setTableDensity] = useState<"default" | "compact">(
    "default",
  );

  const items: Item[] = [
    {
      id: 1,
      material: "FL221ELDLK010",
      description: "FL221ELDLK010",
      branch: "Pune",
      abc: "A",
      stock: 60,
      netAvl: 60,
      safetyStock: { min: 90, max: 110, fill: 40, color: "bg-orange-500" },
      weekly: 81.41,
      avg6M: 86.8,
      lySm: 349,
      sugQty: 56,
      value: "₹16.8K",
      status: "Draft",
      trend: true,
    },
    // ... (keep your other 4 items, or add more for realism)
    {
      id: 2,
      material: "UF211ELUNV170",
      description: "UF211ELUNV170",
      branch: "Pune",
      abc: "A",
      stock: 1,
      netAvl: 1,
      safetyStock: { min: 1, max: 5, fill: 20, color: "bg-red-500" },
      weekly: 3.29,
      avg6M: 14.2,
      lySm: 1,
      sugQty: 4,
      value: "₹15.5K",
      status: "Draft",
      trend: true,
    },
    {
      id: 3,
      material: "CD211ELEHT010",
      description: "CD211ELEHT010",
      branch: "Mumbai",
      abc: "A",
      stock: 6,
      netAvl: 6,
      safetyStock: { min: 5, max: 23, fill: 25, color: "bg-red-500" },
      weekly: 15.89,
      avg6M: 62.2,
      lySm: 68,
      sugQty: 17,
      value: "₹11.8K",
      status: "Draft",
      trend: false,
    },
    {
      id: 4,
      material: "UF921OTKIT030",
      description: "UF921OTKIT030",
      branch: "Mumbai",
      abc: "A",
      stock: 4,
      netAvl: 4,
      safetyStock: { min: 4, max: 10, fill: 40, color: "bg-orange-500" },
      weekly: 6.79,
      avg6M: 7,
      lySm: 29,
      sugQty: 6,
      value: "₹7.9K",
      status: "Draft",
      trend: true,
    },
    {
      id: 5,
      material: "UF320MXDDA090",
      description: "UF320MXDDA090",
      branch: "Pune",
      abc: "A",
      stock: 2,
      netAvl: 2,
      safetyStock: { min: 2, max: 3, fill: 60, color: "bg-amber-500" },
      weekly: 1.96,
      avg6M: 8.3,
      lySm: 1,
      sugQty: 1,
      value: "₹7.4K",
      status: "Draft",
      trend: false,
    },
  ];

  // Filtering & Sorting
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter((item) =>
        [item.material, item.description, item.branch].some((field) =>
          field.toLowerCase().includes(q),
        ),
      );
    }

    // Branch filter
    if (selectedBranch !== "all") {
      result = result.filter((item) => item.branch === selectedBranch);
    }

    // ABC filter
    if (selectedABC !== "all") {
      result = result.filter((item) => item.abc === selectedABC);
    }

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, searchQuery, selectedBranch, selectedABC, sortConfig]);

  const handleSort = (key: keyof Item) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredAndSortedItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAndSortedItems.map((i) => i.id));
    }
  };

  // Safety Stock Bar Component
  const SafetyStockBar = ({ safety }: { safety: SafetyStock }) => (
    <div className="w-[110px] flex flex-col gap-1">
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
        <div
          className={cn(
            "h-full absolute left-0 rounded-full transition-all",
            safety.color,
          )}
          style={{ width: `${Math.min(safety.fill, 100)}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-gray-400 dark:bg-gray-600"
          style={{ left: "60%" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-0.5">
        <span>{safety.min}</span>
        <span>{safety.max}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/70 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-[1680px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Spares Replenishment
            </h1>
            <p className="text-muted-foreground mt-1">
              Suggested orders based on consumption patterns • Pune + Mumbai
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              Create PO
            </Button>
          </div>
        </div>

        {/* Summary Cards - Improved with icons & better hierarchy */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Total Items",
              value: "15,458",
              sub: "125 need orders",
              color: "",
            },
            {
              label: "Order Value",
              value: "₹2.4L",
              sub: "for 125 items",
              color: "text-emerald-600",
            },
            {
              label: "High Priority (A+B)",
              value: "11,336",
              sub: "",
              color: "text-red-600",
            },
            {
              label: "Avg Days of Cover",
              value: "7.2",
              sub: "Target: 5-10",
              color: "",
            },
            { label: "Overrides", value: "0", sub: "", color: "text-blue-600" },
            {
              label: "Confirmed POS",
              value: "0",
              sub: "",
              color: "text-emerald-600",
            },
          ].map((card, i) => (
            <Card
              key={i}
              className="shadow-sm border border-border hover:shadow transition-all duration-200"
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
                {card.sub && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {card.sub}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Panel - Clean & collapsible in production */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-5 text-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-semibold text-foreground">
              How Suggested Quantity is Calculated
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 text-muted-foreground text-[13px]">
            <div>Daily Consumption = max(6M Avg, LY Same Month) ÷ 30</div>
            <div>Max Level = Daily × 10 days</div>
            <div>Suggested Qty = max(0, Max Level – Net Available)</div>
            <div>Min Level = Daily × 5 days</div>
          </div>
          <div className="text-[11px] text-muted-foreground mt-4 border-t border-blue-100 dark:border-blue-900 pt-3">
            Priority: A/B = High. Configure Min/Max cover days in Settings.
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search material, description..."
                className="pl-10 h-10 bg-background shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedABC} onValueChange={setSelectedABC}>
              <SelectTrigger className="w-[110px] h-10">
                <SelectValue placeholder="ABC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ABC</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hidden sm:inline">
              Density:
            </span>
            <Button
              variant={tableDensity === "default" ? "default" : "outline"}
              size="sm"
              onClick={() => setTableDensity("default")}
            >
              Default
            </Button>
            <Button
              variant={tableDensity === "compact" ? "default" : "outline"}
              size="sm"
              onClick={() => setTableDensity("compact")}
            >
              Compact
            </Button>
          </div>
        </div>

        {/* Main Table */}
        <Card className="shadow-sm border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-12 pl-4">
                    <Checkbox
                      checked={
                        selectedRows.length === filteredAndSortedItems.length &&
                        filteredAndSortedItems.length > 0
                      }
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  {[
                    { key: "material", label: "Material" },
                    { key: "description", label: "Description" },
                    { key: "branch", label: "Branch" },
                    { key: "abc", label: "ABC" },
                    { key: "stock", label: "Stock", align: "right" },
                    { key: "netAvl", label: "Net Avl", align: "right" },
                    { key: null, label: "Safety Stock" },
                    { key: "weekly", label: "Weekly", align: "right" },
                    { key: "avg6M", label: "6M Avg", align: "right" },
                    { key: "lySm", label: "LY SM", align: "right" },
                    { key: "sugQty", label: "Sug Qty", align: "right" },
                    { key: "value", label: "Value", align: "right" },
                    { key: "status", label: "Status", align: "center" },
                    { key: null, label: "Trend", align: "center" },
                  ].map((col, index) => (
                    <TableHead
                      key={index}
                      className={cn(
                        "font-medium text-muted-foreground whitespace-nowrap py-4",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                      )}
                    >
                      {col.key ? (
                        <button
                          onClick={() => handleSort(col.key as keyof Item)}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          {col.label}
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      ) : (
                        col.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAndSortedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="h-72 text-center">
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Search className="w-10 h-10 mb-4 opacity-40" />
                        <p className="font-medium">No matching spares found</p>
                        <p className="text-sm mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "hover:bg-muted/50 transition-colors group",
                        tableDensity === "compact" && "h-12",
                      )}
                    >
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={selectedRows.includes(item.id)}
                          onCheckedChange={() => toggleRowSelection(item.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.material}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description}
                      </TableCell>
                      <TableCell>{item.branch}</TableCell>
                      <TableCell>
                        <div className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                          {item.abc}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.stock}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.netAvl}
                      </TableCell>

                      <TableCell>
                        <SafetyStockBar safety={item.safetyStock} />
                      </TableCell>

                      <TableCell className="text-right">
                        {item.weekly.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">{item.avg6M}</TableCell>
                      <TableCell className="text-right">{item.lySm}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold">{item.sugQty}</span>
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer" />
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {item.value}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-medium">
                          {item.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        {item.trend ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto rotate-180" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer Bar (Production touch) */}
          <div className="border-t bg-muted/40 px-6 py-3 flex items-center justify-between text-sm text-muted-foreground">
            <div>{filteredAndSortedItems.length} items shown</div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <MoreHorizontal className="w-4 h-4" />
                Bulk Actions
              </Button>
              {selectedRows.length > 0 && (
                <div className="text-foreground font-medium">
                  {selectedRows.length} selected
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
