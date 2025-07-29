'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Brain, Zap, TrendingUp, Target, Users, DollarSign,
    RefreshCw, ChevronDown, AlertCircle, CheckCircle,
    Loader2, Bot, Sparkles, BarChart3, TrendingDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { aiService } from '../lib/ai-service';

export const AIAnalyticsWidget = ({ 
    title = "AI Insights", 
    data = null, 
    analysisType = "general",
    className = "",
    showProviderSelector = true,
    autoGenerate = false
}) => {
    const [selectedProvider, setSelectedProvider] = useState('');
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableProviders, setAvailableProviders] = useState([]);
    const [showProviderDropdown, setShowProviderDropdown] = useState(false);

    useEffect(() => {
        // Load available providers
        const providers = aiService.getAvailableProviders();
        let configuredProviders = providers.filter(p => p.configured);
        
        // For demo purposes, if no providers are configured, show all providers as available
        if (configuredProviders.length === 0) {
            configuredProviders = providers.map(p => ({ ...p, configured: true }));
        }
        
        setAvailableProviders(configuredProviders);
        
        // Auto-select first configured provider
        if (configuredProviders.length > 0 && !selectedProvider) {
            setSelectedProvider(configuredProviders[0].key);
        }
    }, [selectedProvider]);

    const generateDataPrompt = () => {
        if (!data) return "Provide general marketing analytics insights.";

        let prompt = "";
        
        switch (analysisType) {
            case 'revenue':
                prompt = `Analyze this revenue data: ${JSON.stringify(data)}. 
                Focus on revenue trends, growth opportunities, and optimization strategies.`;
                break;
            case 'conversion':
                prompt = `Analyze this conversion data: ${JSON.stringify(data)}. 
                Identify conversion bottlenecks and optimization opportunities.`;
                break;
            case 'campaign':
                prompt = `Analyze this campaign performance data: ${JSON.stringify(data)}. 
                Evaluate ROI, effectiveness, and improvement recommendations.`;
                break;
            case 'traffic':
                prompt = `Analyze this traffic source data: ${JSON.stringify(data)}. 
                Examine user acquisition channels and behavior patterns.`;
                break;
            default:
                prompt = `Analyze this marketing data: ${JSON.stringify(data)}. 
                Provide comprehensive insights and actionable recommendations.`;
        }

        return prompt;
    };

    const generateInsights = useCallback(async () => {
        if (!selectedProvider) {
            setError('Please select an AI provider first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const prompt = generateDataPrompt();
            const result = await aiService.generateInsights(selectedProvider, prompt, analysisType);
            
            if (result.success) {
                setInsights(result);
                setError(null);
            } else {
                setError(result.error);
                setInsights(null);
            }
        } catch (err) {
            setError(err.message || 'Failed to generate insights');
            setInsights(null);
        } finally {
            setLoading(false);
        }
    }, [selectedProvider, analysisType, data, generateDataPrompt]);

    // Auto-generate insights when conditions are met
    useEffect(() => {
        if (autoGenerate && selectedProvider && data) {
            generateInsights();
        }
    }, [autoGenerate, selectedProvider, data, generateInsights]);

    const getAnalysisIcon = () => {
        switch (analysisType) {
            case 'revenue': return <DollarSign className="w-4 h-4" />;
            case 'conversion': return <Target className="w-4 h-4" />;
            case 'campaign': return <BarChart3 className="w-4 h-4" />;
            case 'traffic': return <Users className="w-4 h-4" />;
            default: return <Brain className="w-4 h-4" />;
        }
    };

    const formatInsights = (insightsText) => {
        if (!insightsText) return '';
        
        // Split by numbered sections or bullet points
        const sections = insightsText.split(/(?:\d+\.|•|-|\*)\s+/).filter(section => section.trim());
        
        if (sections.length <= 1) {
            return insightsText;
        }

        return sections.map((section, index) => {
            const trimmed = section.trim();
            if (!trimmed) return null;
            
            // Check if it's a header-like section
            if (trimmed.includes(':') && trimmed.length < 100) {
                const [header, ...content] = trimmed.split(':');
                return (
                    <div key={index} className="mb-3">
                        <h5 className="font-medium text-sm mb-1 text-blue-300">{header.trim()}:</h5>
                        {content.length > 0 && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {content.join(':').trim()}
                            </p>
                        )}
                    </div>
                );
            }
            
            return (
                <p key={index} className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {trimmed}
                </p>
            );
        }).filter(Boolean);
    };

    return (
        <Card className={`backdrop-blur-md bg-white/5 border-white/10 ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                            {getAnalysisIcon()}
                        </div>
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                {title}
                                <Sparkles className="w-4 h-4 text-purple-400" />
                            </CardTitle>
                            {insights && (
                                <p className="text-xs text-muted-foreground">
                                    Generated by {availableProviders.find(p => p.key === insights.provider)?.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {showProviderSelector && availableProviders.length > 1 && (
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                                    className="text-xs px-2 py-1 h-auto"
                                >
                                    {availableProviders.find(p => p.key === selectedProvider)?.name || 'Select AI'}
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </Button>
                                {showProviderDropdown && (
                                    <div className="absolute right-0 top-full mt-1 z-10 min-w-[150px] backdrop-blur-md bg-black/80 border border-white/10 rounded-lg shadow-lg">
                                        {availableProviders.map((provider) => (
                                            <button
                                                key={provider.key}
                                                onClick={() => {
                                                    setSelectedProvider(provider.key);
                                                    setShowProviderDropdown(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg ${
                                                    selectedProvider === provider.key ? 'bg-blue-500/20 text-blue-300' : ''
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Bot className="w-3 h-3" />
                                                    {provider.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={generateInsights}
                            disabled={loading || !selectedProvider}
                            className="p-2 h-auto"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {availableProviders.length === 0 && (
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                        <div className="flex items-center gap-2 text-blue-300 mb-2">
                            <Brain className="w-4 h-4" />
                            <span className="text-sm font-medium">Demo Mode Active</span>
                        </div>
                        <p className="text-xs text-blue-200/80">
                            Configure AI providers in Settings for live insights. Demo insights will be shown for now.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <div className="flex items-center gap-2 text-red-300 mb-2">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Error</span>
                        </div>
                        <p className="text-xs text-red-200/80">{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3 text-blue-300">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Generating AI insights...</span>
                        </div>
                    </div>
                )}

                {insights && !loading && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-300 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Analysis complete</span>
                            <span className="text-xs text-muted-foreground">
                                • {new Date(insights.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                                {typeof insights.insights === 'string' ? 
                                    formatInsights(insights.insights) : 
                                    <p className="text-sm text-muted-foreground">{insights.insights}</p>
                                }
                            </div>
                        </div>
                    </div>
                )}

                {!insights && !loading && !error && availableProviders.length > 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Brain className="w-8 h-8 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground mb-3">
                            Click the refresh button to generate AI insights
                        </p>
                        <Button
                            onClick={generateInsights}
                            disabled={!selectedProvider}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Generate Insights
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
