import React, { useState } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Zap, 
  RefreshCw,
  Mail,
  User,
  ShieldCheck,
  LogOut,
  FolderPlus,
  Upload,
  Download,
  Layers
} from 'lucide-react';
import { LLMProvider } from '../../types';

export const SettingsSidebar: React.FC = () => {
  const {
    user,
    setIsAuthModalOpen,
    logout,
    projectName,
    openNewProjectModal,
    openImportProjectModal,
    openExportProjectModal,
    byok,
    updateByok,
    testByokConnection
  } = useIDE();

  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testByokConnection();
    setIsTesting(false);
    setTestResult(result);
  };

  const getProviderLink = () => {
    switch (byok.provider) {
      case 'gemini': return { name: 'Google AI Studio', url: 'https://aistudio.google.com/app/apikey' };
      case 'openai': return { name: 'OpenAI Platform', url: 'https://platform.openai.com/api-keys' };
      case 'anthropic': return { name: 'Anthropic Console', url: 'https://console.anthropic.com/settings/keys' };
      default: return null;
    }
  };

  const providerLink = getProviderLink();

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none overflow-hidden">
      {/* Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <div className="flex items-center space-x-1.5 text-[#ededee]">
          <Key className="w-3.5 h-3.5 text-[#818cf8]" />
          <span className="font-semibold text-xs">BYOK & Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* User Account & Verification Card */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#ededee] text-[11px] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Developer Account</span>
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
              user?.isVerified ? 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20' : 'bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/20'
            }`}>
              {user?.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
            </span>
          </div>

          {user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5 bg-[#101014] p-2 rounded border border-[#1e1e24]">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full bg-[#0d0d0f]"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-xs truncate">{user.name}</div>
                  <div className="text-[#71717a] text-[10px] font-mono truncate">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex-1 py-1 bg-[#1c1c24] hover:bg-[#252532] border border-[#282834] text-[#ededee] rounded text-[10px] font-medium transition-colors"
                >
                  Manage Email
                </button>
                <button
                  onClick={logout}
                  className="px-2 py-1 bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 border border-[#f43f5e]/30 text-[#fb7185] rounded text-[10px] transition-colors flex items-center space-x-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
                Sign in with Gmail or work email to verify your developer identity and synchronize agent keys.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium rounded text-[11px] flex items-center justify-center space-x-1.5 transition-all shadow-xs"
              >
                <Mail className="w-3 h-3" />
                <span>Verify Email with Code</span>
              </button>
            </div>
          )}
        </div>

        {/* Project Management Card */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#ededee] text-[11px] flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Project Management</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium bg-[#818cf8]/10 text-[#a5b4fc] border border-[#818cf8]/20 truncate max-w-[90px]">
              {projectName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={openNewProjectModal}
              className="p-2 rounded bg-[#101014] hover:bg-[#1b1b24] border border-[#202028] text-center transition-colors group"
            >
              <FolderPlus className="w-4 h-4 text-[#818cf8] mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[10px] font-medium text-[#ededee]">New</div>
            </button>

            <button
              onClick={openImportProjectModal}
              className="p-2 rounded bg-[#101014] hover:bg-[#1b1b24] border border-[#202028] text-center transition-colors group"
            >
              <Upload className="w-4 h-4 text-[#fbbf24] mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[10px] font-medium text-[#ededee]">Import</div>
            </button>

            <button
              onClick={openExportProjectModal}
              className="p-2 rounded bg-[#101014] hover:bg-[#1b1b24] border border-[#202028] text-center transition-colors group"
            >
              <Download className="w-4 h-4 text-[#34d399] mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-[10px] font-medium text-[#ededee]">Export</div>
            </button>
          </div>
        </div>

        {/* BYOK Main Card */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#ededee] text-[11px] flex items-center space-x-1.5">
              <Zap className="w-3 h-3 text-[#fbbf24]" />
              <span>Bring Your Own Key</span>
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
              byok.isKeyVerified ? 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20' : 'bg-[#1a1a22] text-[#71717a]'
            }`}>
              {byok.isKeyVerified ? 'VERIFIED' : 'DEFAULT'}
            </span>
          </div>

          <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
            Provide your personal API key to power all 4 autonomous agents with zero rate throttling.
          </p>

          {/* Provider Selector Tabs */}
          <div className="space-y-1 pt-1">
            <label className="text-[10px] text-[#71717a] uppercase font-semibold">Provider</label>
            <div className="grid grid-cols-2 gap-1 bg-[#101014] p-1 rounded border border-[#1e1e24]">
              {(['gemini', 'openai', 'anthropic', 'custom'] as LLMProvider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => updateByok({ provider: p })}
                  className={`py-1 rounded text-[10px] font-medium capitalize transition-all ${
                    byok.provider === p
                      ? 'bg-[#22222b] text-white font-semibold'
                      : 'text-[#71717a] hover:text-[#d4d4d8]'
                  }`}
                >
                  {p === 'gemini' ? 'Gemini' : p === 'openai' ? 'OpenAI' : p === 'anthropic' ? 'Anthropic' : 'Custom'}
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <label className="text-[#71717a] uppercase font-semibold">
                {byok.provider === 'gemini' ? 'Gemini API Key' : byok.provider === 'openai' ? 'OpenAI API Key' : byok.provider === 'anthropic' ? 'Anthropic Key' : 'API Key'}
              </label>
              {providerLink && (
                <a
                  href={providerLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#818cf8] hover:underline flex items-center space-x-0.5 text-[10px]"
                >
                  <span>Get Key</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={byok.provider === 'gemini' ? byok.geminiApiKey : (byok.provider === 'openai' ? byok.openaiApiKey : byok.anthropicApiKey)}
                onChange={(e) => {
                  const val = e.target.value;
                  if (byok.provider === 'gemini') updateByok({ geminiApiKey: val, useCustomKey: Boolean(val) });
                  else if (byok.provider === 'openai') updateByok({ openaiApiKey: val, useCustomKey: Boolean(val) });
                  else updateByok({ anthropicApiKey: val, useCustomKey: Boolean(val) });
                }}
                placeholder={byok.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                className="w-full bg-[#101014] border border-[#202028] focus:border-[#6366f1] rounded px-2.5 py-1 pr-8 text-xs text-white placeholder-[#52525b] font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1.5 text-[#52525b] hover:text-[#a1a1aa]"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Model Selector */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#71717a] uppercase font-semibold">Active Model</label>
            <select
              value={byok.selectedModel}
              onChange={(e) => updateByok({ selectedModel: e.target.value })}
              className="w-full bg-[#101014] border border-[#202028] rounded px-2.5 py-1 text-xs text-[#ededee] font-mono focus:outline-none focus:border-[#6366f1]"
            >
              {byok.provider === 'gemini' && (
                <>
                  <option value="gemini-3.7-flash">gemini-3.7-flash (Recommended)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</option>
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
                  <option value="ollama/qwen2.5-coder">qwen2.5-coder</option>
                  <option value="deepseek/deepseek-coder">deepseek-coder</option>
                </>
              )}
            </select>
          </div>

          {/* Test Connection Button */}
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="w-full py-1.5 bg-[#1c1c24] hover:bg-[#252532] border border-[#282834] text-[#ededee] font-medium rounded flex items-center justify-center space-x-1.5 transition-all text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-[#818cf8]' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          {/* Feedback */}
          {testResult && (
            <div className={`p-2 rounded text-[10px] flex items-start space-x-1.5 ${
              testResult.success ? 'bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399]' : 'bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185]'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />}
              <span>{testResult.message || testResult.error}</span>
            </div>
          )}
        </div>

        {/* Token Usage Stats Card */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2">
          <span className="font-medium text-[#ededee] text-[11px] block">Session Metrics</span>
          
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-[#101014] p-2 rounded border border-[#1e1e24]">
              <span className="text-[9px] text-[#71717a] block">Tokens</span>
              <span className="text-white font-bold">{byok.usageStats.totalTokens.toLocaleString()}</span>
            </div>
            <div className="bg-[#101014] p-2 rounded border border-[#1e1e24]">
              <span className="text-[9px] text-[#71717a] block">Agent Calls</span>
              <span className="text-white font-bold">{byok.usageStats.agentRequests}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
