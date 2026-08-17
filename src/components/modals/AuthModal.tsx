import React, { useState, useRef, useEffect } from 'react';
import { useIDE } from '../../context/IDEContext';
import { 
  Mail, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Key, 
  LogOut, 
  Copy, 
  Check, 
  Inbox,
  UserCheck
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    sendVerificationCode,
    verifyCode,
    resendVerificationCode,
    logout,
    latestPreviewCode
  } = useIDE();

  // Step state: 'input' | 'verify' | 'success' | 'profile'
  const [step, setStep] = useState<'input' | 'verify' | 'success' | 'profile'>('input');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [copiedCode, setCopiedCode] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // When modal opens, initialize based on user state
  useEffect(() => {
    if (isAuthModalOpen) {
      setStatusMessage(null);
      if (user) {
        setStep('profile');
      } else {
        setStep('input');
        // Preset with user email if available
        setEmail('oomkarchavan@gmail.com');
        setName('Omkar Chavan');
      }
    }
  }, [isAuthModalOpen, user]);

  // Resend countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isAuthModalOpen) return null;

  // Handle Send Code
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatusMessage({ text: 'Please enter a valid email address.', isError: true });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const res = await sendVerificationCode(email.trim(), name.trim());
    setIsLoading(false);

    if (res.success) {
      setStep('verify');
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      setStatusMessage({ text: res.message });
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } else {
      setStatusMessage({ text: res.error || res.message, isError: true });
    }
  };

  // Handle Digit Change
  const handleDigitChange = (index: number, val: string) => {
    // If multiple chars pasted
    if (val.length > 1) {
      const cleanDigits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      cleanDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(cleanDigits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      
      // Auto-submit if complete
      if (cleanDigits.length === 6) {
        handleAutoVerify(newDigits.join(''));
      }
      return;
    }

    const cleanChar = val.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleanChar;
    setDigits(newDigits);

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if 6th digit entered
    if (cleanChar && index === 5 && newDigits.every(d => d.length > 0)) {
      handleAutoVerify(newDigits.join(''));
    }
  };

  // Handle Key Down in Digit Input (Backspace support)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill Preview Code
  const handleAutoFillCode = () => {
    if (!latestPreviewCode) return;
    const split = latestPreviewCode.split('');
    setDigits(split);
    handleAutoVerify(latestPreviewCode);
  };

  // Verify Code
  const handleAutoVerify = async (fullCode: string) => {
    setIsLoading(true);
    setStatusMessage(null);

    const res = await verifyCode(email.trim(), fullCode, name.trim());
    setIsLoading(false);

    if (res.success) {
      setStep('success');
      setStatusMessage({ text: res.message });
    } else {
      setStatusMessage({ text: res.error || res.message, isError: true });
    }
  };

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setStatusMessage({ text: 'Please enter all 6 digits of the verification code.', isError: true });
      return;
    }
    handleAutoVerify(fullCode);
  };

  // Resend code
  const handleResend = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    const res = await resendVerificationCode(email.trim());
    setIsLoading(false);
    if (res.success) {
      setCountdown(60);
      setStatusMessage({ text: res.message });
    } else {
      setStatusMessage({ text: res.error || res.message, isError: true });
    }
  };

  const handleCopyCode = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#121215] border border-[#22222a] w-full max-w-md rounded-xl shadow-2xl overflow-hidden text-xs text-[#a1a1aa] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-[#1e1e24] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-md bg-[#1a1a22] border border-[#262632] text-[#818cf8]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white flex items-center space-x-2">
                <span>{step === 'profile' ? 'Account Profile' : 'Email & Gmail Verification'}</span>
                {user?.isVerified && (
                  <span className="px-1.5 py-0.2 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] text-[9px] font-mono">
                    VERIFIED
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-[#71717a]">
                {step === 'verify' ? 'Enter the 6-digit code sent to your email' : 'Sign in & verify your developer account'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded hover:bg-[#1a1a22] text-[#71717a] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {/* STEP 1: Email Input */}
          {step === 'input' && (
            <form onSubmit={handleSendCode} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider block">
                  Gmail / Developer Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. oomkarchavan@gmail.com"
                    className="w-full bg-[#0d0d0f] border border-[#202028] focus:border-[#6366f1] rounded px-3 py-2 text-xs text-white placeholder-[#52525b] font-mono focus:outline-none transition-colors"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[#52525b] text-[10px] font-mono">
                    {email.endsWith('@gmail.com') ? 'Gmail' : 'Email'}
                  </span>
                </div>
              </div>

              {/* Quick Suggestion Chip */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-[#52525b]">Quick Select:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('oomkarchavan@gmail.com');
                    setName('Omkar Chavan');
                  }}
                  className="px-2 py-0.5 rounded bg-[#17171c] hover:bg-[#202028] border border-[#262632] text-[#818cf8] text-[10px] font-mono transition-colors"
                >
                  oomkarchavan@gmail.com
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider block">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Omkar Chavan"
                  className="w-full bg-[#0d0d0f] border border-[#202028] focus:border-[#6366f1] rounded px-3 py-2 text-xs text-white placeholder-[#52525b] focus:outline-none transition-colors"
                />
              </div>

              {/* Feature Callout */}
              <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-white font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Autonomous Agent Verification</span>
                </div>
                <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
                  We dispatch an instant 6-digit OTP code directly to your email. Verified accounts unlock cloud repo sync and BYOK orchestrator persistence.
                </p>
              </div>

              {statusMessage && (
                <div className={`p-2.5 rounded text-[11px] flex items-start space-x-2 ${
                  statusMessage.isError
                    ? 'bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185]'
                    : 'bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399]'
                }`}>
                  {statusMessage.isError ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white font-medium rounded text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Code to Email...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify 6-Digit Code */}
          {step === 'verify' && (
            <form onSubmit={handleManualVerify} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center p-2 rounded-full bg-[#1c1c28] border border-[#2d2d3e] text-[#818cf8] mb-1">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="text-white font-medium text-xs">Check your Email Inbox</div>
                <div className="text-[11px] text-[#71717a] font-mono truncate max-w-xs mx-auto">
                  {email}
                </div>
              </div>

              {/* In-App Live Email Delivery Preview Banner */}
              {latestPreviewCode && (
                <div className="bg-[#1a1c29] border border-[#3b3e5a] rounded-lg p-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#a5b4fc] font-medium flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#818cf8]" />
                      <span>Email Code Delivered:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(latestPreviewCode)}
                      className="text-[10px] text-[#71717a] hover:text-white flex items-center space-x-1"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-[#34d399]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-[#12131e] p-2 rounded border border-[#27293d]">
                    <span className="font-mono text-sm font-bold tracking-widest text-[#ededee]">
                      {latestPreviewCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillCode}
                      className="px-2 py-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium rounded text-[10px] flex items-center space-x-1 transition-all"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Auto-fill & Verify</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 6 Digit Input Boxes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider block text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center space-x-2">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-10 h-11 bg-[#0d0d0f] border border-[#202028] focus:border-[#6366f1] rounded-lg text-center text-base font-mono font-bold text-white focus:outline-none transition-colors"
                    />
                  ))}
                </div>
              </div>

              {statusMessage && (
                <div className={`p-2.5 rounded text-[11px] flex items-start space-x-2 ${
                  statusMessage.isError
                    ? 'bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#fb7185]'
                    : 'bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399]'
                }`}>
                  {statusMessage.isError ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Actions */}
              <button
                type="submit"
                disabled={isLoading || digits.join('').length !== 6}
                className="w-full py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white font-medium rounded text-xs flex items-center justify-center space-x-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify Code & Sign In</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-1">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="hover:text-[#ededee] transition-colors"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className={`${countdown > 0 ? 'text-[#52525b] cursor-not-allowed' : 'text-[#818cf8] hover:text-[#a5b4fc] font-medium'}`}
                >
                  {countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Verification Success */}
          {step === 'success' && (
            <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">Verification Complete!</h3>
                <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                  Welcome to Cursor AI IDE, <span className="text-white font-medium">{user?.name || email}</span>.
                </p>
              </div>

              <div className="bg-[#15151a] border border-[#202028] rounded-lg p-3 text-left space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between text-[#71717a]">
                  <span>Email:</span>
                  <span className="text-white">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between text-[#71717a]">
                  <span>Status:</span>
                  <span className="text-[#34d399] font-medium">✓ Verified Active</span>
                </div>
                <div className="flex items-center justify-between text-[#71717a]">
                  <span>Session:</span>
                  <span className="text-[#a1a1aa] truncate max-w-[160px]">{user?.token || 'active_jwt_session'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="w-full py-2 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded text-xs transition-all shadow-xs"
              >
                Continue to AI Workspace
              </button>
            </div>
          )}

          {/* STEP 4: Active Profile View */}
          {step === 'profile' && user && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-[#15151a] border border-[#202028] p-3 rounded-lg">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-[#2a2a38] bg-[#0d0d0f]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-xs truncate">{user.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20 text-[9px] font-mono">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-[11px] text-[#71717a] font-mono truncate">{user.email}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider">
                  Session & Permissions
                </div>

                <div className="bg-[#121215] border border-[#1e1e24] rounded p-2.5 space-y-1.5 text-[10px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">Auth Provider:</span>
                    <span className="text-[#818cf8] capitalize">{user.provider || 'Gmail'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">Verified At:</span>
                    <span className="text-[#ededee]">{new Date(user.verifiedAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">4-Agent Access:</span>
                    <span className="text-[#34d399]">Full Developer Permissions</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setEmail('');
                    setName('');
                  }}
                  className="flex-1 py-1.5 bg-[#17171c] hover:bg-[#202028] border border-[#262632] text-[#ededee] rounded text-xs transition-colors"
                >
                  Verify Another Email
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setStep('input');
                  }}
                  className="px-3 py-1.5 bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 border border-[#f43f5e]/30 text-[#fb7185] rounded text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#1e1e24] bg-[#0d0d0f] flex items-center justify-between text-[10px] text-[#52525b]">
          <div className="flex items-center space-x-1">
            <UserCheck className="w-3 h-3 text-[#34d399]" />
            <span>Secure OTP Email Authentication</span>
          </div>
          <span>v2.4 Cursor AI</span>
        </div>
      </div>
    </div>
  );
};
