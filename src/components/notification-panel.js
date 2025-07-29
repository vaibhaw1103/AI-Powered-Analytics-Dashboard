'use client';

import React, { useState } from 'react';
import { 
    Bell, X, Check, AlertCircle, Info, TrendingUp, 
    Users, Target, Clock, ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

export const NotificationPanel = ({ isOpen, onClose, theme }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'Campaign Performance Alert',
            message: 'Your "Summer Sale" campaign exceeded its target CTR by 25%',
            time: '2 minutes ago',
            read: false,
            icon: TrendingUp,
            color: 'green'
        },
        {
            id: 2,
            type: 'info',
            title: 'New AI Insights Available',
            message: 'Fresh analytics insights have been generated for your dashboard',
            time: '15 minutes ago',
            read: false,
            icon: Info,
            color: 'blue'
        },
        {
            id: 3,
            type: 'warning',
            title: 'Budget Alert',
            message: 'Your "Holiday Campaign" has used 85% of its allocated budget',
            time: '1 hour ago',
            read: true,
            icon: AlertCircle,
            color: 'yellow'
        },
        {
            id: 4,
            type: 'info',
            title: 'Team Member Added',
            message: 'Sarah Johnson has been added to your marketing team',
            time: '3 hours ago',
            read: true,
            icon: Users,
            color: 'purple'
        },
        {
            id: 5,
            type: 'success',
            title: 'Goal Achieved',
            message: 'Monthly conversion target of 500 leads has been reached',
            time: '1 day ago',
            read: true,
            icon: Target,
            color: 'green'
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <Card className={`relative w-96 max-h-[80vh] overflow-hidden shadow-2xl ${
                theme === 'dark' 
                    ? 'bg-black/90 border-white/10' 
                    : 'bg-white/95 border-gray-200'
            }`}>
                <CardHeader className={`pb-4 border-b ${
                    theme === 'dark' ? 'border-white/10' : 'border-gray-100'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-purple-500" />
                            <CardTitle className="text-lg">Notifications</CardTitle>
                            {unreadCount > 0 && (
                                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Mark all read
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="p-2"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className={`w-12 h-12 mx-auto mb-4 ${
                                theme === 'dark' ? 'text-white/40' : 'text-gray-400'
                            }`} />
                            <p className={`text-sm ${
                                theme === 'dark' ? 'text-white/60' : 'text-gray-500'
                            }`}>
                                No notifications yet
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-white/10">
                            {notifications.map((notification) => {
                                const IconComponent = notification.icon;
                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-4 transition-colors hover:bg-opacity-50 ${
                                            !notification.read 
                                                ? theme === 'dark' 
                                                    ? 'bg-purple-500/10' 
                                                    : 'bg-purple-50'
                                                : ''
                                        } ${
                                            theme === 'dark' 
                                                ? 'hover:bg-white/5' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                notification.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                                notification.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                                notification.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                                notification.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <h4 className={`font-medium text-sm ${
                                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="p-1 rounded hover:bg-green-500/20 text-green-500"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className={`p-1 rounded ${
                                                                theme === 'dark' 
                                                                    ? 'hover:bg-red-500/20 text-red-400' 
                                                                    : 'hover:bg-red-50 text-red-500'
                                                            }`}
                                                            title="Delete notification"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className={`text-sm mt-1 ${
                                                    theme === 'dark' ? 'text-white/70' : 'text-gray-600'
                                                }`}>
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className={`text-xs ${
                                                        theme === 'dark' ? 'text-white/50' : 'text-gray-400'
                                                    }`}>
                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                        {notification.time}
                                                    </span>
                                                    <ChevronRight className={`w-3 h-3 ${
                                                        theme === 'dark' ? 'text-white/30' : 'text-gray-300'
                                                    }`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
                <div className={`p-4 border-t ${
                    theme === 'dark' ? 'border-white/10' : 'border-gray-100'
                }`}>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            // Navigate to full notifications page
                            onClose();
                        }}
                    >
                        View All Notifications
                    </Button>
                </div>
            </Card>
        </div>
    );
};
