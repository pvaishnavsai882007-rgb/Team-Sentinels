import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  User,
  Building,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Download,
  Smartphone,
  Shield,
  HelpCircle,
  Award
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { generateBase32Secret, generateBackupCodes, getOtpAuthUri, verifyTOTPCode, generateTOTPCode } from '../utils/totp';

interface AuthPageProps {
  allUsers: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterUser: (newUser: UserProfile) => void;
}

type AuthMode = 'login' | 'register';
type AuthStep = 'credentials' | 'two-factor-challenge' | 'two-factor-setup';

export const AuthPage: React.FC<AuthPageProps> = ({
  allUsers,
  onLoginSuccess,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('credentials');

  // Form Fields
  const [email, setEmail] = useState<string>('eleanor.vance@university.edu');
  const [password, setPassword] = useState<string>('docvault2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [department, setDepartment] = useState<string>('Office of Academic Affairs');
  const [role, setRole] = useState<UserRole>('Dean of Academic Affairs');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [enable2FAOnRegister, setEnable2FAOnRegister] = useState<boolean>(true);

  // 2FA Challenge State
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [totpInput, setTotpInput] = useState<string>('');
  const [useBackupCode, setUseBackupCode] = useState<boolean>(false);
  const [backupCodeInput, setBackupCodeInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // 2FA Setup on Register State
  const [regSecret, setRegSecret] = useState<string>('');
  const [regQrUrl, setRegQrUrl] = useState<string>('');
  const [regBackupCodes, setRegBackupCodes] = useState<string[]>([]);
  const [regCopiedCodes, setRegCopiedCodes] = useState<boolean>(false);

  // Live TOTP code generator for convenience
  const [liveDemoCode, setLiveDemoCode] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);

  // Calculate live TOTP code for the pending challenge user
  useEffect(() => {
    const secret = pendingUser?.twoFactorSecret || regSecret;
    if (!secret) return;

    let isMounted = true;
    const updateCode = async () => {
      const code = await generateTOTPCode(secret);
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
  }, [pendingUser, regSecret]);

  // Handle prefill demo accounts
  const handleSelectQuickAccount = (user: UserProfile) => {
    setEmail(user.email);
    setPassword('docvault2026');
    setAuthError(null);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both your university email and password.');
      return;
    }

    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    // Find existing user or match credentials
    const matchedUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser) {
      setAuthError('Invalid credentials. Please register or select one of the university demo accounts.');
      setAuthLoading(false);
      return;
    }

    setAuthLoading(false);

    // If 2FA is active, route to 2FA Challenge step
    if (matchedUser.twoFactorEnabled) {
      setPendingUser(matchedUser);
      setTotpInput('');
      setStep('two-factor-challenge');
    } else {
      onLoginSuccess(matchedUser);
    }
  };

  // Handle 2FA Challenge Verification
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!pendingUser) return;

    setAuthLoading(true);

    if (useBackupCode) {
      // Check emergency backup code
      const cleanCode = backupCodeInput.trim().toUpperCase();
      const codeIndex = pendingUser.backupCodes?.indexOf(cleanCode);

      if (codeIndex !== -1 && codeIndex !== undefined) {
        // Remove used backup code
        const updatedCodes = [...(pendingUser.backupCodes || [])];
        updatedCodes.splice(codeIndex, 1);

        const updatedUser: UserProfile = {
          ...pendingUser,
          backupCodes: updatedCodes,
          lastLogin: 'Just now (Used Backup Code)',
        };

        setAuthLoading(false);
        onLoginSuccess(updatedUser);
      } else {
        setAuthLoading(false);
        setAuthError('Invalid emergency recovery code. Please check your downloaded codes or enter the 6-digit TOTP.');
      }
      return;
    }

    // Check TOTP 6-digit code
    if (totpInput.length !== 6) {
      setAuthError('Please enter a 6-digit authentication code.');
      setAuthLoading(false);
      return;
    }

    const isValid = await verifyTOTPCode(totpInput, pendingUser.twoFactorSecret);
    setAuthLoading(false);

    if (isValid) {
      const updatedUser: UserProfile = {
        ...pendingUser,
        lastLogin: 'Just now',
      };
      onLoginSuccess(updatedUser);
    } else {
      setAuthError('Invalid 2FA code. Please verify against your authenticator app or use the live demo helper code.');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setAuthError('Please fill in all required registration fields.');
      return;
    }

    if (allUsers.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setAuthError('An account with this university email already exists. Please log in.');
      return;
    }

    // Generate initials & color
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [
      'bg-gradient-to-tr from-orange-500 to-amber-500',
      'bg-gradient-to-tr from-blue-600 to-indigo-600',
      'bg-gradient-to-tr from-emerald-600 to-teal-600',
      'bg-gradient-to-tr from-purple-600 to-pink-600',
      'bg-gradient-to-tr from-rose-600 to-orange-600',
    ];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const secret = generateBase32Secret(16);
    const codes = generateBackupCodes(8);

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: role,
      department: department.trim(),
      employeeId: employeeId.trim() || `EMP-${Date.now().toString().slice(-4)}`,
      avatarInitials: initials,
      avatarColor: avatarColor,
      twoFactorEnabled: enable2FAOnRegister,
      twoFactorSecret: secret,
      backupCodes: codes,
      lastLogin: 'Just now (First Sign In)',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    if (enable2FAOnRegister) {
      setPendingUser(newUser);
      setRegSecret(secret);
      setRegBackupCodes(codes);

      const otpUri = getOtpAuthUri(newUser.email, secret, 'DocVault AI');
      QRCode.toDataURL(otpUri, {
        width: 256,
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      })
        .then((url) => setRegQrUrl(url))
        .catch((err) => console.error(err));

      setStep('two-factor-setup');
    } else {
      onRegisterUser(newUser);
      onLoginSuccess(newUser);
    }
  };

  // Complete 2FA Setup on Register
  const handleFinishRegister2FA = () => {
    if (pendingUser) {
      onRegisterUser(pendingUser);
      onLoginSuccess(pendingUser);
    }
  };

  const handleDownloadRegCodes = () => {
    if (!pendingUser) return;
    const fileContent = `DOCVAULT AI — 2FA EMERGENCY RECOVERY CODES\nUser: ${pendingUser.name} (${pendingUser.email})\nRole: ${pendingUser.role}\nDepartment: ${pendingUser.department}\n\nBackup Codes:\n${regBackupCodes.map((c, i) => `[${i + 1}] ${c}`).join('\n')}`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DocVault-2FA-Codes-${pendingUser.email.split('@')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Background Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] -top-32 -left-32 absolute" />
        <div className="w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -bottom-32 -right-32 absolute" />
      </div>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: University Governance Brand & Security Highlights */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 pr-4 rounded-2xl shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white font-['Space_Grotesk'] block leading-none">
                DocVault <span className="text-orange-400">AI</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Enterprise University Portal</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
              Consequence-Aware Governance & 2FA Security
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Authenticate into your university node to evaluate policy changes, track cross-departmental ripple effects, and review smart approval workflows.
            </p>
          </div>

          {/* Security Badges */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-slate-200 block">RFC 6238 TOTP Two-Factor Authentication</span>
                <span className="text-slate-400">Compatible with Google Authenticator, Microsoft Authenticator & Authy</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-slate-200 block">Role-Based Access Governance</span>
                <span className="text-slate-400">Registrar, Dean, Controller of Examinations, Faculty & Senate Profiles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative">
          {/* STEP 1: CREDENTIALS (Login / Register Tabs) */}
          {step === 'credentials' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Tab Switcher */}
              <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-slate-800/90 text-xs font-bold">
                <button
                  type="button"
                  id="tab-auth-login"
                  onClick={() => {
                    setMode('login');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    mode === 'login'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  id="tab-auth-register"
                  onClick={() => {
                    setMode('register');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    mode === 'register'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Register Account</span>
                </button>
              </div>

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {/* Quick Select Demo Accounts */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Quick Demo Accounts (1-Click Test):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {allUsers.slice(0, 4).map((u) => (
                        <button
                          type="button"
                          key={u.id}
                          onClick={() => handleSelectQuickAccount(u)}
                          className={`p-2 rounded-xl text-left border text-xs transition-all flex items-center gap-2 ${
                            email === u.email
                              ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 ring-1 ring-orange-400/40'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg ${u.avatarColor} text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0`}>
                            {u.avatarInitials}
                          </div>
                          <div className="truncate">
                            <span className="font-bold block truncate">{u.name.split(' ')[0]} {u.name.split(' ')[1]?.[0]}.</span>
                            <span className="text-[10px] text-slate-400 block truncate">{u.role.split(' ')[0]}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        University Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. yourname@university.edu"
                          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-300">Password</label>
                        <span className="text-[11px] text-orange-400 hover:underline cursor-pointer">
                          Forgot password?
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-sm text-white outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    {authLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Sign In & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Full Name & Title
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Jordan Hayes"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        University Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jordan.hayes@university.edu"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        University Governance Role
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none"
                      >
                        <option value="University Registrar">University Registrar</option>
                        <option value="Dean of Academic Affairs">Dean of Academic Affairs</option>
                        <option value="Controller of Examinations">Controller of Examinations</option>
                        <option value="Department Chairperson">Department Chairperson</option>
                        <option value="Faculty Member">Faculty Member</option>
                        <option value="Student Representative">Student Representative</option>
                        <option value="Compliance Officer">Compliance Officer</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Department / Office
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Faculty of Engineering"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Create Master Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters with numbers & symbols"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  {/* 2FA Enable Switch */}
                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Enable Two-Factor Authentication (2FA)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Recommended for academic governance and policy edits
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enable2FAOnRegister}
                      onChange={(e) => setEnable2FAOnRegister(e.target.checked)}
                      className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                    />
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{enable2FAOnRegister ? 'Proceed to 2FA QR Setup' : 'Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: TWO-FACTOR CHALLENGE (Upon Login) */}
          {step === 'two-factor-challenge' && pendingUser && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Two-Factor Authentication Required</h3>
                <p className="text-xs text-slate-300">
                  Signing in as <strong className="text-white">{pendingUser.name}</strong> ({pendingUser.role}).
                </p>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-4">
                {!useBackupCode ? (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-300 text-center block">
                      Enter 6-digit code from Google/Microsoft Authenticator
                    </label>

                    <input
                      type="text"
                      maxLength={6}
                      value={totpInput}
                      onChange={(e) => {
                        setTotpInput(e.target.value.replace(/\D/g, ''));
                        setAuthError(null);
                      }}
                      placeholder="000000"
                      autoFocus
                      className="w-full text-center tracking-[0.5em] text-3xl font-mono font-black py-4 bg-slate-950 border-2 border-slate-700 focus:border-orange-500 rounded-2xl text-white outline-none transition-all shadow-inner"
                    />

                    {/* Live Demo Code Shortcut */}
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setTotpInput(liveDemoCode)}
                        className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Autofill Demo Code: <strong className="font-mono text-white tracking-wider">{liveDemoCode}</strong></span>
                      </button>
                      <span className="text-[11px] text-slate-400 font-mono">{countdown}s</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Enter Single-Use Backup Recovery Code (e.g. 8492-9381)
                    </label>
                    <input
                      type="text"
                      value={backupCodeInput}
                      onChange={(e) => {
                        setBackupCodeInput(e.target.value);
                        setAuthError(null);
                      }}
                      placeholder="XXXX-XXXX"
                      autoFocus
                      className="w-full text-center font-mono font-bold tracking-wider py-3.5 bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-xl text-base text-white outline-none"
                    />
                  </div>
                )}

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUseBackupCode(!useBackupCode);
                      setAuthError(null);
                    }}
                    className="text-orange-400 hover:underline"
                  >
                    {useBackupCode ? 'Use 6-digit Authenticator Code' : 'Lost your phone? Use Backup Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('credentials');
                      setAuthError(null);
                    }}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Cancel & Back
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Verify 2FA & Enter Portal</span>
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: 2FA ONBOARDING FOR NEW REGISTRATION */}
          {step === 'two-factor-setup' && pendingUser && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Scan 2FA QR Code</h3>
                <p className="text-xs text-slate-400">
                  Scan this QR code with Google Authenticator or Microsoft Authenticator to link your university account.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="p-2.5 bg-white rounded-xl shadow-lg flex-shrink-0">
                  {regQrUrl ? (
                    <img src={regQrUrl} alt="2FA QR Code" className="w-36 h-36 object-contain" />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center text-slate-900 font-mono text-xs">
                      Loading QR...
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs flex-1">
                  <div>
                    <span className="text-slate-400 block mb-1">Manual Secret Key:</span>
                    <code className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-orange-400 font-mono font-bold block select-all break-all">
                      {regSecret}
                    </code>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    After scanning, your authenticator will generate a dynamic 6-digit passcode every 30 seconds.
                  </p>
                </div>
              </div>

              {/* Backup Codes */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Your Emergency Backup Codes</span>
                  <button
                    type="button"
                    onClick={handleDownloadRegCodes}
                    className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .txt</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono font-bold text-orange-400 text-center">
                  {regBackupCodes.slice(0, 4).map((c, i) => (
                    <div key={i} className="p-1 rounded bg-slate-900 border border-slate-800">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinishRegister2FA}
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Complete Setup & Enter Portal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
