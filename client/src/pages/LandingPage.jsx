import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  ChevronDown,
  ArrowRight,
  Star,
  LineChart,
  MessageSquare,
  Award,
  Menu,
  X,
  GraduationCap,
  Building2,
  Calendar,
  UserCheck,
  Check
} from "lucide-react";

import TypewriterText from "../components/landing/TypewriterText";
import HeroPreviewCard from "../components/landing/HeroPreviewCard";
import MentorCard from "../components/landing/MentorCard";
import { staggerContainer, fadeUp } from "../styles/motion";
import { useAuth } from "../hooks/useAuth";
import { mentorService } from "../services/mentorService";

export function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student"); // 'student' | 'mentor' | 'admin'
  const [activeMentorTab, setActiveMentorTab] = useState("all");
  const [openFaq, setOpenFaq] = useState(0);
  const [liveMentors, setLiveMentors] = useState([]);

  // Compute dashboard route for authenticated users
  const dashboardRoute =
    role === "mentor"
      ? "/mentor/dashboard"
      : role === "admin"
      ? "/admin/dashboard"
      : "/student/dashboard";

  // Fetch live verified mentors from backend
  React.useEffect(() => {
    let isMounted = true;
    mentorService
      .getPublicExplore()
      .then((res) => {
        const list = res?.data || res?.mentors || (Array.isArray(res) ? res : []);
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setLiveMentors(list);
        }
      })
      .catch((err) => {
        // Quiet notice for public mode
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll Progress Bar calculation
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Dynamic Typewriter phrases per role
  const typewriterPhrases = {
    student: [
      "Accelerate your tech career with verified 1-on-1 guidance.",
      "Book live time slots with engineers from Google, Meta & Stripe.",
      "Master System Design, Coding Mocks & Resume Reviews.",
      "Eliminate back-and-forth emails with automated calendar sync."
    ],
    mentor: [
      "Share your expertise with motivated students & engineers.",
      "Manage time slots seamlessly without double-booking risk.",
      "Automate session reminders & calendar invites with Resend.",
      "Earn institutional verification badges to grow your mentor impact."
    ],
    admin: [
      "Streamline institution-wide mentorship programs at scale.",
      "Verify mentor credentials & manage permissions centrally.",
      "Track student engagement & session completion analytics.",
      "Provide a unified platform for students, alumni & staff."
    ]
  };

  // Mock mentors data
  const sampleMentors = [
    {
      id: 1,
      name: "Dr. Alex Rivera",
      role: "Staff Engineer",
      company: "Google",
      category: "engineering",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      rating: 4.98,
      reviewsCount: 142,
      skills: ["System Design", "Distributed Systems", "Go & Microservices"],
      bio: "12+ years building global backend infrastructure. Dedicated to helping junior & mid-level engineers level up.",
      nextSlot: "Today @ 5:30 PM"
    },
    {
      id: 2,
      name: "Sophia Chen",
      role: "Senior Product Designer",
      company: "Stripe",
      category: "design",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
      rating: 4.95,
      reviewsCount: 98,
      skills: ["Figma Systems", "UX Research", "Portfolio Critique"],
      bio: "Passionate about intuitive design & product strategy. Helped 40+ mentees land product design roles at top tech firms.",
      nextSlot: "Tomorrow @ 4:00 PM"
    },
    {
      id: 3,
      name: "Marcus Vance",
      role: "Lead Data Scientist",
      company: "Meta",
      category: "data",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      rating: 4.92,
      reviewsCount: 76,
      skills: ["Machine Learning", "Python & PyTorch", "AI Roadmap"],
      bio: "Specializing in LLMs & AI pipelines. Transitioning software engineers into modern AI/ML roles.",
      nextSlot: "Wed @ 6:30 PM"
    },
    {
      id: 4,
      name: "Elena Rostova",
      role: "Director of Product",
      company: "Airbnb",
      category: "product",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      rating: 4.99,
      reviewsCount: 164,
      skills: ["Product Strategy", "FAANG PM Interviews", "Metrics & OKRs"],
      bio: "Ex-Amazon, currently leading product teams at Airbnb. Mentoring aspiring PMs on cracking interview case studies.",
      nextSlot: "Thu @ 5:00 PM"
    }
  ];

  const DEFAULT_AVATAR_POOL = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300"
  ];

  const displayMentorsList = liveMentors.length > 0
    ? liveMentors.map((m, idx) => ({
        id: m.id || m.mentor_id || idx,
        name: m.full_name || m.name || m.user?.full_name || `Mentor ${idx + 1}`,
        role: m.title || m.role || "Senior Tech Lead",
        company: m.company || m.organization || "Tech Org",
        category: m.category || (idx % 2 === 0 ? "engineering" : "product"),
        image: m.avatar_url || m.image || DEFAULT_AVATAR_POOL[idx % DEFAULT_AVATAR_POOL.length],
        rating: m.rating || Number((4.9 + (idx % 10) * 0.01).toFixed(2)),
        reviewsCount: m.reviews_count || m.total_sessions || (35 + (idx * 11) % 80),
        skills: Array.isArray(m.skills) ? m.skills : (m.expertise ? m.expertise.split(",") : ["Mentorship", "System Design"]),
        bio: m.bio || "Verified industry mentor helping students build high-impact careers.",
        nextSlot: m.next_slot || "Available Today"
      }))
    : sampleMentors;

  const filteredMentors =
    activeMentorTab === "all"
      ? displayMentorsList
      : displayMentorsList.filter((m) => m.category === activeMentorTab);

  // FAQ items
  const faqs = [
    {
      q: "How does real-time slot booking work on Nexora?",
      a: "Mentors define available time slots on their dashboard; students browse and book with one click. Thanks to Supabase Realtime synchronization, slots update instantly for all users to eliminate double bookings."
    },
    {
      q: "How are mentors verified on the platform?",
      a: "Every mentor undergoes identity and professional background checks. Institutional admins verify corporate email credentials or university affiliation before issuing verified mentor badges."
    },
    {
      q: "How does Nexora cater to Students, Mentors, and Admins?",
      a: "Nexora features role-based access control (RBAC). Students get an intuitive booking workspace; Mentors get a slot availability manager; and Admins get a centralized dashboard for verification & analytics."
    },
    {
      q: "What happens after a session is booked?",
      a: "Both student and mentor receive instant email confirmations via Resend with session details, Google Meet video link, and calendar attachments."
    },
    {
      q: "Can universities or bootcamps use Nexora for internal mentorship?",
      a: "Yes! Nexora is designed for campus and corporate deployments, giving administrators tools to oversee internal mentor pools and measure career outcomes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[var(--text-primary)] selection:bg-[var(--accent-primary)]/20 selection:text-[var(--accent-primary)] overflow-x-hidden font-sans relative">
      {/* ── Top Scroll Reading Progress Bar ───────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 origin-left z-50 shadow-[0_0_12px_rgba(245,166,35,0.7)]"
        style={{ scaleX }}
      />

      {/* ── Announcement Top Bar ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500/15 via-[var(--accent-primary)]/25 to-emerald-500/15 border-b border-white/5 py-2 px-3 sm:px-4 text-center text-[11px] sm:text-xs font-medium text-amber-300 flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles className="h-3.5 w-3.5 shrink-0 hidden xs:inline" />
        <span className="truncate max-w-[240px] sm:max-w-none">Nexora 2.0 Live! Tailored 1-on-1 workspaces.</span>
        <Link to="/register" className="underline font-bold text-white hover:text-amber-200 shrink-0 whitespace-nowrap">
          Get Started Free &rarr;
        </Link>
      </div>

      {/* ── Sticky Navigation Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B0D12]/85 border-b border-white/5 transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-amber-600 text-black font-extrabold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Zap className="h-5 w-5 fill-black" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                NEXORA<span className="text-[var(--accent-primary)]">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
              <a href="#roles" className="hover:text-white transition-colors">Portals</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#mentors" className="hover:text-white transition-colors">Mentors</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>

            {/* Auth CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#roles"
                className="px-3.5 py-2 text-xs font-bold text-amber-400 bg-amber-400/10 rounded-xl border border-amber-400/20 hover:bg-amber-400/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Book Live Demo</span>
              </a>
              {isAuthenticated ? (
                <Link
                  to={dashboardRoute}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/20 hover:brightness-110 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/20 hover:brightness-110 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-white/10 bg-[#12141B] px-4 pt-2 pb-6 space-y-3"
            >
              <a
                href="#roles"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
              >
                Portals & Stakeholders
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
              >
                How It Works
              </a>
              <a
                href="#mentors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/5 hover:text-white"
              >
                Mentors
              </a>
              <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-[var(--accent-primary)] text-black font-bold text-sm"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO SECTION WITH PERSONA SWITCHER ─────────────────────────────── */}
      {/* ── HERO SECTION WITH PERSONA SWITCHER ─────────────────────────────── */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        {/* Background Grid Mesh */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(245,166,35,0.15) 0%, transparent 65%),
                              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 36px 36px, 36px 36px'
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Persona Switcher Selector — Mobile responsive scroll container */}
          <div className="flex justify-center mb-8 px-2">
            <div className="inline-flex items-center gap-1 p-1 sm:p-1.5 rounded-2xl border border-white/10 bg-[#12141B]/90 backdrop-blur-md shadow-2xl max-w-full overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedRole === "student"
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-500/25 scale-[1.02]"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>For Students</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("mentor")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedRole === "mentor"
                    ? "bg-emerald-400 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>For Mentors</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedRole === "admin"
                    ? "bg-sky-400 text-black shadow-lg shadow-sky-400/25 scale-[1.02]"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Institutions & Admins</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center">
                <span className="badge badge-primary px-3.5 py-1.5 text-xs font-bold border border-amber-400/20 bg-amber-400/10 text-amber-300">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                  {selectedRole === "student" && "🎓 Purpose-Built 1-on-1 Student Career Platform"}
                  {selectedRole === "mentor" && "👨‍🏫 Complete Mentor Availability & Brand Suite"}
                  {selectedRole === "admin" && "🏛️ Unified Campus & Institutional Mentorship Engine"}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
              >
                {selectedRole === "student" && (
                  <>
                    Connect with Top Tech Mentors.{" "}
                    <span className="gradient-text">Book Real-Time Slots.</span>
                  </>
                )}
                {selectedRole === "mentor" && (
                  <>
                    Empower Future Leaders.{" "}
                    <span className="text-emerald-400">Manage Availability Effortlessly.</span>
                  </>
                )}
                {selectedRole === "admin" && (
                  <>
                    Scale Campus Mentorship.{" "}
                    <span className="text-sky-400">Verify & Oversee Programs.</span>
                  </>
                )}
              </motion.h1>

              {/* Typewriter Subhead */}
              <motion.div
                variants={fadeUp}
                className="text-lg sm:text-xl text-[var(--text-secondary)] min-h-[3.5rem] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                <TypewriterText
                  key={selectedRole}
                  words={typewriterPhrases[selectedRole]}
                  typingSpeed={40}
                  deletingSpeed={20}
                  pauseDuration={2400}
                  className={
                    selectedRole === "student"
                      ? "text-amber-300 font-semibold"
                      : selectedRole === "mentor"
                      ? "text-emerald-300 font-semibold"
                      : "text-sky-300 font-semibold"
                  }
                />
              </motion.div>

              {/* Social Proof Avatars Row */}
              <motion.div variants={fadeUp} className="flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-start gap-3 py-1">
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0D12] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0D12] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0D12] object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B0D12] object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" alt="" />
                </div>
                <div className="text-xs text-[var(--text-secondary)] font-semibold text-center sm:text-left">
                  <span className="text-white font-extrabold">2,400+ students</span> & <span className="text-amber-400 font-extrabold">500+ verified mentors</span> active
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={fadeUp}
                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                {selectedRole === "student" && (
                  <>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-base shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Explore Mentors Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
                    >
                      <Users className="h-5 w-5 text-emerald-400" />
                      <span>Join as Mentor</span>
                    </Link>
                  </>
                )}

                {selectedRole === "mentor" && (
                  <>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Apply as Verified Mentor</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
                    >
                      <span>Mentor Sign In</span>
                    </Link>
                  </>
                )}

                {selectedRole === "admin" && (
                  <>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 text-black font-extrabold text-base shadow-xl shadow-sky-400/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Request Admin Workspace</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
                    >
                      <span>Admin Portal Login</span>
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeUp}
                className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs text-[var(--text-tertiary)] font-medium"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Supabase Realtime Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                  <span>Resend Email Reminders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Role-Based Access Control</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Multi-Persona Hero Interactive Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <HeroPreviewCard activeRole={selectedRole} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── DEDICATED 3-COLUMN PERSONA SHOWCASE SECTION (SCROLL REVEAL) ────── */}
      <motion.section
        id="roles"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 border-t border-white/5 bg-[#12141B]/40 relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="badge badge-primary">Tailored Experience</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built For All Three Ecosystem Stakeholders
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              Nexora provides dedicated, security-scoped workspaces tailored for Students, Mentors, and Institutional Admins.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Pillar */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] space-y-6 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">🎓 Student Portal</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Everything a student needs to discover verified mentors, reserve time slots, and accelerate career growth.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-white/5">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Real-time slot search & 1-click booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Instant email confirmation & calendar attachments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Session goals & feedback logs tracker</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 pt-4"
              >
                <span>Join as Student</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Mentor Pillar */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] space-y-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-xl"
            >
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">👨‍🏫 Mentor Workspace</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Powerful tools for mentors to publish time slots, manage schedules, and build a verified brand.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-white/5">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Flexible slot availability manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero double-booking protection via Supabase Realtime</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified credentials & company affiliation badge</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 pt-4"
              >
                <span>Become a Mentor</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Admin Pillar */}
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] space-y-6 relative overflow-hidden group hover:border-sky-500/40 transition-all shadow-xl"
            >
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">🏛️ Admin Console</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Centralized oversight for colleges, bootcamps, and organizations running mentorship programs.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-white/5">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Mentor verification approval queue & badge management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Role-based user management (Student, Mentor, Admin)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>System-wide engagement analytics & session stats</span>
                </li>
              </ul>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 group-hover:text-sky-300 pt-4"
              >
                <span>Institutional Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── PLATFORM METRICS (SCROLL REVEAL) ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="py-12 border-y border-white/5 bg-[#12141B]/60 backdrop-blur-md"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                500<span className="text-amber-400">+</span>
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">Verified Mentors</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                10,000<span className="text-emerald-400">+</span>
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">Booked Sessions</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                98.4<span className="text-sky-400">%</span>
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">Satisfaction Rate</p>
            </div>

            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                45<span className="text-purple-400">+</span>
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">Partner Organizations</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FEATURES SHOWCASE (SCROLL REVEAL) ────────────────────────────── */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="py-24 relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="badge badge-primary">Engineered For Performance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful Core Features
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              Built on React 18, Supabase Realtime, and Express to deliver zero-latency booking.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] hover:border-amber-500/40 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Slot Engine</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Mentors publish open slots; students book instantly. Real-time subscriptions eliminate stale data.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] hover:border-emerald-500/40 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verified Badges</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Mentors are verified via corporate email or admin approval for student trust.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] hover:border-sky-500/40 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Transactional Email Invites</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Powered by Resend API. Automatic booking confirmation, calendar invites, and session reminders.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] hover:border-purple-500/40 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Institutional Analytics</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Colleges and bootcamps get centralized oversight to manage mentor rosters & track engagement metrics.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] hover:border-rose-500/40 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Session Agenda & Goals</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Specify your session topic in advance — whether System Design, Code Review, or Behavioral Mocks.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl border border-white/10 bg-[#12141B] hover:border-amber-500/40 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Role-Based Workspaces</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Tailored user experiences for Students, Mentors, and Admins with custom analytics & management tools.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── HOW IT WORKS (SCROLL REVEAL) ─────────────────────────────────── */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-[#12141B]/40 border-y border-white/5"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="badge badge-success">4 Simple Steps</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How Nexora Works
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              No endless DM threads or manual calendars. Book your session in seconds.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-[#12141B] space-y-4">
              <div className="h-10 w-10 rounded-xl bg-amber-400 text-black font-extrabold flex items-center justify-center text-base">
                01
              </div>
              <h3 className="text-base font-bold text-white">Explore Mentors</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Filter verified mentors by domain, company, technical skills, or ratings.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-[#12141B] space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-400 text-black font-extrabold flex items-center justify-center text-base">
                02
              </div>
              <h3 className="text-base font-bold text-white">Pick Open Slot</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Select from real-time time slots configured directly by mentors.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-[#12141B] space-y-4">
              <div className="h-10 w-10 rounded-xl bg-sky-400 text-black font-extrabold flex items-center justify-center text-base">
                03
              </div>
              <h3 className="text-base font-bold text-white">Instant Confirmation</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Receive email booking invite, calendar attachment & video link via Resend.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-[#12141B] space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-400 text-black font-extrabold flex items-center justify-center text-base">
                04
              </div>
              <h3 className="text-base font-bold text-white">Accelerate Career</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Attend your 1-on-1 session, gain actionable insights, and achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── MENTOR SPOTLIGHT (SCROLL REVEAL) ─────────────────────────────── */}
      <motion.section
        id="mentors"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="badge badge-primary">Verified Experts</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Featured Industry Mentors
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Learn directly from veterans working at top tech organizations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Mentors" },
                { id: "engineering", label: "Engineering" },
                { id: "product", label: "Product" },
                { id: "data", label: "Data & AI" },
                { id: "design", label: "Design" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMentorTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeMentorTab === tab.id
                      ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                      : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Mentor Cards Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all"
            >
              <span>Explore All 500+ Verified Mentors</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── FAQ ACCORDION (SCROLL REVEAL) ────────────────────────────────── */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-[#12141B]/40 border-t border-white/5"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <span className="badge badge-primary">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Everything you need to know about Nexora for Students, Mentors, and Admins.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#12141B] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-white hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-amber-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 pt-0 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-white/5"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── CTA BANNER (SCROLL REVEAL) ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="py-20 relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#12141B] to-emerald-500/10 p-8 sm:p-14 text-center shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="badge badge-primary px-3 py-1 text-xs">Ready to Get Started?</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Join Nexora Today
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                Whether you're a Student looking for guidance, a Mentor sharing expertise, or an Institution running programs.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-base shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all"
                >
                  Sign In to Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#0B0D12] pt-16 pb-12 text-xs text-[var(--text-secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/5">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black font-extrabold">
                  <Zap className="h-4 w-4 fill-black" />
                </div>
                <span className="text-lg font-extrabold tracking-tight text-white">
                  NEXORA
                </span>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] max-w-sm leading-relaxed">
                Nexora is a 1-on-1 mentorship platform built for Students, Mentors, and Institutional Admins.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portals</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition-colors">Student Workspace</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Mentor Workspace</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#mentors" className="hover:text-white transition-colors">Mentors</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-tertiary)]">
              © {new Date().getFullYear()} Nexora Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
