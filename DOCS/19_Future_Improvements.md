# 19. Future Improvements & Production Expansion Roadmap

## 1. Executive Summary

While NEXORA v2.0.0 delivers an enterprise-ready MVP for one-on-one mentorship booking, the system architecture is deliberately structured to support future extensions into AI matching, real-time messaging, WebRTC video calling, institutional multi-tenancy, and monetization.

---

## 2. Platform Expansion Roadmap

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FUTURE EXPANSION ROADMAP                                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: AI & Intelligent Matching ──> Extend `aiService.js` for ML mentor matching    │
│ PHASE 2: Real-Time Communication ─────> Integrate Socket.io & Supabase Realtime Chat   │
│ PHASE 3: Embedded Video Sessions ────> WebRTC / Agora Native Video Call Integration    │
│ PHASE 4: Institutional Multi-Tenancy ─> Multi-University Workspace Isolation (SaaS)   │
│ PHASE 5: Monetization & Payments ─────> Stripe / Razorpay Escrow Payment Gateway     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technical Implementation Blueprints for Next Phases

### 1. AI-Powered Mentor Recommendation Engine (`server/src/services/aiService.js`)
- **Current Foundation:** The backend already contains `AIService` ([aiService.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/server/src/services/aiService.js)) providing multi-provider abstraction stubs for OpenAI, Gemini, Claude, Groq, and Ollama.
- **Planned Extension:** Vector embeddings (using OpenAI `text-embedding-3-small` or pgvector in PostgreSQL) matching student profile goals and skills against mentor expertise vectors.
- **API Endpoint:** `POST /api/v1/student/recommendations` returning ranked mentor profiles with semantic similarity scores.

### 2. In-App Real-Time Messaging Subsystem
- **Architecture:** Leverage Supabase Realtime channels or Socket.io.
- **Database Extension:** `messages` table storing `(id, booking_id, sender_id, receiver_id, content, created_at)`.
- **UI Integration:** Chat drawer embedded inside `StudentBookingsPage.jsx` and `MentorBookingsPage.jsx`.

### 3. Integrated WebRTC Video Call Engine
- **Architecture:** Replace external Google Meet links with embedded WebRTC rooms using Agora.io or Daily.co SDKs.
- **Security:** Generate short-lived ephemeral RTC tokens bound to `booking_id` accessible strictly to the student and mentor during the scheduled session window.

### 4. Institutional Multi-Tenancy (Multi-University SaaS)
- **Database Extension:** Add `organizations` table (`id`, `name`, `domain`, `subscription_tier`) and foreign key `organization_id` to `users`.
- **Tenant Isolation:** Enforce tenant partitioning in RLS policies (`WHERE organization_id = auth.jwt() -> 'org_id'`).

### 5. Monetization & Payment Escrow (Razorpay / Stripe)
- **Workflow:** Student pays upon booking creation -> Funds held in escrow status (`payment_status: 'escrow'`) -> Funds released to mentor account upon session completion status update.
