'use client';

import React, { useState, useEffect } from 'react';
import { 
    Bot, Key, Eye, EyeOff, TestTube, CheckCircle, 
    XCircle, AlertCircle, Loader2, Save, Trash2,
    Brain, Zap, Settings as SettingsIcon, Shield
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { aiService } from '../lib/ai-service';

export const AISettingsSection = () => {
    const [apiKeys, setApiKeys] = useState({});
    const [showKeys, setShowKeys] = useState({});
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState({});
    const [saving, setSaving] = useState({});

    useEffect(() => {
        // Load stored API keys
        const storedKeys = aiService.getStoredAPIKeys();
        setApiKeys(storedKeys);
    }, []);

    const handleAPIKeyChange = (provider, value) => {
        setApiKeys(prev => ({
            ...prev,
            [provider]: value
        }));
        // Clear test results when key changes
        setTestResults(prev => ({
            ...prev,
            [provider]: null
        }));
    };

    const toggleKeyVisibility = (provider) => {
        setShowKeys(prev => ({
            ...prev,
            [provider]: !prev[provider]
        }));
    };

    const saveAPIKey = async (provider) => {
        setSaving(prev => ({ ...prev, [provider]: true }));
        
        try {
            const success = aiService.storeAPIKey(provider, apiKeys[provider]);
            if (success) {
                setTestResults(prev => ({
                    ...prev,
                    [provider]: { success: true, message: 'API key saved successfully' }
                }));
            } else {
                setTestResults(prev => ({
                    ...prev,
                    [provider]: { success: false, error: 'Failed to save API key' }
                }));
            }
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                [provider]: { success: false, error: error.message }
            }));
        } finally {
            setSaving(prev => ({ ...prev, [provider]: false }));
        }
    };

    const testConnection = async (provider) => {
        if (!apiKeys[provider]) {
            setTestResults(prev => ({
                ...prev,
                [provider]: { success: false, error: 'Please enter an API key first' }
            }));
            return;
        }

        setLoading(prev => ({ ...prev, [provider]: true }));
        
        try {
            const result = await aiService.testConnection(provider, apiKeys[provider]);
            setTestResults(prev => ({
                ...prev,
                [provider]: result
            }));
        } catch (error) {
            setTestResults(prev => ({
                ...prev,
                [provider]: { success: false, error: error.message }
            }));
        } finally {
            setLoading(prev => ({ ...prev, [provider]: false }));
        }
    };

    const removeAPIKey = (provider) => {
        aiService.removeAPIKey(provider);
        setApiKeys(prev => ({
            ...prev,
            [provider]: ''
        }));
        setTestResults(prev => ({
            ...prev,
            [provider]: null
        }));
    };

    const getStatusIcon = (provider) => {
        const result = testResults[provider];
        if (loading[provider]) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
        if (!result) return null;
        if (result.success) return <CheckCircle className="w-4 h-4 text-green-500" />;
        return <XCircle className="w-4 h-4 text-red-500" />;
    };

    const getStatusMessage = (provider) => {
        const result = testResults[provider];
        if (!result) return null;
        if (result.success) return result.message || 'Connection successful';
        return result.error || 'Connection failed';
    };

    const providers = aiService.getAvailableProviders();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                    <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">AI Integration</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure AI providers for advanced analytics and insights
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {providers.map((provider) => (
                    <Card key={provider.key} className="backdrop-blur-md bg-white/5 border-white/10">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                                        <Bot className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{provider.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground">
                                            {provider.configured ? 'Configured' : 'Not configured'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(provider.key)}
                                    <div className={`w-2 h-2 rounded-full ${
                                        provider.configured ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Key className="w-4 h-4" />
                                    API Key
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            type={showKeys[provider.key] ? 'text' : 'password'}
                                            value={apiKeys[provider.key] || ''}
                                            onChange={(e) => handleAPIKeyChange(provider.key, e.target.value)}
                                            placeholder={`Enter your ${provider.name} API key`}
                                            className="pr-10 backdrop-blur-sm bg-white/5 border-white/10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                                            onClick={() => toggleKeyVisibility(provider.key)}
                                        >
                                            {showKeys[provider.key] ? 
                                                <EyeOff className="w-4 h-4" /> : 
                                                <Eye className="w-4 h-4" />
                                            }
                                        </Button>
                                    </div>
                                    {apiKeys[provider.key] && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAPIKey(provider.key)}
                                            className="px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {testResults[provider.key] && (
                                <div className={`p-3 rounded-lg border backdrop-blur-sm ${
                                    testResults[provider.key].success 
                                        ? 'bg-green-500/10 border-green-500/30 text-green-300'
                                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                                }`}>
                                    <div className="flex items-center gap-2 text-sm">
                                        {testResults[provider.key].success ? 
                                            <CheckCircle className="w-4 h-4" /> : 
                                            <AlertCircle className="w-4 h-4" />
                                        }
                                        {getStatusMessage(provider.key)}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={() => saveAPIKey(provider.key)}
                                    disabled={!apiKeys[provider.key] || saving[provider.key]}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    {saving[provider.key] ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => testConnection(provider.key)}
                                    disabled={!apiKeys[provider.key] || loading[provider.key]}
                                    className="flex-1 border-white/10 hover:bg-white/5"
                                >
                                    {loading[provider.key] ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <TestTube className="w-4 h-4 mr-2" />
                                    )}
                                    Test
                                </Button>
                            </div>

                            <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-3 h-3" />
                                    API keys are stored securely in your browser&apos;s local storage
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3" />
                                    Supports streaming and advanced analytics
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div className="space-y-2">
                            <h4 className="font-medium text-blue-300">Security Notice</h4>
                            <p className="text-sm text-muted-foreground">
                                Your API keys are stored locally and never sent to our servers. 
                                Each AI provider will only receive prompts and return insights. 
                                Review each provider&apos;s privacy policy for their data handling practices.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
