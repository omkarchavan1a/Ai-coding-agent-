import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Key, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ShieldCheck
} from 'lucide-react';
import { LLMProvider } from '../../types';

export const BYOKModal: React.FC = () => {
  const {
    isByokModalOpen,
    setIsByokModalOpen,
    byok,
    updateByok,
    testByokConnection
  } = useIDE();

  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  if (!isByokModalOpen) return null;

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testByokConnection();
    setIsTesting(false);
    setTestResult(res);
  };

  const getProviderInfo = () => {
    switch (byok.provider) {
      case 'gemini':
        return {
          title: 'Google Gemini AI',
          description: 'High-speed reasoning with Gemini 3.7 Flash & 3.1 Pro.',
          keyUrl: 'https://aistudio.google.com/app/apikey',
          keyName: 'Google AI Studio API Key',
          defaultModel: 'gemini-3.7-flash'
        };
      case 'openai':
        return {
          title: 'OpenAI GPT-4o & o1',
          description: 'GPT-4o, GPT-4o-mini, or o1 reasoning models for code synthesis.',
          keyUrl: 'https://platform.openai.com/api-keys',
          keyName: 'OpenAI API Key',
          defaultModel: 'gpt-4o'
        };
      case 'anthropic':
        return {
          title: 'Anthropic Claude 3.5 Sonnet',
          description: 'Claude 3.5 Sonnet for code editing and refactoring.',
          keyUrl: 'https://console.anthropic.com/settings/keys',
          keyName: 'Anthropic API Key',
          defaultModel: 'claude-3-5-sonnet-latest'
        };
      case 'custom':
        return {
          title: 'Custom Endpoint / Local Ollama',
          description: 'Connect local models (Qwen2.5 Coder, DeepSeek) or OpenRouter.',
          keyUrl: 'https://ollama.ai',
          keyName: 'Custom API Key (Optional)',
          defaultModel: 'qwen2.5-coder'
        };
    }
  };

  const info = getProviderInfo();

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-[#22222a] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden text-xs text-[#a1a1aa] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-[#1e1e24] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-md bg-[#1a1a22] border border-[#262632] text-[#818cf8]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white flex items-center space-x-2">
                <span>Bring Your Own Key (BYOK)</span>
                <span className="px-1.5 py-0.2 rounded bg-[#1c1c24] text-[#818cf8] text-[10px] font-mono">
                  Custom
                </span>
              </h2>
              <p className="text-[11px] text-[#71717a]">
                Configure API keys to power all 4 autonomous agents.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsByokModalOpen(false)}
            className="p-1 rounded hover:bg-[#1a1a22] text-[#71717a] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Provider Selection Tabs */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Select LLM Provider</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['gemini', 'openai', 'anthropic', 'custom'] as LLMProvider[]).map((prov) => (
                <button
                  key={prov}
                  onClick={() => updateByok({ provider: prov })}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    byok.provider === prov
                      ? 'bg-[#1a1a22] border-[#818cf8] text-white font-medium'
                      : 'bg-[#15151a] border-[#202028] text-[#71717a] hover:border-[#2f2f3c] hover:text-[#d4d4d8]'
                  }`}
                >
                  <div className="capitalize text-xs font-medium">
                    {prov === 'gemini' ? 'Gemini' : prov === 'openai' ? 'OpenAI' : prov === 'anthropic' ? 'Anthropic' : 'Custom'}
                  </div>
                  <span className="text-[9px] text-[#52525b] block mt-0.5">
                    {prov === 'gemini' ? 'Google' : prov === 'openai' ? 'GPT-4o' : prov === 'anthropic' ? 'Claude' : 'Ollama'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Provider Callout & Free Key Link */}
          <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#ededee] text-xs flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-[#818cf8]" />
                <span>{info.title}</span>
              </span>
              <a
                href={info.keyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded bg-[#1c1c24] hover:bg-[#252532] border border-[#282834] text-[#818cf8] text-[10px] flex items-center space-x-1 transition-all"
              >
                <span>Get Key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
              {info.description}
            </p>
          </div>

          {/* Key Input Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">
                {info.keyName}
              </label>
              <span className="text-[9px] text-[#52525b] font-mono">Encrypted locally</span>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={
                  byok.provider === 'gemini'
                    ? byok.geminiApiKey
                    : byok.provider === 'openai'
                    ? byok.openaiApiKey
                    : byok.anthropicApiKey
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (byok.provider === 'gemini') updateByok({ geminiApiKey: val, useCustomKey: Boolean(val) });
                  else if (byok.provider === 'openai') updateByok({ openaiApiKey: val, useCustomKey: Boolean(val) });
                  else updateByok({ anthropicApiKey: val, useCustomKey: Boolean(val) });
                }}
                placeholder={byok.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                className="w-full bg-[#0d0d0f] border border-[#202028] focus:border-[#6366f1] rounded px-3 py-1.5 pr-8 text-xs text-white placeholder-[#52525b] font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-2 text-[#52525b] hover:text-[#a1a1aa]"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">Select Model</label>
            <select
              value={byok.selectedModel}
              onChange={(e) => updateByok({ selectedModel: e.target.value })}
              className="w-full bg-[#0d0d0f] border border-[#202028] focus:border-[#6366f1] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
            >
              {byok.provider === 'gemini' && (
                <>
                  <option value="gemini-3.7-flash">gemini-3.7-flash (Fast & Accurate)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                </>
              )}
              {byok.provider === 'openai' && (
                <>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="o1">o1</option>
                </>
              )}
              {byok.provider === 'anthropic' && (
                <>
                  <option value="claude-3-5-sonnet-latest">claude-3-5-sonnet-latest</option>
                  <option value="claude-3-opus-20240229">claude-3-opus-20240229</option>
                </>
              )}
              {byok.provider === 'custom' && (
                <>
                  <option value="qwen2.5-coder">qwen2.5-coder (Ollama / Local)</option>
                  <option value="deepseek-coder">deepseek-coder</option>
                </>
              )}
            </select>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div className={`p-2.5 rounded text-xs flex items-start space-x-2 ${
              testResult.success
                ? 'bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399]'
                : 'bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185]'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
              <span>{testResult.message || testResult.error}</span>
            </div>
          )}

          {/* Test Connection Button */}
          <button
            onClick={handleTestKey}
            disabled={isTesting}
            className="w-full py-2 bg-[#1a1a22] hover:bg-[#22222c] border border-[#282834] text-white font-medium rounded flex items-center justify-center space-x-2 transition-all text-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-[#818cf8]' : ''}`} />
            <span>{isTesting ? 'Validating Key...' : 'Test Connection'}</span>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-[#1e1e24] bg-[#0d0d0f] flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] text-[#71717a]">
            <ShieldCheck className="w-3 h-3 text-[#34d399]" />
            <span>Key remains secure & client-isolated</span>
          </div>

          <button
            onClick={() => setIsByokModalOpen(false)}
            className="px-3 py-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium rounded text-xs transition-all"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
