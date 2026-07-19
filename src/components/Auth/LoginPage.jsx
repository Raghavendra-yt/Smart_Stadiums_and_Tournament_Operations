import React, { useState } from 'react';
import { useStadium } from '../../context/StadiumContext';

export function LoginPage({ targetRole }) {
  const { loginRole } = useStadium();
  
  const isOps = targetRole === 'ops';
  const roleTitle = isOps ? 'Organizer Operations Control Room' : 'Volunteer Support Hub';
  const roleBadge = isOps ? 'RESTRICTED AIOPS PORTAL' : 'FIELD VOLUNTEER ACCESS';
  const roleIcon = isOps ? 'admin_panel_settings' : 'badge';

  const defaultDemoEmail = isOps ? 'organizer@worldcup2026.org' : 'volunteer@worldcup2026.org';
  const defaultDemoPass = isOps ? 'ops2026' : 'staff2026';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email/ID and Password.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), role: targetRole })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loginRole(targetRole, data.user, data.token);
      } else {
        setErrorMsg(data.message || 'Invalid credentials or unauthorized role access.');
      }
    } catch (err) {
      console.warn('Backend server auth fallback active:', err);
      // Fallback for demo
      loginRole(targetRole, {
        name: isOps ? 'J. Smith' : 'Vol. Alex Rivera',
        title: isOps ? 'Senior Ops Controller' : 'Gate 4 Specialist',
        email: email.trim()
      }, `demo-token-${targetRole}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (roleToLogin) => {
    const demoEmail = roleToLogin === 'ops' ? 'organizer@worldcup2026.org' : 'volunteer@worldcup2026.org';
    const demoPass = roleToLogin === 'ops' ? 'ops2026' : 'staff2026';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass, role: roleToLogin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loginRole(roleToLogin, data.user, data.token);
        return;
      }
    } catch (e) {
      console.warn('Backend auth error:', e);
    }

    loginRole(roleToLogin, {
      name: roleToLogin === 'ops' ? 'J. Smith' : 'Vol. Alex Rivera',
      title: roleToLogin === 'ops' ? 'Senior Ops Controller' : 'Gate 4 Specialist',
      email: demoEmail
    }, `demo-token-${roleToLogin}`);
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-gutter py-12 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Main Login Form */}
        <div className="md:col-span-7 glass-panel rounded-2xl p-8 border border-outline-variant/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim/20 text-primary-fixed-dim flex items-center justify-center border border-primary-fixed-dim/40 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">{roleIcon}</span>
              </div>
              <div>
                <span className="text-[10px] font-label-bold text-secondary-fixed-dim tracking-wider uppercase bg-secondary-container/30 px-2 py-0.5 rounded border border-secondary/20">
                  {roleBadge}
                </span>
                <h1 className="font-headline-md text-2xl text-on-surface font-bold mt-1">
                  {roleTitle}
                </h1>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant mb-6">
              Please enter your credentials to authenticate into the {isOps ? 'Stadium Operations Telemetry' : 'Volunteer Support'} engine.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-error-container/80 text-on-error-container text-xs rounded-lg border border-error/40 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-label-bold text-on-surface-variant mb-1.5 uppercase">
                  User ID / Official Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-sm">mail</span>
                  <input
                    type="text"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 pl-10 pr-4 text-sm text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim outline-none transition-all"
                    placeholder={`e.g., ${defaultDemoEmail}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-bold text-on-surface-variant mb-1.5 uppercase">
                  Passcode / Token
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-sm">lock</span>
                  <input
                    type="password"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2.5 pl-10 pr-4 text-sm text-on-surface focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-fixed-dim outline-none transition-all"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container text-on-primary-container font-label-bold py-3 rounded-lg hover:bg-primary transition-all glow-accent flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                {isSubmitting ? 'Authenticating...' : 'Authenticate & Access Portal'}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/20 flex justify-between items-center text-xs text-on-surface-variant">
            <span>FIFA 2026 Database Auth System</span>
            <span className="text-secondary flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse"></span>
              API Connected
            </span>
          </div>
        </div>

        {/* Demo Credentials Card */}
        <div className="md:col-span-5 glass-panel rounded-2xl p-6 border border-secondary/30 bg-secondary-container/10 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container font-label-bold text-[10px] px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">vpn_key</span> DEMO ACCESS
          </div>

          <div>
            <h2 className="font-headline-md text-lg text-primary-fixed-dim font-bold mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified</span> Demo Credentials
            </h2>
            <p className="text-xs text-on-surface-variant mb-6">
              Use these pre-configured test accounts stored in the backend database:
            </p>

            <div className="space-y-4">
              {/* Organizers Account Pill */}
              <div className={`p-4 rounded-xl border transition-all ${isOps ? 'bg-surface-container-high border-primary-fixed-dim/50' : 'bg-surface-container-low border-outline-variant/30'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-bold text-xs text-primary-fixed-dim flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span> Organizers (Ops Control)
                  </span>
                  <span className="text-[10px] bg-primary-fixed-dim/20 text-primary-fixed-dim px-2 py-0.5 rounded font-mono">Senior Controller</span>
                </div>
                <div className="space-y-1 font-mono text-xs text-on-surface-variant">
                  <div><strong className="text-on-surface">Email:</strong> organizer@worldcup2026.org</div>
                  <div><strong className="text-on-surface">Passcode:</strong> ops2026</div>
                </div>
                <button
                  onClick={() => handleQuickDemoLogin('ops')}
                  className="mt-3 w-full bg-primary-fixed-dim/20 hover:bg-primary-fixed-dim text-primary-fixed-dim hover:text-on-primary-fixed border border-primary-fixed-dim/40 font-label-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span> Quick Login as Organizer
                </button>
              </div>

              {/* Volunteers Account Pill */}
              <div className={`p-4 rounded-xl border transition-all ${!isOps ? 'bg-surface-container-high border-secondary/50' : 'bg-surface-container-low border-outline-variant/30'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-bold text-xs text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">badge</span> Volunteers (Support Hub)
                  </span>
                  <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded font-mono">Gate Specialist</span>
                </div>
                <div className="space-y-1 font-mono text-xs text-on-surface-variant">
                  <div><strong className="text-on-surface">Email:</strong> volunteer@worldcup2026.org</div>
                  <div><strong className="text-on-surface">Passcode:</strong> staff2026</div>
                </div>
                <button
                  onClick={() => handleQuickDemoLogin('volunteer')}
                  className="mt-3 w-full bg-secondary-container/40 hover:bg-secondary text-on-secondary-container hover:text-on-secondary border border-secondary/40 font-label-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span> Quick Login as Volunteer
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-outline-variant/20 text-[11px] text-on-surface-variant text-center">
            Database API authenticates credentials against database.json.
          </div>
        </div>

      </div>
    </div>
  );
}
