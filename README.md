# ⚡ VENTURE PREDATOR // The Apex Founder & VC Network

> A ruthless dual-portal deal engine where early-stage founders endure a 4-round interrogation against AI General Partner **Vesper Prey**, streaming verified survivors into a real-time **VC Radar Terminal**.

![Status](https://img.shields.io/badge/STATUS-ACTIVE%20ONLINE-00f0ff?style=for-the-badge)
![Next.js](https://img.shields.io/badge/NEXT.JS-16%20APP%20ROUTER-black?style=for-the-badge&logo=next.js)
![Tailwind](https://img.shields.io/badge/TAILWIND-CSS%20v4-38bdf8?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/FRAMER-MOTION-ff003c?style=for-the-badge)
![Supabase](https://img.shields.io/badge/SUPABASE-POSTGRES%20%26%20REALTIME-3ecf8e?style=for-the-badge&logo=supabase)

---

## 👁️ Overview

**Venture Predator** bridges the gap between ambitious founders and high-conviction venture capitalists through an industrial cyberpunk terminal aesthetic. 

Traditional pitch decks are slow, passive, and filled with fluff. Venture Predator forces founders through a grueling 4-round dynamic AI gauntlet that attacks unit economics, defensibility, and retention. Startups scoring **80+** are automatically verified and broadcast live into the VC Radar, where venture partners can inspect the complete interrogation transcript, request direct founder intros, and issue soft term sheets in real-time.

---

## 🚀 Key Features

### 1. Dual-Portal Role Routing
* **Landing Gateway (`/`)**: Split-path selector featuring cyber glow cards for `[ FOUNDER / STARTUP ACCESS ]` and `[ VC TERMINAL ACCESS ]`.
* **Telemetry Ticker**: Live real-time ecosystem stats (Pitches Eaten, Capital Committed, Verified Survivors, Median Hype Score).
* **Role Metadata**: Seamless dual navigation between founder and investor perspectives.

### 2. Founder Arena (`/portal/founder`)
* **Startup Dossier Intake**:
  * Fields for startup name, sector category, and founder contact info.
  * Verified traction telemetry (MRR, MoM Growth, Active Contracts, Burn Rate).
  * Auto-expanding elevator pitch buffer with zero character truncation.
  * 1-Click test presets (`+ Load Apex Pitch` & `+ Load Flawed Pitch`).
* **4-Round AI Interrogation Gauntlet ("Vesper Prey")**:
  * **Round 1 (Unit Economics)**: CAC drag, procurement bureaucracy, gross margins vs compute burn.
  * **Round 2 (Moat & Commoditization)**: Defense against open-source duplication and Big Tech copying.
  * **Round 3 (Retention & Churn)**: Net Revenue Retention (NRR) and customer concentration vulnerabilities.
  * **Round 4 (The Apex Kill Shot)**: Why write a $5M lead check today instead of letting the venture bleed?
* **Live Spring-Physics Metrics**:
  * Real-time Hype Gauge (0–100), Moat Defensibility, and Risk Factor meters driven by Framer Motion springs.
  * Synthetic audio ratchet clicks dynamically adjusting pitch as scores change.
* **Cinematic Verdict Reveal**:
  * **Score $\ge$ 80 (Term Sheet Issued)**: Dramatic screen flash, confetti explosion (`canvas-confetti`), victory chords, and automatic pipeline submission.
  * **Score < 80 (Eaten & Discarded)**: Blood-red glitch shake, low dissonance rejection sound, and detailed autopsy critique report with retry cooldown.

### 3. VC Terminal Radar (`/portal/vc`)
* **Live Real-Time Deal Stream**:
  * Real-time WebSocket listener (`BroadcastChannel` cross-tab sync + Supabase Realtime).
  * Multi-dimensional filtering by Category, Minimum Hype (`ALL`, `80+`, `88+`, `92+`), and full-text keyword search.
  * Real-time pulse indicator and incoming transmission audio chime on newly arrived deals.
* **Deep-Dive Cyber Drawer (`DealDrawer.tsx`)**:
  * Slide-out drawer with complete 4-round interrogation transcript (Vesper Prey questions, founder defenses, critique notes, and deltas).
  * Founder contact dossier with direct email and Twitter/X handle.
* **Direct VC Actions**:
  * **Issue Soft Term Sheet (`TermSheetModal.tsx`)**: Submit pre-money valuation ($M), check size ($M), and board governance covenants saved to the database.
  * **Request Direct Intro (`DirectIntroModal.tsx`)**: High-priority partner intro request routing.

### 4. Cyberpunk Audio & Visual Design System
* **Synthetic Web Audio Engine (`AudioEngine.ts`)**: Pure browser-native Web Audio API synthesizer generating cyber blips, low sub-bass hums, spring ratchets, and victory/rejection chords without external audio files.
* **Canvas Grid & Particle Shader (`CyberBackground.tsx`)**: 60 FPS interactive floating wireframe grid with horizon perspective lines and cursor-reactive particles.
* **Glitch & Frequency Waves (`GlitchText.tsx`, `FrequencyWave.tsx`)**: Chromatic aberration text scrambling and audio visualizer frequency wave canvas reacting to Vesper Prey's questioning.

---

## 🛠️ Architecture & Tech Stack
