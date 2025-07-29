'use client';

// AI Service Management
export class AIService {
    constructor() {
        this.providers = {
            gemini: {
                name: 'Google Gemini',
                apiKeyKey: 'gemini_api_key',
                testEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
                supportsStreaming: true
            },
            openai: {
                name: 'OpenAI GPT',
                apiKeyKey: 'openai_api_key',
                testEndpoint: 'https://api.openai.com/v1/chat/completions',
                supportsStreaming: true
            },
            anthropic: {
                name: 'Anthropic Claude',
                apiKeyKey: 'anthropic_api_key',
                testEndpoint: 'https://api.anthropic.com/v1/messages',
                supportsStreaming: true
            }
        };
    }

    // Get stored API keys
    getStoredAPIKeys() {
        if (typeof window === 'undefined') return {};
        
        const keys = {};
        Object.entries(this.providers).forEach(([provider, config]) => {
            keys[provider] = localStorage.getItem(config.apiKeyKey) || '';
        });
        return keys;
    }

    // Store API key securely
    storeAPIKey(provider, apiKey) {
        if (typeof window === 'undefined') return false;
        
        try {
            localStorage.setItem(this.providers[provider].apiKeyKey, apiKey);
            return true;
        } catch (error) {
            console.error('Failed to store API key:', error);
            return false;
        }
    }

    // Remove API key
    removeAPIKey(provider) {
        if (typeof window === 'undefined') return false;
        
        try {
            localStorage.removeItem(this.providers[provider].apiKeyKey);
            return true;
        } catch (error) {
            console.error('Failed to remove API key:', error);
            return false;
        }
    }

    // Test API connection
    async testConnection(provider, apiKey) {
        try {
            switch (provider) {
                case 'gemini':
                    return await this.testGeminiConnection(apiKey);
                case 'openai':
                    return await this.testOpenAIConnection(apiKey);
                case 'anthropic':
                    return await this.testAnthropicConnection(apiKey);
                default:
                    return { success: false, error: 'Unknown provider' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async testGeminiConnection(apiKey) {
        try {
            const response = await fetch(`${this.providers.gemini.testEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'Hello, this is a test message.' }]
                    }]
                })
            });

            if (response.ok) {
                return { success: true, message: 'Connection successful' };
            } else {
                const error = await response.json();
                return { success: false, error: error.error?.message || 'Invalid API key' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or invalid key' };
        }
    }

    async testOpenAIConnection(apiKey) {
        try {
            const response = await fetch(this.providers.openai.testEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: 'Hello, this is a test message.' }],
                    max_tokens: 10
                })
            });

            if (response.ok) {
                return { success: true, message: 'Connection successful' };
            } else {
                const error = await response.json();
                return { success: false, error: error.error?.message || 'Invalid API key' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or invalid key' };
        }
    }

    async testAnthropicConnection(apiKey) {
        try {
            const response = await fetch(this.providers.anthropic.testEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 10,
                    messages: [{ role: 'user', content: 'Hello, this is a test message.' }]
                })
            });

            if (response.ok) {
                return { success: true, message: 'Connection successful' };
            } else {
                const error = await response.json();
                return { success: false, error: error.error?.message || 'Invalid API key' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or invalid key' };
        }
    }

    // Generate insights using specified provider
    async generateInsights(provider, prompt, analysisType = 'general') {
        const apiKey = this.getStoredAPIKeys()[provider];
        
        // For demonstration purposes, use local API if no API key is configured
        if (!apiKey) {
            try {
                const response = await fetch('/api/ai-insights', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        provider,
                        prompt,
                        analysisType
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    return { 
                        success: false, 
                        error: `Demo mode: Add your ${this.providers[provider].name} API key in settings for real insights.` 
                    };
                }
            } catch (error) {
                return { 
                    success: false, 
                    error: `Demo mode: Add your ${this.providers[provider].name} API key in settings for live AI analysis.` 
                };
            }
        }

        try {
            switch (provider) {
                case 'gemini':
                    return await this.generateGeminiInsights(apiKey, prompt, analysisType);
                case 'openai':
                    return await this.generateOpenAIInsights(apiKey, prompt, analysisType);
                case 'anthropic':
                    return await this.generateAnthropicInsights(apiKey, prompt, analysisType);
                default:
                    return { success: false, error: 'Unknown provider' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async generateGeminiInsights(apiKey, prompt, analysisType) {
        try {
            const enhancedPrompt = this.enhancePromptForAnalysis(prompt, analysisType);
            
            const response = await fetch(`${this.providers.gemini.testEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: enhancedPrompt }]
                    }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights generated';
                return { 
                    success: true, 
                    insights: text,
                    provider: 'gemini',
                    analysisType,
                    timestamp: new Date().toISOString()
                };
            } else {
                const error = await response.json();
                return { success: false, error: error.error?.message || 'Failed to generate insights' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or API failure' };
        }
    }

    async generateOpenAIInsights(apiKey, prompt, analysisType) {
        try {
            const enhancedPrompt = this.enhancePromptForAnalysis(prompt, analysisType);
            
            const response = await fetch(this.providers.openai.testEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { 
                            role: 'system', 
                            content: 'You are a marketing analytics expert. Provide actionable insights based on the data provided.' 
                        },
                        { role: 'user', content: enhancedPrompt }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.choices?.[0]?.message?.content || 'No insights generated';
                return { 
                    success: true, 
                    insights: text,
                    provider: 'openai',
                    analysisType,
                    timestamp: new Date().toISOString()
                };
            } else {
                const error = await response.json();
                return { success: false, error: error.error?.message || 'Failed to generate insights' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or API failure' };
        }
    }

    async generateAnthropicInsights(apiKey, prompt, analysisType) {
        try {
            const enhancedPrompt = this.enhancePromptForAnalysis(prompt, analysisType);
            
            const response = await fetch(this.providers.anthropic.testEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 500,
                    messages: [{ 
                        role: 'user', 
                        content: `As a marketing analytics expert, ${enhancedPrompt}` 
                    }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.content?.[0]?.text || 'No insights generated';
                return { 
                    success: true, 
                    insights: text,
                    provider: 'anthropic',
                    analysisType,
                    timestamp: new Date().toISOString()
                };
            } else {
                const error = await response.json();
                return { success: false, error: error.error?.message || 'Failed to generate insights' };
            }
        } catch (error) {
            return { success: false, error: 'Network error or API failure' };
        }
    }

    enhancePromptForAnalysis(basePrompt, analysisType) {
        const analysisPrompts = {
            revenue: 'Focus on revenue optimization opportunities, pricing strategies, and monetization improvements. ',
            conversion: 'Analyze conversion funnels, identify bottlenecks, and suggest optimization strategies. ',
            campaign: 'Evaluate campaign performance, ROI analysis, and recommendations for improvement. ',
            traffic: 'Examine traffic sources, user behavior patterns, and acquisition channel effectiveness. ',
            general: 'Provide comprehensive marketing analytics insights and actionable recommendations. '
        };

        const analysisPrefix = analysisPrompts[analysisType] || analysisPrompts.general;
        return `${analysisPrefix}${basePrompt}

Please structure your response with:
1. Key findings
2. Actionable recommendations
3. Priority actions
4. Expected impact

Keep the response concise but insightful.`;
    }

    // Get available providers with their status
    getAvailableProviders() {
        const keys = this.getStoredAPIKeys();
        return Object.entries(this.providers).map(([key, provider]) => ({
            key,
            ...provider,
            hasApiKey: !!keys[key],
            configured: !!keys[key]
        }));
    }
}

// Export singleton instance
export const aiService = new AIService();
