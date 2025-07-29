

// =======================================================================
// FILE: /src/components/dashboard-client.js
// This is the main client component that contains all the interactive
// dashboard logic, state, and effects.
// =======================================================================
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Sector } from 'recharts';
import { Sun, Moon, Search, LayoutDashboard, Target, BarChart3, Settings, LogOut, DollarSign, Users, MousePointerClick, LineChart as LineChartIcon, TrendingUp, TrendingDown, Download, Menu, ChevronLeft, ChevronRight, Sparkles, X, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';


// Mock Data (same as before)
const monthlyRevenueData = [
    { name: 'Jan', revenue: 12000 }, { name: 'Feb', revenue: 19000 }, { name: 'Mar', revenue: 15000 }, { name: 'Apr', revenue: 25000 }, { name: 'May', revenue: 22000 }, { name: 'Jun', revenue: 30000 }, { name: 'Jul', revenue: 28000 }, { name: 'Aug', revenue: 35000 }, { name: 'Sep', revenue: 32000 }, { name: 'Oct', revenue: 41000 }, { name: 'Nov', revenue: 38000 }, { name: 'Dec', revenue: 45000 },
];
const campaignPerformanceData = [
    { name: 'Campaign A', impressions: 120000, ctr: 2.5 }, { name: 'Campaign B', impressions: 190000, ctr: 3.1 }, { name: 'Campaign C', impressions: 150000, ctr: 2.8 }, { name: 'Campaign D', impressions: 250000, ctr: 3.5 }, { name: 'Campaign E', impressions: 220000, ctr: 3.2 },
];
const conversionSourceData = [
    { name: 'Google Ads', value: 400 }, { name: 'Facebook', value: 300 }, { name: 'Organic', value: 300 }, { name: 'Referral', value: 200 },
];
const COLORS = ['#4f46e5', '#8b5cf6', '#0ea5e9', '#10b981'];
const initialCampaigns = [
    { id: 1, name: 'Summer Sale Blast', spend: 5200, impressions: 250000, clicks: 7500, conversions: 450, status: 'Active' }, { id: 2, name: 'Q4 Product Launch', spend: 12500, impressions: 800000, clicks: 16000, conversions: 980, status: 'Active' }, { id: 3, name: 'Brand Awareness Push', spend: 8000, impressions: 1200000, clicks: 12000, conversions: 150, status: 'Paused' }, { id: 4, name: 'Lead Gen Form Campaign', spend: 3500, impressions: 150000, clicks: 9000, conversions: 1100, status: 'Completed' }, { id: 5, name: 'Holiday Special Offer', spend: 9800, impressions: 650000, clicks: 21000, conversions: 1500, status: 'Active' }, { id: 6, name: 'New Year Kickoff', spend: 6000, impressions: 300000, clicks: 8500, conversions: 550, status: 'Active' }, { id: 7, name: 'Spring Collection Promo', spend: 4500, impressions: 180000, clicks: 6200, conversions: 320, status: 'Paused' }, { id: 8, name: 'Ebook Download Campaign', spend: 2000, impressions: 90000, clicks: 5000, conversions: 800, status: 'Completed' },
];

// Sub-components for the dashboard
const StatCard = ({ title, value, icon: Icon, trend, trendValue, description }) => {
    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
    return (
        <Card className="transform hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="w-5 h-5 text-slate-400" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-slate-50">{value}</div>
                <p className="text-xs text-slate-400 mt-1 flex items-center">
                    <span className={`flex items-center gap-1 ${trendColor}`}><TrendIcon className="w-4 h-4" />{trendValue}</span>
                    <span className="ml-1">{description}</span>
                </p>
            </CardContent>
        </Card>
    );
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

const DataTable = ({ onAnalyze }) => {
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const sortedCampaigns = useMemo(() => {
        let sortableItems = [...campaigns];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [campaigns, sortConfig]);

    const paginatedCampaigns = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedCampaigns.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedCampaigns, currentPage]);

    const totalPages = Math.ceil(campaigns.length / itemsPerPage);
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-900/50 text-green-400';
            case 'Paused': return 'bg-yellow-900/50 text-yellow-400';
            default: return 'bg-gray-700 text-slate-300';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Manage and track your latest campaigns. Click ✨ to get an AI-powered analysis.</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-gray-900">
                        <tr>
                            {['name', 'spend', 'impressions', 'clicks', 'conversions', 'status', 'actions'].map(key => (
                                <th key={key} scope="col" className="px-6 py-3" onClick={() => key !== 'actions' && requestSort(key)}>
                                    <span className={key !== 'actions' ? 'cursor-pointer' : ''}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {paginatedCampaigns.map(campaign => (
                            <tr key={campaign.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-50 whitespace-nowrap">{campaign.name}</td>
                                <td className="px-6 py-4 text-slate-300">${campaign.spend.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4 text-slate-300">{campaign.impressions.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4 text-slate-300">{campaign.clicks.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4 text-slate-300">{campaign.conversions.toLocaleString('en-US')}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(campaign.status)}`}>{campaign.status}</span></td>
                                <td className="px-6 py-4"><Button variant="ghost" className="gap-2" onClick={() => onAnalyze(campaign)}><Sparkles className="w-4 h-4 text-indigo-500" /> Analyze</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center p-4 border-t border-gray-800">
                <span className="text-sm text-slate-400">Page {currentPage} of {totalPages}</span>
                <div className="inline-flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>
        </Card>
    );
};

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, active: true }, { name: 'Campaigns', icon: Target, active: false }, { name: 'Analytics', icon: BarChart3, active: false }, { name: 'Settings', icon: Settings, active: false },
    ];
    const sidebarClasses = `fixed z-40 h-full bg-black border-r border-gray-800 flex flex-col transition-transform duration-300`;
    return (
        <>
            <aside className={`w-64 ${sidebarClasses} hidden lg:flex`}>
                <div className="flex items-center h-20 px-6 border-b border-gray-800">
                    <a href="#" className="flex items-center gap-3"><div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div><span className="text-xl font-bold text-slate-50">ADmyBRAND</span></a>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => (<a key={item.name} href="#" className={`flex items-center gap-4 rounded-lg p-3 transition-colors duration-200 ${item.active ? 'bg-gray-900 text-indigo-400' : 'text-slate-400 hover:bg-gray-900'}`}><item.icon className="w-6 h-6" /><span>{item.name}</span></a>))}
                </nav>
            </aside>
            <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`${sidebarClasses} lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}>
                 <div className="flex items-center h-20 px-6 border-b border-gray-800">
                    <a href="#" className="flex items-center gap-3"><div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div><span className="text-xl font-bold text-slate-50">ADmyBRAND</span></a>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => (<a key={item.name} href="#" className={`flex items-center gap-4 rounded-lg p-3 transition-colors duration-200 ${item.active ? 'bg-gray-900 text-indigo-400' : 'text-slate-400 hover:bg-gray-900'}`}><item.icon className="w-6 h-6" /><span>{item.name}</span></a>))}
                </nav>
            </aside>
        </>
    );
};

const Header = ({ setSidebarOpen, onGenerateIdeas }) => {
    return (
        <header className="sticky top-0 z-10 h-20 bg-black/80 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400"><Menu /></button>
                <div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><Input type="text" placeholder="Search..." className="pl-10 w-64" /></div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="primary" className="gap-2" onClick={onGenerateIdeas}><Sparkles className="w-4 h-4" /> <span className="hidden md:inline">Generate Ideas</span></Button>
                <div className="relative"><button className="flex items-center gap-2"><Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" width={40} height={40} className="rounded-full border-2 border-indigo-500 object-cover" /></button></div>
            </div>
        </header>
    );
};

export default function DashboardClient() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [isIdeasModalOpen, setIdeasModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [analysisResult, setAnalysisResult] = useState('');
    const [ideasResult, setIdeasResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ideaTopic, setIdeaTopic] = useState('');

    const handleAnalyzeCampaign = async (campaign) => {
        setSelectedCampaign(campaign); setAnalysisModalOpen(true); setAnalysisResult(''); setIsLoading(true);
        const prompt = `As a marketing expert, analyze the following campaign data and provide a concise summary with actionable insights. Focus on what's working, potential issues, and specific recommendations for improvement. Format the response in markdown.
        - Campaign Name: ${campaign.name}, Spend: $${campaign.spend}, Impressions: ${campaign.impressions}, Clicks: ${campaign.clicks}, Conversions: ${campaign.conversions}, Status: ${campaign.status}`;
        try {
            const response = await fetch(`/api/gemini`, { method: 'POST', body: JSON.stringify({ prompt }) });
            const result = await response.json();
            setAnalysisResult(result.text || "Could not retrieve analysis.");
        } catch (error) { setAnalysisResult("An error occurred while analyzing the campaign."); } finally { setIsLoading(false); }
    };
    
    const handleGenerateIdeas = async () => {
        if (!ideaTopic.trim()) return;
        setIdeasResult(''); setIsLoading(true);
        const prompt = `You are a creative marketing strategist. Generate 3 distinct campaign ideas for the topic: "${ideaTopic}". For each idea, provide a catchy tagline, a target audience, and a primary channel suggestion. Format in markdown with clear headings.`;
        try {
            const response = await fetch(`/api/gemini`, { method: 'POST', body: JSON.stringify({ prompt }) });
            const result = await response.json();
            setIdeasResult(result.text || "Could not generate ideas.");
        } catch (error) { setIdeasResult("An error occurred while generating ideas."); } finally { setIsLoading(false); }
    };

    return (
        <div className="text-slate-50">
            <div className="flex min-h-screen">
                <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 flex flex-col lg:ml-64">
                    <Header setSidebarOpen={setSidebarOpen} onGenerateIdeas={() => setIdeasModalOpen(true)} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div><h1 className="text-3xl font-bold">Welcome Back, Jane!</h1><p className="text-slate-400 mt-1">Here&apos;s your marketing performance overview.</p></div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 md:mt-0 w-full sm:w-auto">
                                <Input type="date" defaultValue="2025-07-28" className="w-full sm:w-auto" />
                                <Button variant="secondary" className="gap-2 w-full sm:w-auto"><Download className="w-4 h-4" />Export</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Revenue" value="$59,956" icon={DollarSign} trend="up" trendValue="+12.5%" description="vs last month" />
                            <StatCard title="Users" value="73,205" icon={Users} trend="up" trendValue="+8.2%" description="vs last month" />
                            <StatCard title="Conversions" value="8,430" icon={MousePointerClick} trend="down" trendValue="-1.7%" description="vs last month" />
                            <StatCard title="Growth" value="15.3%" icon={LineChartIcon} trend="up" trendValue="+3.1%" description="vs last quarter" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <Card className="lg:col-span-3 xl:col-span-2"><CardHeader><CardTitle>Monthly Revenue Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={350}><AreaChart data={monthlyRevenueData}><defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} /><CartesianGrid strokeDasharray="3 3" className="stroke-gray-800" /><Tooltip contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem'}} cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }} /><Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} /></AreaChart></ResponsiveContainer></CardContent></Card>
                            <Card className="lg:col-span-3 xl:col-span-1"><CardHeader><CardTitle>Conversion Sources</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={350}><PieChart><Pie activeIndex={activeIndex} activeShape={ActiveShapePieChart} data={conversionSourceData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} fill="#8884d8" dataKey="value" onMouseEnter={(_, index) => setActiveIndex(index)}>{conversionSourceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Legend iconType="circle" layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{color: '#e2e8f0'}}/></PieChart></ResponsiveContainer></CardContent></Card>
                        </div>
                         <div className="grid grid-cols-1 gap-6 mb-8">
                             <Card><CardHeader><CardTitle>Campaign Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={350}><BarChart data={campaignPerformanceData}><CartesianGrid strokeDasharray="3 3" className="stroke-gray-800"/><XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#888" /><YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" fontSize={12} tickLine={false} axisLine={false} /><YAxis yAxisId="right" orientation="right" stroke="#0ea5e9" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} /><Tooltip contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem'}} /><Legend wrapperStyle={{color: '#e2e8f0'}} /><Bar yAxisId="left" dataKey="impressions" fill="#8b5cf6" radius={[4, 4, 0, 0]} /><Bar yAxisId="right" dataKey="ctr" fill="#0ea5e9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
                        </div>
                        <DataTable onAnalyze={handleAnalyzeCampaign} />
                    </main>
                </div>
            </div>
            <Modal isOpen={isAnalysisModalOpen} onClose={() => setAnalysisModalOpen(false)} title={`✨ AI Analysis: ${selectedCampaign?.name}`}>
                {isLoading ? <div className="flex items-center justify-center h-40"><Loader className="w-8 h-8 animate-spin text-indigo-500" /></div> : <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysisResult.replace(/\n/g, '<br />') }}></div>}
            </Modal>
            <Modal isOpen={isIdeasModalOpen} onClose={() => setIdeasModalOpen(false)} title="✨ Generate Campaign Ideas">
                <div className="space-y-4">
                    <Input type="text" placeholder="e.g., 'Launch new eco-friendly sneakers'" value={ideaTopic} onChange={(e) => setIdeaTopic(e.target.value)} />
                    <Button variant="primary" className="w-full gap-2" onClick={handleGenerateIdeas} disabled={isLoading || !ideaTopic.trim()}>{isLoading ? <><Loader className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Ideas'}</Button>
                    {ideasResult && <div className="prose prose-sm dark:prose-invert max-w-none mt-4 pt-4 border-t border-gray-800" dangerouslySetInnerHTML={{ __html: ideasResult.replace(/\n/g, '<br />') }}></div>}
                </div>
            </Modal>
        </div>
    );
}