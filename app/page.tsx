"use client";

import { useState, useMemo, useEffect } from "react";
import axios from "axios";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  plant: number;
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
  const [selectedPlant, setSelectedPlant] = useState("all");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:8000/api/spares/data");

        const formattedData: Item[] = res.data.data.map((item: any) => ({
          id: item.id,
          material: item.material,
          description: item.description,
          branch: item.branch,
          plant: item.plant,
          abc: item.abc,
          stock: item.stock,
          netAvl: item.netavl,
          weekly: item.weekly,
          avg6M: item.avg6m,
          lySm: item.lysm,
          sugQty: item.sugqty,
          value: item.value,
          status: item.status,
          trend: item.trend,

          safetyStock: {
            min: Math.round(item.avg6m * 0.5),
            max: Math.round(item.avg6m),
            fill: Math.min(
              Math.round((item.stock / (item.avg6m || 1)) * 100),
              100,
            ),
            color:
              item.stock <= 5
                ? "bg-red-500"
                : item.stock <= 15
                  ? "bg-orange-500"
                  : "bg-green-500",
          },
        }));

        setItems(formattedData);
      } catch (err) {
        setError("Failed to fetch spares data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // SEARCH
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      result = result.filter((item) =>
        [
          item.material,
          item.description,
          item.branch,
          item.plant.toString(),
        ].some((field) => field.toLowerCase().includes(q)),
      );
    }

    // Branch Filter
    if (selectedBranch !== "all") {
      result = result.filter((item) => item.branch === selectedBranch);
    }

    // ABC Filter
    if (selectedABC !== "all") {
      result = result.filter((item) => item.abc === selectedABC);
    }

    // Plant Filter
    if (selectedPlant !== "all") {
      result = result.filter((item) => item.plant.toString() === selectedPlant);
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
  }, [
    items,
    searchQuery,
    selectedBranch,
    selectedABC,
    selectedPlant,
    sortConfig,
  ]);

  const totalPages = Math.ceil(
    filteredAndSortedItems.length / Number(pageSize),
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * Number(pageSize);
    const end = start + Number(pageSize);

    return filteredAndSortedItems.slice(start, end);
  }, [filteredAndSortedItems, currentPage, pageSize]);

  /* RESET PAGE WHEN FILTERS CHANGE */
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, selectedABC, selectedPlant, pageSize]);

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

  const highPriorityItems = useMemo(() => {
    return filteredAndSortedItems.filter(
      (item) => item.abc === "A" || item.abc === "B",
    );
  }, [filteredAndSortedItems]);

  const highPriorityCount = highPriorityItems.length;

  const highPriorityValue = highPriorityItems.reduce((sum, item) => {
    const numeric = Number(item.value.replace(/[₹K,L,]/g, ""));
    return sum + numeric;
  }, 0);

  const summary = useMemo(() => {
    const data = filteredAndSortedItems;

    const totalItems = data.length;

    const needOrders = data.filter((item) => item.sugQty > 0).length;

    const orderValue = data.reduce((sum, item) => {
      const numeric = Number(
        item.value.replace("₹", "").replace("K", "").replace(/,/g, ""),
      );

      return item.sugQty > 0 ? sum + numeric : sum;
    }, 0);

    const avgDaysOfCover =
      data.length > 0
        ? (
            data.reduce((sum, item) => {
              const daily = Math.max(item.avg6M, item.lySm) / 30;

              const cover = daily > 0 ? item.netAvl / daily : 0;

              return sum + cover;
            }, 0) / data.length
          ).toFixed(1)
        : "0";

    const overrides = data.filter((item) => item.status === "Override").length;

    const confirmedPOs = data.filter(
      (item) => item.status === "Confirmed",
    ).length;

    return {
      totalItems,
      needOrders,
      orderValue,
      avgDaysOfCover,
      overrides,
      confirmedPOs,
    };
  }, [filteredAndSortedItems]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

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
              // value: "15,458",
              value: summary.totalItems.toLocaleString(),
              // sub: "125 items need orders",
              sub: `${summary.needOrders} items need orders`,
              color: "",
            },
            {
              label: "Order Value",
              // value: "₹2.4L",
              value: `₹${summary.orderValue.toFixed(1)}K`,
              // sub: "for 125 items",
              sub: `for ${summary.needOrders} items`,
              color: "text-emerald-600",
            },
            {
              label: "High Priority (A+B)",
              value: highPriorityCount.toString(),
              sub: "Critical items",
              color: "text-red-600",
            },
            {
              label: "Avg Days of Cover",
              // value: "7.2",
              value: summary.avgDaysOfCover,
              sub: "Target: 5-10",
              color: "",
            },
            {
              label: "Overrides",
              // value: "0",
              value: summary.overrides.toString(),
              sub: "",
              color: "text-blue-600",
            },
            {
              label: "Confirmed POS",
              // value: "0",
              value: summary.confirmedPOs.toString(),
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

            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="Plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants</SelectItem>
                <SelectItem value="5502">5502</SelectItem>
                <SelectItem value="5505">5505</SelectItem>
                <SelectItem value="5513">5513</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>

                {[...new Set(items.map((item) => item.branch))]
                  .sort()
                  .map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
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
                <SelectItem value="C">C</SelectItem>
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
                    { key: "plant", label: "Plant" },
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
                {/* {filteredAndSortedItems.length === 0 ? ( */}
                {paginatedItems.length === 0 ? (
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
                  // filteredAndSortedItems.map((item) => (
                  paginatedItems.map((item) => (
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
                      <TableCell>{item.plant}</TableCell>
                      <TableCell>{item.branch}</TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "inline-flex w-6 h-6 items-center justify-center rounded-full text-white text-xs font-bold",
                            item.abc === "A" && "bg-red-600",
                            item.abc === "B" && "bg-orange-500",
                            item.abc === "C" && "bg-blue-600",
                          )}
                        >
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
          <div className="border-t bg-muted/40 px-6 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm">
            <div>
              Showing {(currentPage - 1) * Number(pageSize) + 1}
              {" - "}
              {Math.min(
                currentPage * Number(pageSize),
                filteredAndSortedItems.length,
              )}{" "}
              of {filteredAndSortedItems.length}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* PAGE SIZE */}
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="w-[110px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>

              {/* PREVIOUS PAGE */}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft />
              </Button>

              <span className="px-2 font-medium">
                {currentPage} / {totalPages || 1}
              </span>

              {/* NEXT PAGE */}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight />
              </Button>

              {selectedRows.length > 0 && (
                <div className="font-medium text-foreground">
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
