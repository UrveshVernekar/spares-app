"use client";

import { useState, useMemo } from "react";
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
  ArrowUpDown,
  MapPin,
  Download,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const tabs = ["Pool Candidates", "Pool Management"];

  /* -------------------------------------------------------------------------- */
  /*                            DATA: POOL CANDIDATES                           */
  /* -------------------------------------------------------------------------- */
  const candidatesItems: PoolCandidate[] = [
    {
      id: 1,
      material: "LM221DTSP6170",
      description: "",
      branch: "Parbhani",
      stock: 550,
      daysSinceSale: 91,
      aging: "90+",
      poolQty: 275,
      nearestBranch: "Pune",
      distance: "(3u, --)",
      value: "₹0.0K",
    },
    {
      id: 2,
      material: "CD221DTBFP010",
      description: "",
      branch: "Mumbai",
      stock: 499,
      daysSinceSale: 91,
      aging: "90+",
      poolQty: 250,
      nearestBranch: "Thane",
      distance: "(8u, 25km)",
      value: "₹0.0K",
    },
    {
      id: 3,
      material: "UF921OTKIT120",
      description: "",
      branch: "Mumbai",
      stock: 376,
      daysSinceSale: 91,
      aging: "90+",
      poolQty: 188,
      nearestBranch: "Thane",
      distance: "(38u, 25km)",
      value: "₹0.0K",
    },
    {
      id: 4,
      material: "UF321MXDBA070",
      description: "",
      branch: "Pune",
      stock: 353,
      daysSinceSale: 91,
      aging: "90+",
      poolQty: 177,
      nearestBranch: "Satara",
      distance: "(1u, 115km)",
      value: "₹0.0K",
    },
    {
      id: 5,
      material: "UF321MXDBA020",
      description: "",
      branch: "Mumbai",
      stock: 352,
      daysSinceSale: 791,
      aging: "90+",
      poolQty: 176,
      nearestBranch: "Pune",
      distance: "(1u, 150km)",
      value: "₹0.0K",
    },
    {
      id: 6,
      material: "UF921OTKIT090",
      description: "",
      branch: "Mumbai",
      stock: 340,
      daysSinceSale: 1097,
      aging: "90+",
      poolQty: 170,
      nearestBranch: "Thane",
      distance: "(19u, 25km)",
      value: "₹0.0K",
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                            DATA: POOL MANAGEMENT                           */
  /* -------------------------------------------------------------------------- */
  const managementItems: PoolManagementItem[] = [
    {
      id: 1,
      material: "LM2210TSP6170",
      description: "",
      branch: "Parbhani",
      qty: 275,
      agingDays: "91d",
      aging: "90+",
      added: "Auto",
      status: "Available",
    },
    // ... (your other items)
    {
      id: 2,
      material: "CD2210TBFP010",
      description: "",
      branch: "Mumbai",
      qty: 250,
      agingDays: "91d",
      aging: "90+",
      added: "Auto",
      status: "Available",
    },
    {
      id: 3,
      material: "UF9210TKIT120",
      description: "",
      branch: "Mumbai",
      qty: 188,
      agingDays: "91d",
      aging: "90+",
      added: "Auto",
      status: "Available",
    },
    {
      id: 4,
      material: "UF321MXDBA070",
      description: "",
      branch: "Pune",
      qty: 177,
      agingDays: "91d",
      aging: "90+",
      added: "Auto",
      status: "Available",
    },
    {
      id: 5,
      material: "UF321MXDBA020",
      description: "",
      branch: "Mumbai",
      qty: 176,
      agingDays: "791d",
      aging: "90+",
      added: "Auto",
      status: "Available",
    },
    {
      id: 6,
      material: "UF9210TKIT090",
      description: "",
      branch: "Mumbai",
      qty: 170,
      agingDays: "1097d",
      aging: "90+",
      added: "Auto",
      status: "Available",
    },
    {
      id: 7,
      material: "UF321MXDBA070",
      description: "",
      branch: "Mumbai",
      qty: 155,
      agingDays: "122d",
      aging: "90+",
      added: "Auto",
      status: "Available",
    },
  ];

  // Filtering + Sorting Logic
  const filteredCandidates = useMemo(() => {
    let result = [...candidatesItems];

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter((item) =>
        [item.material, item.branch, item.nearestBranch].some((field) =>
          field.toLowerCase().includes(q),
        ),
      );
    }

    if (selectedBranch !== "all") {
      result = result.filter((item) => item.branch === selectedBranch);
    }

    if (sortConfig) {
      // Add sorting logic here if needed
    }

    return result;
  }, [candidatesItems, searchQuery, selectedBranch, sortConfig]);

  const filteredManagement = useMemo(() => {
    let result = [...managementItems];

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter((item) =>
        [item.material, item.branch].some((field) =>
          field.toLowerCase().includes(q),
        ),
      );
    }

    return result;
  }, [managementItems, searchQuery]);

  const handleSort = (key: string) => {
    // Implement full sorting if needed
    console.log("Sorting by:", key);
  };

  const toggleRowSelection = (id: number, isCandidate: boolean) => {
    const currentList = isCandidate ? filteredCandidates : filteredManagement;
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = (isCandidate: boolean) => {
    const currentList = isCandidate ? filteredCandidates : filteredManagement;
    const allIds = currentList.map((i) => i.id);

    setSelectedRows((prev) =>
      prev.length === allIds.length && prev.every((id) => allIds.includes(id))
        ? []
        : allIds,
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/70 dark:bg-zinc-950 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-[1680px] mx-auto space-y-6">
        {/* Header */}
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

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Pool Items", value: "35,095", color: "" },
            { label: "Pool Value", value: "₹0.0K", color: "" },
            {
              label: "Available Qty",
              value: "47,807",
              color: "text-emerald-600",
            },
            { label: "Pool Utilization", value: "0%", color: "text-blue-600" },
            { label: "Pool Candidates", value: "35,095", color: "" },
            { label: "Transfers Logged", value: "1", color: "" },
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

        {/* Tabs Navigation - Modern & Clean */}
        <div className="flex items-center border-b border-border">
          <div className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as "Pool Candidates" | "Pool Management");
                  setSelectedRows([]); // Clear selection on tab change
                }}
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
        </div>

        {/* POOL MANAGEMENT TAB */}
        {activeTab === "Pool Management" && (
          <div className="space-y-6">
            {/* Secondary KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "POOL ITEMS", value: "35,095" },
                { label: "TOTAL QTY", value: "47,821" },
                { label: "POOL VALUE", value: "₹0.0K" },
                {
                  label: "AVAILABLE",
                  value: "35,081",
                  highlight: "text-emerald-600",
                },
                {
                  label: "AUTO-PUSHED",
                  value: "35,095",
                  sub: "Aging >60d",
                  highlight: "text-blue-600 border-l-4 border-l-blue-600",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className={cn(
                    "shadow-sm border-border",
                    item.highlight?.includes("border") && "border-l-4",
                  )}
                >
                  <CardContent className="p-5">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                      {item.label}
                    </div>
                    <div
                      className={cn(
                        "text-3xl font-semibold tracking-tight",
                        item.highlight,
                      )}
                    >
                      {item.value}
                    </div>
                    {item.sub && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.sub}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Table */}
            <Card className="shadow-sm overflow-hidden border-border">
              <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30">
                <h2 className="text-lg font-semibold tracking-tight">
                  Central Pool — Current Stock
                </h2>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search material or branch..."
                    className="pl-10 h-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                          onCheckedChange={() => toggleAll(false)}
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
                      ].map((header, idx) => (
                        <TableHead
                          key={idx}
                          className={cn(
                            "font-medium text-muted-foreground text-xs py-4",
                            [
                              "Pool Qty",
                              "Aging Days",
                              "Aging",
                              "Added",
                              "Status",
                            ].includes(header) && "text-center",
                          )}
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredManagement.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/50 transition-colors group"
                      >
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedRows.includes(item.id)}
                            onCheckedChange={() =>
                              toggleRowSelection(item.id, false)
                            }
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
                          <Badge variant="destructive" className="font-medium">
                            {item.aging}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          >
                            {item.added}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="px-6 py-3 border-t bg-muted/40 text-sm text-muted-foreground flex justify-between items-center">
                <div>{filteredManagement.length} items in pool</div>
                {selectedRows.length > 0 && (
                  <div className="font-medium text-foreground">
                    {selectedRows.length} selected
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* POOL CANDIDATES TAB */}
        {activeTab === "Pool Candidates" && (
          <Card className="shadow-sm overflow-hidden border-border">
            <div className="p-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Pool Candidates (Aging &gt; 60 days)
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search material..."
                    className="pl-10 h-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-full sm:w-[160px] h-10">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Parbhani">Parbhani</SelectItem>
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
                        onCheckedChange={() => toggleAll(true)}
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
                          "font-medium text-muted-foreground py-4 whitespace-nowrap",
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
                  {filteredCandidates.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="h-80 text-center text-muted-foreground"
                      >
                        No candidates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCandidates.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/50 group transition-colors"
                      >
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedRows.includes(item.id)}
                            onCheckedChange={() =>
                              toggleRowSelection(item.id, true)
                            }
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
          </Card>
        )}
      </div>
    </div>
  );
}
