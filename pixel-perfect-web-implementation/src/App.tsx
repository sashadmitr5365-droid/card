import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Home,
  MessageCircleMore,
  Send,
  X,
} from 'lucide-react';
import '@fontsource-variable/inter';

type Panel = 'medication' | 'water' | 'visit' | 'sleep' | 'calendar' | 'messages' | 'profile';

type Appointment = {
  date: string;
  time: string;
};

type DashboardProps = {
  water: number;
  medicationLeft: number;
  appointment: Appointment;
  onOpen: (panel: Panel) => void;
  onHome: () => void;
  preview?: boolean;
};

const chartHeights = [
  50, 61, 54, 67, 57, 71, 61, 75, 62, 79, 85, 70, 88, 76,
  91, 79, 92, 77, 95, 83, 97, 85, 100, 90, 100, 93, 100, 93,
];

function DotCross({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 25 25" fill="currentColor" aria-hidden="true">
      <rect x="11" y="1" width="3" height="3" rx="0.4" />
      <rect x="11" y="6" width="3" height="3" rx="0.4" />
      <rect x="1" y="11" width="3" height="3" rx="0.4" />
      <rect x="6" y="11" width="3" height="3" rx="0.4" />
      <rect x="11" y="11" width="3" height="3" rx="0.4" />
      <rect x="16" y="11" width="3" height="3" rx="0.4" />
      <rect x="21" y="11" width="3" height="3" rx="0.4" />
      <rect x="11" y="16" width="3" height="3" rx="0.4" />
      <rect x="11" y="21" width="3" height="3" rx="0.4" />
    </svg>
  );
}

function Chart() {
  return (
    <div
      className="health-chart"
      role="img"
      aria-label="Health score history from August 1 to August 28, trending upward"
    >
      <div className="chart-columns" aria-hidden="true">
        {chartHeights.map((height, index) => (
          <span
            className="chart-column"
            key={index}
            style={{ height: `${height}%`, '--bar-delay': `${index * 15}ms` } as CSSProperties}
          />
        ))}
      </div>
      <div className="chart-dates" aria-hidden="true">
        <span>1 Aug</span>
        <span>10 Aug</span>
        <span>15 Aug</span>
        <span>20 Aug</span>
        <span>25 Aug</span>
        <span>28 Aug</span>
      </div>
    </div>
  );
}

function Navigation({ onOpen, onHome }: Pick<DashboardProps, 'onOpen' | 'onHome'>) {
  return (
    <nav className="dashboard-nav" aria-label="Dashboard navigation">
      <button className="nav-button nav-button-active" onClick={onHome} aria-label="Home" type="button">
        <Home strokeWidth={1.8} />
      </button>
      <button className="nav-button" onClick={() => onOpen('calendar')} aria-label="Appointments" type="button">
        <CalendarDays strokeWidth={1.7} />
      </button>
      <button className="nav-button" onClick={() => onOpen('messages')} aria-label="Messages" type="button">
        <MessageCircleMore strokeWidth={1.7} />
      </button>
      <button className="nav-button nav-avatar" onClick={() => onOpen('profile')} aria-label="Your profile" type="button">
        <img src="/images/patient-profile.webp" alt="" />
      </button>
    </nav>
  );
}

function HealthDashboard({ water, medicationLeft, appointment, onOpen, onHome, preview = false }: DashboardProps) {
  const waterLeft = Math.max(2500 - water, 0);
  const waterPercentage = Math.min(Math.round((water / 2500) * 100), 100);

  return (
    <section className={`dashboard-ui ${preview ? 'dashboard-preview' : 'dashboard-live'}`} aria-label={preview ? 'Health dashboard preview' : 'Your health dashboard'}>
      <div className="status-time">9:41</div>
      <h2 className="dashboard-title">Health Score</h2>
      <div className="score" aria-label="Health score 88 out of 100">
        <span>88</span><small>/ 100</small>
      </div>
      <Chart />

      <div className="metric-grid">
        <button className="metric metric-medication" type="button" onClick={() => onOpen('medication')}>
          <span className="metric-note">{medicationLeft === 0 ? 'All done' : `${medicationLeft} left`}</span>
          <span className="metric-cross"><DotCross /></span>
          <span className="dot-text metric-number">{medicationLeft}</span>
          <span className="metric-label">Medication</span>
        </button>

        <button className="metric metric-water" type="button" onClick={() => onOpen('water')}>
          <span className="metric-note">{waterLeft > 0 ? `${waterLeft}ml left` : 'Goal met'}</span>
          <span className="metric-cross"><DotCross /></span>
          <span className="dot-text metric-number">{waterPercentage}%</span>
          <span className="metric-label">Water Intake</span>
        </button>

        <button className="metric metric-visit" type="button" onClick={() => onOpen('visit')}>
          <span className="metric-note">{appointment.date}, {appointment.time}</span>
          <span className="doctor-avatar"><img src="/images/doctor-wilson.webp" alt="" /></span>
          <span className="doctor-name">Dr. Wilson</span>
          <span className="metric-label">Next visit</span>
        </button>

        <button className="metric metric-sleep" type="button" onClick={() => onOpen('sleep')}>
          <span className="metric-note">84% · Deep Sleep</span>
          <span className="dot-text sleep-number">7h 40m</span>
          <span className="sleep-status">Good</span>
          <span className="metric-label">Sleep Quality</span>
        </button>
      </div>
      <Navigation onOpen={onOpen} onHome={onHome} />
      <div className="home-indicator" aria-hidden="true" />
    </section>
  );
}

function IntroArtwork({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={mobile ? 'intro-art intro-art-mobile' : 'intro-art'} aria-hidden="true">
      <img className="art-object art-flower" src="/images/purple-flower.webp" alt="" />
      <img className="art-object art-heart" src="/images/glass-heart.webp" alt="" />
      <img className="art-object art-star" src="/images/blue-star.webp" alt="" />
    </div>
  );
}

function IntroCopy({ onStart }: { onStart: () => void }) {
  return (
    <div className="intro-copy">
      <h1>Healthcare<br />made simple.</h1>
      <p>Find specialists, book appointments, and<br className="desktop-break" /> manage your care in one place.</p>
      <button className="start-button" type="button" onClick={onStart}>Get Started <ArrowUpRight aria-hidden="true" /></button>
    </div>
  );
}

function AppointmentPreview() {
  return (
    <div className="device appointment-device" aria-hidden="true">
      <div className="appointment-back"><ArrowLeft /></div>
      <div className="appointment-doctor">
        <img src="/images/doctor-amanda.webp" alt="" />
        <div><strong>Dr. Amanda</strong><span>General Practitioner</span></div>
        <ChevronRight />
      </div>
      <div className="appointment-caption">Appointment schedule</div>
      <div className="appointment-dates">
        <div><strong>Sep 1</strong><span>Wed</span></div>
        <div className="selected"><strong>Sep 2</strong><span>Thu</span></div>
        <div><strong>Sep 3</strong><span>Fri</span></div>
      </div>
      <div className="appointment-times"><span>09:00 am</span><span>10:00 am</span><span>11:00 am</span></div>
      <div className="appointment-caption second-caption">About the doctor</div>
      <div className="appointment-lines"><i /><i /><i /></div>
    </div>
  );
}

function useSceneScale() {
  const getScale = () => Math.max(Math.max(window.innerHeight, 720) / 1128, window.innerWidth / 1800);
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const resize = () => setScale(getScale());
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return scale;
}

function Modal({ panel, onClose, onOpen, water, setWater, medicationLeft, setMedicationLeft, appointment, setAppointment, messages, setMessages, notifications, setNotifications }: {
  panel: Panel;
  onClose: () => void;
  onOpen: (panel: Panel) => void;
  water: number;
  setWater: (value: number) => void;
  medicationLeft: number;
  setMedicationLeft: (value: number) => void;
  appointment: Appointment;
  setAppointment: (value: Appointment) => void;
  messages: string[];
  setMessages: (value: string[]) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedDate, setSelectedDate] = useState(appointment.date);
  const [selectedTime, setSelectedTime] = useState(appointment.time);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages([...messages, text]);
    setDraft('');
  };

  const titles: Record<Panel, string> = {
    medication: 'Medication',
    water: 'Water intake',
    visit: 'Your next visit',
    sleep: 'Sleep quality',
    calendar: 'Appointment schedule',
    messages: 'Messages',
    profile: 'Your profile',
  };

  return (
    <dialog
      className="detail-dialog"
      ref={dialogRef}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-content">
        <div className="dialog-topline">
          <span className="dialog-kicker">YOUR CARE</span>
          <button className="close-button" type="button" onClick={onClose} aria-label="Close"><X size={21} /></button>
        </div>
        <h2 id="dialog-title">{titles[panel]}</h2>

        {panel === 'medication' && (
          <div className="dialog-body">
            <p className="dialog-lead">A little routine goes a long way.</p>
            <div className="dialog-stat"><strong>{medicationLeft}</strong><span>{medicationLeft === 1 ? 'medication left' : 'medications left'}<br />for today</span></div>
            <p className="dialog-note">{medicationLeft > 0 ? 'Keep track of what you have taken today.' : 'You are all caught up for today.'}</p>
            <button className="dialog-action" type="button" disabled={medicationLeft === 0} onClick={() => setMedicationLeft(Math.max(medicationLeft - 1, 0))}>
              {medicationLeft === 0 ? 'All done' : 'Mark one as taken'} <Check size={18} />
            </button>
          </div>
        )}

        {panel === 'water' && (
          <div className="dialog-body">
            <p className="dialog-lead">Stay hydrated, one glass at a time.</p>
            <div className="dialog-stat"><strong>{Math.min(Math.round(water / 25), 100)}%</strong><span>of your daily<br />water goal</span></div>
            <div className="progress-track"><span style={{ width: `${Math.min(water / 25, 100)}%` }} /></div>
            <p className="dialog-note">{water.toLocaleString()} ml of 2,500 ml logged today</p>
            <button className="dialog-action" type="button" disabled={water >= 2500} onClick={() => setWater(Math.min(water + 250, 2500))}>
              {water >= 2500 ? 'Daily goal reached' : `Log ${Math.min(250, 2500 - water)} ml`} <span>+</span>
            </button>
          </div>
        )}

        {panel === 'visit' && (
          <div className="dialog-body">
            <p className="dialog-lead">Your care is in good hands.</p>
            <div className="dialog-person">
              <img src="/images/doctor-wilson.webp" alt="Dr. Wilson" />
              <div><strong>Dr. Wilson</strong><span>General Practitioner</span></div>
            </div>
            <div className="detail-row"><span>Date</span><strong>{appointment.date}</strong></div>
            <div className="detail-row"><span>Time</span><strong>{appointment.time}</strong></div>
            <p className="dialog-note">This is a sample appointment for your dashboard.</p>
            <button className="dialog-action" type="button" onClick={() => onOpen('calendar')}>Change appointment <ChevronRight size={19} /></button>
          </div>
        )}

        {panel === 'sleep' && (
          <div className="dialog-body">
            <p className="dialog-lead">A good night makes a good day.</p>
            <div className="dialog-stat sleep-stat"><strong>7h 40m</strong><span>last night</span></div>
            <div className="detail-row"><span>Sleep quality</span><strong className="text-aqua">Good</strong></div>
            <div className="detail-row"><span>Deep sleep</span><strong>84%</strong></div>
            <p className="dialog-note">Your sleep summary is based on sample data.</p>
            <button className="dialog-action" type="button" onClick={onClose}>Done <Check size={18} /></button>
          </div>
        )}

        {panel === 'calendar' && (
          <div className="dialog-body">
            <p className="dialog-lead">Find a time that works for you.</p>
            <span className="field-label">SELECT A DATE</span>
            <div className="date-options">
              {['Aug 29', 'Aug 30', 'Aug 31', 'Sep 1'].map((date) => (
                <button className={selectedDate === date ? 'selected' : ''} type="button" key={date} aria-pressed={selectedDate === date} onClick={() => setSelectedDate(date)}>{date}</button>
              ))}
            </div>
            <span className="field-label">AVAILABLE TIMES</span>
            <div className="time-options">
              {['9:00 am', '10:00 am', '11:00 am', '2:00 pm'].map((time) => (
                <button className={selectedTime === time ? 'selected' : ''} type="button" key={time} aria-pressed={selectedTime === time} onClick={() => setSelectedTime(time)}>{time}</button>
              ))}
            </div>
            <p className="dialog-note">Changes are saved in this demo for this session.</p>
            <button className="dialog-action" type="button" onClick={() => { setAppointment({ date: selectedDate, time: selectedTime }); onClose(); }}>Save changes <Check size={18} /></button>
          </div>
        )}

        {panel === 'messages' && (
          <div className="dialog-body">
            <p className="dialog-lead">A direct line to your care team.</p>
            <div className="message-list" aria-live="polite">
              <div className="message message-incoming">Hi! Let us know if you need anything before your visit.</div>
              {messages.map((message, index) => <div className="message message-outgoing" key={`${index}-${message}`}>{message}</div>)}
            </div>
            <p className="dialog-note">Demo chat. Messages stay on this page.</p>
            <form className="message-form" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="message-input">Write a message</label>
              <input id="message-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." />
              <button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={19} /></button>
            </form>
          </div>
        )}

        {panel === 'profile' && (
          <div className="dialog-body">
            <p className="dialog-lead">A little space for all things you.</p>
            <div className="dialog-person">
              <img src="/images/patient-profile.webp" alt="" />
              <div><strong>Your care profile</strong><span>Personal health dashboard</span></div>
            </div>
            <div className="detail-row notification-row">
              <div><strong>Reminders</strong><span>Get gentle care reminders</span></div>
              <button className={`toggle ${notifications ? 'is-on' : ''}`} type="button" role="switch" aria-checked={notifications} aria-label="Care reminders" onClick={() => setNotifications(!notifications)}><span /></button>
            </div>
            <p className="dialog-note">Your preferences are kept for this session.</p>
            <button className="dialog-action" type="button" onClick={onClose}>Done <Check size={18} /></button>
          </div>
        )}
      </div>
    </dialog>
  );
}

export default function App() {
  const scale = useSceneScale();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [water, setWater] = useState(1800);
  const [medicationLeft, setMedicationLeft] = useState(2);
  const [appointment, setAppointment] = useState<Appointment>({ date: 'Aug 29', time: '10:00 am' });
  const [messages, setMessages] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const goToDashboard = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('dashboard')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  const dashboardProps = { water, medicationLeft, appointment, onOpen: setPanel, onHome: goToDashboard };

  return (
    <main>
      <section className="hero" aria-label="Healthcare made simple">
        <div className="desktop-scene" style={{ '--scene-scale': scale } as CSSProperties}>
          <div className="device peek-device" aria-hidden="true"><div className="peek-shape" /><div className="peek-avatar" /></div>
          <div className="device intro-device">
            <IntroArtwork />
            <IntroCopy onStart={goToDashboard} />
            <div className="intro-indicator" aria-hidden="true" />
          </div>
          <div className="device health-device"><HealthDashboard {...dashboardProps} preview /></div>
          <AppointmentPreview />
        </div>

        <div className="mobile-intro">
          <div className="mobile-status"><span>9:41</span><DotCross /></div>
          <IntroArtwork mobile />
          <IntroCopy onStart={goToDashboard} />
          <div className="mobile-indicator" aria-hidden="true" />
        </div>
      </section>

      <section className="care-section" id="dashboard" aria-label="Explore your health dashboard">
        <div className="care-layout">
          <div className="care-copy" data-reveal>
            <span className="section-eyebrow"><DotCross /> A LITTLE MORE CARE</span>
            <h2>All your health,<br />in one place.</h2>
            <p>A simpler way to keep up with your care, every day.</p>
            <div className="care-copy-line"><span>MADE FOR YOUR EVERYDAY</span><ArrowUpRight size={19} /></div>
          </div>
          <div className="live-device" data-reveal>
            <HealthDashboard {...dashboardProps} />
          </div>
        </div>
        <div className="care-footer"><span>Care, made simple.</span><span>DEMO DASHBOARD</span></div>
      </section>

      {panel && <Modal key={panel} panel={panel} onClose={() => setPanel(null)} onOpen={setPanel} water={water} setWater={setWater} medicationLeft={medicationLeft} setMedicationLeft={setMedicationLeft} appointment={appointment} setAppointment={setAppointment} messages={messages} setMessages={setMessages} notifications={notifications} setNotifications={setNotifications} />}
    </main>
  );
}