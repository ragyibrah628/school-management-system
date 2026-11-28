import { Sparkles, X } from 'lucide-react';

// Quotes and daily messages shown on the login page and after login.
export interface Quote { text: string; by?: string }

export const LOGIN_QUOTES: Quote[] = [
  { text: 'Education is not a way of escaping poverty, it is a way of fighting it.', by: 'Mwalimu Julius K. Nyerere' },
  { text: 'The purpose of education is to transmit from one generation to the next the accumulated wisdom and knowledge of the society, and to prepare the young people for their future membership of the society and their active participation in its maintenance or development.', by: 'Mwalimu Julius K. Nyerere, Education for Self-Reliance (1967)' },
  { text: 'If real development is to take place, the people have to be involved.', by: 'Mwalimu Julius K. Nyerere' },
  { text: 'Without unity, there is no future for Africa.', by: 'Mwalimu Julius K. Nyerere' },
  { text: 'No nation has the right to make decisions for another nation; no people for another people.', by: 'Mwalimu Julius K. Nyerere' },
  { text: 'Those who receive this privilege therefore, have a duty to repay the sacrifice which others have made.', by: 'Mwalimu Julius K. Nyerere' },
  { text: 'Uhuru na Kazi.', by: 'Kauli mbiu ya Mwalimu Julius K. Nyerere' },
  { text: 'Uhuru na Umoja.', by: 'Kauli mbiu ya Mwalimu Julius K. Nyerere' },
  { text: 'Education is the most powerful weapon which you can use to change the world.', by: 'Nelson Mandela' },
  { text: 'It always seems impossible until it\'s done.', by: 'Nelson Mandela' },
  { text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.', by: 'Malcolm X' },
  { text: 'An investment in knowledge pays the best interest.', by: 'Benjamin Franklin' },
  { text: 'Education is the key to unlock the golden door of freedom.', by: 'George Washington Carver' },
  { text: 'The beautiful thing about learning is that no one can take it away from you.', by: 'B. B. King' },
  { text: 'One child, one teacher, one book, one pen can change the world.', by: 'Malala Yousafzai' },
  { text: 'Intelligence plus character: that is the goal of true education.', by: 'Martin Luther King Jr.' },
  { text: 'It is the supreme art of the teacher to awaken joy in creative expression and knowledge.', by: 'Albert Einstein' },
  { text: 'Teachers affect eternity; no one can tell where their influence stops.', by: 'Henry Adams' },
  { text: 'The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires.', by: 'William Arthur Ward' },
  { text: 'A good teacher can inspire hope, ignite the imagination and instill a love of learning.', by: 'Brad Henry' },
  { text: 'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go.', by: 'Dr. Seuss' },
  { text: 'The roots of education are bitter, but the fruit is sweet.', by: 'Aristotle (attributed)' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', by: 'Mahatma Gandhi (attributed)' },
  { text: 'Every child you teach today is a nation you build tomorrow.' },
  { text: 'Elimu ni ufunguo wa maisha.', by: 'Msemo wa Kiswahili' },
  { text: 'Elimu haina mwisho.', by: 'Msemo wa Kiswahili' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', by: 'Confucius' },
  { text: 'The expert in anything was once a beginner.', by: 'Helen Hayes' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', by: 'Robert Collier' },
  { text: 'Discipline is the bridge between goals and accomplishment.', by: 'Jim Rohn' },
  { text: 'Whether you think you can, or you think you can\'t, you\'re right.', by: 'Henry Ford' },
  { text: 'Failure is simply the opportunity to begin again, this time more intelligently.', by: 'Henry Ford' },
  { text: 'The only way to do great work is to love what you do.', by: 'Steve Jobs' },
  { text: 'Aim for the moon. If you miss, you may hit a star.', by: 'W. Clement Stone' },
  { text: 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.', by: 'Pelé' },
  { text: 'You must be the change you wish to see in the world.', by: 'Mahatma Gandhi (attributed)' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', by: 'Eleanor Roosevelt (attributed)' },
  { text: 'Hard work beats talent when talent doesn\'t work hard.', by: 'Tim Notke' },
  { text: 'Believe you can and you\'re halfway there.', by: 'Theodore Roosevelt (attributed)' },
  { text: 'Haba na haba hujaza kibaba.', by: 'Methali ya Kiswahili' },
  { text: 'Subira huvuta heri.', by: 'Methali ya Kiswahili' },
  { text: 'Pole pole ndio mwendo.', by: 'Methali ya Kiswahili' },
  { text: 'Penye nia pana njia.', by: 'Methali ya Kiswahili' },
  { text: 'Umoja ni nguvu, utengano ni udhaifu.', by: 'Methali ya Kiswahili' },
  { text: 'Mwenda pole hajikwai.', by: 'Methali ya Kiswahili' },
  { text: 'Kuuliza si ujinga.', by: 'Methali ya Kiswahili' },
  { text: 'Asiyefunzwa na mamaye hufunzwa na ulimwengu.', by: 'Methali ya Kiswahili' },
  { text: 'Mtaka cha uvunguni sharti ainame.', by: 'Methali ya Kiswahili' },
  { text: 'Usipoziba ufa utajenga ukuta.', by: 'Methali ya Kiswahili' },
  { text: 'Bandu bandu huisha gogo.', by: 'Methali ya Kiswahili' },
  { text: 'Akili ni mali.', by: 'Methali ya Kiswahili' },
  { text: 'Kawia ufike.', by: 'Methali ya Kiswahili' }
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
