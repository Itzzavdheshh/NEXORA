import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Calendar, ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export function MentorCard({ mentor }) {
  const {
    name = "Dr. Alex Rivera",
    role = "Principal Architect",
    company = "Google",
    image = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    rating = 4.95,
    reviewsCount = 84,
    skills = ["System Design", "Cloud Native", "Distributed Systems"],
    bio = "Helped 80+ engineers scale systems to millions of users and pass FAANG interviews.",
    nextSlot = "Today @ 5:30 PM"
  } = mentor || {};

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#12141B] p-5 sm:p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_12px_40px_rgba(245,166,35,0.12)] h-full"
    >
      {/* Subtle top hover glow */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl pointer-events-none" />

      <div className="space-y-4">
        {/* Top Avatar & Rating Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative shrink-0">
            <img
              src={image}
              alt={name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-amber-500/50 transition-all shadow-md"
            />
            <div
              className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5 ring-2 ring-[#12141B]"
              title="Verified Mentor"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 text-xs font-semibold text-amber-400 shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{rating}</span>
            <span className="text-[10px] text-[var(--text-tertiary)] font-normal">({reviewsCount})</span>
          </div>
        </div>

        {/* Name & Role Info */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
            {name}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
            <span>{role}</span>
            <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[11px] text-amber-300 font-semibold border border-white/5">
              <Building2 className="h-3 w-3 text-amber-400" />
              {company}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 min-h-[2.25rem]">
          {bio}
        </p>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[var(--text-tertiary)] border border-white/5 group-hover:border-amber-400/20 group-hover:text-white transition-all"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium shrink-0">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[140px]">{nextSlot}</span>
        </div>

        <Link
          to="/register"
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors shrink-0"
        >
          <span>Book Slot</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default MentorCard;
