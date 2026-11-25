import { Sparkles, X } from 'lucide-react';
import { DAILY_MESSAGES, dayOfYear, greetingFor } from '../data/inspiration';

interface WelcomeBannerProps {
  name: string;
  onClose: () => void;
}

export function WelcomeBanner({ name, onClose }: WelcomeBannerProps) {
  const now = new Date();
  const message = DAILY_MESSAGES[dayOfYear(now) % DAILY_MESSAGES.length];
  const dateText = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="welcome-banner no-print" role="status">
      <div className="welcome-banner__glow" aria-hidden="true" />
      <div className="welcome-banner__icon" aria-hidden="true"><Sparkles size={22} /></div>
      <div className="welcome-banner__text">
        <p className="welcome-banner__small">{greetingFor(now)} &middot; {dateText}</p>
        <h2 className="welcome-banner__title">Welcome, {name || 'friend'}!</h2>
        <p className="welcome-banner__headline">{message.headline} <span>{message.line}</span></p>
      </div>
      <button type="button" aria-label="Close welcome message" onClick={onClose} className="welcome-banner__close"><X size={18} /></button>
    </div>
  );
}
