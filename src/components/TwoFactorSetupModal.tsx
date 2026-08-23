import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Copy,
  Check,
  Download,
  AlertTriangle,
  X,
  Sparkles,
  Key,
  Lock,
  ArrowRight,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';
import { generateBase32Secret, generateBackupCodes, getOtpAuthUri, verifyTOTPCode, generateTOTPCode } from '../utils/totp';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: QR Scan, 2: Verify Code, 3: Backup Codes
  const [secretKey, setSecretKey] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedSecret, setCopiedSecret] = useState<boolean>(false);
  const [copiedCodes, setCopiedCodes] = useState<boolean>(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [liveDemoCode, setLiveDemoCode] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);

  // Initialize or reset setup state
  useEffect(() => {
    if (isOpen) {
      const newSecret = currentUser.twoFactorSecret || generateBase32Secret(16);
      setSecretKey(newSecret);
      setStep(1);
      setVerificationCode('');
      setVerifyError(null);

      const generatedCodes = currentUser.backupCodes?.length ? currentUser.backupCodes : generateBackupCodes(8);
      setBackupCodes(generatedCodes);

      // Generate real QR code image data
      const otpUri = getOtpAuthUri(currentUser.email, newSecret, 'DocVault AI');
      QRCode.toDataURL(otpUri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [isOpen, currentUser]);

  // Live TOTP code generator for test convenience
  useEffect(() => {
    if (!secretKey) return;
    let isMounted = true;

    const updateCode = async () => {
      const code = await generateTOTPCode(secretKey);
      if (isMounted) {
        setLiveDemoCode(code);
        const epoch = Math.floor(Date.now() / 1000);
        setCountdown(30 - (epoch % 30));
      }
    };

    updateCode();
    const interval = setInterval(updateCode, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [secretKey]);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const fileContent = `DOCVAULT AI — UNIVERSITY 2FA EMERGENCY RECOVERY CODES\nUser: ${currentUser.name} (${currentUser.email})\nRole: ${currentUser.role}\nDepartment: ${currentUser.department}\nGenerated: ${new Date().toLocaleString()}\n\nEach code can be used once if you lose access to your authenticator app:\n\n${backupCodes.map((c, i) => `[${i + 1}] ${c}`).join('\n')}\n\nKeep these codes in a secure, confidential place.`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DocVault-2FA-BackupCodes-${currentUser.email.split('@')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleVerifyCode = async () => {
    setVerifyError(null);
    if (!verificationCode || verificationCode.trim().length !== 6) {
      setVerifyError('Please enter a valid 6-digit authentication code.');
      return;
    }

    setIsVerifying(true);
    try {
      const isValid = await verifyTOTPCode(verificationCode, secretKey);
      if (isValid) {
        setStep(3); // Proceed to backup codes
      } else {
        setVerifyError('Invalid verification code. Please check your authenticator app or enter the demo code shown.');
      }
    } catch (err) {
      setVerifyError('Failed to verify authentication code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteSetup = () => {
    const updated: UserProfile = {
      ...currentUser,
      twoFactorEnabled: true,
      twoFactorSecret: secretKey,
      backupCodes: backupCodes,
    };
    onUpdateUser(updated);
    onClose();
  };

  const handleDisable2FA = () => {
    if (window.confirm('Are you sure you want to disable Two-Factor Authentication? This will reduce your account security.')) {
      const updated: UserProfile = {
        ...currentUser,
        twoFactorEnabled: false,
      };
      onUpdateUser(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                  Two-Factor Authentication (2FA)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RFC 6238 TOTP
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Secure your university governance and policy modification permissions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              1
            </span>
            <span className={step === 1 ? 'text-white font-bold' : 'text-slate-400'}>Scan QR Code</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={step === 2 ? 'text-white font-bold' : 'text-slate-400'}>Verify 6-Digit Code</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 3 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-white font-bold' : 'text-slate-400'}>Save Backup Codes</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* STEP 1: Scan QR Code */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" />
                  <span>Step 1: Link your Authenticator App</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Open <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, <strong>Authy</strong>, or <strong>1Password</strong> on your mobile device and scan the QR code below.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 p-6 rounded-3xl border border-slate-800">
                {/* QR Code Container */}
                <div className="p-3 bg-white rounded-2xl shadow-xl flex-shrink-0">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="2FA QR Code" className="w-44 h-44 object-contain rounded-lg" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-900 font-mono text-xs">
                      Loading QR...
                    </div>
                  )}
                </div>

                {/* Secret Key & Manual Option */}
                <div className="space-y-4 text-left flex-1 w-full">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Can&apos;t scan? Enter this secret key manually:
                    </span>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                      <code className="text-xs sm:text-sm font-mono font-bold text-orange-400 flex-1 select-all break-all">
                        {secretKey}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                      >
                        {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live helper for easy instant testing */}
                  <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-orange-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Live Authenticator Code (Demo Helper):
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        Refreshes in {countdown}s
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-base font-mono font-black text-white tracking-widest bg-slate-900/90 px-3 py-1 rounded-lg border border-orange-500/30">
                        {liveDemoCode}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (Matches real Google/Microsoft Authenticator)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {currentUser.twoFactorEnabled && (
                  <button
                    type="button"
                    onClick={handleDisable2FA}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Disable 2FA Protection
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="ml-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <span>Next: Verify Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Verify Code */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn max-w-md mx-auto">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Enter 6-Digit Code</h3>
                <p className="text-xs text-slate-400">
                  Enter the 6-digit confirmation code generated by your authenticator app for <strong>DocVault AI</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value.replace(/\D/g, ''));
                      setVerifyError(null);
                    }}
                    placeholder="000000"
                    autoFocus
                    className="w-full text-center tracking-[0.6em] text-2xl font-mono font-black py-4 bg-slate-950 border-2 border-slate-700 focus:border-orange-500 rounded-2xl text-white outline-none transition-all"
                  />
                </div>

                {/* Quick Demo Autofill Button */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <button
                    type="button"
                    onClick={() => setVerificationCode(liveDemoCode)}
                    className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Autofill current demo code ({liveDemoCode})</span>
                  </button>
                  <span className="font-mono">{countdown}s</span>
                </div>

                {verifyError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="flex-1 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Verify & Continue</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Save Backup Codes */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">2FA Verification Successful</h4>
                  <p className="text-xs text-slate-300">
                    Your authenticator app is now linked. Save these emergency backup recovery codes in case you lose access to your device.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Emergency Recovery Codes (Single-Use)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyBackupCodes}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCodes ? 'Copied' : 'Copy All'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadBackupCodes}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .txt</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {backupCodes.map((code, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs sm:text-sm font-bold text-orange-400"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Store these in a password manager or secure notes. Each code can only be used once for emergency sign-in.
                </p>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleCompleteSetup}
                  className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Finish & Activate Two-Factor Protection</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
