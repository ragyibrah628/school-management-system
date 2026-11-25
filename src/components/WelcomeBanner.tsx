import { Sparkles, X } from 'lucide-react';

// Quotes and daily messages shown on the login page and after login.
export interface Quote { text: string; by?: string }

export const LOGIN_QUOTES: Quote[] = [
  { text: 'Education is the most powerful weapon which you can use to change the world.', by: 'Nelson Mandela' },
  { text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.', by: 'Malcolm X' },
  { text: 'An investment in knowledge pays the best interest.', by: 'Benjamin Franklin' },
  { text: 'Haba na haba hujaza kibaba.', by: 'Methali ya Kiswahili' },
  { text: 'Every child you teach today is a nation you build tomorrow.' },
  { text: 'Subira huvuta heri.', by: 'Methali ya Kiswahili' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', by: 'Robert Collier' },
  { text: 'Elimu haina mwisho.', by: 'Msemo wa Kiswahili' }
];

export interface DailyMessage { headline: string; line: string }

export const DAILY_MESSAGES: DailyMessage[] = [
  { headline: "It's another day to make it happen.", line: 'Nothing is impossible when you give it your best.' },
  { headline: 'Great teaching builds great futures.', line: 'Every lesson you prepare today shapes a student for life.' },
  { headline: 'Small steps every day build big results.', line: 'Stay consistent, stay proud of the work you do.' },
  { headline: 'Your effort matters more than you know.', line: 'Somewhere a student is learning because of you.' },
  { headline: 'Lead with passion, teach with heart.', line: 'Excellence is a habit, and you are building it.' },
  { headline: 'Today is full of possibilities.', line: 'Make it a day your students will remember.' },
  { headline: 'Keep learning, keep inspiring.', line: 'The best teachers are the ones who never stop growing.' },
  { headline: "Let's make today count.", line: 'Together we build a school of discipline, knowledge and success.' }
];

export function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

export function greetingFor(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

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
