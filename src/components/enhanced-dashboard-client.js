// Enhanced Dashboard Client with all missing features
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Sector } from 'recharts';
import { Sun, Moon, DollarSign, Users, MousePointerClick, LineChart as LineChartIcon, TrendingUp, TrendingDown, Download, Sparkles, X, Loader, Filter, Calendar, FileDown, ChevronLeft, ChevronRight, Brain } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useTheme } from '@/components/theme-provider';
import { AIAnalyticsWidget } from '@/components/ai-analytics-widget';
import { cn } from '@/lib/utils';

// Clean, readable color palette for light and dark modes
const rootStyles = `
:root {
  /* Main Color System (HSL-based) */
  --background: 240 10% 98%;
  --foreground: 240 10% 8%;
  
  /* Primary Palette */
  --primary: 258 90% 66%;
  --primary-light: 258 90% 75%;
  --primary-dark: 258 90% 55%;
  --secondary: 220 30% 95%;
  --accent: 212 100% 70%;
  
  /* Semantic Colors */
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;
  
  /* Cards & Components */
  --card: 0 0% 100%;
  --card-hover: 240 10% 96%;
  --border: 220 15% 90%;
  --muted: 240 5% 45%;
  --muted-light: 240 5% 65%;
  --muted-foreground: 240 5% 45%;
  
  /* Glass Effects */
  --glass-bg: hsla(0, 0%, 100%, 0.25);
  --glass-border: hsla(0, 0%, 100%, 0.18);
}

.dark {
  /* Main Color System (Dark mode) */
  --background: 240 10% 4%;
  --foreground: 240 10% 95%;
  
  /* Cards & Components (Dark) */
  --card: 240 15% 8%;
  --card-hover: 240 15% 12%;
  --border: 240 15% 20%;
  --muted: 240 5% 55%;
  --muted-light: 240 5% 65%;
  --muted-foreground: 240 5% 65%;
  
  /* Glass Effects (Dark) */
  --glass-bg: hsla(240, 15%, 8%, 0.25);
  --glass-border: hsla(240, 15%, 20%, 0.18);
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  transition: all 0.3s ease;
}

input::placeholder {
  color: hsl(var(--muted));
}

input:focus {
  ring-color: hsl(var(--primary));
}

/* Glass Morphism Classes */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.glass-card-hover {
  background: hsla(var(--card), 0.7);
  backdrop-filter: blur(12px);
}

/* Chart Colors */
.chart-direct { color: hsl(220 70% 50%); }
.chart-organic { color: hsl(142 76% 36%); }
.chart-social { color: hsl(271 81% 56%); }
.chart-email { color: hsl(25 95% 53%); }
.chart-referral { color: hsl(0 84% 60%); }

/* Chart Text Visibility */
.recharts-text {
  fill: hsl(var(--foreground)) !important;
  font-size: 12px !important;
}

.recharts-cartesian-axis-tick-value {
  fill: hsl(var(--muted)) !important;
  font-size: 11px !important;
}

.recharts-legend-item-text {
  color: hsl(var(--foreground)) !important;
}

.recharts-tooltip-wrapper {
  background: hsl(var(--card)) !important;
  border: 1px solid hsl(var(--border)) !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 32px hsla(var(--foreground), 0.1) !important;
}

/* Shadow Effects */
.shadow-primary-soft { box-shadow: 0 4px 20px hsla(258, 90%, 66%, 0.1); }
.shadow-primary-medium { box-shadow: 0 8px 32px hsla(258, 90%, 66%, 0.15); }
.shadow-primary-strong { box-shadow: 0 12px 48px hsla(258, 90%, 66%, 0.2); }

// Add animations
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulseGlow {
  0%, 100% { 
    box-shadow: 0 0 20px hsla(258, 90%, 66%, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px hsla(258, 90%, 66%, 0.6), 0 0 40px hsla(258, 90%, 66%, 0.3);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-fadeIn { animation: fadeIn 0.5s ease-out; }
.animate-slideIn { animation: slideIn 0.4s ease-out; }
.animate-scaleIn { animation: scaleIn 0.3s ease-out; }
.animate-pulseGlow { animation: pulseGlow 2s infinite; }
.animate-float { animation: float 3s infinite; }
`;

// Inject styles dynamically
if (typeof document !== 'undefined') {
  const rootStyleSheet = document.createElement("style");
  rootStyleSheet.id = "theme-styles";
  rootStyleSheet.innerText = rootStyles;
  const existingStyleSheet = document.getElementById("theme-styles");
  if (existingStyleSheet) {
    existingStyleSheet.replaceWith(rootStyleSheet);
  } else {
    document.head.appendChild(rootStyleSheet);
  }
}

// Mock Data
const monthlyRevenueData = [
    { name: 'Jan', revenue: 12000 }, { name: 'Feb', revenue: 19000 }, { name: 'Mar', revenue: 15000 }, { name: 'Apr', revenue: 25000 }, { name: 'May', revenue: 22000 }, { name: 'Jun', revenue: 30000 }, { name: 'Jul', revenue: 28000 }, { name: 'Aug', revenue: 35000 }, { name: 'Sep', revenue: 32000 }, { name: 'Oct', revenue: 41000 }, { name: 'Nov', revenue: 38000 }, { name: 'Dec', revenue: 45000 },
];
const campaignPerformanceData = [
    { name: 'Campaign A', impressions: 120000, ctr: 2.5 }, { name: 'Campaign B', impressions: 190000, ctr: 3.1 }, { name: 'Campaign C', impressions: 150000, ctr: 2.8 }, { name: 'Campaign D', impressions: 250000, ctr: 3.5 }, { name: 'Campaign E', impressions: 220000, ctr: 3.2 },
];
const conversionSourceData = [
    { name: 'Direct', value: 400 }, 
    { name: 'Organic Search', value: 300 }, 
    { name: 'Social Media', value: 300 }, 
    { name: 'Email', value: 200 },
    { name: 'Referral', value: 150 }
];
const COLORS = [
    'hsl(220 70% 50%)',    // Direct - Deep Blue
    'hsl(142 76% 36%)',    // Organic Search - Emerald Green
    'hsl(271 81% 56%)',    // Social Media - Purple/Violet
    'hsl(25 95% 53%)',     // Email - Orange
    'hsl(0 84% 60%)'       // Referral - Red
];
const initialCampaigns = [
    { id: 1, name: 'Summer Sale Blast', spend: 5200, impressions: 250000, clicks: 7500, conversions: 450, status: 'Active' }, { id: 2, name: 'Q4 Product Launch', spend: 12500, impressions: 800000, clicks: 16000, conversions: 980, status: 'Active' }, { id: 3, name: 'Brand Awareness Push', spend: 8000, impressions: 1200000, clicks: 12000, conversions: 150, status: 'Paused' }, { id: 4, name: 'Lead Gen Form Campaign', spend: 3500, impressions: 150000, clicks: 9000, conversions: 1100, status: 'Completed' }, { id: 5, name: 'Holiday Special Offer', spend: 9800, impressions: 650000, clicks: 21000, conversions: 1500, status: 'Active' }, { id: 6, name: 'New Year Kickoff', spend: 6000, impressions: 300000, clicks: 8500, conversions: 550, status: 'Active' }, { id: 7, name: 'Spring Collection Promo', spend: 4500, impressions: 180000, clicks: 6200, conversions: 320, status: 'Paused' }, { id: 8, name: 'Ebook Download Campaign', spend: 2000, impressions: 90000, clicks: 5000, conversions: 800, status: 'Completed' },
];

// Loading Skeleton Components
const StatCardSkeleton = () => (
    <Card className="rounded-lg shadow-lg border animate-pulse glass-card" 
          style={{ backgroundColor: `hsl(var(--card) / 0.5)`, borderColor: `hsl(var(--border) / 0.3)` }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24 rounded" style={{ backgroundColor: `hsl(var(--muted-light))` }} />
            <Skeleton className="h-12 w-12 rounded-xl" style={{ backgroundColor: `hsl(var(--muted-light))` }} />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-20 mb-2 rounded" style={{ backgroundColor: `hsl(var(--muted-light))` }} />
            <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-16 rounded" style={{ backgroundColor: `hsl(var(--muted-light))` }} />
                <Skeleton className="h-3 w-20 rounded" style={{ backgroundColor: `hsl(var(--muted-light))` }} />
            </div>
        </CardContent>
    </Card>
);

const ChartSkeleton = () => (
    <Card className="rounded-lg shadow-lg border animate-pulse glass-card"
          style={{ backgroundColor: `hsl(var(--card) / 0.5)`, borderColor: `hsl(var(--border) / 0.3)` }}>
        <CardHeader>
            <Skeleton className="h-6 w-48 rounded" style={{ backgroundColor: `hsl(var(--muted-light))` }} />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-[350px] w-full rounded" style={{ backgroundColor: `hsl(var(--muted-light))` }} />
        </CardContent>
    </Card>
);

// Enhanced StatCard with real-time updates
const StatCard = ({ title, value, icon: Icon, trend, trendValue, description, isLoading = false, isRealTime = false }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [currentTrend, setCurrentTrend] = useState(trend);
    const [currentTrendValue, setCurrentTrendValue] = useState(trendValue);
    const TrendIcon = currentTrend === 'up' ? TrendingUp : TrendingDown;
    const trendColor = currentTrend === 'up' ? 'text-green-500' : 'text-red-500';

    useEffect(() => {
        if (isRealTime && !isLoading) {
            const interval = setInterval(() => {
                // More sophisticated simulation based on data type
                if (title === "Total Revenue") {
                    const baseValue = 342000;
                    const change = Math.floor(Math.random() * 20000) - 10000; // ±$10k change for more visible updates
                    const newValue = Math.max(300000, baseValue + change);
                    setDisplayValue(`$${newValue.toLocaleString()}`);
                    
                    // Update trend
                    const trendChange = Math.random() > 0.5; // 50% chance to change trend
                    if (trendChange) {
                        const newTrend = Math.random() > 0.5 ? 'up' : 'down';
                        setCurrentTrend(newTrend);
                        setCurrentTrendValue(`${Math.floor(Math.random() * 20 + 1)}%`);
                    }
                } else if (title === "Total Users") {
                    const baseValue = 28345;
                    const change = Math.floor(Math.random() * 500) - 250; // ±250 users for more visible updates
                    const newValue = Math.max(25000, baseValue + change);
                    setDisplayValue(newValue.toLocaleString());
                    
                    const trendChange = Math.random() > 0.6;
                    if (trendChange) {
                        const newTrend = Math.random() > 0.6 ? 'up' : 'down';
                        setCurrentTrend(newTrend);
                        setCurrentTrendValue(`${Math.floor(Math.random() * 15 + 1)}%`);
                    }
                } else if (title === "Conversion Rate") {
                    const baseValue = 3.45;
                    const change = (Math.random() - 0.5) * 1.0; // ±0.5% change for more visible updates
                    const newValue = Math.max(2.0, Math.min(5.0, baseValue + change));
                    setDisplayValue(`${newValue.toFixed(2)}%`);
                    
                    const trendChange = Math.random() > 0.6;
                    if (trendChange) {
                        const newTrend = Math.random() > 0.4 ? 'up' : 'down';
                        setCurrentTrend(newTrend);
                        setCurrentTrendValue(`${Math.floor(Math.random() * 10 + 1)}%`);
                    }
                } else if (title === "Avg. CTR") {
                    const baseValue = 2.84;
                    const change = (Math.random() - 0.5) * 0.6; // ±0.3% change for more visible updates
                    const newValue = Math.max(2.0, Math.min(4.0, baseValue + change));
                    setDisplayValue(`${newValue.toFixed(2)}%`);
                    
                    const trendChange = Math.random() > 0.5;
                    if (trendChange) {
                        const newTrend = Math.random() > 0.5 ? 'up' : 'down';
                        setCurrentTrend(newTrend);
                        setCurrentTrendValue(`${Math.floor(Math.random() * 12 + 1)}%`);
                    }
                }
            }, 1000); // Update every 1 second for more visible changes
            return () => clearInterval(interval);
        } else {
            // Reset to original values when real-time is disabled
            setDisplayValue(value);
            setCurrentTrend(trend);
            setCurrentTrendValue(trendValue);
        }
    }, [value, isRealTime, isLoading, title, trend, trendValue]);

    if (isLoading) return <StatCardSkeleton />;

    return (
        <Card className="rounded-lg glass-card hover:glass-card-hover hover:shadow-primary-medium hover:-translate-y-2 transition-all duration-300 group cursor-pointer border"
              style={{ 
                  backgroundColor: `hsl(var(--card) / 0.5)`, 
                  borderColor: `hsl(var(--border) / 0.3)`,
                  color: `hsl(var(--foreground))`
              }}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2"
                          style={{ color: `hsl(var(--muted))` }}>
                    {title}
                    {isRealTime && <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: `hsl(var(--success))` }} />}
                </CardTitle>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
                     style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}>
                    <Icon className="w-6 h-6" style={{ color: 'white' }} />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-2xl font-bold mb-1" style={{ color: `hsl(var(--foreground))` }}>
                    {displayValue}
                </div>
                <p className="text-sm flex items-center gap-1" style={{ color: `hsl(var(--muted))` }}>
                    <span className={`flex items-center gap-1 transition-colors duration-300`}
                          style={{ color: currentTrend === 'up' ? `hsl(var(--success))` : `hsl(var(--destructive))` }}>
                        <TrendIcon className="w-4 h-4" />
                        {currentTrendValue}
                    </span>
                    <span>{description}</span>
                </p>
            </CardContent>
        </Card>
    );
};

// Export functionality
const exportToPDF = (data, filename) => {
    // For a real PDF export, you would use jsPDF
    // This creates a simple text file with formatted data
    const content = `ADmyBRAND Analytics Report - ${filename}
Generated: ${new Date().toLocaleDateString()}

${JSON.stringify(data, null, 2)}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_report.txt`;
    link.click();
    URL.revokeObjectURL(url);
};

const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    // Handle different data structures
    let csvData = data;
    if (filename === 'revenue-data') {
        csvData = data.map(item => ({
            Month: item.name,
            Revenue: item.revenue
        }));
    }
    
    const headers = Object.keys(csvData[0]);
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            return typeof value === 'string' && value.includes(',') 
                ? `"${value.replace(/"/g, '""')}"` 
                : value;
        }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

const exportToJSON = (data, filename) => {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

const ActiveShapePieChart = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-2xl font-bold">{payload.name}</text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
        </g>
    );
};

// Enhanced DataTable with filtering
const DataTable = ({ onAnalyze, isLoading = false }) => {
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 5;

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(campaign => {
            const matchesStatus = filterStatus === 'all' || campaign.status.toLowerCase() === filterStatus.toLowerCase();
            const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [campaigns, filterStatus, searchTerm]);

    const sortedCampaigns = useMemo(() => {
        let sortableItems = [...filteredCampaigns];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [filteredCampaigns, sortConfig]);

    const paginatedCampaigns = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedCampaigns.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedCampaigns, currentPage]);

    const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
            case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-lg shadow-lg border hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
              }}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Recent Campaigns</CardTitle>
                        <CardDescription style={{ color: 'var(--muted)' }}>Manage and track your latest campaigns. Click ✨ to get an AI-powered analysis.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} style={{ borderColor: 'var(--border)' }}>
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                        <div className="relative group">
                            <Button variant="outline" size="sm" style={{ borderColor: 'var(--border)' }}>
                                <FileDown className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <div className="absolute right-0 top-full mt-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10"
                                 style={{ 
                                     backgroundColor: 'var(--card)', 
                                     borderColor: 'var(--border)',
                                     border: '1px solid'
                                 }}>
                                <div className="py-2 min-w-[140px]">
                                    <button
                                        onClick={() => exportToCSV(campaigns, 'campaigns')}
                                        className="w-full text-left px-4 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'var(--card-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Export as CSV
                                    </button>
                                    <button
                                        onClick={() => exportToJSON(campaigns, 'campaigns')}
                                        className="w-full text-left px-4 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'var(--card-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Export as JSON
                                    </button>
                                    <button
                                        onClick={() => exportToPDF(campaigns, 'campaigns')}
                                        className="w-full text-left px-4 py-2 text-sm transition-colors"
                                        style={{ color: 'var(--foreground)' }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'var(--card-hover)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Export as PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {showFilters && (
                    <div className="flex gap-4 p-4 rounded-lg border"
                         style={{ 
                             backgroundColor: 'var(--card-hover)', 
                             borderColor: 'var(--border)'
                         }}>
                        <Input
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                            style={{ 
                                backgroundColor: 'var(--card)', 
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)'
                            }}
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                            style={{ 
                                backgroundColor: 'var(--card)', 
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)'
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                )}
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs uppercase"
                           style={{ 
                               color: 'var(--muted)', 
                               backgroundColor: 'var(--card-hover)'
                           }}>
                        <tr>
                            {['name', 'spend', 'impressions', 'clicks', 'conversions', 'status', 'actions'].map(key => (
                                <th key={key} scope="col" className="px-6 py-4 text-left font-medium" onClick={() => key !== 'actions' && requestSort(key)}>
                                    <span className={key !== 'actions' ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCampaigns.map(campaign => (
                            <tr key={campaign.id} 
                                className="transition-colors hover:opacity-80"
                                style={{ 
                                    ':hover': { backgroundColor: 'var(--card-hover)' }
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--card-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}>
                                <td className="px-6 py-4 font-medium whitespace-nowrap" style={{ color: 'var(--foreground)' }}>{campaign.name}</td>
                                <td className="px-6 py-4" style={{ color: 'var(--muted)' }}>${campaign.spend.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4" style={{ color: 'var(--muted)' }}>{campaign.impressions.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4" style={{ color: 'var(--muted)' }}>{campaign.clicks.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4" style={{ color: 'var(--muted)' }}>{campaign.conversions.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(campaign.status)}`}>
                                        {campaign.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors" 
                                        onClick={() => onAnalyze(campaign)}
                                    >
                                        <Sparkles className="w-4 h-4 text-blue-500" /> 
                                        Analyze
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center p-4">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    Page {currentPage} of {totalPages} ({sortedCampaigns.length} total campaigns)
                </span>
                <div className="inline-flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default function EnhancedDashboardClient() {
    const { theme } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [isIdeasModalOpen, setIdeasModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [analysisResult, setAnalysisResult] = useState('');
    const [ideasResult, setIdeasResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ideaTopic, setIdeaTopic] = useState('');
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [realTimeEnabled, setRealTimeEnabled] = useState(false);
    
    // Real-time chart data
    const [liveRevenueData, setLiveRevenueData] = useState(monthlyRevenueData);
    const [liveCampaignData, setLiveCampaignData] = useState(campaignPerformanceData);
    const [liveConversionData, setLiveConversionData] = useState(conversionSourceData);

    // Apply theme to document root on mount and theme change
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.style.backgroundColor = 'var(--background)';
            document.body.style.color = 'var(--foreground)';
        }
    }, [theme]);

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setDashboardLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Real-time chart data updates
    useEffect(() => {
        if (realTimeEnabled && !dashboardLoading) {
            const interval = setInterval(() => {
                // Update revenue data
                setLiveRevenueData(prev => prev.map(item => ({
                    ...item,
                    revenue: Math.max(10000, item.revenue + (Math.random() - 0.5) * 3000)
                })));

                // Update campaign performance data
                setLiveCampaignData(prev => prev.map(item => ({
                    ...item,
                    impressions: Math.max(100000, item.impressions + Math.floor((Math.random() - 0.5) * 20000)),
                    ctr: Math.max(1.5, Math.min(5.0, item.ctr + (Math.random() - 0.5) * 0.3))
                })));

                // Update conversion source data
                setLiveConversionData(prev => prev.map(item => ({
                    ...item,
                    value: Math.max(100, item.value + Math.floor((Math.random() - 0.5) * 50))
                })));
            }, 3000); // Update every 3 seconds
            
            return () => clearInterval(interval);
        } else {
            // Reset to original data when real-time is disabled
            setLiveRevenueData(monthlyRevenueData);
            setLiveCampaignData(campaignPerformanceData);
            setLiveConversionData(conversionSourceData);
        }
    }, [realTimeEnabled, dashboardLoading]);

    const handleAnalyzeCampaign = async (campaign) => {
        setSelectedCampaign(campaign); 
        setAnalysisModalOpen(true); 
        setAnalysisResult(''); 
        setIsLoading(true);
        
        const prompt = `As a marketing expert, analyze the following campaign data and provide a concise summary with actionable insights. Focus on what's working, potential issues, and specific recommendations for improvement. Format the response in markdown.
        - Campaign Name: ${campaign.name}, Spend: $${campaign.spend}, Impressions: ${campaign.impressions}, Clicks: ${campaign.clicks}, Conversions: ${campaign.conversions}, Status: ${campaign.status}`;
        
        try {
            const response = await fetch(`/api/gemini`, { method: 'POST', body: JSON.stringify({ prompt }) });
            const result = await response.json();
            setAnalysisResult(result.text || "Could not retrieve analysis.");
        } catch (error) { 
            setAnalysisResult("An error occurred while analyzing the campaign."); 
        } finally { 
            setIsLoading(false); 
        }
    };
    
    const handleGenerateIdeas = async () => {
        if (!ideaTopic.trim()) return;
        setIdeasResult(''); 
        setIsLoading(true);
        
        const prompt = `You are a creative marketing strategist. Generate 3 distinct campaign ideas for the topic: "${ideaTopic}". For each idea, provide a catchy tagline, a target audience, and a primary channel suggestion. Format in markdown with clear headings.`;
        
        try {
            const response = await fetch(`/api/gemini`, { method: 'POST', body: JSON.stringify({ prompt }) });
            const result = await response.json();
            setIdeasResult(result.text || "Could not generate ideas.");
        } catch (error) { 
            setIdeasResult("An error occurred while generating ideas."); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <div className="min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] p-6"
             style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Welcome back, John! 👋</h1>
                    <p style={{ color: 'var(--muted)' }}>Here&apos;s what&apos;s happening with your campaigns today.</p>
                    <div className="flex items-center gap-4 mt-6 animate-[slideIn_0.4s_ease-out_0.2s_both]">
                        <Button
                                    variant={realTimeEnabled ? "default" : "outline"}
                                    onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                                    className={`gap-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${realTimeEnabled ? 'bg-gradient-to-r from-[hsl(142,69%,58%)] to-[hsl(142,76%,36%)] text-white shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_32px_rgba(34,197,94,0.4)] hover:scale-105' : 'border-[hsl(220,15%,90%)] hover:bg-[hsl(220,30%,95%)] text-[hsl(240,10%,8%)] dark:border-[hsl(240,15%,15%)] dark:hover:bg-[hsl(240,20%,12%)] dark:text-[hsl(240,10%,95%)]'}`}
                                    aria-label={realTimeEnabled ? "Disable real-time updates" : "Enable real-time updates"}
                                >
                                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${realTimeEnabled ? 'bg-green-200 animate-[pulseGlow_2s_infinite]' : 'bg-gray-400'}`} />
                                    Live Data Sync
                                    <span className={`text-xs px-2 py-1 rounded-full ${realTimeEnabled ? 'bg-green-700 text-green-100' : 'bg-[hsl(220,15%,90%)] text-[hsl(240,10%,50%)] dark:bg-[hsl(240,15%,15%)] dark:text-[hsl(240,10%,70%)]'}`}>
                                        {realTimeEnabled ? 'Real-time' : 'OFF'}
                                    </span>
                        </Button>
                        <Button 
                            variant="secondary" 
                            className="gap-2 transition-all duration-300 hover:scale-105" 
                            onClick={() => setIdeasModalOpen(true)}
                        >
                            <Sparkles className="w-4 h-4" /> 
                            Generate Ideas
                        </Button>
                    </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Total Revenue"
                                value="$342,000"
                                icon={DollarSign}
                                trend="up"
                                trendValue="12%"
                                description="from last month"
                                isLoading={dashboardLoading}
                                isRealTime={realTimeEnabled}
                            />
                            <StatCard
                                title="Total Users"
                                value="28,345"
                                icon={Users}
                                trend="up"
                                trendValue="8%"
                                description="from last month"
                                isLoading={dashboardLoading}
                                isRealTime={realTimeEnabled}
                            />
                            <StatCard
                                title="Conversion Rate"
                                value="3.45%"
                                icon={MousePointerClick}
                                trend="down"
                                trendValue="2%"
                                description="from last month"
                                isLoading={dashboardLoading}
                                isRealTime={realTimeEnabled}
                            />
                            <StatCard
                                title="Avg. CTR"
                                value="2.84%"
                                icon={LineChartIcon}
                                trend="up"
                                trendValue="15%"
                                description="from last month"
                                isLoading={dashboardLoading}
                                isRealTime={realTimeEnabled}
                            />
                        </div>

                        {/* AI Analytics Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                                    <Brain className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">AI Analytics</h2>
                                    <p className="text-sm text-muted-foreground">
                                        AI-powered insights and analysis for your marketing data
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <AIAnalyticsWidget
                                    title="Revenue Insights"
                                    data={liveRevenueData}
                                    analysisType="revenue"
                                    className="lg:col-span-1"
                                />
                                <AIAnalyticsWidget
                                    title="Campaign Performance"
                                    data={liveCampaignData}
                                    analysisType="campaign"
                                    className="lg:col-span-1"
                                />
                                <AIAnalyticsWidget
                                    title="Conversion Analysis"
                                    data={liveConversionData}
                                    analysisType="conversion"
                                    className="lg:col-span-1"
                                />
                                <AIAnalyticsWidget
                                    title="Traffic Sources"
                                    data={liveConversionData}
                                    analysisType="traffic"
                                    className="lg:col-span-1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {dashboardLoading ? (
                                <>
                                    <ChartSkeleton />
                                    <ChartSkeleton />
                                </>
                            ) : (
                                <>
                                    <Card className="rounded-lg shadow-lg border hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                                          style={{ 
                                              backgroundColor: 'var(--card)', 
                                              borderColor: 'var(--border)',
                                              color: 'var(--foreground)'
                                          }}>
                                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                                            <CardTitle className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Monthly Revenue Trend</CardTitle>
                                            <div className="relative group/button">
                                                <Button variant="outline" size="sm" style={{ borderColor: 'var(--border)' }}>
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <div className="absolute right-0 top-full mt-2 rounded-lg shadow-lg opacity-0 invisible group-hover/button:opacity-100 group-hover/button:visible transition-all duration-300 z-10"
                                                     style={{ 
                                                         backgroundColor: 'var(--card)', 
                                                         borderColor: 'var(--border)',
                                                         border: '1px solid'
                                                     }}>
                                                    <div className="py-2 min-w-[120px]">
                                                        <button
                                                            onClick={() => exportToCSV(liveRevenueData, 'revenue-data')}
                                                            className="w-full text-left px-4 py-2 text-sm transition-colors"
                                                            style={{ color: 'var(--foreground)' }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = 'var(--card-hover)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            Export CSV
                                                        </button>
                                                        <button
                                                            onClick={() => exportToJSON(liveRevenueData, 'revenue-data')}
                                                            className="w-full text-left px-4 py-2 text-sm transition-colors"
                                                            style={{ color: 'var(--foreground)' }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = 'var(--card-hover)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                            }}
                                                        >
                                                            Export JSON
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={350}>
                                                <AreaChart data={liveRevenueData}>
                                                    <defs>
                                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis 
                                                        dataKey="name" 
                                                        fontSize={12} 
                                                        tickLine={false} 
                                                        axisLine={false} 
                                                        style={{ fill: 'var(--muted)' }}
                                                    />
                                                    <YAxis 
                                                        fontSize={12} 
                                                        tickLine={false} 
                                                        axisLine={false} 
                                                        style={{ fill: 'var(--muted)' }}
                                                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: theme === 'dark' ? '#000000' : '#ffffff', 
                                                            border: '1px solid', 
                                                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                                            borderRadius: '0.5rem',
                                                            color: theme === 'dark' ? '#ffffff' : '#000000'
                                                        }} 
                                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="revenue" 
                                                        stroke="#8b5cf6" 
                                                        strokeWidth={2}
                                                        fillOpacity={1} 
                                                        fill="url(#colorRevenue)" 
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                    <Card className="rounded-lg shadow-lg border hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                                          style={{ 
                                              backgroundColor: 'var(--card)', 
                                              borderColor: 'var(--border)',
                                              color: 'var(--foreground)'
                                          }}>
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Conversion Sources</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={350}>
                                                <PieChart>
                                                    <Pie
                                                        data={liveConversionData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={120}
                                                        fill="#8884d8"
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        activeIndex={activeIndex}
                                                        activeShape={ActiveShapePieChart}
                                                        onMouseEnter={(_, index) => setActiveIndex(index)}
                                                    >
                                                        {liveConversionData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: theme === 'dark' ? '#000000' : '#ffffff', 
                                                            border: '1px solid', 
                                                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                                            borderRadius: '0.5rem',
                                                            color: theme === 'dark' ? '#ffffff' : '#000000'
                                                        }}
                                                        labelStyle={{
                                                            color: theme === 'dark' ? 'white' : 'black'
                                                        }}
                                                        itemStyle={{
                                                            color: theme === 'dark' ? 'white' : 'black'
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            {dashboardLoading ? (
                                <ChartSkeleton />
                            ) : (
                                <Card className="rounded-lg shadow-lg border hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                                      style={{ 
                                          backgroundColor: 'var(--card)', 
                                          borderColor: 'var(--border)',
                                          color: 'var(--foreground)'
                                      }}>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Campaign Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={liveCampaignData}>
                                                <XAxis 
                                                    dataKey="name" 
                                                    fontSize={12} 
                                                    tickLine={false} 
                                                    axisLine={false} 
                                                    style={{ fill: 'var(--muted)' }}
                                                />
                                                <YAxis 
                                                    yAxisId="left" 
                                                    orientation="left" 
                                                    style={{ fill: '#8b5cf6' }} 
                                                    fontSize={12} 
                                                    tickLine={false} 
                                                    axisLine={false} 
                                                />
                                                <YAxis 
                                                    yAxisId="right" 
                                                    orientation="right" 
                                                    style={{ fill: '#3b82f6' }} 
                                                    fontSize={12} 
                                                    tickLine={false} 
                                                    axisLine={false} 
                                                    tickFormatter={(value) => `${value}%`} 
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: theme === 'dark' ? '#000000' : '#ffffff', 
                                                        border: '1px solid', 
                                                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        color: theme === 'dark' ? '#ffffff' : '#000000'
                                                    }} 
                                                />
                                                <Legend style={{ fill: 'var(--muted)' }} />
                                                <Bar yAxisId="left" dataKey="impressions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                                <Bar yAxisId="right" dataKey="ctr" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        <DataTable onAnalyze={handleAnalyzeCampaign} isLoading={dashboardLoading} />
                    </div>
                    
                    <Modal isOpen={isAnalysisModalOpen} onClose={() => setAnalysisModalOpen(false)} title={`✨ AI Analysis: ${selectedCampaign?.name}`}>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader className="w-8 h-8 animate-spin text-violet-500" />
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }}></div>
                        )}
                    </Modal>
                    <Modal isOpen={isIdeasModalOpen} onClose={() => setIdeasModalOpen(false)} title="✨ Generate Campaign Ideas">
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="e.g., 'Launch new eco-friendly sneakers'"
                                value={ideaTopic}
                                onChange={(e) => setIdeaTopic(e.target.value)}
                                aria-label="Campaign idea topic input"
                            />
                            <Button
                                variant="default"
                                className="w-full gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                                onClick={handleGenerateIdeas}
                                disabled={isLoading || !ideaTopic.trim()}
                                aria-label="Generate campaign ideas"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Ideas'
                                )}
                            </Button>
                            {ideasResult && (
                                <div className="prose prose-sm dark:prose-invert max-w-none mt-4 pt-4 border-t border-gray-800" dangerouslySetInnerHTML={{ __html: ideasResult.replace(/\n/g, '<br />') }}></div>
                            )}
                        </div>
                    </Modal>
                </div>
            );
        }
