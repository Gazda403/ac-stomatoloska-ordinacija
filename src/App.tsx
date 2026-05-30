import { useState } from 'react';
import {
  Shield, Microscope, Diamond, ArrowRight, CheckCircle2,
  Menu, X, Play, Phone, Calendar, Clock, ChevronRight,
  CheckCheck
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: 'konsultacija', label: 'Konsultacija & Pregled', icon: '🦷', desc: 'Prvi pregled i procjena stanja' },
  { id: 'karijes',      label: 'Popravka karijesa',      icon: '🔧', desc: 'Plomba i restauracija zuba'  },
  { id: 'vadjenje',     label: 'Vađenje zuba',           icon: '✂️', desc: 'Bezbolno vađenje zuba'       },
  { id: 'izbjeljivanje',label: 'Izbjeljivanje zuba',     icon: '✨', desc: 'Profesionalno izbjeljivanje' },
  { id: 'veneers',      label: 'Keramičke ljuskice',     icon: '💎', desc: 'Veneers & estetika osmijeha' },
  { id: 'implantati',   label: 'Ugradnja implantata',    icon: '⚙️', desc: 'Trajno rješenje za izgubljeni zub' },
  { id: 'ciscenje',     label: 'Profesionalno čišćenje', icon: '🫧', desc: 'Uklanjanje kamenca i poliranje' },
  { id: 'ostalo',       label: 'Ostalo',                 icon: '📋', desc: 'Druge usluge i tretmani'     },
];

const TIME_SLOTS = [
  { id: 'jutro',    label: 'Jutro',           time: '09:00 – 12:00' },
  { id: 'podne',    label: 'Podne',           time: '12:00 – 15:00' },
  { id: 'popodne',  label: 'Kasno popodne',   time: '15:00 – 18:00' },
];

// ─── Booking Modal ────────────────────────────────────────────────────────────

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const reset = () => {
    setStep(1);
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setFormData({ name: '', phone: '', note: '' });
    setSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleSubmit = () => setSubmitted(true);

  const stepLabel = step === 1 ? 'Usluga' : step === 2 ? 'Datum & Vrijeme' : 'Kontakt';

  const serviceName = SERVICES.find(s => s.id === selectedService)?.label ?? '';
  const slot        = TIME_SLOTS.find(t => t.id === selectedTime);
  const dateFormatted = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('bs-BA', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-titanium-100">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-accent mb-0.5">Ordinacija A&amp;C</p>
            <h2 className="text-xl font-display font-bold text-titanium-900">Zakažite termin</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-titanium-100 text-titanium-400 hover:text-titanium-900 luxury-transition"
          >
            <X size={20} />
          </button>
        </div>

        {!submitted ? (
          <div className="p-6">

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold luxury-transition
                    ${step > s  ? 'bg-accent text-white'
                    : step === s ? 'bg-accent text-titanium-900'
                    : 'bg-titanium-100 text-titanium-400'}`}
                  >
                    {step > s ? <CheckCheck size={14} /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`h-0.5 w-12 rounded-full luxury-transition ${step > s ? 'bg-accent' : 'bg-titanium-200'}`} />
                  )}
                </div>
              ))}
              <span className="ml-2 text-sm text-titanium-500 font-medium">{stepLabel}</span>
            </div>

            {/* ── Step 1: Service ── */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-display font-semibold text-titanium-900 mb-5">Odaberite uslugu</h3>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`text-left p-4 rounded-2xl border-2 luxury-transition
                        ${selectedService === s.id
                          ? 'border-accent bg-accent/5'
                          : 'border-titanium-200 hover:border-accent/40 hover:bg-titanium-50'
                        }`}
                    >
                      <span className="text-2xl mb-2 block">{s.icon}</span>
                      <p className={`text-sm font-semibold mb-0.5 ${selectedService === s.id ? 'text-accent' : 'text-titanium-900'}`}>
                        {s.label}
                      </p>
                      <p className="text-xs text-titanium-500">{s.desc}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => selectedService && setStep(2)}
                  disabled={!selectedService}
                  className="w-full mt-6 bg-accent text-titanium-900 py-4 rounded-full font-medium
                    hover:bg-accent-light luxury-transition disabled:opacity-40 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  Dalje <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* ── Step 2: Date & Time ── */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-display font-semibold text-titanium-900 mb-5">Odaberite datum &amp; vrijeme</h3>

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-widest text-titanium-500 mb-2 flex items-center gap-1.5">
                    <Calendar size={13} /> Željeni datum
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border-2 border-titanium-200 rounded-2xl px-4 py-3 text-titanium-900
                      focus:outline-none focus:border-accent luxury-transition text-base"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-titanium-500 mb-3 flex items-center gap-1.5">
                    <Clock size={13} /> Preferirani termin
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTime(t.id)}
                        className={`p-4 rounded-2xl border-2 text-center luxury-transition
                          ${selectedTime === t.id
                            ? 'border-accent bg-accent/5'
                            : 'border-titanium-200 hover:border-accent/40'
                          }`}
                      >
                        <Clock size={18} className={`mx-auto mb-2 ${selectedTime === t.id ? 'text-accent' : 'text-titanium-400'}`} />
                        <p className={`text-sm font-semibold mb-0.5 ${selectedTime === t.id ? 'text-accent' : 'text-titanium-900'}`}>
                          {t.label}
                        </p>
                        <p className="text-xs text-titanium-500">{t.time}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-full border-2 border-titanium-200 text-titanium-600 font-medium hover:bg-titanium-50 luxury-transition"
                  >
                    Nazad
                  </button>
                  <button
                    onClick={() => selectedDate && selectedTime && setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-accent text-titanium-900 py-4 rounded-full font-medium
                      hover:bg-accent-light luxury-transition disabled:opacity-40 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
                  >
                    Dalje <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Contact ── */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-display font-semibold text-titanium-900 mb-5">Vaši kontakt podaci</h3>

                {/* Summary chip */}
                <div className="bg-titanium-50 rounded-2xl p-4 mb-6 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-titanium-400 mb-1">Sažetak rezervacije</p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                    <span className="text-titanium-600">Usluga:</span>
                    <span className="font-semibold text-titanium-900">{serviceName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-accent flex-shrink-0" />
                    <span className="text-titanium-600">Datum:</span>
                    <span className="font-semibold text-titanium-900">{dateFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-accent flex-shrink-0" />
                    <span className="text-titanium-600">Vrijeme:</span>
                    <span className="font-semibold text-titanium-900">{slot?.label} · {slot?.time}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-titanium-500 mb-2">
                      Ime i prezime *
                    </label>
                    <input
                      type="text"
                      placeholder="npr. Amira Begović"
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full border-2 border-titanium-200 rounded-2xl px-4 py-3 text-titanium-900
                        placeholder:text-titanium-300 focus:outline-none focus:border-accent luxury-transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-titanium-500 mb-2">
                      Broj telefona *
                    </label>
                    <input
                      type="tel"
                      placeholder="npr. 061 234 567"
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="w-full border-2 border-titanium-200 rounded-2xl px-4 py-3 text-titanium-900
                        placeholder:text-titanium-300 focus:outline-none focus:border-accent luxury-transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-titanium-500 mb-2">
                      Napomena <span className="normal-case font-normal text-titanium-400">(opcionalno)</span>
                    </label>
                    <textarea
                      placeholder="Kratki opis tegoba ili posebni zahtjevi..."
                      rows={3}
                      value={formData.note}
                      onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))}
                      className="w-full border-2 border-titanium-200 rounded-2xl px-4 py-3 text-titanium-900
                        placeholder:text-titanium-300 focus:outline-none focus:border-accent luxury-transition resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-full border-2 border-titanium-200 text-titanium-600 font-medium hover:bg-titanium-50 luxury-transition"
                  >
                    Nazad
                  </button>
                  <button
                    onClick={() => formData.name && formData.phone && handleSubmit()}
                    disabled={!formData.name || !formData.phone}
                    className="flex-1 bg-accent text-titanium-900 py-4 rounded-full font-medium
                      hover:bg-accent-light luxury-transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Pošaljite zahtjev
                  </button>
                </div>
              </div>
            )}
          </div>

        ) : (
          /* ── Confirmation screen ── */
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCheck size={36} className="text-accent" />
            </div>
            <h3 className="text-2xl font-display font-bold text-titanium-900 mb-3">Zahtjev poslan! 🎉</h3>
            <p className="text-titanium-600 leading-relaxed mb-1">
              Hvala, <span className="font-semibold text-titanium-900">{formData.name}</span>!
            </p>
            <p className="text-titanium-600 leading-relaxed mb-6">
              Naš tim će Vas <span className="font-semibold text-titanium-900">kontaktirati telefonski</span> na broj{' '}
              <span className="font-semibold text-accent">{formData.phone}</span> u najkraćem mogućem roku kako bismo
              potvrdili Vaš termin.
            </p>

            <div className="bg-titanium-50 rounded-2xl p-4 text-left mb-6 space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-titanium-400 mb-2">Detalji rezervacije</p>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={14} className="text-accent" />
                <span className="text-titanium-900 font-medium">{serviceName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-accent" />
                <span className="text-titanium-900">{dateFormatted}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-accent" />
                <span className="text-titanium-900">{slot?.label} · {slot?.time}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-accent text-titanium-900 py-4 rounded-full font-medium hover:bg-accent-light luxury-transition"
            >
              Zatvori
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState('preventiva');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => { setBookingOpen(true); setMobileMenuOpen(false); };

  return (
    <div className="min-h-screen flex flex-col relative bg-alabaster selection:bg-accent selection:text-white">

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-[90] glass-panel border-b border-titanium-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-accent">A&amp;C</span>
              <span className="font-display font-bold text-xl tracking-tight text-titanium-900">Stomatološka ordinacija</span>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#usluge"  className="text-sm font-medium text-titanium-600 hover:text-accent transition-colors">Usluge</a>
              <a href="#pristup" className="text-sm font-medium text-titanium-600 hover:text-accent transition-colors">Pristup</a>
              <a href="#tim"     className="text-sm font-medium text-titanium-600 hover:text-accent transition-colors">Stručni Tim</a>
              <a href="#kontakt" className="text-sm font-medium text-titanium-600 hover:text-accent transition-colors">Kontakt</a>
            </div>

            {/* Desktop phone + CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:+38733000000"
                className="flex items-center gap-1.5 text-sm font-medium text-titanium-600 hover:text-accent transition-colors"
              >
                <Phone size={15} className="text-accent" />
                +387 (0) 33 000 000
              </a>
              <button
                onClick={openBooking}
                className="bg-accent text-titanium-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent-light luxury-transition shadow-lg shadow-accent/20"
              >
                Zakažite Konsultaciju
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-titanium-900">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-titanium-200 absolute top-20 left-0 w-full z-[80] shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a href="#usluge"  onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-titanium-900 border-b border-titanium-100">Usluge</a>
            <a href="#pristup" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-titanium-900 border-b border-titanium-100">Pristup</a>
            <a href="#tim"     onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-titanium-900 border-b border-titanium-100">Stručni Tim</a>
            <a href="#kontakt" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-titanium-900">Kontakt</a>
            <div className="pt-4 px-3 flex flex-col gap-3">
              <a
                href="tel:+38733000000"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-titanium-200 rounded-full text-base font-medium text-titanium-700 hover:border-accent transition-colors"
              >
                <Phone size={16} className="text-accent" /> +387 (0) 33 000 000
              </a>
              <button
                onClick={openBooking}
                className="w-full bg-accent text-titanium-900 px-6 py-3 rounded-full text-base font-medium shadow-md"
              >
                Zakažite Konsultaciju
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">

        {/* ── Hero ── */}
        <section className="relative pt-24 pb-32 overflow-hidden bg-[url(/images/hero.jpg)] bg-cover bg-center lg:bg-none">
          {/* Mobile background overlay */}
          <div className="absolute inset-0 bg-black/60 lg:hidden pointer-events-none" />
          
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-titanium-200/50 blur-3xl opacity-50 pointer-events-none hidden lg:block" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-titanium-300/30 blur-3xl opacity-50 pointer-events-none hidden lg:block" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="max-w-2xl relative z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 lg:bg-titanium-100 border border-white/20 lg:border-titanium-200 mb-8">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs font-medium tracking-wide text-titanium-100 lg:text-titanium-700 uppercase">Premium Dental Clinic Sarajevo</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 text-white lg:text-titanium-900">
                  Inženjering <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light lg:from-titanium-700 lg:to-titanium-500">Vašeg Osmijeha.</span>
                </h1>

                <p className="text-lg md:text-xl text-titanium-200 lg:text-titanium-600 mb-10 leading-relaxed max-w-xl font-light">
                  Stomatološka ordinacija A&amp;C predstavlja vrhunac multidisciplinarne digitalne stomatologije.
                  Pružamo apsolutnu preciznost, estetsku perfekciju i bezkompromisni kvalitet.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={openBooking}
                    className="bg-accent text-titanium-900 px-8 py-4 rounded-full text-base font-medium hover:bg-accent-light luxury-transition flex items-center justify-center gap-2 shadow-xl shadow-accent/10"
                  >
                    Zakažite termin <ArrowRight size={18} />
                  </button>
                  <button className="bg-white/10 lg:bg-white text-white lg:text-accent border border-white/20 lg:border-titanium-200 px-8 py-4 rounded-full text-base font-medium hover:bg-white/20 lg:hover:bg-titanium-100 luxury-transition flex items-center justify-center gap-2 backdrop-blur-sm">
                    <Play size={18} className="text-white lg:text-titanium-500" /> Upoznajte Kliniku
                  </button>
                </div>
              </div>

              {/* Hero visual */}
              <div className="relative h-[200px] sm:h-[260px] lg:h-[600px] flex items-stretch gap-3 w-full mt-10 lg:mt-0">
                {/* Large dental chair card (Desktop only) */}
                <div className="hidden lg:block flex-1 rounded-3xl border border-titanium-200 shadow-2xl overflow-hidden group/hero-img">
                  <img
                    src="/images/hero.jpg"
                    alt="Stomatološka ordinacija A&C"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/hero-img:scale-105"
                  />
                </div>
                {/* 2 smaller cards (Stacked vertically on desktop, side-by-side on mobile) */}
                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-44 lg:flex-shrink-0">
                  <div className="flex-1 rounded-2xl border border-titanium-200 shadow-lg overflow-hidden relative group/c1">
                    <img src="/images/card1.jpg" alt="Digitalni Dizajn Osmijeha" className="w-full h-full object-cover transition-transform duration-700 group-hover/c1:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-accent/90 flex items-center justify-center">
                          <Diamond size={8} className="text-white" />
                        </div>
                        <span className="text-[9px] text-accent font-semibold uppercase tracking-wide">Ordinacija A&amp;C</span>
                      </div>
                      <p className="text-[11px] text-white font-semibold leading-tight">Digitalni Dizajn Osmijeha</p>
                    </div>
                  </div>
                  <div className="flex-1 rounded-2xl border border-titanium-200 shadow-lg overflow-hidden relative group/c2">
                    <img src="/images/card2.jpg" alt="3D Skeniranje" className="w-full h-full object-cover transition-transform duration-700 group-hover/c2:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[9px] text-white/80 font-medium mb-0.5">3D Skeniranje</p>
                      <h4 className="text-lg font-display font-bold text-accent">0.01mm</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section id="pristup" className="py-24 bg-white border-y border-titanium-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-accent mb-4">Temelji Naše Prakse</h2>
              <p className="text-titanium-600 text-lg leading-relaxed">
                Naša filozofija počiva na tri ključna stuba koji osiguravaju neusporediv kvalitet i iskustvo pacijenata.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Microscope size={28} />, title: 'Napredna Dijagnostika', desc: 'Koristimo najsavremeniju 3D digitalnu vizualizaciju i precizno planiranje za savršene rezultate prije samog početka terapije. Svaki mikron je važan.' },
                { icon: <Diamond size={28} />,    title: 'Vrhunski Materijali',   desc: 'Ekskluzivno koristimo premium, certificirane implantate i protetiku švicarskog i njemačkog porijekla. Beskompromisna izdržljivost i estetika.' },
                { icon: <Shield size={28} />,     title: 'Maksimalna Privatnost', desc: 'Posvećeni i individualizirani ciklusi brige o pacijentima. Vaš termin je rezervisan samo za vas u potpuno diskretnom i opuštajućem ambijentu.' },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="glass-panel p-10 rounded-3xl group hover:shadow-xl luxury-transition hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-titanium-100 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-titanium-900 luxury-transition text-titanium-700">
                    {icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-accent mb-3">{title}</h3>
                  <p className="text-titanium-600 leading-relaxed text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Treatment Hub ── */}
        <section id="usluge" className="py-32 bg-alabaster relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16">

              {/* Tab nav */}
              <div className="lg:w-1/3 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-titanium-900 mb-8">
                  Specijalistički <br />
                  <span className="text-titanium-400">Tretmani</span>
                </h2>
                <div className="flex flex-col space-y-2 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-titanium-200 rounded-full" />
                  {[
                    { id: 'preventiva',    label: 'Preventiva & Estetika' },
                    { id: 'hirurgija',     label: 'Oralna Hirurgija'      },
                    { id: 'implantologija',label: 'Implantologija'         },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="text-left pl-6 py-4 relative luxury-transition group"
                    >
                      {activeTab === id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-full luxury-transition" />
                      )}
                      <h4 className={`font-display font-semibold text-lg luxury-transition ${
                        activeTab === id ? 'text-titanium-900 pl-1' : 'text-titanium-400 group-hover:text-titanium-600'
                      }`}>{label}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab panels */}
              <div className="lg:w-2/3 relative min-h-[400px]">
                {[
                  {
                    id: 'preventiva', heading: 'Estetska Perfekcija',
                    body: 'Zaboravite na kompromise. Naši estetski protokoli osiguravaju prirodan i blistav osmijeh. Od minimalno invazivnih ljuskica (veneers) do najmodernijeg izbjeljivanja.',
                    items: ['Keramičke Ljuskice (Veneers)', 'Lasersko Izbjeljivanje', 'Digital Smile Design', 'Profesionalno Čišćenje'],
                    img: '/images/pexels-cottonbro-6502305.jpg', alt: 'Preventiva & Estetika',
                  },
                  {
                    id: 'hirurgija', heading: 'Bezbolna Hirurgija',
                    body: 'Minimalno invazivni hirurški protokoli koji osiguravaju brži oporavak i apsolutnu udobnost. Naš specijalistički tim rješava najkompleksnije slučajeve.',
                    items: ['Vađenje Umnjaka', 'Resekcija Korijena', 'Regeneracija Kosti', 'Cistektomija'],
                    img: '/images/pexels-cedric-fauntleroy-4269277.jpg', alt: 'Bezbolna Hirurgija',
                  },
                  {
                    id: 'implantologija', heading: 'Doživotna Rješenja',
                    body: 'Ponosni smo partneri vodećih svjetskih brendova implantata. Vraćamo vam samopouzdanje trajnim, stabilnim i estetski besprijekornim rješenjima.',
                    items: ['Straumann® Implantati', 'All-on-4 / All-on-6 Rješenja', 'Kompjuterski Navođena Ugradnja', 'Trenutno Opterećenje'],
                    img: '/images/pexels-cedric-fauntleroy-4269682.jpg', alt: 'Implantologija',
                  },
                ].map(({ id, heading, body, items, img, alt }) => (
                  <div
                    key={id}
                    className={`bg-white border border-titanium-200 rounded-3xl p-8 md:p-12 shadow-sm luxury-transition flex flex-col md:flex-row gap-8 items-center ${
                      activeTab === id
                        ? 'relative opacity-100 translate-y-0 z-10'
                        : 'absolute inset-0 opacity-0 translate-y-4 pointer-events-none z-0'
                    }`}
                  >
                    <div className="md:w-1/2 space-y-6">
                      <h3 className="text-2xl font-display font-bold text-titanium-900">{heading}</h3>
                      <p className="text-titanium-600 leading-relaxed">{body}</p>
                      <ul className="space-y-3">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-medium text-titanium-700">
                            <CheckCircle2 size={18} className="text-titanium-400" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:w-1/2 w-full aspect-square bg-titanium-50 rounded-2xl border border-titanium-100 relative overflow-hidden group/tab-img">
                      <img src={img} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover/tab-img:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-titanium-950/20 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 border-t border-titanium-200 bg-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-titanium-50 -skew-x-12 transform origin-top hidden lg:block" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-titanium-900 mb-6">
                  Spremni za vaš novi osmijeh?
                </h2>
                <p className="text-lg text-titanium-600">
                  Rezervišite konsultacije sa našim stručnim timom i saznajte kako vam Stomatološka ordinacija A&amp;C
                  može pomoći da postignete osmijeh iz snova uz najviše standarde moderne stomatologije.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={openBooking}
                  className="bg-accent text-titanium-900 px-8 py-4 rounded-full text-base font-medium hover:bg-accent-light luxury-transition shadow-xl shadow-accent/20"
                >
                  Zakažite Pregled
                </button>
                <a
                  href="tel:+38733000000"
                  className="bg-alabaster text-accent border border-titanium-200 px-8 py-4 rounded-full text-base font-medium hover:bg-titanium-100 luxury-transition flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> Pozovite Nas: +387 (0) 33 000 000
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer id="kontakt" className="bg-alabaster border-t border-titanium-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="font-display font-bold text-xl tracking-tight text-accent">A&amp;C</span>
                <span className="font-display font-bold text-xl tracking-tight text-titanium-900">Stomatološka ordinacija</span>
              </div>
              <p className="text-titanium-500 text-sm max-w-sm leading-relaxed">
                Vrhunska stomatološka usluga u srcu Sarajeva. Koristimo najnaprednije tehnologije i materijale
                kako bismo Vam osigurali osmijeh koji zaslužujete.
              </p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-accent mb-6">Brzi Linkovi</h4>
              <ul className="space-y-4">
                <li><a href="#"       className="text-sm text-titanium-500 hover:text-accent luxury-transition">Početna</a></li>
                <li><a href="#usluge" className="text-sm text-titanium-500 hover:text-accent luxury-transition">Usluge i Tretmani</a></li>
                <li><a href="#tim"    className="text-sm text-titanium-500 hover:text-accent luxury-transition">Naš Tim Stručnjaka</a></li>
                <li><a href="#kontakt"className="text-sm text-titanium-500 hover:text-accent luxury-transition">Kontakt i Lokacija</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-accent mb-6">Kontakt</h4>
              <ul className="space-y-4">
                <li className="text-sm text-titanium-500">
                  <span className="block text-accent font-medium mb-1">Adresa</span>
                  Jovana Bijelića 4,<br />Sarajevo 71000
                </li>
                <li className="text-sm text-titanium-500">
                  <span className="block text-accent font-medium mb-1">Telefon</span>
                  <a href="tel:+38733000000" className="hover:text-accent transition-colors">+387 (0) 33 000 000</a>
                </li>
                <li className="text-sm text-titanium-500">
                  <span className="block text-accent font-medium mb-1">Email</span>
                  info@ac-ordinacija.ba
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-titanium-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-titanium-400">
              &copy; {new Date().getFullYear()} Stomatološka ordinacija A&amp;C. Sva prava zadržana.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-titanium-400 hover:text-accent luxury-transition text-xs">Politika Privatnosti</a>
              <a href="#" className="text-titanium-400 hover:text-accent luxury-transition text-xs">Uslovi Korištenja</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
