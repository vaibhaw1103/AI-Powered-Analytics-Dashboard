'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    TrendingUp, TrendingDown, Users, Eye, MousePointerClick, 
    Globe, Smartphone, Monitor, Calendar, Filter, Download,
    BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Funnel as FunnelIcon, Map, Clock,
    ArrowUp, ArrowDown, Sparkles, RefreshCw, Share2, Brain
} from 'lucide-react';
import { 
    Card, CardHeader, CardTitle, CardContent, CardDescription 
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DateRangePicker } from './ui/date-range-picker';
import { AIAnalyticsWidget } from './ai-analytics-widget';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
    PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart as RechartsLineChart, Line,
    FunnelChart, Funnel as RechartsFunnel, LabelList
} from 'recharts';
import { useTheme } from './theme-provider';

// Mock Analytics Data
const trafficTrendsData = [
    { date: 'Jan', organic: 12500, paid: 8300, social: 3200, email: 2100, direct: 5400 },
    { date: 'Feb', organic: 15200, paid: 9500, social: 3800, email: 2400, direct: 6100 },
    { date: 'Mar', organic: 18900, paid: 11200, social: 4500, email: 2800, direct: 7200 },
    { date: 'Apr', organic: 22100, paid: 13800, social: 5200, email: 3100, direct: 8500 },
    { date: 'May', organic: 25800, paid: 15600, social: 6100, email: 3600, direct: 9800 },
    { date: 'Jun', organic: 28200, paid: 17200, social: 6800, email: 4200, direct: 11200 },
    { date: 'Jul', organic: 31500, paid: 19800, social: 7600, email: 4800, direct: 12800 }
];

const channelPerformanceData = [
    { channel: 'Organic Search', sessions: 31500, conversions: 1575, rate: 5.0, revenue: 125000 },
    { channel: 'Paid Search', sessions: 19800, conversions: 1386, rate: 7.0, revenue: 98000 },
    { channel: 'Social Media', sessions: 7600, conversions: 304, rate: 4.0, revenue: 28000 },
    { channel: 'Email', sessions: 4800, conversions: 288, rate: 6.0, revenue: 32000 },
    { channel: 'Direct', sessions: 12800, conversions: 512, rate: 4.0, revenue: 54000 }
];

const audienceDemographicsData = [
    { name: '18-24', value: 18, color: 'hsl(220 70% 50%)' },
    { name: '25-34', value: 35, color: 'hsl(142 76% 36%)' },
    { name: '35-44', value: 28, color: 'hsl(271 81% 56%)' },
    { name: '45-54', value: 12, color: 'hsl(25 95% 53%)' },
    { name: '55+', value: 7, color: 'hsl(0 84% 60%)' }
];

const conversionFunnelData = [
    { name: 'Page Views', value: 100000, fill: 'hsl(220 70% 50%)' },
    { name: 'Product Views', value: 45000, fill: 'hsl(142 76% 36%)' },
    { name: 'Add to Cart', value: 12000, fill: 'hsl(271 81% 56%)' },
    { name: 'Checkout', value: 5500, fill: 'hsl(25 95% 53%)' },
    { name: 'Purchase', value: 4200, fill: 'hsl(0 84% 60%)' }
];

const geographicData = [
    { country: 'United States', sessions: 28500, revenue: 142000, color: 'hsl(220 70% 50%)' },
    { country: 'Canada', sessions: 8200, revenue: 38000, color: 'hsl(142 76% 36%)' },
    { country: 'United Kingdom', sessions: 6800, revenue: 32000, color: 'hsl(271 81% 56%)' },
    { country: 'Germany', sessions: 5200, revenue: 24000, color: 'hsl(25 95% 53%)' },
    { country: 'France', sessions: 4100, revenue: 18500, color: 'hsl(0 84% 60%)' }
];

const userBehaviorData = [
    { hour: '00:00', users: 1200 },
    { hour: '02:00', users: 800 },
    { hour: '04:00', users: 600 },
    { hour: '06:00', users: 1100 },
    { hour: '08:00', users: 2800 },
    { hour: '10:00', users: 4500 },
    { hour: '12:00', users: 5800 },
    { hour: '14:00', users: 6200 },
    { hour: '16:00', users: 5900 },
    { hour: '18:00', users: 4800 },
    { hour: '20:00', users: 3600 },
    { hour: '22:00', users: 2400 }
];

const deviceData = [
    { device: 'Desktop', sessions: 42500, percentage: 55.2 },
    { device: 'Mobile', sessions: 28200, percentage: 36.6 },
    { device: 'Tablet', sessions: 6300, percentage: 8.2 }
];

// AI Insights Component
const AIInsights = () => {
    const insights = [
        {
            type: 'trend',
            title: 'Organic Traffic Surge',
            description: 'Organic search traffic increased by 28% this month, primarily driven by improved rankings for long-tail keywords.',
            impact: 'high',
            icon: TrendingUp
        },
        {
            type: 'opportunity',
            title: 'Mobile Conversion Gap',
            description: 'Mobile conversion rate is 2.3% lower than desktop. Consider optimizing mobile checkout flow.',
            impact: 'medium',
            icon: Smartphone
        },
        {
            type: 'alert',
            title: 'Social Media Decline',
            description: 'Social media traffic dropped 15% compared to last month. Review content strategy and posting frequency.',
            impact: 'low',
            icon: TrendingDown
        }
    ];

    return (
        <Card className="rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border"
              style={{ 
                  backgroundColor: `hsl(var(--card) / 0.5)`, 
                  borderColor: `hsl(var(--border) / 0.3)`
              }}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    AI-Powered Insights
                </CardTitle>
                <CardDescription style={{ color: 'hsl(var(--muted))' }}>
                    Automated analysis and recommendations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-opacity-80"
                         style={{ backgroundColor: 'hsl(var(--card-hover))' }}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            insight.impact === 'high' ? 'bg-green-100 text-green-600' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                        }`}>
                            <insight.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium mb-1" style={{ color: 'hsl(var(--foreground))' }}>
                                {insight.title}
                            </h4>
                            <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                {insight.description}
                            </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            insight.impact === 'high' ? 'bg-green-100 text-green-800' :
                            insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {insight.impact}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

// Widget Component for Dashboard Builder
const AnalyticsWidget = ({ title, children, onRemove, isDragging }) => {
    return (
        <Card className={`rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border ${isDragging ? 'opacity-50' : ''}`}
              style={{ 
                  backgroundColor: `hsl(var(--card) / 0.5)`, 
                  borderColor: `hsl(var(--border) / 0.3)`
              }}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle style={{ color: 'hsl(var(--foreground))' }}>{title}</CardTitle>
                {onRemove && (
                    <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-500">
                        ×
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

// Stat Card Component
const AnalyticsStatCard = ({ title, value, icon: Icon, trend, trendValue, description }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    
    return (
        <Card className="rounded-lg glass-card hover:glass-card-hover hover:shadow-primary-medium hover:-translate-y-2 transition-all duration-300 group cursor-pointer border"
              style={{ 
                  backgroundColor: `hsl(var(--card) / 0.5)`, 
                  borderColor: `hsl(var(--border) / 0.3)`,
                  color: `hsl(var(--foreground))`
              }}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium"
                          style={{ color: `hsl(var(--muted))` }}>
                    {title}
                </CardTitle>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
                     style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}>
                    <Icon className="w-6 h-6" style={{ color: 'white' }} />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-2xl font-bold mb-1" style={{ color: `hsl(var(--foreground))` }}>
                    {value}
                </div>
                <p className="text-sm flex items-center gap-1" style={{ color: `hsl(var(--muted))` }}>
                    <span className={`flex items-center gap-1 transition-colors duration-300`}
                          style={{ color: trend === 'up' ? `hsl(var(--success))` : `hsl(var(--destructive))` }}>
                        <TrendIcon className="w-4 h-4" />
                        {trendValue}
                    </span>
                    <span>{description}</span>
                </p>
            </CardContent>
        </Card>
    );
};

export default function AnalyticsPage() {
    const { theme } = useTheme();
    const [dateRange, setDateRange] = useState({ from: '2024-07-01', to: '2024-07-31' });
    const [selectedMetric, setSelectedMetric] = useState('sessions');
    const [comparisonPeriod, setComparisonPeriod] = useState('previous');
    const [dashboardWidgets, setDashboardWidgets] = useState([
        'traffic-trends', 'channel-performance', 'conversion-funnel', 'audience-demographics'
    ]);
    const [isCustomizing, setIsCustomizing] = useState(false);

    // Available widgets for dashboard builder
    const availableWidgets = [
        { id: 'traffic-trends', name: 'Traffic Trends', icon: LineChartIcon },
        { id: 'channel-performance', name: 'Channel Performance', icon: BarChart3 },
        { id: 'conversion-funnel', name: 'Conversion Funnel', icon: FunnelIcon },
        { id: 'audience-demographics', name: 'Audience Demographics', icon: PieChartIcon },
        { id: 'geographic-data', name: 'Geographic Distribution', icon: Map },
        { id: 'user-behavior', name: 'User Behavior', icon: Clock },
        { id: 'device-breakdown', name: 'Device Breakdown', icon: Monitor },
        { id: 'ai-insights', name: 'AI Insights', icon: Sparkles }
    ];

    const renderWidget = (widgetId) => {
        switch (widgetId) {
            case 'traffic-trends':
                return (
                    <AnalyticsWidget title="Traffic Source Trends">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trafficTrendsData}>
                                <defs>
                                    <linearGradient id="organicGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(220 70% 50%)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(220 70% 50%)" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} 
                                       style={{ fill: 'hsl(var(--muted))' }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} 
                                       style={{ fill: 'hsl(var(--muted))' }} />
                                <Tooltip contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))'
                                }} />
                                <Legend style={{ fill: 'hsl(var(--muted))' }} />
                                <Area type="monotone" dataKey="organic" stackId="1" stroke="hsl(142 76% 36%)" 
                                      fill="url(#organicGradient)" strokeWidth={2} />
                                <Area type="monotone" dataKey="paid" stackId="1" stroke="hsl(220 70% 50%)" 
                                      fill="url(#paidGradient)" strokeWidth={2} />
                                <Area type="monotone" dataKey="social" stackId="1" stroke="hsl(271 81% 56%)" 
                                      fill="hsl(271 81% 56%)" fillOpacity={0.3} strokeWidth={2} />
                                <Area type="monotone" dataKey="email" stackId="1" stroke="hsl(25 95% 53%)" 
                                      fill="hsl(25 95% 53%)" fillOpacity={0.3} strokeWidth={2} />
                                <Area type="monotone" dataKey="direct" stackId="1" stroke="hsl(0 84% 60%)" 
                                      fill="hsl(0 84% 60%)" fillOpacity={0.3} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </AnalyticsWidget>
                );

            case 'channel-performance':
                return (
                    <AnalyticsWidget title="Channel Performance Comparison">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={channelPerformanceData}>
                                <XAxis dataKey="channel" fontSize={12} tickLine={false} axisLine={false} 
                                       style={{ fill: 'hsl(var(--muted))' }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} 
                                       style={{ fill: 'hsl(var(--muted))' }} />
                                <Tooltip contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))'
                                }} />
                                <Legend style={{ fill: 'hsl(var(--muted))' }} />
                                <Bar dataKey="sessions" fill="hsl(220 70% 50%)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="conversions" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </AnalyticsWidget>
                );

            case 'conversion-funnel':
                return (
                    <AnalyticsWidget title="Conversion Funnel Analysis">
                        <div className="space-y-3">
                            {conversionFunnelData.map((step, index) => {
                                const percentage = index === 0 ? 100 : (step.value / conversionFunnelData[0].value * 100);
                                const dropOff = index > 0 ? conversionFunnelData[index - 1].value - step.value : 0;
                                
                                return (
                                    <div key={step.name} className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                {step.name}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                    {step.value.toLocaleString()}
                                                </span>
                                                <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                    {percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-8 rounded-lg overflow-hidden" 
                                             style={{ backgroundColor: 'hsl(var(--card-hover))' }}>
                                            <div 
                                                className="h-full transition-all duration-500"
                                                style={{ 
                                                    width: `${percentage}%`,
                                                    backgroundColor: step.fill
                                                }}
                                            />
                                        </div>
                                        {dropOff > 0 && (
                                            <div className="text-xs mt-1" style={{ color: 'hsl(var(--destructive))' }}>
                                                -{dropOff.toLocaleString()} users dropped off
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </AnalyticsWidget>
                );

            case 'audience-demographics':
                return (
                    <AnalyticsWidget title="Audience Age Demographics">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={audienceDemographicsData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {audienceDemographicsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`${value}%`, 'Percentage']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </AnalyticsWidget>
                );

            case 'geographic-data':
                return (
                    <AnalyticsWidget title="Top Countries by Sessions">
                        <div className="space-y-4">
                            {geographicData.map((country, index) => (
                                <div key={country.country} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: country.color }} />
                                        <span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                            {country.country}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                            {country.sessions.toLocaleString()}
                                        </div>
                                        <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                            ${country.revenue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnalyticsWidget>
                );

            case 'user-behavior':
                return (
                    <AnalyticsWidget title="User Activity by Hour">
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsLineChart data={userBehaviorData}>
                                <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} 
                                       style={{ fill: 'hsl(var(--muted))' }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} 
                                       style={{ fill: 'hsl(var(--muted))' }} />
                                <Tooltip contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))'
                                }} />
                                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" 
                                      strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </AnalyticsWidget>
                );

            case 'device-breakdown':
                return (
                    <AnalyticsWidget title="Device Usage Breakdown">
                        <div className="space-y-4">
                            {deviceData.map((device) => (
                                <div key={device.device} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {device.device === 'Desktop' && <Monitor className="w-4 h-4" />}
                                            {device.device === 'Mobile' && <Smartphone className="w-4 h-4" />}
                                            {device.device === 'Tablet' && <div className="w-4 h-4 border rounded" />}
                                            <span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                {device.device}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                {device.sessions.toLocaleString()}
                                            </div>
                                            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                {device.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${device.percentage}%`,
                                                backgroundColor: 'hsl(var(--primary))'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnalyticsWidget>
                );

            case 'ai-insights':
                return <AIInsights />;

            default:
                return null;
        }
    };

    const addWidget = (widgetId) => {
        if (!dashboardWidgets.includes(widgetId)) {
            setDashboardWidgets(prev => [...prev, widgetId]);
        }
    };

    const removeWidget = (widgetId) => {
        setDashboardWidgets(prev => prev.filter(id => id !== widgetId));
    };

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Advanced Analytics
                    </h1>
                    <p style={{ color: 'hsl(var(--muted))' }}>
                        Deep insights into your marketing performance and user behavior
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        style={{ borderColor: 'hsl(var(--border))' }}
                    >
                        {isCustomizing ? 'Done' : 'Customize Dashboard'}
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Filters and Controls */}
            <Card className="rounded-lg glass-card transition-all duration-300 border"
                  style={{ 
                      backgroundColor: `hsl(var(--card) / 0.5)`, 
                      borderColor: `hsl(var(--border) / 0.3)`
                  }}>
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: 'hsl(var(--muted))' }} />
                            <DateRangePicker 
                                value={dateRange} 
                                onChange={setDateRange}
                                className="min-w-[200px]"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>Compare to:</span>
                            <select
                                value={comparisonPeriod}
                                onChange={(e) => setComparisonPeriod(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                                style={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))'
                                }}
                            >
                                <option value="previous">Previous Period</option>
                                <option value="year">Same Period Last Year</option>
                                <option value="none">No Comparison</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>Primary Metric:</span>
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                                style={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))'
                                }}
                            >
                                <option value="sessions">Sessions</option>
                                <option value="users">Users</option>
                                <option value="pageviews">Page Views</option>
                                <option value="conversions">Conversions</option>
                                <option value="revenue">Revenue</option>
                            </select>
                        </div>

                        <Button variant="outline" size="sm" style={{ borderColor: 'hsl(var(--border))' }}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Data
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <AnalyticsStatCard
                    title="Total Sessions"
                    value="76,900"
                    icon={Eye}
                    trend="up"
                    trendValue="12.5%"
                    description="vs last period"
                />
                <AnalyticsStatCard
                    title="Unique Users"
                    value="52,400"
                    icon={Users}
                    trend="up"
                    trendValue="8.2%"
                    description="vs last period"
                />
                <AnalyticsStatCard
                    title="Page Views"
                    value="156,800"
                    icon={Eye}
                    trend="up"
                    trendValue="15.3%"
                    description="vs last period"
                />
                <AnalyticsStatCard
                    title="Conversion Rate"
                    value="5.2%"
                    icon={MousePointerClick}
                    trend="down"
                    trendValue="2.1%"
                    description="vs last period"
                />
                <AnalyticsStatCard
                    title="Revenue"
                    value="$337,000"
                    icon={TrendingUp}
                    trend="up"
                    trendValue="18.7%"
                    description="vs last period"
                />
            </div>

            {/* AI Analytics Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                        <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">AI-Powered Analytics</h2>
                        <p className="text-sm text-muted-foreground">
                            Advanced insights and recommendations based on your analytics data
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AIAnalyticsWidget
                        title="Traffic Analysis"
                        data={trafficTrendsData}
                        analysisType="traffic"
                        className="lg:col-span-1"
                    />
                    <AIAnalyticsWidget
                        title="Channel Performance"
                        data={channelPerformanceData}
                        analysisType="campaign"
                        className="lg:col-span-1"
                    />
                    <AIAnalyticsWidget
                        title="Conversion Optimization"
                        data={conversionFunnelData}
                        analysisType="conversion"
                        className="lg:col-span-2"
                    />
                </div>
            </div>

            {/* Widget Selection for Customization */}
            {isCustomizing && (
                <Card className="rounded-lg glass-card transition-all duration-300 border"
                      style={{ 
                          backgroundColor: `hsl(var(--card) / 0.5)`, 
                          borderColor: `hsl(var(--border) / 0.3)`
                      }}>
                    <CardHeader>
                        <CardTitle style={{ color: 'hsl(var(--foreground))' }}>Available Widgets</CardTitle>
                        <CardDescription style={{ color: 'hsl(var(--muted))' }}>
                            Click to add widgets to your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {availableWidgets.map((widget) => (
                                <Button
                                    key={widget.id}
                                    variant={dashboardWidgets.includes(widget.id) ? "default" : "outline"}
                                    onClick={() => dashboardWidgets.includes(widget.id) ? removeWidget(widget.id) : addWidget(widget.id)}
                                    className="flex items-center gap-2 justify-start p-4 h-auto"
                                >
                                    <widget.icon className="w-4 h-4" />
                                    <span className="text-sm">{widget.name}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Dynamic Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {dashboardWidgets.map((widgetId) => (
                    <div key={widgetId} className={dashboardWidgets.indexOf(widgetId) < 2 ? '' : 'lg:col-span-1'}>
                        {renderWidget(widgetId)}
                    </div>
                ))}
            </div>

            {/* Period Comparison Table */}
            <Card className="rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border"
                  style={{ 
                      backgroundColor: `hsl(var(--card) / 0.5)`, 
                      borderColor: `hsl(var(--border) / 0.3)`
                  }}>
                <CardHeader>
                    <CardTitle style={{ color: 'hsl(var(--foreground))' }}>Period Comparison Analysis</CardTitle>
                    <CardDescription style={{ color: 'hsl(var(--muted))' }}>
                        Current period vs {comparisonPeriod === 'previous' ? 'previous period' : 'same period last year'}
                    </CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs uppercase"
                               style={{ 
                                   color: 'hsl(var(--muted))', 
                                   backgroundColor: 'hsl(var(--card-hover))'
                               }}>
                            <tr>
                                <th className="px-6 py-4 text-left font-medium">Metric</th>
                                <th className="px-6 py-4 text-left font-medium">Current Period</th>
                                <th className="px-6 py-4 text-left font-medium">Previous Period</th>
                                <th className="px-6 py-4 text-left font-medium">Change</th>
                                <th className="px-6 py-4 text-left font-medium">% Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { metric: 'Sessions', current: 76900, previous: 68400, change: 8500 },
                                { metric: 'Users', current: 52400, previous: 48300, change: 4100 },
                                { metric: 'Page Views', current: 156800, previous: 135900, change: 20900 },
                                { metric: 'Conversions', current: 4002, previous: 3854, change: 148 },
                                { metric: 'Revenue', current: 337000, previous: 284000, change: 53000 }
                            ].map((row) => {
                                const percentChange = ((row.change / row.previous) * 100);
                                const isPositive = row.change > 0;
                                
                                return (
                                    <tr key={row.metric} className="transition-colors hover:opacity-80"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'hsl(var(--card-hover))';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}>
                                        <td className="px-6 py-4 font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                            {row.metric}
                                        </td>
                                        <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                            {row.metric === 'Revenue' ? `$${row.current.toLocaleString()}` : row.current.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                            {row.metric === 'Revenue' ? `$${row.previous.toLocaleString()}` : row.previous.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                                {row.metric === 'Revenue' ? `$${Math.abs(row.change).toLocaleString()}` : Math.abs(row.change).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
