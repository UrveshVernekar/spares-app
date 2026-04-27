"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  AlertTriangle,
  Package,
  Calendar,
  Activity,
  ArrowRight,
  Loader2,
  RefreshCcw,
  History,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface HistoricalData {
  date: string;
  qty: number;
}

interface ForecastData {
  date: string;
  predicted: number;
}

interface ApiResponse {
  material: string;
  status: string;
  historical: HistoricalData[];
  forecast: ForecastData[];
  avg_rmse: number;
  total_historical_weeks: number;
}

interface MetaResponse {
  success: boolean;
  materials: {id: string, label: string}[];
  plants: string[];
}

export default function ForecastPage() {
  // --- State ---
  const [material, setMaterial] = useState("");
  const [plant, setPlant] = useState("");
  const [forecastWeeks, setForecastWeeks] = useState(4);
  
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  
  const [materialsList, setMaterialsList] = useState<{id: string, label: string}[]>([]);
  const [plantsList, setPlantsList] = useState<string[]>([]);
  const [searchMaterial, setSearchMaterial] = useState("");

  // --- Fetch Meta ---
  const fetchMeta = async (search: string = "") => {
    try {
      const res = await axios.get<MetaResponse>(
        "http://localhost:8000/api/spares/meta",
        { params: { search } }
      );
      if (res.data.success) {
        setMaterialsList(res.data.materials);
        setPlantsList(res.data.plants);
        
        // Initial defaults (only on first load)
        if (metaLoading) {
          if (res.data.materials.length > 0) {
            setMaterial(res.data.materials[0].id);
          }
          if (res.data.plants.length > 0) {
            setPlant(res.data.plants[0]);
          }
        }
      }
    } catch (err) {
      console.error("Meta fetch error:", err);
    } finally {
      setMetaLoading(false);
    }
  };

  // --- Fetch Function ---
  const fetchForecast = async () => {
    if (!material || !plant) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>(
        `http://localhost:8000/predictions/forecast/${material}`,
        {
          params: {
            plant,
            forecast_weeks: forecastWeeks,
          },
        }
      );
      setData(response.data);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.detail || "Failed to fetch forecast data. Please check if the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch - Only meta, no auto-forecast
  useEffect(() => {
    fetchMeta();
  }, []);

  // Debounced search for materials
  useEffect(() => {
    if (metaLoading) return;
    const timer = setTimeout(() => {
      fetchMeta(searchMaterial);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchMaterial]);

  // --- Data Processing for Chart ---
  const chartData = useMemo(() => {
    if (!data || data.status === "skipped") return [];

    const historical = (data.historical || []).map((item) => ({
      date: item.date,
      actual: item.qty,
      type: "historical",
    }));

    const forecast = (data.forecast || []).map((item) => ({
      date: item.date,
      predicted: item.predicted,
      type: "forecast",
    }));

    return [...historical, ...forecast];
  }, [data]);

  // --- Render Helpers ---
  const renderKPIs = () => {
    if (!data || data.status === "skipped") return null;

    const nextWeekForecast = data.forecast?.[0]?.predicted?.toFixed(2) || "0.00";
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Next Week Forecast</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{nextWeekForecast}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              Expected on {data.forecast[0]?.date}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Model Accuracy (RMSE)</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{data.avg_rmse?.toFixed(2) || "N/A"}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Lower is better
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Historical Depth</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{data.total_historical_weeks}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Total weeks of data analyzed
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Forecast Horizon</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{data.forecast?.length || 0} <span className="text-sm font-normal text-muted-foreground">Weeks</span></p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Predicting future requirements
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 dark:bg-[#0a0a0a] min-h-screen animate-in fade-in duration-700">
      <div className="max-w-[1680px] mx-auto space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 slide-in-from-top-4 duration-500 fill-mode-both">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Demand Forecasting
            </h1>
            <p className="text-muted-foreground">
              ARIMA-based predictive modeling for spare parts inventory.
            </p>
          </div>

          <Card className="w-full xl:w-auto border-none shadow-sm bg-white dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/5">
            <CardContent className="p-4 flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Material Selection</label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger className="w-full md:w-80 bg-gray-50 dark:bg-zinc-800 border-none ring-1 ring-inset ring-gray-200 dark:ring-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all">
                    <SelectValue placeholder="Select Material" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 w-[var(--radix-select-trigger-width)] min-w-[320px] md:min-w-[450px]" align="start">
                    <div className="p-2 sticky top-0 bg-popover z-10 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Type to search..." 
                          className="pl-8 h-8 text-xs focus:ring-1 focus:ring-blue-500" 
                          value={searchMaterial}
                          onChange={(e) => setSearchMaterial(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()} // Prevent select closing
                        />
                      </div>
                    </div>
                    {materialsList.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="text-xs py-2 cursor-pointer">
                        <div className="truncate max-w-[300px] md:max-w-[400px]" title={m.label}>
                          {m.label}
                        </div>
                      </SelectItem>
                    ))}
                    {materialsList.length === 0 && (
                      <div className="p-4 text-center text-xs text-muted-foreground">No results found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plant</label>
                <Select value={plant} onValueChange={setPlant}>
                  <SelectTrigger className="w-full md:w-32 bg-gray-50 dark:bg-zinc-800 border-none ring-1 ring-inset ring-gray-200 dark:ring-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all">
                    <SelectValue placeholder="Plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {plantsList.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weeks</label>
                <Input 
                  type="number"
                  value={forecastWeeks} 
                  onChange={(e) => setForecastWeeks(parseInt(e.target.value))}
                  className="w-full md:w-20 bg-gray-50 dark:bg-zinc-800 border-none ring-1 ring-inset ring-gray-200 dark:ring-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all h-[40px]"
                  placeholder="4"
                />
              </div>
              <Button 
                onClick={fetchForecast} 
                disabled={loading || !material || !plant}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all h-[40px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
                Run Model
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-4 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* KPIs - Hidden until data exists */}
        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            {renderKPIs()}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          
          {/* Chart Section */}
          <Card className="lg:col-span-2 border-none shadow-md bg-white dark:bg-zinc-900 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Forecast Visualization</CardTitle>
                  <CardDescription>Historical demand vs. Projected requirements</CardDescription>
                </div>
                {data && (
                   <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none font-mono px-3 py-1">
                    {data.material}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[450px] w-full">
                {loading ? (
                  <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full" />
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                    </div>
                    <p className="text-muted-foreground font-medium animate-pulse">Analyzing demand patterns...</p>
                  </div>
                ) : data?.status === "skipped" ? (
                  <div className="h-full w-full flex flex-col items-center justify-center space-y-4 text-center px-12 animate-in fade-in zoom-in duration-500">
                     <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 mb-2">
                        <AlertTriangle className="w-8 h-8" />
                     </div>
                     <h3 className="text-lg font-semibold">Insufficient Data for Forecasting</h3>
                     <p className="text-muted-foreground text-sm max-w-md">
                        The ARIMA model skipped this material because it doesn't have enough historical sales volume to generate a reliable forecast.
                     </p>
                  </div>
                ) : data ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        minTickGap={30}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-white/20 dark:border-zinc-800 p-4 rounded-xl shadow-2xl transition-all">
                                <p className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">{item.date}</p>
                                {item.actual !== undefined && (
                                  <div className="flex items-center justify-between gap-8 mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                      <p className="text-sm font-medium">Historical</p>
                                    </div>
                                    <p className="text-sm font-bold">{item.actual}</p>
                                  </div>
                                )}
                                {item.predicted !== undefined && (
                                  <div className="flex items-center justify-between gap-8">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                      <p className="text-sm font-medium">Forecasted</p>
                                    </div>
                                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{item.predicted.toFixed(2)}</p>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-sm font-medium text-muted-foreground ml-1">{value}</span>}
                      />
                      <Line 
                        name="Historical Demand"
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                        animationDuration={1500}
                      />
                      <Line 
                        name="Predicted Forecast"
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        strokeDasharray="6 6"
                        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                        activeDot={{ r: 8, strokeWidth: 0, fill: "#6366f1" }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                       <Package className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="font-medium text-center">Select a material and plant, then click <br/> <span className="text-blue-600 font-bold">Run Model</span> to generate forecast</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Forecast Table Section */}
          <Card className="border-none shadow-md bg-white dark:bg-zinc-900 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
              <CardTitle className="text-xl font-semibold">Forecast Schedule</CardTitle>
              <CardDescription>Weekly demand projections</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {data && data.status !== "skipped" ? (
                <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
                      <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="pl-6 h-12">Week Ending</TableHead>
                        <TableHead className="text-right pr-6 h-12">Predicted Qty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.forecast.map((item, idx) => (
                        <TableRow key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors border-b last:border-0">
                          <TableCell className="pl-6 py-4 font-medium flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {idx + 1}
                            </div>
                            {item.date}
                          </TableCell>
                          <TableCell className="text-right pr-6 py-4">
                            <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/50 px-3 py-1 text-sm font-bold shadow-sm">
                              {item.predicted.toFixed(2)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <Activity className="w-12 h-12 mb-4 opacity-10" />
                  <p>No projections available</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
