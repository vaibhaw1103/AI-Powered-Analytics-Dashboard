'use client';

import React, { useState, useEffect } from 'react';
import { 
    User, Mail, Lock, Bell, Shield, Globe, CreditCard, 
    Users, Download, Upload, Key, Smartphone, Monitor,
    Trash2, Edit, Save, X, Check, AlertCircle, Eye,
    EyeOff, Camera, Settings as SettingsIcon, Palette,
    Moon, Sun, Languages, Clock, MapPin, Zap, Brain
} from 'lucide-react';
import { 
    Card, CardHeader, CardTitle, CardContent, CardDescription 
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Modal } from './ui/modal';
import { useTheme } from './theme-provider';
import { AISettingsSection } from './ai-settings';

// Mock user data
const userData = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@admybrand.com',
    avatar: 'https://i.pravatar.cc/150?u=john.doe',
    role: 'Admin',
    joinDate: '2023-03-15',
    lastLogin: '2024-07-29T10:30:00Z',
    timezone: 'America/New_York',
    language: 'en-US'
};

// Mock settings data
const settingsData = {
    notifications: {
        email: true,
        push: true,
        sms: false,
        campaignAlerts: true,
        weeklyReports: true,
        systemUpdates: false
    },
    privacy: {
        profileVisible: true,
        showEmail: false,
        trackingEnabled: true,
        analyticsSharing: true
    },
    preferences: {
        theme: 'system',
        language: 'en-US',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD'
    }
};

// Mock team data
const teamMembers = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@admybrand.com',
        role: 'Marketing Manager',
        status: 'active',
        lastActive: '2024-07-29T09:15:00Z',
        permissions: ['campaigns', 'analytics', 'reports']
    },
    {
        id: 2,
        name: 'Mike Chen',
        email: 'mike.chen@admybrand.com',
        role: 'Data Analyst',
        status: 'active',
        lastActive: '2024-07-29T08:45:00Z',
        permissions: ['analytics', 'reports']
    },
    {
        id: 3,
        name: 'Emily Davis',
        email: 'emily.davis@admybrand.com',
        role: 'Campaign Specialist',
        status: 'inactive',
        lastActive: '2024-07-28T16:20:00Z',
        permissions: ['campaigns']
    }
];

// Mock connected devices
const connectedDevices = [
    {
        id: 1,
        name: 'MacBook Pro',
        type: 'desktop',
        browser: 'Chrome 126.0',
        location: 'New York, NY',
        lastActive: '2024-07-29T10:30:00Z',
        current: true
    },
    {
        id: 2,
        name: 'iPhone 15',
        type: 'mobile',
        browser: 'Safari Mobile',
        location: 'New York, NY',
        lastActive: '2024-07-29T08:15:00Z',
        current: false
    },
    {
        id: 3,
        name: 'iPad Air',
        type: 'tablet',
        browser: 'Safari 17.0',
        location: 'Brooklyn, NY',
        lastActive: '2024-07-28T19:45:00Z',
        current: false
    }
];

// Mock integrations
const availableIntegrations = [
    {
        id: 'google-analytics',
        name: 'Google Analytics',
        description: 'Connect your Google Analytics account for enhanced reporting',
        icon: '📊',
        connected: true,
        status: 'active'
    },
    {
        id: 'facebook-ads',
        name: 'Facebook Ads',
        description: 'Import campaign data from Facebook Ads Manager',
        icon: '📘',
        connected: true,
        status: 'active'
    },
    {
        id: 'google-ads',
        name: 'Google Ads',
        description: 'Sync your Google Ads campaigns and performance data',
        icon: '🔍',
        connected: false,
        status: 'available'
    },
    {
        id: 'linkedin-ads',
        name: 'LinkedIn Ads',
        description: 'Connect LinkedIn Campaign Manager for B2B insights',
        icon: '💼',
        connected: false,
        status: 'available'
    },
    {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Import email marketing data and audience insights',
        icon: '📧',
        connected: true,
        status: 'error'
    },
    {
        id: 'shopify',
        name: 'Shopify',
        description: 'Connect your Shopify store for e-commerce tracking',
        icon: '🛒',
        connected: false,
        status: 'available'
    }
];

// Section Component
const SettingsSection = ({ title, description, children, icon: Icon }) => {
    return (
        <Card className="rounded-lg glass-card hover:glass-card-hover transition-all duration-300 border"
              style={{ 
                  backgroundColor: `hsl(var(--card) / 0.5)`, 
                  borderColor: `hsl(var(--border) / 0.3)`
              }}>
            <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ color: 'hsl(var(--foreground))' }}>
                    {Icon && <Icon className="w-5 h-5 text-violet-500" />}
                    {title}
                </CardTitle>
                {description && (
                    <CardDescription style={{ color: 'hsl(var(--muted))' }}>
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label, description }) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-opacity-80 transition-colors"
             style={{ backgroundColor: 'hsl(var(--card-hover))' }}>
            <div className="flex-1">
                <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    {label}
                </div>
                {description && (
                    <div className="text-sm mt-1" style={{ color: 'hsl(var(--muted))' }}>
                        {description}
                    </div>
                )}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    checked ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [userProfile, setUserProfile] = useState(userData);
    const [settings, setSettings] = useState(settingsData);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'preferences', name: 'Preferences', icon: SettingsIcon },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'ai', name: 'AI Integration', icon: Brain },
        { id: 'integrations', name: 'Integrations', icon: Zap },
        { id: 'team', name: 'Team', icon: Users },
        { id: 'billing', name: 'Billing', icon: CreditCard },
        { id: 'data', name: 'Data', icon: Download }
    ];

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.new !== passwordData.confirm) {
            alert('New passwords do not match');
            return;
        }
        
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowPasswordModal(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } finally {
            setIsSaving(false);
        }
    };

    const updateNotificationSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const updatePreferenceSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value
            }
        }));
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="Personal Information"
                            description="Update your personal details and profile information"
                            icon={User}
                        >
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img 
                                            src={userProfile.avatar} 
                                            alt="Profile" 
                                            className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg" 
                                        />
                                        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white hover:bg-violet-600 transition-colors">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg" style={{ color: 'hsl(var(--foreground))' }}>
                                            {userProfile.name}
                                        </h3>
                                        <p style={{ color: 'hsl(var(--muted))' }}>
                                            {userProfile.role} • Joined {new Date(userProfile.joinDate).toLocaleDateString()}
                                        </p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload New Photo
                                        </Button>
                                    </div>
                                </div>

                                {/* Profile Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                                            Full Name
                                        </label>
                                        <Input
                                            value={userProfile.name}
                                            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                                            disabled={!isEditing}
                                            style={{ 
                                                backgroundColor: 'hsl(var(--card))', 
                                                borderColor: 'hsl(var(--border))',
                                                color: 'hsl(var(--foreground))'
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                                            Email Address
                                        </label>
                                        <Input
                                            type="email"
                                            value={userProfile.email}
                                            onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={!isEditing}
                                            style={{ 
                                                backgroundColor: 'hsl(var(--card))', 
                                                borderColor: 'hsl(var(--border))',
                                                color: 'hsl(var(--foreground))'
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                                            Role
                                        </label>
                                        <Input
                                            value={userProfile.role}
                                            disabled
                                            style={{ 
                                                backgroundColor: 'hsl(var(--card-hover))', 
                                                borderColor: 'hsl(var(--border))',
                                                color: 'hsl(var(--muted))'
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                                            Last Login
                                        </label>
                                        <Input
                                            value={new Date(userProfile.lastLogin).toLocaleString()}
                                            disabled
                                            style={{ 
                                                backgroundColor: 'hsl(var(--card-hover))', 
                                                borderColor: 'hsl(var(--border))',
                                                color: 'hsl(var(--muted))'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)} className="gap-2">
                                            <Edit className="w-4 h-4" />
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <>
                                            <Button 
                                                onClick={handleSaveProfile} 
                                                disabled={isSaving}
                                                className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                                            >
                                                <Save className="w-4 h-4" />
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => setIsEditing(false)}
                                                disabled={isSaving}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SettingsSection>
                    </div>
                );

            case 'preferences':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="Display Preferences"
                            description="Customize your dashboard appearance and behavior"
                            icon={Palette}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg"
                                     style={{ backgroundColor: 'hsl(var(--card-hover))' }}>
                                    <div className="flex items-center gap-3">
                                        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                        <div>
                                            <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                Theme
                                            </div>
                                            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                Choose your preferred color scheme
                                            </div>
                                        </div>
                                    </div>
                                    <select
                                        value={settings.preferences.theme}
                                        onChange={(e) => {
                                            updatePreferenceSetting('theme', e.target.value);
                                            if (e.target.value !== 'system') {
                                                // Apply theme change
                                                if (e.target.value !== theme) toggleTheme();
                                            }
                                        }}
                                        className="px-3 py-2 border rounded-md text-sm"
                                        style={{ 
                                            backgroundColor: 'hsl(var(--card))', 
                                            borderColor: 'hsl(var(--border))',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg"
                                     style={{ backgroundColor: 'hsl(var(--card-hover))' }}>
                                    <div className="flex items-center gap-3">
                                        <Languages className="w-5 h-5" />
                                        <div>
                                            <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                Language
                                            </div>
                                            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                Select your preferred language
                                            </div>
                                        </div>
                                    </div>
                                    <select
                                        value={settings.preferences.language}
                                        onChange={(e) => updatePreferenceSetting('language', e.target.value)}
                                        className="px-3 py-2 border rounded-md text-sm"
                                        style={{ 
                                            backgroundColor: 'hsl(var(--card))', 
                                            borderColor: 'hsl(var(--border))',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                    >
                                        <option value="en-US">English (US)</option>
                                        <option value="en-GB">English (UK)</option>
                                        <option value="es-ES">Spanish</option>
                                        <option value="fr-FR">French</option>
                                        <option value="de-DE">German</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg"
                                     style={{ backgroundColor: 'hsl(var(--card-hover))' }}>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5" />
                                        <div>
                                            <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                Timezone
                                            </div>
                                            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                Set your local timezone
                                            </div>
                                        </div>
                                    </div>
                                    <select
                                        value={settings.preferences.timezone}
                                        onChange={(e) => updatePreferenceSetting('timezone', e.target.value)}
                                        className="px-3 py-2 border rounded-md text-sm"
                                        style={{ 
                                            backgroundColor: 'hsl(var(--card))', 
                                            borderColor: 'hsl(var(--border))',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                    >
                                        <option value="America/New_York">Eastern Time</option>
                                        <option value="America/Chicago">Central Time</option>
                                        <option value="America/Denver">Mountain Time</option>
                                        <option value="America/Los_Angeles">Pacific Time</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>
                            </div>
                        </SettingsSection>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="Notification Preferences"
                            description="Control how and when you receive notifications"
                            icon={Bell}
                        >
                            <div className="space-y-2">
                                <ToggleSwitch
                                    checked={settings.notifications.email}
                                    onChange={(value) => updateNotificationSetting('email', value)}
                                    label="Email Notifications"
                                    description="Receive notifications via email"
                                />
                                <ToggleSwitch
                                    checked={settings.notifications.push}
                                    onChange={(value) => updateNotificationSetting('push', value)}
                                    label="Push Notifications"
                                    description="Receive browser push notifications"
                                />
                                <ToggleSwitch
                                    checked={settings.notifications.sms}
                                    onChange={(value) => updateNotificationSetting('sms', value)}
                                    label="SMS Notifications"
                                    description="Receive critical alerts via SMS"
                                />
                                <ToggleSwitch
                                    checked={settings.notifications.campaignAlerts}
                                    onChange={(value) => updateNotificationSetting('campaignAlerts', value)}
                                    label="Campaign Alerts"
                                    description="Get notified about campaign performance changes"
                                />
                                <ToggleSwitch
                                    checked={settings.notifications.weeklyReports}
                                    onChange={(value) => updateNotificationSetting('weeklyReports', value)}
                                    label="Weekly Reports"
                                    description="Receive weekly performance summaries"
                                />
                                <ToggleSwitch
                                    checked={settings.notifications.systemUpdates}
                                    onChange={(value) => updateNotificationSetting('systemUpdates', value)}
                                    label="System Updates"
                                    description="Get notified about platform updates and maintenance"
                                />
                            </div>
                        </SettingsSection>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="Account Security"
                            description="Manage your account security settings and connected devices"
                            icon={Shield}
                        >
                            <div className="space-y-6">
                                {/* Password Change */}
                                <div className="flex items-center justify-between p-4 rounded-lg border"
                                     style={{ 
                                         backgroundColor: 'hsl(var(--card-hover))', 
                                         borderColor: 'hsl(var(--border))'
                                     }}>
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-5 h-5 text-violet-500" />
                                        <div>
                                            <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                Password
                                            </div>
                                            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                Last changed 3 months ago
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                                        Change Password
                                    </Button>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div className="flex items-center justify-between p-4 rounded-lg border"
                                     style={{ 
                                         backgroundColor: 'hsl(var(--card-hover))', 
                                         borderColor: 'hsl(var(--border))'
                                     }}>
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-violet-500" />
                                        <div>
                                            <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                Two-Factor Authentication
                                            </div>
                                            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                Add an extra layer of security to your account
                                            </div>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowTwoFactorModal(true)}
                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                    >
                                        Enable 2FA
                                    </Button>
                                </div>

                                {/* Connected Devices */}
                                <div>
                                    <h4 className="font-medium mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                                        Connected Devices
                                    </h4>
                                    <div className="space-y-3">
                                        {connectedDevices.map((device) => (
                                            <div key={device.id} 
                                                 className="flex items-center justify-between p-3 rounded-lg border"
                                                 style={{ 
                                                     backgroundColor: 'hsl(var(--card-hover))', 
                                                     borderColor: 'hsl(var(--border))'
                                                 }}>
                                                <div className="flex items-center gap-3">
                                                    {device.type === 'desktop' && <Monitor className="w-5 h-5" />}
                                                    {device.type === 'mobile' && <Smartphone className="w-5 h-5" />}
                                                    {device.type === 'tablet' && <div className="w-5 h-5 border rounded" />}
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2" 
                                                             style={{ color: 'hsl(var(--foreground))' }}>
                                                            {device.name}
                                                            {device.current && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                            {device.browser} • {device.location} • Last active {new Date(device.lastActive).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                {!device.current && (
                                                    <Button variant="ghost" size="sm" className="text-red-500">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SettingsSection>
                    </div>
                );

            case 'ai':
                return (
                    <div className="space-y-6">
                        <AISettingsSection />
                    </div>
                );

            case 'integrations':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="API Integrations"
                            description="Connect external services to enhance your analytics"
                            icon={Zap}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableIntegrations.map((integration) => (
                                    <div key={integration.id} 
                                         className="p-4 rounded-lg border transition-all duration-300 hover:shadow-md"
                                         style={{ 
                                             backgroundColor: 'hsl(var(--card-hover))', 
                                             borderColor: 'hsl(var(--border))'
                                         }}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{integration.icon}</span>
                                                <div>
                                                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                        {integration.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            integration.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            integration.status === 'error' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {integration.connected ? 
                                                                (integration.status === 'error' ? 'Error' : 'Connected') : 
                                                                'Available'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {integration.connected ? (
                                                <div className="flex gap-2">
                                                    {integration.status === 'error' && (
                                                        <Button variant="outline" size="sm" className="text-yellow-600">
                                                            Reconnect
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" size="sm" className="text-red-600">
                                                        Disconnect
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="text-violet-600 border-violet-600 hover:bg-violet-50"
                                                >
                                                    Connect
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                            {integration.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SettingsSection>
                    </div>
                );

            case 'team':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="Team Management"
                            description="Manage team members and their permissions"
                            icon={Users}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                        Team Members ({teamMembers.length})
                                    </h4>
                                    <Button className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
                                        <Users className="w-4 h-4" />
                                        Invite Member
                                    </Button>
                                </div>
                                
                                <div className="space-y-3">
                                    {teamMembers.map((member) => (
                                        <div key={member.id} 
                                             className="flex items-center justify-between p-4 rounded-lg border"
                                             style={{ 
                                                 backgroundColor: 'hsl(var(--card-hover))', 
                                                 borderColor: 'hsl(var(--border))'
                                             }}>
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={`https://i.pravatar.cc/150?u=${member.email}`} 
                                                    alt={member.name} 
                                                    className="w-10 h-10 rounded-full object-cover" 
                                                />
                                                <div>
                                                    <div className="font-medium flex items-center gap-2" 
                                                         style={{ color: 'hsl(var(--foreground))' }}>
                                                        {member.name}
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {member.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                        {member.email} • {member.role}
                                                    </div>
                                                    <div className="text-xs" style={{ color: 'hsl(var(--muted))' }}>
                                                        Permissions: {member.permissions.join(', ')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SettingsSection>
                    </div>
                );

            case 'billing':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="Billing & Subscription"
                            description="Manage your subscription and billing information"
                            icon={CreditCard}
                        >
                            <div className="space-y-6">
                                {/* Current Plan */}
                                <div className="p-6 rounded-lg border bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20"
                                     style={{ borderColor: 'hsl(var(--border))' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                                                Professional Plan
                                            </h4>
                                            <p style={{ color: 'hsl(var(--muted))' }}>
                                                $99/month • Renews on August 15, 2024
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-violet-600">$99</div>
                                            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>per month</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline">Change Plan</Button>
                                        <Button variant="outline" className="text-red-600">Cancel Subscription</Button>
                                    </div>
                                </div>

                                {/* Billing History */}
                                <div>
                                    <h4 className="font-medium mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                                        Billing History
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            { date: '2024-07-15', amount: 99, status: 'paid', invoice: 'INV-2024-0715' },
                                            { date: '2024-06-15', amount: 99, status: 'paid', invoice: 'INV-2024-0615' },
                                            { date: '2024-05-15', amount: 99, status: 'paid', invoice: 'INV-2024-0515' }
                                        ].map((bill, index) => (
                                            <div key={index} 
                                                 className="flex items-center justify-between p-3 rounded-lg border"
                                                 style={{ 
                                                     backgroundColor: 'hsl(var(--card-hover))', 
                                                     borderColor: 'hsl(var(--border))'
                                                 }}>
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                            ${bill.amount}
                                                        </div>
                                                        <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                                            {new Date(bill.date).toLocaleDateString()} • {bill.invoice}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                                        Paid
                                                    </span>
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SettingsSection>
                    </div>
                );

            case 'data':
                return (
                    <div className="space-y-6">
                        <SettingsSection
                            title="Data Management"
                            description="Export, import, and manage your data"
                            icon={Download}
                        >
                            <div className="space-y-6">
                                {/* Data Export */}
                                <div>
                                    <h4 className="font-medium mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                                        Export Data
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { name: 'Campaign Data', description: 'All campaign performance metrics and settings' },
                                            { name: 'Analytics Data', description: 'Traffic, conversions, and user behavior data' },
                                            { name: 'User Data', description: 'Account information and preferences' },
                                            { name: 'Complete Backup', description: 'Full account backup including all data' }
                                        ].map((item, index) => (
                                            <div key={index} 
                                                 className="p-4 rounded-lg border"
                                                 style={{ 
                                                     backgroundColor: 'hsl(var(--card-hover))', 
                                                     borderColor: 'hsl(var(--border))'
                                                 }}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h5 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                                                            {item.name}
                                                        </h5>
                                                        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted))' }}>
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Export
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Data Import */}
                                <div>
                                    <h4 className="font-medium mb-4" style={{ color: 'hsl(var(--foreground))' }}>
                                        Import Data
                                    </h4>
                                    <div className="p-6 border-2 border-dashed rounded-lg text-center"
                                         style={{ borderColor: 'hsl(var(--border))' }}>
                                        <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--muted))' }} />
                                        <h5 className="font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                                            Import Campaign Data
                                        </h5>
                                        <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted))' }}>
                                            Upload CSV or JSON files to import campaign data
                                        </p>
                                        <Button className="gap-2">
                                            <Upload className="w-4 h-4" />
                                            Choose File
                                        </Button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="p-6 rounded-lg border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                                    <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">
                                        Danger Zone
                                    </h4>
                                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                                        These actions are irreversible. Please proceed with caution.
                                    </p>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                            Delete All Data
                                        </Button>
                                        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                            Delete Account
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </SettingsSection>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                        Settings
                    </h1>
                    <p style={{ color: 'hsl(var(--muted))' }}>
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Settings Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <Card className="rounded-lg glass-card transition-all duration-300 border"
                              style={{ 
                                  backgroundColor: `hsl(var(--card) / 0.5)`, 
                                  borderColor: `hsl(var(--border) / 0.3)`
                              }}>
                            <CardContent className="p-2">
                                <nav className="space-y-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                                                activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                                                    : 'hover:bg-opacity-80'
                                            }`}
                                            style={activeTab !== tab.id ? { 
                                                color: 'hsl(var(--muted))',
                                                ':hover': { 
                                                    backgroundColor: 'hsl(var(--card-hover))',
                                                    color: 'hsl(var(--foreground))'
                                                }
                                            } : {}}
                                            onMouseEnter={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = 'hsl(var(--card-hover))';
                                                    e.target.style.color = 'hsl(var(--foreground))';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (activeTab !== tab.id) {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = 'hsl(var(--muted))';
                                                }
                                            }}
                                        >
                                            <tab.icon className="w-5 h-5" />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Settings Content */}
                    <div className="flex-1">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            <Modal 
                isOpen={showPasswordModal} 
                onClose={() => setShowPasswordModal(false)} 
                title="Change Password"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                            Current Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={passwordData.current}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                style={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: 'hsl(var(--muted))' }}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                            New Password
                        </label>
                        <Input
                            type="password"
                            value={passwordData.new}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                            style={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                            Confirm New Password
                        </label>
                        <Input
                            type="password"
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                            style={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowPasswordModal(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePasswordChange}
                            disabled={isSaving || !passwordData.current || !passwordData.new || !passwordData.confirm}
                            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                        >
                            {isSaving ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Two-Factor Authentication Modal */}
            <Modal 
                isOpen={showTwoFactorModal} 
                onClose={() => setShowTwoFactorModal(false)} 
                title="Enable Two-Factor Authentication"
            >
                <div className="space-y-6 text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>QR Code</div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                            Scan with your authenticator app
                        </h3>
                        <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                            Use Google Authenticator, Authy, or any TOTP-compatible app to scan this QR code.
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                            Enter verification code
                        </label>
                        <Input
                            type="text"
                            placeholder="000000"
                            className="text-center text-lg tracking-widest"
                            style={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowTwoFactorModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
                            Enable 2FA
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
