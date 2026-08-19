import React from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  FolderPlus,
  Upload,
  Download,
  Layers,
  Lock,
  ShieldCheck,
  KeyRound,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const SettingsSidebar: React.FC = () => {
  const {
    projectName,
    openNewProjectModal,
    openImportProjectModal,
    openExportProjectModal,
    passcodeConfig,
    openPasscodeModal,
    openSecurityGuideModal,
    lockSession,
    byok
  } = useIDE();

  return (
    <div className="h-full flex flex-col bg-[#111114] text-xs text-[#a1a1aa] select-none overflow-hidden">
      {/* Header */}
      <div className="h-9 px-3 border-b border-[#1e1e24] flex items-center justify-between font-medium text-[#71717a] text-[11px]">
        <div className="flex items-center space-x-1.5 text-[#ededee]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-xs">Security & Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
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

        {/* Passcode Security & Cryptography Card */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#ededee] text-[11px] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Passcode Security</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PBKDF2-SHA256
            </span>
          </div>

          <div className="text-[11px] text-[#8e8ea0] bg-[#101014] p-2 rounded border border-[#1e1e24] space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span>Status:</span>
              <span className="text-white font-medium">
                {passcodeConfig?.hasPasscode ? 'Active & Hash Encrypted' : 'Not Set'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span>Developer:</span>
              <span className="text-indigo-300 font-mono">
                {passcodeConfig?.developerName || 'Default'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span>Hash Algorithm:</span>
              <span className="text-[#a1a1aa] font-mono">100,000 Rounds</span>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5 pt-0.5">
            {passcodeConfig?.hasPasscode ? (
              <>
                <button
                  id="btn-sidebar-lock-ide"
                  onClick={lockSession}
                  className="w-full py-1.5 bg-[#251f15] hover:bg-[#382b1b] border border-amber-500/30 text-amber-300 rounded flex items-center justify-center space-x-1.5 transition-colors text-[11px] cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock IDE Session</span>
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    id="btn-sidebar-change-passcode"
                    onClick={() => openPasscodeModal('change')}
                    className="py-1.5 bg-[#181822] hover:bg-[#232332] border border-[#282838] text-[#ededee] rounded flex items-center justify-center space-x-1 text-[10px] cursor-pointer"
                  >
                    <KeyRound className="w-3 h-3 text-indigo-400" />
                    <span>Change PIN</span>
                  </button>
                  <button
                    id="btn-sidebar-crypto-audit"
                    onClick={() => openPasscodeModal('security_info')}
                    className="py-1.5 bg-[#181822] hover:bg-[#232332] border border-[#282838] text-[#ededee] rounded flex items-center justify-center space-x-1 text-[10px] cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Audit Crypto</span>
                  </button>
                </div>
                <button
                  id="btn-sidebar-security-guide"
                  onClick={openSecurityGuideModal}
                  className="w-full py-1.5 bg-[#16241c] hover:bg-[#1f3529] border border-emerald-500/30 text-emerald-300 rounded flex items-center justify-center space-x-1.5 transition-colors text-[10px] cursor-pointer font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5-Pillar Security Guide & Bench</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="btn-sidebar-create-passcode"
                  onClick={() => openPasscodeModal('create')}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center justify-center space-x-1.5 transition-colors text-[11px] cursor-pointer"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Create Passcode Protection</span>
                </button>
                <button
                  id="btn-sidebar-security-guide-empty"
                  onClick={openSecurityGuideModal}
                  className="w-full py-1.5 bg-[#16241c] hover:bg-[#1f3529] border border-emerald-500/30 text-emerald-300 rounded flex items-center justify-center space-x-1.5 transition-colors text-[10px] cursor-pointer font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5-Pillar Security Guide & Bench</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Zero API Keys & Mandatory Passcode Security Architecture Card */}
        <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#ededee] text-[11px] flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>AI Agent Security Protocol</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ZERO-API-KEY MODE
            </span>
          </div>

          <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
            All 4 Autonomous Agents operate with <strong className="text-white">zero external API keys</strong> and <strong className="text-white">no Gmail / SMTP</strong> requirements. Security is strictly enforced using your PBKDF2-SHA256 encrypted Passcode.
          </p>

          <div className="space-y-1.5 text-[10px] bg-[#101014] p-2.5 rounded border border-[#1e1e24]">
            <div className="flex items-center space-x-2 text-[#34d399]">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>Passcode Gatekeeper: AI execution requires active PIN</span>
            </div>
            <div className="flex items-center space-x-2 text-[#34d399]">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>No Gmail / SMTP or Third-Party Credentials Needed</span>
            </div>
            <div className="flex items-center space-x-2 text-[#34d399]">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>Constant-Time PBKDF2 Hashing (100,000 Rounds)</span>
            </div>
            <div className="flex items-center space-x-2 text-[#34d399]">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              <span>Progressive Timing Throttling & Lockout Defense</span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                if (!passcodeConfig?.isUnlocked) {
                  openPasscodeModal('authorize');
                } else {
                  openPasscodeModal('security_info');
                }
              }}
              className="w-full py-1.5 bg-[#1a1a24] hover:bg-[#232332] border border-[#28283a] text-[#ededee] font-medium rounded flex items-center justify-center space-x-1.5 transition-all text-[11px] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{passcodeConfig?.isUnlocked ? "Audit Cryptographic Status" : "Authorize Session with Passcode"}</span>
            </button>
          </div>
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
