'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    DollarSign, Users, MousePointerClick, TrendingUp, TrendingDown, 
    Target, Play, Pause, Copy, Edit, Trash2, Plus, Filter, Search,
    FileDown, Calendar, BarChart3, PieChart as PieChartIcon, Download, Sparkles,
    Eye, Settings, Upload, X, Save, AlertCircle, CheckCircle
} from 'lucide-react';
import { 
    Card, CardHeader, CardTitle, CardContent, CardDescription 
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { useTheme } from '../components/theme-provider';

// Mock Data for Campaigns
const mockCampaigns = [
    {
        id: 1,
        name: 'Summer Sale Blast 2024',
        status: 'Active',
        budget: 15000,
        spend: 12450,
        impressions: 850000,
        clicks: 25500,
        ctr: 3.0,
        conversions: 1275,
        cpa: 9.76,
        roi: 145.2,
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        targetAudience: 'Age 25-45, Fashion Enthusiasts',
        createdAt: '2024-06-25'
    },
    {
        id: 2,
        name: 'Back to School Campaign',
        status: 'Active',
        budget: 25000,
        spend: 18750,
        impressions: 1200000,
        clicks: 36000,
        ctr: 3.0,
        conversions: 1800,
        cpa: 10.42,
        roi: 165.8,
        startDate: '2024-08-01',
        endDate: '2024-08-31',
        targetAudience: 'Students & Parents, Age 18-50',
        createdAt: '2024-07-20'
    },
    {
        id: 3,
        name: 'Holiday Special Promo',
        status: 'Draft',
        budget: 30000,
        spend: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        cpa: 0,
        roi: 0,
        startDate: '2024-12-01',
        endDate: '2024-12-25',
        targetAudience: 'Gift Buyers, Age 25-65',
        createdAt: '2024-07-28'
    },
    {
        id: 4,
        name: 'Brand Awareness Push Q3',
        status: 'Paused',
        budget: 20000,
        spend: 8500,
        impressions: 2100000,
        clicks: 21000,
        ctr: 1.0,
        conversions: 315,
        cpa: 26.98,
        roi: 45.8,
        startDate: '2024-07-01',
        endDate: '2024-09-30',
        targetAudience: 'Broad Audience, Age 18-65',
        createdAt: '2024-06-15'
    },
    {
        id: 5,
        name: 'Lead Gen Form Campaign',
        status: 'Completed',
        budget: 8000,
        spend: 7850,
        impressions: 450000,
        clicks: 18000,
        ctr: 4.0,
        conversions: 2200,
        cpa: 3.57,
        roi: 280.5,
        startDate: '2024-06-01',
        endDate: '2024-06-30',
        targetAudience: 'B2B Decision Makers, Age 30-55',
        createdAt: '2024-05-25'
    },
    {
        id: 6,
        name: 'Mobile App Download Push',
        status: 'Active',
        budget: 12000,
        spend: 9200,
        impressions: 680000,
        clicks: 27200,
        ctr: 4.0,
        conversions: 1360,
        cpa: 6.76,
        roi: 195.3,
        startDate: '2024-07-15',
        endDate: '2024-08-15',
        targetAudience: 'Mobile Users, Age 18-40',
        createdAt: '2024-07-10'
    },
    {
        id: 7,
        name: 'Retargeting Campaign Q3',
        status: 'Active',
        budget: 10000,
        spend: 6300,
        impressions: 320000,
        clicks: 19200,
        ctr: 6.0,
        conversions: 960,
        cpa: 6.56,
        roi: 220.8,
        startDate: '2024-07-01',
        endDate: '2024-09-30',
        targetAudience: 'Website Visitors, Past 30 Days',
        createdAt: '2024-06-28'
    },
    {
        id: 8,
        name: 'Video Content Promotion',
        status: 'Paused',
        budget: 15000,
        spend: 4200,
        impressions: 890000,
        clicks: 8900,
        ctr: 1.0,
        conversions: 267,
        cpa: 15.73,
        roi: 75.2,
        startDate: '2024-07-10',
        endDate: '2024-08-10',
        targetAudience: 'Video Content Consumers, Age 18-45',
        createdAt: '2024-07-05'
    }
];

// Performance data for charts
const campaignPerformanceData = [
    { date: 'Jul 1', spend: 1250, conversions: 85, roi: 145 },
    { date: 'Jul 8', spend: 1800, conversions: 125, roi: 155 },
    { date: 'Jul 15', spend: 2200, conversions: 165, roi: 168 },
    { date: 'Jul 22', spend: 2800, conversions: 210, roi: 182 },
    { date: 'Jul 29', spend: 3200, conversions: 245, roi: 195 }
];

const budgetAllocationData = [
    { name: 'Summer Sale', value: 15000, color: 'hsl(220 70% 50%)' },
    { name: 'Back to School', value: 25000, color: 'hsl(142 76% 36%)' },
    { name: 'Brand Awareness', value: 20000, color: 'hsl(271 81% 56%)' },
    { name: 'Mobile App', value: 12000, color: 'hsl(25 95% 53%)' },
    { name: 'Retargeting', value: 10000, color: 'hsl(0 84% 60%)' }
];

const roiComparisonData = [
    { name: 'Lead Gen', roi: 280.5 },
    { name: 'Retargeting', roi: 220.8 },
    { name: 'Mobile App', roi: 195.3 },
    { name: 'Back to School', roi: 165.8 },
    { name: 'Summer Sale', roi: 145.2 }
];

// Campaign Form Component
const CampaignForm = ({ campaign, onSave, onClose, isLoading }) => {
    const [formData, setFormData] = useState({
        name: campaign?.name || '',
        budget: campaign?.budget || '',
        startDate: campaign?.startDate || '',
        endDate: campaign?.endDate || '',
        targetAudience: campaign?.targetAudience || '',
        status: campaign?.status || 'Draft'
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Campaign name is required';
        if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required';
        
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
            newErrors.endDate = 'End date must be after start date';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({ ...formData, id: campaign?.id || Date.now() });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Campaign Name
                    </label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter campaign name"
                        className={errors.name ? 'border-red-500' : ''}
                        style={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: errors.name ? 'hsl(0 84% 60%)' : 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Budget ($)
                    </label>
                    <Input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                        placeholder="0"
                        className={errors.budget ? 'border-red-500' : ''}
                        style={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: errors.budget ? 'hsl(0 84% 60%)' : 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Start Date
                    </label>
                    <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className={errors.startDate ? 'border-red-500' : ''}
                        style={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: errors.startDate ? 'hsl(0 84% 60%)' : 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        End Date
                    </label>
                    <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className={errors.endDate ? 'border-red-500' : ''}
                        style={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: errors.endDate ? 'hsl(0 84% 60%)' : 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Target Audience
                    </label>
                    <Input
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        placeholder="e.g., Age 25-45, Fashion Enthusiasts"
                        className={errors.targetAudience ? 'border-red-500' : ''}
                        style={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: errors.targetAudience ? 'hsl(0 84% 60%)' : 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    {errors.targetAudience && <p className="text-red-500 text-xs mt-1">{errors.targetAudience}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        style={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    style={{ borderColor: 'hsl(var(--border))' }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                >
                    {isLoading ? 'Saving...' : (campaign ? 'Update Campaign' : 'Create Campaign')}
                </Button>
            </div>
        </form>
    );
};

// Stat Cards Component
const CampaignStatCard = ({ title, value, icon: Icon, trend, trendValue, description }) => {
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

export default function CampaignsPage() {
    const { theme } = useTheme();
    const [campaigns, setCampaigns] = useState(mockCampaigns);
    const [filteredCampaigns, setFilteredCampaigns] = useState(mockCampaigns);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCampaigns, setSelectedCampaigns] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 8;

    // Filter campaigns based on search and status
    useEffect(() => {
        let filtered = campaigns.filter(campaign => {
            const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || campaign.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
        setFilteredCampaigns(filtered);
        setCurrentPage(1);
    }, [campaigns, searchTerm, statusFilter]);

    const paginatedCampaigns = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCampaigns, currentPage]);

    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
            case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
            case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const handleCampaignSave = async (campaignData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editingCampaign) {
                setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...campaignData, id: editingCampaign.id } : c));
            } else {
                setCampaigns(prev => [...prev, { ...campaignData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
            }
            
            setShowCreateModal(false);
            setEditingCampaign(null);
        } catch (error) {
            console.error('Error saving campaign:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkAction = (action) => {
        if (selectedCampaigns.length === 0) return;
        
        setCampaigns(prev => prev.map(campaign => {
            if (selectedCampaigns.includes(campaign.id)) {
                switch (action) {
                    case 'pause':
                        return { ...campaign, status: 'Paused' };
                    case 'resume':
                        return { ...campaign, status: 'Active' };
                    case 'duplicate':
                        // Add duplicated campaigns
                        return campaign;
                    default:
                        return campaign;
                }
            }
            return campaign;
        }));
        
        if (action === 'duplicate') {
            const duplicatedCampaigns = campaigns
                .filter(c => selectedCampaigns.includes(c.id))
                .map(c => ({ ...c, id: Date.now() + Math.random(), name: `${c.name} (Copy)`, status: 'Draft' }));
            setCampaigns(prev => [...prev, ...duplicatedCampaigns]);
        }
        
        setSelectedCampaigns([]);
    };

    const calculateTotalStats = () => {
        const activeCampaigns = campaigns.filter(c => c.status === 'Active');
        return {
            totalBudget: activeCampaigns.reduce((sum, c) => sum + c.budget, 0),
            totalSpend: activeCampaigns.reduce((sum, c) => sum + c.spend, 0),
            totalConversions: activeCampaigns.reduce((sum, c) => sum + c.conversions, 0),
            averageROI: activeCampaigns.length > 0 ? activeCampaigns.reduce((sum, c) => sum + c.roi, 0) / activeCampaigns.length : 0
        };
    };

    const stats = calculateTotalStats();

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Campaign Management
                    </h1>
                    <p style={{ color: 'hsl(var(--muted))' }}>
                        Create, manage, and optimize your marketing campaigns
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                >
                    <Plus className="w-4 h-4" />
                    New Campaign
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CampaignStatCard
                    title="Total Budget"
                    value={`$${stats.totalBudget.toLocaleString()}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="12%"
                    description="allocated"
                />
                <CampaignStatCard
                    title="Total Spend"
                    value={`$${stats.totalSpend.toLocaleString()}`}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="8%"
                    description="this month"
                />
                <CampaignStatCard
                    title="Total Conversions"
                    value={stats.totalConversions.toLocaleString()}
                    icon={Target}
                    trend="up"
                    trendValue="15%"
                    description="this month"
                />
                <CampaignStatCard
                    title="Average ROI"
                    value={`${stats.averageROI.toFixed(1)}%`}
                    icon={BarChart3}
                    trend="up"
                    trendValue="5%"
                    description="improvement"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Over Time */}
                <Card className="lg:col-span-2 rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border"
                      style={{ 
                          backgroundColor: `hsl(var(--card) / 0.5)`, 
                          borderColor: `hsl(var(--border) / 0.3)`
                      }}>
                    <CardHeader>
                        <CardTitle style={{ color: 'hsl(var(--foreground))' }}>Campaign Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={campaignPerformanceData}>
                                <defs>
                                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="date" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    style={{ fill: 'hsl(var(--muted))' }}
                                />
                                <YAxis 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    style={{ fill: 'hsl(var(--muted))' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))', 
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        color: 'hsl(var(--foreground))'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="spend" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#spendGradient)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Budget Allocation */}
                <Card className="rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border"
                      style={{ 
                          backgroundColor: `hsl(var(--card) / 0.5)`, 
                          borderColor: `hsl(var(--border) / 0.3)`
                      }}>
                    <CardHeader>
                        <CardTitle style={{ color: 'hsl(var(--foreground))' }}>Budget Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={budgetAllocationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={(entry) => {
                                        const { name, percent, x, y } = entry;
                                        return (
                                            <text 
                                                x={x} 
                                                y={y} 
                                                fill={theme === 'dark' ? 'white' : 'black'} 
                                                textAnchor={x > entry.cx ? 'start' : 'end'} 
                                                dominantBaseline="central"
                                                fontSize="12px"
                                                fontWeight="500"
                                            >
                                                {`${name} ${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                    labelLine={false}
                                >
                                    {budgetAllocationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))', 
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        color: theme === 'dark' ? 'white' : 'black'
                                    }}
                                    labelStyle={{
                                        color: theme === 'dark' ? 'white' : 'black'
                                    }}
                                    itemStyle={{
                                        color: theme === 'dark' ? 'white' : 'black'
                                    }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Budget']}
                                />
                                <Legend 
                                    wrapperStyle={{
                                        color: theme === 'dark' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ROI Comparison Chart */}
            <Card className="rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border"
                  style={{ 
                      backgroundColor: `hsl(var(--card) / 0.5)`, 
                      borderColor: `hsl(var(--border) / 0.3)`
                  }}>
                <CardHeader>
                    <CardTitle style={{ color: 'hsl(var(--foreground))' }}>ROI Comparison by Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={roiComparisonData}>
                            <XAxis 
                                dataKey="name" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                style={{ fill: 'hsl(var(--muted))' }}
                            />
                            <YAxis 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                style={{ fill: 'hsl(var(--muted))' }}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? 'hsl(var(--card))' : 'hsl(var(--card))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value) => [`${value}%`, 'ROI']}
                            />
                            <Bar 
                                dataKey="roi" 
                                fill="hsl(var(--success))" 
                                radius={[4, 4, 0, 0]} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Campaigns Table */}
            <Card className="rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border"
                  style={{ 
                      backgroundColor: `hsl(var(--card) / 0.5)`, 
                      borderColor: `hsl(var(--border) / 0.3)`
                  }}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle style={{ color: 'hsl(var(--foreground))' }}>Campaign Performance</CardTitle>
                            <CardDescription style={{ color: 'hsl(var(--muted))' }}>
                                Manage and monitor all your campaigns in one place
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setShowFilters(!showFilters)}
                                style={{ borderColor: 'hsl(var(--border))' }}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                            {selectedCampaigns.length > 0 && (
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleBulkAction('pause')}
                                    >
                                        <Pause className="w-4 h-4 mr-2" />
                                        Pause
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleBulkAction('resume')}
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Resume
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleBulkAction('duplicate')}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Duplicate
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {showFilters && (
                        <div className="flex gap-4 p-4 rounded-lg border mt-4"
                             style={{ 
                                 backgroundColor: 'hsl(var(--card-hover))', 
                                 borderColor: 'hsl(var(--border))'
                             }}>
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
                                       style={{ color: 'hsl(var(--muted))' }} />
                                <Input
                                    placeholder="Search campaigns..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    style={{ 
                                        backgroundColor: 'hsl(var(--card))', 
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm min-w-[120px]"
                                style={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))'
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="draft">Draft</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    )}
                </CardHeader>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs uppercase"
                               style={{ 
                                   color: 'hsl(var(--muted))', 
                                   backgroundColor: 'hsl(var(--card-hover))'
                               }}>
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedCampaigns(filteredCampaigns.map(c => c.id));
                                            } else {
                                                setSelectedCampaigns([]);
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left font-medium">Campaign</th>
                                <th className="px-6 py-4 text-left font-medium">Status</th>
                                <th className="px-6 py-4 text-left font-medium">Budget</th>
                                <th className="px-6 py-4 text-left font-medium">Spend</th>
                                <th className="px-6 py-4 text-left font-medium">Impressions</th>
                                <th className="px-6 py-4 text-left font-medium">Clicks</th>
                                <th className="px-6 py-4 text-left font-medium">CTR</th>
                                <th className="px-6 py-4 text-left font-medium">Conversions</th>
                                <th className="px-6 py-4 text-left font-medium">CPA</th>
                                <th className="px-6 py-4 text-left font-medium">ROI</th>
                                <th className="px-6 py-4 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCampaigns.map(campaign => (
                                <tr key={campaign.id} 
                                    className="transition-colors hover:opacity-80"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'hsl(var(--card-hover))';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCampaigns.includes(campaign.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedCampaigns(prev => [...prev, campaign.id]);
                                                } else {
                                                    setSelectedCampaigns(prev => prev.filter(id => id !== campaign.id));
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                {campaign.name}
                                            </div>
                                            <div className="text-xs" style={{ color: 'hsl(var(--muted))' }}>
                                                {campaign.targetAudience}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                        ${campaign.budget.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                        ${campaign.spend.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                        {campaign.impressions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                        {campaign.clicks.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                        {campaign.ctr.toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                        {campaign.conversions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'hsl(var(--muted))' }}>
                                        ${campaign.cpa.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${campaign.roi > 100 ? 'text-green-600' : 'text-red-600'}`}>
                                            {campaign.roi.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => setEditingCampaign(campaign)}
                                                className="hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="flex justify-between items-center p-4">
                    <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
                    </span>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Create/Edit Campaign Modal */}
            <Modal 
                isOpen={showCreateModal || !!editingCampaign} 
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingCampaign(null);
                }} 
                title={editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            >
                <CampaignForm
                    campaign={editingCampaign}
                    onSave={handleCampaignSave}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingCampaign(null);
                    }}
                    isLoading={isLoading}
                />
            </Modal>
        </div>
    );
}
