import { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, GraduationCap, Lock, Quote as QuoteIcon, User, BookOpen, Users } from 'lucide-react';
import { LOGIN_QUOTES } from './WelcomeBanner';

interface LoginScreenProps {
  schoolLogo: string;
  schoolName: string;
  districtName: string;
  mode: string;
  username: string;
  password: string;
  error: string;
  loading: boolean;
  showRecovery: boolean;
  recoveryCode: string;
  onUsername: (value: string) => void;
  onPassword: (value: string) => void;
  onLogin: () => void;
  onToggleRecovery: () => void;
  onRecoveryCode: (value: string) => void;
  onResetAdmin: () => void;
}

function HeroArt() {
  return (
    <svg className="login-art" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="la-page" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#dbeafe" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="la-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#d4a017" />
        </linearGradient>
      </defs>
      <g opacity="0.35" fill="none" stroke="#bfdbfe" strokeWidth="1.2">
        <circle cx="200" cy="150" r="120" />
        <circle cx="200" cy="150" r="88" />
        <circle cx="200" cy="150" r="56" />
      </g>
      <g fill="#fde68a">
        <circle cx="62" cy="48" r="3" /><circle cx="338" cy="72" r="2.5" /><circle cx="110" cy="250" r="2" />
        <circle cx="318" cy="238" r="3" /><circle cx="350" cy="150" r="2" /><circle cx="46" cy="150" r="2" />
      </g>
      <path d="M200 205 C170 188 120 184 82 196 L82 108 C120 96 170 100 200 118 Z" fill="url(#la-page)" />
      <path d="M200 205 C230 188 280 184 318 196 L318 108 C280 96 230 100 200 118 Z" fill="url(#la-page)" opacity="0.92" />
      <path d="M200 118 L200 205" fill="none" stroke="#93c5fd" strokeWidth="2" />
      <g fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <path d="M100 126 C125 120 150 124 180 136" /><path d="M100 146 C125 140 150 144 180 156" /><path d="M100 166 C125 160 150 164 180 176" />
        <path d="M300 126 C275 120 250 124 220 136" /><path d="M300 146 C275 140 250 144 220 156" /><path d="M300 166 C275 160 250 164 220 176" />
      </g>
      <g transform="translate(200 72)">
        <path d="M0 -26 L52 -4 L0 18 L-52 -4 Z" fill="url(#la-gold)" />
        <path d="M-30 6 L-30 26 C-14 38 14 38 30 26 L30 6 L0 20 Z" fill="#1e3a8a" opacity="0.95" />
        <path d="M46 -1 L46 28" fill="none" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="46" cy="31" r="4" fill="#fde68a" />
      </g>
    </svg>
  );
}

export function LoginScreen(props: LoginScreenProps) {
  const { schoolLogo, schoolName, districtName, mode, username, password, error, loading, showRecovery, recoveryCode } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => { setQuoteIndex(index => (index + 1) % LOGIN_QUOTES.length); setFading(false); }, 450);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const quote = LOGIN_QUOTES[quoteIndex];
  const submit = (event: FormEvent) => { event.preventDefault(); if (!loading) props.onLogin(); };

  return (
    <div className="login-page">
      <aside className="login-hero">
        {/* Optional school photo: put a picture at public/images/login-hero.jpg and it appears here. */}
        <div className="login-hero__photo" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(155deg, rgba(11,29,63,0.82), rgba(11,29,63,0.55)), url(/images/login-hero.jpg)' }} />
        <div className="login-hero__content">
          <div className="login-hero__brand">
            <div className="login-logo-ring">
              {schoolLogo ? <img src={schoolLogo} alt="School logo" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <GraduationCap size={44} />}
            </div>
            <div>
              <p className="login-hero__school">{schoolName}</p>
              <p className="login-hero__district">{districtName}</p>
            </div>
          </div>
          <HeroArt />
          <div className={`login-quote ${fading ? 'is-fading' : ''}`}>
            <QuoteIcon size={22} className="login-quote__mark" aria-hidden="true" />
            <p className="login-quote__text">{quote.text}</p>
            {quote.by && <p className="login-quote__by">— {quote.by}</p>}
          </div>
          <p className="login-hero__motto">Honor All &middot; Build Together</p>
        </div>
      </aside>

      <main className="login-panel">
        <div className="login-card">
          <div className="login-card__mobile-brand">
            <div className="login-logo-ring login-logo-ring--small">
              {schoolLogo ? <img src={schoolLogo} alt="School logo" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <GraduationCap size={30} />}
            </div>
            <p>{schoolName}</p>
          </div>
          <h1 className="login-card__title">Welcome back</h1>
          <p className="login-card__subtitle">Sign in to the School Management System</p>

          <form onSubmit={submit} className="login-form" autoComplete="on">
            <label className="login-field">
              <span className="login-field__label">Username</span>
              <span className="login-field__box">
                <User size={18} aria-hidden="true" />
                <input type="text" name="username" autoComplete="username" placeholder="Enter your username" value={username} onChange={e => props.onUsername(e.target.value)} />
              </span>
            </label>
            <label className="login-field">
              <span className="login-field__label">Password</span>
              <span className="login-field__box">
                <Lock size={18} aria-hidden="true" />
                <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => props.onPassword(e.target.value)} />
                <button type="button" className="login-eye" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="login-submit">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-meta">
            <span className="login-badge">{mode}</span>
            <span className="login-chips"><span><BookOpen size={14} /> Teachers</span><span><Users size={14} /> Parents</span></span>
          </div>

          <details className="login-help">
            <summary>Help &amp; default passwords</summary>
            <p>Admin: admin / admin123 &nbsp;|&nbsp; Teacher: Teacher@123 &nbsp;|&nbsp; Parent: Parent@123</p>
            <p>Best in Chrome / Opera / Firefox. Opera Mini may be slow to sign in; press "Sign In" again after 3 seconds or switch to Chrome.</p>
          </details>

          <button type="button" onClick={props.onToggleRecovery} className="login-link">Forgot Admin Password?</button>
          {showRecovery && (
            <div className="login-recovery">
              <p>Enter Master Recovery Code:</p>
              <input type="password" placeholder="Recovery Code" value={recoveryCode} onChange={e => props.onRecoveryCode(e.target.value)} />
              <button type="button" onClick={props.onResetAdmin}>Reset Admin Password</button>
              <small>Contact your school IT administrator for the recovery code.</small>
            </div>
          )}
        </div>
        <p className="login-footer">&copy; {new Date().getFullYear()} {schoolName}</p>
      </main>
    </div>
  );
}
