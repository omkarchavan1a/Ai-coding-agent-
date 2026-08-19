import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Cpu, 
  Binary, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';
import { useIDE } from '../../context/IDEContext';
import { PasscodeModalMode } from '../../types';

export const PasscodeModal: React.FC = () => {
  const {
    passcodeConfig,
    isPasscodeModalOpen,
    setIsPasscodeModalOpen,
    passcodeModalMode,
    setPasscodeModalMode,
    openSecurityGuideModal,
    authorizePasscode,
    createPasscode,
    changePasscode,
    removePasscode
  } = useIDE();

  // Mode & Form States
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [developerName, setDeveloperName] = useState(passcodeConfig?.developerName || 'Omkar Chavan');
  const [hint, setHint] = useState(passcodeConfig?.hint || '');
  const [showPasscode, setShowPasscode] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(passcodeConfig?.remainingLockoutSeconds || 0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens or mode changes
  useEffect(() => {
    if (isPasscodeModalOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setPasscode('');
      setConfirmPasscode('');
      setCurrentPasscode('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isPasscodeModalOpen, passcodeModalMode]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  if (!isPasscodeModalOpen) return null;

  const isLocked = passcodeConfig && !passcodeConfig.isUnlocked;
  const canClose = !isLocked; // If locked out, user must authorize

  // Trigger shake animation on error
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // 1. Authorize handler
  const handleAuthorize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode || passcode.trim().length === 0) {
      triggerError("Please enter your passcode.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await authorizePasscode(passcode.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setPasscode('');
    } else {
      triggerError(res.error || res.message || "Incorrect passcode. Decrypted hash did not match.");
      if (res.remainingSeconds) {
        setCooldown(res.remainingSeconds);
      }
    }
  };

  // 2. Create Passcode handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || passcode.length < 4) {
      triggerError("Passcode must be at least 4 characters long.");
      return;
    }
    if (passcode !== confirmPasscode) {
      triggerError("Passcodes do not match. Please re-type carefully.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await createPasscode(passcode.trim(), hint.trim(), developerName.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      triggerError(res.error || res.message);
    }
  };

  // 3. Change Passcode handler
  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasscode) {
      triggerError("Please enter your current passcode.");
      return;
    }
    if (!passcode || passcode.length < 4) {
      triggerError("New passcode must be at least 4 characters.");
      return;
    }
    if (passcode !== confirmPasscode) {
      triggerError("New passcodes do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await changePasscode(currentPasscode.trim(), passcode.trim(), hint.trim(), developerName.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      triggerError(res.error || res.message);
    }
  };

  // 4. Remove Passcode handler
  const handleRemove = async () => {
    if (!currentPasscode) {
      triggerError("Enter current passcode to disable protection.");
      return;
    }

    setIsLoading(true);
    const res = await removePasscode(currentPasscode.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      triggerError(res.error || res.message);
    }
  };

  // Numeric Quick Pad input
  const handleKeypadPress = (num: string) => {
    if (cooldown > 0) return;
    if (passcode.length < 12) {
      const next = passcode + num;
      setPasscode(next);
      if (passcodeModalMode === 'authorize' && next.length === 4 && passcodeConfig?.hasPasscode) {
        // Auto submit if 4-digit standard PIN
        setTimeout(() => {
          authorizePasscode(next).then(res => {
            if (!res.success) {
              triggerError(res.error || "Incorrect passcode.");
              if (res.remainingSeconds) setCooldown(res.remainingSeconds);
            }
          });
        }, 150);
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  return (
    <div 
      id="passcode-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        id="passcode-modal-card"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          x: shake ? [-8, 8, -6, 6, -3, 3, 0] : 0
        }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-[#121217] border border-[#272733] rounded-2xl shadow-2xl overflow-hidden text-[#e4e4e7]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#21212b] bg-[#16161d]">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isLocked 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              {isLocked ? <Lock className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">
                {passcodeModalMode === 'authorize' && (isLocked ? 'IDE Locked' : 'Passcode Authorization')}
                {passcodeModalMode === 'create' && 'Create Unique Passcode'}
                {passcodeModalMode === 'change' && 'Change Passcode'}
                {passcodeModalMode === 'security_info' && 'Cryptographic Hash Architecture'}
              </h2>
              <p className="text-xs text-[#8e8ea0]">
                {passcodeModalMode === 'authorize' && 'PBKDF2 SHA-256 Hash + AES Decryption Match'}
                {passcodeModalMode === 'create' && 'Secure Salt + Hash Database Generation'}
                {passcodeModalMode === 'change' && 'Re-hash & re-encrypt security payload'}
                {passcodeModalMode === 'security_info' && 'Live Verification & Security Engine'}
              </p>
            </div>
          </div>

          {canClose && (
            <button
              id="btn-close-passcode-modal"
              onClick={() => setIsPasscodeModalOpen(false)}
              className="p-1.5 rounded-lg text-[#8e8ea0] hover:text-white hover:bg-[#272733] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Navigation (When not locked out or in modal mode) */}
        {canClose && (
          <div className="flex border-b border-[#21212b] bg-[#14141a] px-3 pt-2">
            <button
              id="tab-passcode-authorize"
              onClick={() => { setPasscodeModalMode('authorize'); setErrorMessage(null); }}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                passcodeModalMode === 'authorize'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-[#8e8ea0] hover:text-[#d4d4d8]'
              }`}
            >
              Authorize
            </button>
            <button
              id="tab-passcode-create"
              onClick={() => { setPasscodeModalMode('create'); setErrorMessage(null); }}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                passcodeModalMode === 'create'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-[#8e8ea0] hover:text-[#d4d4d8]'
              }`}
            >
              Create New
            </button>
            <button
              id="tab-passcode-change"
              onClick={() => { setPasscodeModalMode('change'); setErrorMessage(null); }}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                passcodeModalMode === 'change'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-[#8e8ea0] hover:text-[#d4d4d8]'
              }`}
            >
              Change
            </button>
            <button
              id="tab-passcode-security-info"
              onClick={() => { setPasscodeModalMode('security_info'); setErrorMessage(null); }}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1 ${
                passcodeModalMode === 'security_info'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-[#8e8ea0] hover:text-[#d4d4d8]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Crypto Audit</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* Notification Messages */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-2 text-red-400 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="leading-snug">{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-emerald-400 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="leading-snug">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MODE 1: AUTHORIZE / UNLOCK */}
          {passcodeModalMode === 'authorize' && (
            <div>
              <div className="text-center mb-5">
                <p className="text-xs text-[#9d9da8]">
                  Enter your unique passcode to decrypt and verify the cryptographic hash.
                </p>
                {passcodeConfig?.developerName && (
                  <div className="inline-flex items-center space-x-1.5 mt-2 px-2.5 py-1 rounded-full bg-[#1b1b24] border border-[#2c2c3a] text-xs text-[#a1a1aa]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Developer: <strong className="text-white">{passcodeConfig.developerName}</strong></span>
                  </div>
                )}
              </div>

              {/* PIN Bubbles Display */}
              <div className="flex justify-center items-center space-x-3 mb-6">
                {[0, 1, 2, 3].map(idx => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                      passcode.length > idx
                        ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] scale-110'
                        : 'border-[#3f3f4e] bg-[#1c1c24]'
                    }`}
                  />
                ))}
              </div>

              {/* Passcode Input Field */}
              <form onSubmit={handleAuthorize} className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="input-authorize-passcode"
                    type={showPasscode ? "text" : "password"}
                    value={passcode}
                    disabled={cooldown > 0 || isLoading}
                    onChange={e => setPasscode(e.target.value)}
                    placeholder="Enter Passcode or PIN (e.g. 1234)"
                    className="w-full px-4 py-3 bg-[#181820] border border-[#2b2b3b] rounded-xl text-center text-lg tracking-widest text-white placeholder:text-xs placeholder:tracking-normal placeholder:text-[#525263] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3.5 text-[#717182] hover:text-white transition-colors"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Keypad for Quick Click Input */}
                <div className="grid grid-cols-3 gap-2 pt-1 pb-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                    <button
                      key={num}
                      type="button"
                      disabled={cooldown > 0}
                      onClick={() => handleKeypadPress(num)}
                      className="py-2.5 bg-[#181822] hover:bg-[#232332] active:bg-indigo-600/30 text-white font-mono text-sm font-semibold rounded-lg border border-[#272736] transition-all"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={() => setShowHint(!showHint)}
                    className="py-2.5 bg-[#181822] hover:bg-[#232332] text-[#8e8ea0] hover:text-white rounded-lg border border-[#272736] text-xs flex items-center justify-center transition-all"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={() => handleKeypadPress('0')}
                    className="py-2.5 bg-[#181822] hover:bg-[#232332] active:bg-indigo-600/30 text-white font-mono text-sm font-semibold rounded-lg border border-[#272736] transition-all"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={handleKeypadBackspace}
                    className="py-2.5 bg-[#181822] hover:bg-[#232332] text-[#8e8ea0] hover:text-white rounded-lg border border-[#272736] text-xs flex items-center justify-center transition-all"
                  >
                    ⌫
                  </button>
                </div>

                {/* Hint Disclosure */}
                {showHint && passcodeConfig?.hint && (
                  <div className="p-3 bg-[#181822] border border-[#2d2d3d] rounded-xl text-xs text-[#a1a1aa] flex items-start space-x-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Passcode Hint: </span>
                      <span>{passcodeConfig.hint}</span>
                    </div>
                  </div>
                )}

                {/* Cooldown Timer Alert */}
                {cooldown > 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-xs text-amber-300 font-mono">
                    ⏳ Security Cooldown Active: Retry in {cooldown}s
                  </div>
                ) : (
                  <button
                    id="btn-authorize-passcode"
                    type="submit"
                    disabled={isLoading || passcode.length === 0}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Decrypting & Verifying Hash...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        <span>Authorize & Unlock AI Agents</span>
                      </>
                    )}
                  </button>
                )}
              </form>

              {/* Cryptographic Hash Verification Indicator */}
              <div className="mt-4 pt-3 border-t border-[#20202b] flex items-center justify-between text-[11px] text-[#717182]">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PBKDF2-SHA256 (100k rounds)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPasscodeModalMode('security_info')}
                  className="text-indigo-400 hover:underline flex items-center space-x-0.5"
                >
                  <span>Audit crypto</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: CREATE NEW PASSCODE */}
          {passcodeModalMode === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Developer / Workspace Name</label>
                <input
                  type="text"
                  value={developerName}
                  onChange={e => setDeveloperName(e.target.value)}
                  placeholder="e.g. Omkar Chavan"
                  className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">New Unique Passcode</label>
                <div className="relative">
                  <input
                    type={showPasscode ? "text" : "password"}
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    placeholder="Min 4 characters (e.g. 1234 or secure key)"
                    className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white font-mono placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-2.5 text-[#717182] hover:text-white"
                  >
                    {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Confirm New Passcode</label>
                <input
                  type={showPasscode ? "text" : "password"}
                  value={confirmPasscode}
                  onChange={e => setConfirmPasscode(e.target.value)}
                  placeholder="Re-type passcode to confirm"
                  className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white font-mono placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Passcode Hint (Optional)</label>
                <input
                  type="text"
                  value={hint}
                  onChange={e => setHint(e.target.value)}
                  placeholder="e.g. Year of graduation or birth year"
                  className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Cryptographic Preview */}
              <div className="p-3 bg-[#15151c] border border-[#252533] rounded-xl text-[11px] text-[#8e8ea0] space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-white font-sans text-xs">
                  <span className="flex items-center space-x-1">
                    <Binary className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Cryptographic Storage Schema</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Salted & Hashed</span>
                </div>
                <div className="text-[10px] text-[#717182]">
                  Algorithm: PBKDF2-HMAC-SHA256 • 100,000 Rounds • AES-256-GCM
                </div>
              </div>

              <button
                id="btn-create-passcode-submit"
                type="submit"
                disabled={isLoading || passcode.length < 4}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Cryptographic Hash...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Save & Hash Passcode in Database</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 3: CHANGE PASSCODE */}
          {passcodeModalMode === 'change' && (
            <form onSubmit={handleChange} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Current Passcode</label>
                <input
                  type="password"
                  value={currentPasscode}
                  onChange={e => setCurrentPasscode(e.target.value)}
                  placeholder="Enter current passcode to authorize change"
                  className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white font-mono placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">New Passcode</label>
                <input
                  type="password"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Min 4 characters"
                  className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white font-mono placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">Confirm New Passcode</label>
                <input
                  type="password"
                  value={confirmPasscode}
                  onChange={e => setConfirmPasscode(e.target.value)}
                  placeholder="Confirm new passcode"
                  className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white font-mono placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1">New Hint (Optional)</label>
                <input
                  type="text"
                  value={hint}
                  onChange={e => setHint(e.target.value)}
                  placeholder="Hint to remember your passcode"
                  className="w-full px-3 py-2 bg-[#181820] border border-[#2b2b3b] rounded-xl text-xs text-white placeholder:text-[#525263] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="submit"
                  disabled={isLoading || !currentPasscode || passcode.length < 4}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Update Passcode</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isLoading || !currentPasscode}
                  className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs transition-colors cursor-pointer"
                  title="Remove Passcode Protection"
                >
                  Remove Protection
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: CRYPTOGRAPHIC AUDIT & INFO */}
          {passcodeModalMode === 'security_info' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#15151e] border border-[#252533] rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>Database Storage & Cryptographic Pipeline</span>
                </div>
                <p className="text-[#a1a1aa] leading-relaxed text-[11px]">
                  When a unique passcode is created, the server derives a 16-byte cryptographically secure pseudorandom salt. It then computes a <strong>PBKDF2 SHA-256</strong> hash through <strong>100,000 iterations</strong>.
                </p>
                <p className="text-[#a1a1aa] leading-relaxed text-[11px]">
                  The record is encapsulated into an <strong>AES-256-GCM</strong> authenticated encrypted payload with an ephemeral initialization vector. During authorization, the server decrypts the payload, computes the constant-time hash, and verifies a bitwise match before unlocking access.
                </p>
              </div>

              {/* Stored Hash Details */}
              <div className="p-3 bg-[#171722] border border-[#2a2a3a] rounded-xl space-y-2 font-mono text-[11px]">
                <div className="flex justify-between items-center text-[#8e8ea0]">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold">
                    {passcodeConfig?.hasPasscode ? 'Active & Protected' : 'Not Configured'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#8e8ea0]">
                  <span>Algorithm:</span>
                  <span className="text-white">PBKDF2-HMAC-SHA256</span>
                </div>
                <div className="flex justify-between items-center text-[#8e8ea0]">
                  <span>Hash Preview:</span>
                  <span className="text-indigo-300 font-mono">{passcodeConfig?.hashPreview || 'sha256:7f83...9e24'}</span>
                </div>
                <div className="flex justify-between items-center text-[#8e8ea0]">
                  <span>Salt Preview:</span>
                  <span className="text-indigo-300 font-mono">{passcodeConfig?.salt || 'd7a8fb...'}</span>
                </div>
                <div className="flex justify-between items-center text-[#8e8ea0]">
                  <span>Timing Attack Protection:</span>
                  <span className="text-emerald-400">crypto.timingSafeEqual</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasscodeModalOpen(false);
                    openSecurityGuideModal();
                  }}
                  className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs transition-colors flex items-center space-x-1.5 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Open 5-Pillar Security Guide & Test Bench</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPasscodeModalMode('authorize')}
                  className="px-4 py-2 bg-[#222230] hover:bg-[#2d2d3f] text-white rounded-xl text-xs transition-colors flex items-center space-x-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Back to Authorize</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
