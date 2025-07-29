'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Target, BarChart3, Settings, ChevronLeft, ChevronRight,
    Sun, Moon, Search, Menu, Sparkles, User, LogOut, Bell, HelpCircle,
    ChevronDown
} from 'lucide-react';
import EnhancedDashboardClient from './enhanced-dashboard-client';
import CampaignsPage from './campaigns-page';
import AnalyticsPage from './analytics-page';
import SettingsPage from './settings-page';
import { NotificationPanel } from './notification-panel';
import { HelpSupportModal } from './help-support-modal';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { Input } from './ui/input';

const NavigationWrapper = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const profileDropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, component: EnhancedDashboardClient },
        { id: 'campaigns', name: 'Campaigns', icon: Target, component: CampaignsPage },
        { id: 'analytics', name: 'Analytics', icon: BarChart3, component: AnalyticsPage },
        { id: 'settings', name: 'Settings', icon: Settings, component: SettingsPage }
    ];

    const renderPage = () => {
        const currentItem = navItems.find(item => item.id === currentPage);
        if (currentItem) {
            const Component = currentItem.component;
            return <Component />;
        }
        return <EnhancedDashboardClient />;
    };

    return (
        <div className="min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
             style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
            
            {/* Mobile overlay */}
            <div className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                 onClick={() => setSidebarOpen(false)}></div>
            
            {/* Mobile sidebar */}
            <aside className={`fixed z-40 h-full border-r shadow-xl flex flex-col transition-all duration-300 lg:hidden glass-card ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}
                   style={{ 
                       backgroundColor: `hsl(var(--card) / 0.5)`, 
                       borderColor: `hsl(var(--border) / 0.3)` 
                   }}>
                <div className="flex items-center h-20 px-6 border-b"
                     style={{ 
                         borderColor: `hsl(var(--border) / 0.3)`,
                         backgroundColor: `hsl(var(--card) / 0.7)`
                     }}>
                    <a href="#" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                             style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}>
                            A
                        </div>
                        <span className="text-xl font-bold" style={{ color: `hsl(var(--foreground))` }}>ADmyBRAND</span>
                    </a>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => (
                        <div key={item.id} className="relative group">
                            <button 
                                onClick={() => {
                                    setCurrentPage(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 rounded-xl p-3 transition-all duration-300 hover:scale-105`}
                                style={currentPage === item.id ? 
                                    { 
                                        background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
                                        color: 'white'
                                    } :
                                    { color: theme === 'dark' ? 'white' : `hsl(var(--muted))` }
                                }
                                onMouseEnter={(e) => {
                                    if (currentPage !== item.id) {
                                        e.target.style.backgroundColor = `hsl(var(--card-hover))`;
                                        e.target.style.color = `hsl(var(--foreground))`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== item.id) {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = theme === 'dark' ? 'white' : `hsl(var(--muted))`;
                                    }
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </button>
                        </div>
                    ))}
                </nav>
            </aside>
            
            {/* Desktop Sidebar Navigation */}
            <aside className={`fixed z-40 h-full border-r shadow-xl flex-col transition-all duration-300 glass-card hidden lg:flex ${isCollapsed ? 'w-16' : 'w-64'}`}
                   style={{ 
                       backgroundColor: `hsl(var(--card) / 0.5)`, 
                       borderColor: `hsl(var(--border) / 0.3)` 
                   }}>
                <div className="flex items-center h-20 px-6 border-b justify-between"
                     style={{ 
                         borderColor: `hsl(var(--border) / 0.3)`,
                         backgroundColor: `hsl(var(--card) / 0.7)`
                     }}>
                    {!isCollapsed && (
                        <a href="#" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                                 style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}>
                                A
                            </div>
                            <span className="text-xl font-bold" style={{ color: `hsl(var(--foreground))` }}>ADmyBRAND</span>
                        </a>
                    )}
                    {isCollapsed && (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                             style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))` }}>
                            A
                        </div>
                    )}
                    <div className="ml-auto">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 rounded-md transition-all duration-300 hover:scale-105"
                            style={{ 
                                backgroundColor: `hsl(var(--card))`,
                                color: `hsl(var(--muted))`
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = `hsl(var(--card-hover))`;
                                e.target.style.color = `hsl(var(--foreground))`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = `hsl(var(--card))`;
                                e.target.style.color = `hsl(var(--muted))`;
                            }}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => (
                        <div key={item.id} className="relative group">
                            <button 
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full flex items-center rounded-xl p-3 transition-all duration-300 hover:scale-105 ${isCollapsed ? 'justify-center' : 'gap-4'}`}
                                style={currentPage === item.id ? 
                                    { 
                                        background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
                                        color: 'white'
                                    } :
                                    { color: theme === 'dark' ? 'white' : `hsl(var(--muted))` }
                                }
                                onMouseEnter={(e) => {
                                    if (currentPage !== item.id) {
                                        e.target.style.backgroundColor = `hsl(var(--card-hover))`;
                                        e.target.style.color = `hsl(var(--foreground))`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== item.id) {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = theme === 'dark' ? 'white' : `hsl(var(--muted))`;
                                    }
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                {!isCollapsed && <span className="font-medium">{item.name}</span>}
                            </button>
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 whitespace-nowrap glass-card"
                                     style={{ 
                                         backgroundColor: `hsl(var(--card) / 0.9)`, 
                                         borderColor: `hsl(var(--border) / 0.3)`,
                                         border: '1px solid',
                                         color: `hsl(var(--foreground))`
                                     }}>
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
                {/* Header */}
                <header className="sticky top-0 z-50 h-16 border-b flex items-center justify-between px-4 shadow-xl backdrop-blur-lg"
                        style={{ 
                            background: theme === 'dark' ? `hsla(240, 15%, 8%, 0.8)` : `hsla(0, 0%, 100%, 0.8)`,
                            borderColor: theme === 'dark' ? `hsla(240, 15%, 20%, 0.3)` : `hsla(220, 15%, 90%, 0.5)`,
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} 
                                className={`lg:hidden p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                                    theme === 'dark' 
                                        ? 'text-white/90 hover:bg-white/10' 
                                        : 'text-gray-700 hover:bg-black/10'
                                }`}>
                            <Menu className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center px-3">
                        <div className="relative max-w-sm w-full">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                                theme === 'dark' ? 'text-white/60' : 'text-gray-500'
                            }`} />
                            <Input 
                                type="text" 
                                placeholder="Search campaigns, metrics..." 
                                className={`pl-10 w-full transition-all duration-300 backdrop-blur-sm rounded-lg h-9 ${
                                    theme === 'dark' 
                                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:bg-white/10'
                                        : 'bg-black/5 border-black/10 text-gray-900 placeholder:text-gray-500 focus:bg-black/10'
                                }`} 
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-all duration-300 h-9 w-9 ${
                                theme === 'dark' 
                                    ? 'hover:bg-white/10 text-white/90' 
                                    : 'hover:bg-black/10 text-gray-700'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-yellow-300" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </Button>
                        <div className="relative" ref={profileDropdownRef}>
                            <button 
                                className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            >
                                <img 
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                                    alt="User Avatar" 
                                    className={`w-8 h-8 rounded-full border-2 object-cover shadow-lg ${
                                        theme === 'dark' ? 'border-white/20' : 'border-black/20'
                                    }`} 
                                />
                                <span className={`font-medium hidden lg:block text-sm ${
                                    theme === 'dark' ? 'text-white/90' : 'text-gray-700'
                                }`}>John Doe</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                                    isProfileDropdownOpen ? 'rotate-180' : ''
                                } ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`} />
                            </button>
                            
                            {/* Profile Dropdown */}
                            {isProfileDropdownOpen && (
                                <div className={`absolute right-0 top-full mt-2 w-64 backdrop-blur-md border rounded-lg shadow-lg z-50 transition-all duration-200 ${
                                    theme === 'dark' 
                                        ? 'bg-black/80 border-white/10' 
                                        : 'bg-white/90 border-gray-200'
                                }`}>
                                    <div className={`p-4 border-b ${
                                        theme === 'dark' ? 'border-white/10' : 'border-gray-100'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                                                alt="User Avatar" 
                                                className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover" 
                                            />
                                            <div>
                                                <h3 className={`font-medium ${
                                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>John Doe</h3>
                                                <p className={`text-sm ${
                                                    theme === 'dark' ? 'text-white/60' : 'text-gray-500'
                                                }`}>john.doe@admybrand.com</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setCurrentPage('settings');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                                                theme === 'dark' 
                                                    ? 'hover:bg-white/10 text-white/80 hover:text-white' 
                                                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                            }`}
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="text-sm">Profile Settings</span>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                setIsNotificationPanelOpen(true);
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                                                theme === 'dark' 
                                                    ? 'hover:bg-white/10 text-white/80 hover:text-white' 
                                                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                            }`}
                                        >
                                            <Bell className="w-4 h-4" />
                                            <span className="text-sm">Notifications</span>
                                            <span className={`ml-auto text-xs px-2 py-1 rounded-full bg-purple-500 text-white`}>
                                                3
                                            </span>
                                        </button>
                                        
                                        <button
                                            onClick={() => {
                                                setIsHelpModalOpen(true);
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                                                theme === 'dark' 
                                                    ? 'hover:bg-white/10 text-white/80 hover:text-white' 
                                                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                            }`}
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                            <span className="text-sm">Help & Support</span>
                                        </button>
                                        
                                        <div className={`my-2 border-t ${
                                            theme === 'dark' ? 'border-white/10' : 'border-gray-100'
                                        }`}></div>
                                        
                                        <button
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                                // Add logout functionality here
                                                alert('Logout functionality would be implemented here');
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                                                theme === 'dark' 
                                                    ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300' 
                                                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                                            }`}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                
                {renderPage()}
            </div>
            
            {/* Notification Panel */}
            <NotificationPanel 
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
                theme={theme}
            />
            
            {/* Help & Support Modal */}
            <HelpSupportModal 
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                theme={theme}
            />
        </div>
    );
};

export default NavigationWrapper;
