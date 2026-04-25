"use client";

import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Download,
  Plus,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

type PoolCandidate = {
  id: number;
  material: string;
  description: string;
  branch: string;
  stock: number;
  daysSinceSale: number;
  aging: string;
  poolQty: number;
  nearestBranch: string;
  distance: string;
  value: string;
};

type PoolManagementItem = {
  id: number;
  material: string;
  description: string;
  branch: string;
  qty: number;
  agingDays: string;
  aging: string;
  added: string;
  status: string;
};

export default function PoolDashboard() {
  const [activeTab, setActiveTab] = useState<
    "Pool Candidates" | "Pool Management"
  >("Pool Management");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Pagination States
  const [pageSize, setPageSize] = useState("10");
  const [currentPageCandidates, setCurrentPageCandidates] = useState(1);
  const [currentPageManagement, setCurrentPageManagement] = useState(1);

  const [poolApiData, setPoolApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/spares/pool-data",
        );
        if (res.data.success) {
          setPoolApiData(res.data.data);
        }
      } catch (err: any) {
        setError("Failed to load pool data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const candidatesItems: PoolCandidate[] = poolApiData?.candidates || [];
  const managementItems: PoolManagementItem[] =
    poolApiData?.management ||
    candidatesItems
      .filter((c) => c.daysSinceSale >= 60)
      .map((c) => ({
        id: c.id,
        material: c.material,
        description: c.description,
        branch: c.branch,
        qty: c.poolQty,
        agingDays: `${c.daysSinceSale}d`,
        aging: c.aging,
        added: "Auto",
        status: "Available",
      }));

  // Filtering
  const filteredCandidates = useMemo(() => {
    let result = [...candidatesItems];
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      result = result.filter((item) =>
        [item.material, item.description, item.branch, item.nearestBranch].some(
          (field) => field?.toLowerCase().includes(q),
        ),
      );
    }

    if (selectedBranch !== "all") {
      result = result.filter(
        (item) => item.branch.toUpperCase() === selectedBranch.toUpperCase(),
      );
    }
    return result;
  }, [candidatesItems, searchQuery, selectedBranch]);

  const filteredManagement = useMemo(() => {
    let result = [...managementItems];
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      result = result.filter((item) =>
        [item.material, item.description, item.branch].some((field) =>
          field?.toLowerCase().includes(q),
        ),
      );
    }
    return result;
  }, [managementItems, searchQuery]);

  // Pagination Logic
  const currentPage =
    activeTab === "Pool Candidates"
      ? currentPageCandidates
      : currentPageManagement;
  const setCurrentPage =
    activeTab === "Pool Candidates"
      ? setCurrentPageCandidates
      : setCurrentPageManagement;

  const filteredItems: (PoolCandidate | PoolManagementItem)[] =
    activeTab === "Pool Candidates" ? filteredCandidates : filteredManagement;

  const totalPages = Math.ceil(filteredItems.length / Number(pageSize));

  const paginatedCandidates = useMemo(() => {
    const start = (currentPageCandidates - 1) * Number(pageSize);
    return filteredCandidates.slice(start, start + Number(pageSize));
  }, [filteredCandidates, currentPageCandidates, pageSize]);

  const paginatedManagement = useMemo(() => {
    const start = (currentPageManagement - 1) * Number(pageSize);
    return filteredManagement.slice(start, start + Number(pageSize));
  }, [filteredManagement, currentPageManagement, pageSize]);

  // Reset page when filters or tab changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [searchQuery, selectedBranch, activeTab, pageSize]);

  const totalPoolValue = useMemo(() => {
    const total = candidatesItems.reduce((sum, item) => {
      const clean = item.value.replace(/[₹,]/g, "");
      let val = parseFloat(clean);
      if (clean.toUpperCase().includes("K")) val *= 1000;
      if (clean.toUpperCase().includes("M")) val *= 1000000;
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    if (total >= 1000000) return `₹${(total / 1000000).toFixed(1)}M`;
    if (total >= 1000) return `₹${(total / 1000).toFixed(1)}K`;
    return `₹${total.toLocaleString()}`;
  }, [candidatesItems]);

  const poolUtilization = useMemo(() => {
    if (candidatesItems.length === 0) return "0%";
    const percentage = (managementItems.length / candidatesItems.length) * 100;
    return `${percentage.toFixed(1)}%`;
  }, [candidatesItems, managementItems]);

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredItems.map((i) => i.id));
    }
  };

  // ==================== PRODUCTION LOADING UI ====================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50/70 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 font-sans">
        <div className="max-w-[1680px] mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-96" />
              <Skeleton className="h-4 w-[420px] mt-2" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-8 border-b border-border pb-1">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Table Skeleton */}
          <Card className="shadow-sm border-border overflow-hidden">
            <div className="p-5 border-b flex justify-between">
              <Skeleton className="h-7 w-80" />
              <Skeleton className="h-10 w-80" />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/60">
                  <TableRow>
                    {Array.from({
                      length: activeTab === "Pool Management" ? 9 : 10,
                    }).map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-5 w-24" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, row) => (
                    <TableRow key={row}>
                      {Array.from({
                        length: activeTab === "Pool Management" ? 9 : 10,
                      }).map((_, col) => (
                        <TableCell key={col}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Skeleton */}
            <div className="border-t bg-muted/40 px-6 py-4 flex justify-between items-center">
              <Skeleton className="h-5 w-64" />
              <div className="flex gap-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
              </div>
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
            Failed to Load Pool Data
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
        {/* Header & KPI Cards (unchanged) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Central Pool Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Optimize slow-moving inventory across branches
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add to Pool
            </Button>
          </div>
        </div>

        {/* KPI Cards - Dynamic */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Pool Items",
              value: candidatesItems.length.toLocaleString(),
            },
            { label: "Pool Value", value: totalPoolValue },
            {
              label: "Available Qty",
              value: candidatesItems
                .reduce((sum, i) => sum + i.poolQty, 0)
                .toLocaleString(),
              color: "text-emerald-600",
            },
            {
              label: "Pool Utilization",
              value: poolUtilization,
              color: "text-blue-600",
            },
            {
              label: "Pool Candidates",
              value: candidatesItems.length.toLocaleString(),
            },
            { label: "Transfers Logged", value: "1" },
          ].map((card, i) => (
            <Card
              key={i}
              className="shadow-sm border-border hover:shadow transition-all"
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

        {/* Tabs */}
        <div className="flex items-center border-b border-border">
          {["Pool Candidates", "Pool Management"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as "Pool Candidates" | "Pool Management")
              }
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-all",
                activeTab === tab
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* === TABLES WITH PAGINATION === */}

        {/* Pool Management Tab */}
        {activeTab === "Pool Management" && (
          <Card className="shadow-sm overflow-hidden border-border">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold tracking-tight">
                Central Pool — Current Stock
              </h2>
              <div className="relative w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search material or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/60 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-12 pl-6">
                      <Checkbox
                        checked={
                          selectedRows.length === filteredManagement.length &&
                          filteredManagement.length > 0
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    {[
                      "Material",
                      "Description",
                      "Source Branch",
                      "Pool Qty",
                      "Aging Days",
                      "Aging",
                      "Added",
                      "Status",
                    ].map((h, i) => (
                      <TableHead
                        key={i}
                        className={cn(
                          "text-xs py-4",
                          [
                            "Pool Qty",
                            "Aging Days",
                            "Aging",
                            "Added",
                            "Status",
                          ].includes(h) && "text-center",
                        )}
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedManagement.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-72 text-center text-muted-foreground"
                      >
                        No items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedManagement.map((item: PoolManagementItem) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="pl-6">
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
                        <TableCell className="font-medium">
                          {item.branch}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.agingDays}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">{item.aging}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">Auto</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-emerald-100 text-emerald-700"
                          >
                            Available
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t bg-muted/40 px-6 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm">
              <div>
                Showing {(currentPage - 1) * Number(pageSize) + 1}–
                {Math.min(
                  currentPage * Number(pageSize),
                  filteredManagement.length,
                )}{" "}
                of {filteredManagement.length} items
              </div>

              <div className="flex items-center gap-3">
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-[110px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="px-3 font-medium">
                  {currentPage} / {totalPages || 1}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Pool Candidates Tab */}
        {activeTab === "Pool Candidates" && (
          <Card className="shadow-sm overflow-hidden border-border">
            <div className="p-5 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Pool Candidates (Aging &gt; 60 days)
              </h2>
              <div className="flex gap-3">
                <div className="relative w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search material..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="PUNE">Pune</SelectItem>
                    <SelectItem value="MUMBAI">Mumbai</SelectItem>
                    <SelectItem value="PARBHANI">Parbhani</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/60 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-12 pl-6">
                      <Checkbox
                        checked={
                          selectedRows.length === filteredCandidates.length &&
                          filteredCandidates.length > 0
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    {[
                      "Material",
                      "Description",
                      "Branch",
                      "Stock",
                      "Days Since Sale",
                      "Aging",
                      "Pool Qty",
                      "Nearest Branch",
                      "Value",
                    ].map((col, i) => (
                      <TableHead
                        key={i}
                        className={cn(
                          "py-4 whitespace-nowrap",
                          [
                            "Stock",
                            "Days Since Sale",
                            "Aging",
                            "Pool Qty",
                          ].includes(col) && "text-center",
                          col === "Value" && "text-right pr-6",
                        )}
                      >
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="h-72 text-center text-muted-foreground"
                      >
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCandidates.map((item: PoolCandidate) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/50 group transition-colors"
                      >
                        <TableCell className="pl-6">
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
                        <TableCell className="font-medium">
                          {item.branch}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.stock}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.daysSinceSale}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">{item.aging}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-blue-600">
                          {item.poolQty}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {item.nearestBranch}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.distance}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium pr-6">
                          {item.value}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Footer - Same as Management */}
            <div className="border-t bg-muted/40 px-6 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm">
              <div>
                Showing {(currentPage - 1) * Number(pageSize) + 1}–
                {Math.min(
                  currentPage * Number(pageSize),
                  filteredCandidates.length,
                )}{" "}
                of {filteredCandidates.length} candidates
              </div>

              <div className="flex items-center gap-3">
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-[110px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 font-medium">
                  {currentPage} / {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
