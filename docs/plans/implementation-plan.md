# Implementation Plan: ElevenLabs Voice Agent Web App

**Version**: 1.0
**Created**: 2025-11-04
**Status**: READY FOR IMPLEMENTATION
**Phase**: 4 - Implementation Planning (WHAT→HOW)

---

## Overview

This implementation plan maps the technology-agnostic specifications from Phase 3 to concrete Next.js 15 + @elevenlabs/react 0.9.1 implementation. Following Constitution Article IV, this document defines HOW to implement the WHAT/WHY requirements.

### Source Specifications
1. **Landing Page Spec**: `docs/specs/nextjs-starter-specs.md` (356 lines)
2. **Voice Component Spec**: `docs/specs/elevenlabs-voice-component-specs.md` (540 lines)

### Tech Stack (Confirmed)
- **Framework**: Next.js 15.0.3 (App Router)
- **React**: 18.3.1 (NOT 19.x - compatibility requirement)
- **Voice SDK**: @elevenlabs/react 0.9.1 (user explicitly required)
- **UI Components**: Shadcn UI + @elevenlabs-ui registry
- **Styling**: Tailwind CSS 3.4.14 + custom Aurora animation
- **Animation**: Framer Motion 11.11.11
- **TypeScript**: 5.6.3 (strict mode)

### Evidence
- Research: `docs/research/synthesis-report.md` (590 lines)
- Tech Stack: `docs/standards/tech-stack-and-code-standards.md` v2.0
- Architecture: `planning.md` (lines 27-83)

---

## Architecture Overview (CoD^Σ)

### System Model
```
Implementation := LandingPage ⊕ VoiceComponent ⊕ APIRoute ⊕ AuroraBackground

LandingPage := NextJS_Page ∘ AuroraBackground ∘ CTAButton
VoiceComponent := useConversation ≫ UIComponents ≫ StateManagement
APIRoute := SignedURL_Generation (server-side)
AuroraBackground := Framer_Motion ∘ Tailwind_Animation (already implemented)

Flow := UserClick ≫ VoiceComponent ≫ APIRoute ≫ useConversation ≫ WebRTC ≫ UI_Feedback
```

### Component Hierarchy
```
src/app/page.tsx (Server Component)
  └─> <AuroraBackground> (Client Component, already exists)
        └─> <motion.div> (Framer Motion)
              ├─> <h1> ElevenLabs Voice Agent
              ├─> <p> Subheading
              └─> <VoiceAgentButton> (new, triggers modal)
                    └─> <VoiceAgentModal> (new, contains voice UI)
                          ├─> <ConversationBar> (@elevenlabs-ui)
                          ├─> <Orb> (@elevenlabs-ui)
                          └─> <Conversation> (@elevenlabs-ui)

src/app/api/elevenlabs/route.ts (API Route)
  └─> generateSignedUrl() → ElevenLabs API
```

**Rationale**: Separate concerns - landing page (server) vs. voice interaction (client). Modal pattern prevents full-page takeover, allowing graceful entry/exit from voice mode.

---

## Landing Page Implementation

### Spec Mapping: nextjs-starter-specs.md → Next.js 15

#### User Story P1: Immediate Understanding
**Spec** (lines 35-44): Display clear heading + subheading describing voice agent

**Implementation**:
```typescript
// src/app/page.tsx (existing file, update content)
import { AuroraBackground } from "@/components/ui/aurora-background";
import { VoiceAgentButton } from "@/components/elevenlabs/voice-agent-button";

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        {/* AC1: Clear, prominent heading */}
        <h1 className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          ElevenLabs Voice Agent
        </h1>

        {/* AC2: Subheading with benefits */}
        <p className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 text-center">
          Experience natural voice conversations powered by AI
        </p>

        {/* AC3: Above the fold (viewport height ensured by flex center) */}
        {/* AC4: Concise text (heading: 3 words, subheading: 7 words) */}

        <VoiceAgentButton />
      </motion.div>
    </AuroraBackground>
  );
}
```

**Acceptance Criteria Verification**:
- ✅ AC1: Heading displays voice agent functionality clearly
- ✅ AC2: Subheading explains benefits (voice conversations, AI-powered)
- ✅ AC3: Content visible without scrolling (flex center ensures viewport alignment)
- ✅ AC4: Text concise (heading: 3 words, subheading: 7 words)

#### User Story P2: Start Conversation with One Click
**Spec** (lines 45-55): Prominent CTA button that initiates voice agent

**Implementation**:
```typescript
// src/components/elevenlabs/voice-agent-button.tsx (NEW FILE)
"use client";

import { useState } from "react";
import { VoiceAgentModal } from "./voice-agent-modal";

export function VoiceAgentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* AC1: Prominent, visible without scrolling */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-6 py-3 text-lg font-medium hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500"
        aria-label="Start voice conversation"
      >
        {/* AC2: Clear label indicating voice interaction */}
        Start Conversation
      </button>

      {/* AC4: Triggers voice agent (modal opens, conversation starts) */}
      <VoiceAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
```

**Acceptance Criteria Verification**:
- ✅ AC1: Button visible without scrolling (rendered in viewport)
- ✅ AC2: Label "Start Conversation" clearly indicates voice interaction
- ✅ AC3: Visually distinct (black/white contrast, hover scale effect)
- ✅ AC4: Click triggers voice agent (opens modal with conversation UI)
- ✅ AC5: Keyboard accessible (native button, focus ring, Tab/Enter/Space work)

#### User Story P3: Responsive Design
**Spec** (lines 56-66): Content adapts to all screen sizes

**Implementation** (Already handled by Tailwind responsive utilities):
```typescript
// Tailwind responsive classes handle breakpoints automatically
className="text-3xl md:text-7xl"  // Mobile: 3xl (30px), Desktop: 7xl (72px)
className="text-base md:text-4xl" // Mobile: 16px, Desktop: 36px
className="px-4"                   // Consistent padding all breakpoints
className="rounded-full px-6 py-3" // Button: 48x48px minimum (exceeds 44px requirement)
```

**Acceptance Criteria Verification**:
- ✅ AC1: Content adapts (Tailwind md: breakpoint at 768px)
- ✅ AC2: Text readable (mobile: 16px minimum, desktop: larger)
- ✅ AC3: Button tappable (48x48px minimum, exceeds 44px requirement)
- ✅ AC4: No horizontal scroll (flex layout, px-4 padding prevents overflow)
- ✅ AC5: Content hierarchy maintained (vertical flex, order preserved)

#### User Story P4: Visual Appeal with Aurora Animation
**Spec** (lines 67-77): Animated background, smooth performance, dark mode

**Implementation**: Already complete in Phase 1
- File: `src/components/ui/aurora-background.tsx`
- Animation: 60s linear loop via Tailwind `animate-aurora`
- Performance: Framer Motion optimized, GPU-accelerated
- Dark mode: Tailwind `dark:` utilities for text contrast

**Acceptance Criteria Verification**:
- ✅ AC1: Aurora animation active (Phase 1 complete)
- ✅ AC2: Smooth 60fps (Framer Motion + GPU)
- ✅ AC3: Aesthetically pleasing (gradient colors, blur effects)
- ✅ AC4: Dark mode support (`dark:text-white`, `dark:bg-white`)
- ✅ AC5: Not distracting (background layer, content in foreground)

### Non-Functional Requirements

#### NFR1: Performance
**Spec** (lines 150-156): < 1s load, 60fps animation, < 300 KB bundle

**Implementation**:
- Next.js automatic code splitting (page.tsx separate bundle)
- Static generation where possible (page.tsx can be static)
- Framer Motion tree-shaking (only used components imported)
- Tailwind purge (unused classes removed in production)

**Verification**: Run `npm run build` and check:
- First Load JS < 300 KB
- Lighthouse Performance score ≥ 90
- Chrome DevTools FPS counter: 60fps animation

#### NFR2: Accessibility
**Spec** (lines 157-163): WCAG AA, keyboard navigation, screen reader

**Implementation**:
- Semantic HTML (h1, p, button)
- ARIA labels (`aria-label="Start voice conversation"`)
- Keyboard accessible (native button, focus ring)
- Color contrast: Test with Lighthouse (text: 4.5:1, large: 3:1)
- Screen reader: Test with VoiceOver (macOS) / NVDA (Windows)

**Verification**:
- Lighthouse Accessibility score ≥ 95
- Manual keyboard test: Tab → button, Enter/Space activates
- Screen reader test: Logical reading order

---

## Voice Component Implementation

### Spec Mapping: elevenlabs-voice-component-specs.md → @elevenlabs/react 0.9.1

#### Component Architecture

**Voice Agent Modal**:
```typescript
// src/components/elevenlabs/voice-agent-modal.tsx (NEW FILE)
"use client";

import { useEffect, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { ConversationBar, Orb, Conversation } from "@/components/ui/elevenlabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAgentModal({ isOpen, onClose }: VoiceAgentModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch signed URL when modal opens
  useEffect(() => {
    if (isOpen && !signedUrl) {
      fetchSignedUrl();
    }
  }, [isOpen]);

  const fetchSignedUrl = async () => {
    try {
      const response = await fetch("/api/elevenlabs");
      if (!response.ok) throw new Error("Failed to get signed URL");
      const data = await response.json();
      setSignedUrl(data.signedUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const conversation = useConversation({
    signedUrl: signedUrl || undefined,
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => {
      console.error("Conversation error:", error);
      setError(error.message);
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, [conversation]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {error ? (
          <div className="text-red-500 p-4">
            Error: {error}
          </div>
        ) : !signedUrl ? (
          <div className="p-4">Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Orb: Visual indicator of agent state */}
            <div className="flex justify-center">
              <Orb
                agentState={
                  conversation.isSpeaking ? "talking" :
                  conversation.status === "connected" ? "listening" : null
                }
              />
            </div>

            {/* Connection controls */}
            <div className="flex gap-2 justify-center">
              {conversation.status === "disconnected" ? (
                <button
                  onClick={() => conversation.startSession()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Start Conversation
                </button>
              ) : (
                <button
                  onClick={() => conversation.endSession()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  End Conversation
                </button>
              )}
            </div>

            {/* Conversation history */}
            <Conversation>
              {conversation.messages.map((msg, idx) => (
                <div key={idx} className={`p-2 ${msg.source === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {msg.message}
                  </span>
                </div>
              ))}
            </Conversation>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

#### User Story P1: Start Voice Conversation
**Spec** (lines 45-53): Initiate connection within 3 seconds

**Implementation Details**:
1. **Microphone Permission** (AC2): Browser prompts automatically when `conversation.startSession()` called
2. **Connection Feedback** (AC3): Loading state shows while fetching signed URL, then connection status from SDK
3. **Connection Latency** (AC4): Target < 3s (signed URL fetch + WebRTC handshake)
4. **Error Handling** (AC5): `onError` callback captures failures, displays user-friendly message

**SDK Integration**:
```typescript
const conversation = useConversation({
  signedUrl,           // From API route
  onConnect,           // AC: Connection established
  onDisconnect,        // AC: Clean disconnect
  onMessage,           // AC: Message received
  onError,             // AC5: Error notification
});

// AC4: Connection within 3 seconds
// Evidence: synthesis-report.md lines 76-89 (WebRTC flow)
```

#### User Story P2: Speech Transcription
**Spec** (lines 54-63): Capture and transcribe user speech

**Implementation**:
- SDK handles speech capture automatically via WebRTC
- `conversation.messages` array contains transcriptions
- `onMessage` callback fires for each transcribed message
- Messages displayed in `<Conversation>` component

**Data Flow**:
```
UserSpeech → Microphone → WebRTC → ElevenLabs API → Transcription
  → onMessage({ source: 'user', message: '...' })
  → conversation.messages.push(...)
  → <Conversation> re-renders
```

#### User Story P3-P6: Additional Requirements
- **P3: Agent Response** (lines 64-73): SDK handles automatically, `isSpeaking` state tracks agent audio
- **P4: End Session** (lines 74-82): `conversation.endSession()` method, cleanup in useEffect
- **P5: Conversation History** (lines 83-92): `conversation.messages` array, rendered in `<Conversation>`
- **P6: Visual Feedback** (lines 93-102): `<Orb>` component reacts to `agentState` prop

### Authentication Implementation

**API Route**:
```typescript
// src/app/api/elevenlabs/route.ts (NEW FILE)
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json(
      { error: "Missing API key or Agent ID" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
```

**Environment Variables** (`.env.local`):
```bash
# Server-only (no NEXT_PUBLIC prefix)
ELEVENLABS_API_KEY=sk_...

# Client-accessible (NEXT_PUBLIC prefix)
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
```

**Security Requirements**:
- ✅ API key NEVER exposed client-side (no NEXT_PUBLIC prefix)
- ✅ Signed URL generation server-side only (API route)
- ✅ Private agent support (production-ready)

---

## Component Dependencies

### Installation Required

Install @elevenlabs-ui components:
```bash
# Orb component
npx shadcn@latest add https://ui.elevenlabs.io/r/orb

# ConversationBar component (if needed for advanced features)
npx shadcn@latest add https://ui.elevenlabs.io/r/conversation-bar

# Conversation component
npx shadcn@latest add https://ui.elevenlabs.io/r/conversation

# Dialog component (for modal)
npx shadcn@latest add https://ui.shadcn.com/docs/components/dialog
```

### File Structure

```
src/
├── app/
│   ├── api/
│   │   └── elevenlabs/
│   │       └── route.ts               # NEW: API route for signed URLs
│   ├── layout.tsx                     # EXISTS
│   ├── page.tsx                       # UPDATE: Landing page content
│   └── globals.css                    # EXISTS
├── components/
│   ├── ui/
│   │   ├── aurora-background.tsx      # EXISTS (Phase 1)
│   │   ├── dialog.tsx                 # NEW: Shadcn Dialog
│   │   ├── orb.tsx                    # NEW: @elevenlabs-ui Orb
│   │   └── conversation.tsx           # NEW: @elevenlabs-ui Conversation
│   └── elevenlabs/
│       ├── voice-agent-button.tsx     # NEW: CTA button + modal trigger
│       └── voice-agent-modal.tsx      # NEW: Voice UI container
└── lib/
    └── utils.ts                       # EXISTS

.env.local                              # NEW: Environment variables
```

---

## Implementation Roadmap

### Phase 5A: Landing Page Enhancement (T501-T504)
**Duration**: 30-45 minutes
**Dependencies**: None (Phase 1 Aurora complete)

1. **T501**: Update `src/app/page.tsx` with final content
   - Update heading text
   - Update subheading text
   - Replace button with `<VoiceAgentButton />`
   - **AC Verification**: Visual inspection + Lighthouse scores

2. **T502**: Create `src/components/elevenlabs/voice-agent-button.tsx`
   - Implement button with modal trigger
   - Add keyboard accessibility
   - Add focus states
   - **AC Verification**: Keyboard test (Tab/Enter), click test

3. **T503**: Add Dialog component from Shadcn
   - Run: `npx shadcn@latest add dialog`
   - Verify installation in `components.json`
   - **AC Verification**: Build succeeds

4. **T504**: Test landing page acceptance criteria
   - Lighthouse: Performance ≥ 90, Accessibility ≥ 95
   - Keyboard navigation: Tab → button, Enter activates
   - Responsive: Test 375px (mobile), 768px (tablet), 1920px (desktop)
   - **AC Verification**: All Phase 3 landing page ACs pass

### Phase 5B: Voice Component Integration (T505-T510)
**Duration**: 60-90 minutes
**Dependencies**: Phase 5A complete, environment variables configured

5. **T505**: Create API route `src/app/api/elevenlabs/route.ts`
   - Implement signed URL generation
   - Add error handling
   - Test with curl/Postman
   - **AC Verification**: Returns valid signed URL

6. **T506**: Install @elevenlabs-ui components
   - Run: `npx shadcn@latest add https://ui.elevenlabs.io/r/orb`
   - Run: `npx shadcn@latest add https://ui.elevenlabs.io/r/conversation`
   - Verify files created in `src/components/ui/`
   - **AC Verification**: Build succeeds

7. **T507**: Create `src/components/elevenlabs/voice-agent-modal.tsx`
   - Implement useConversation hook
   - Add Orb component with state binding
   - Add start/end session controls
   - Add conversation history display
   - **AC Verification**: Modal opens, connection starts

8. **T508**: Test voice conversation flow
   - Start conversation → microphone permission → connection established
   - Speak → transcription appears
   - Agent responds → audio plays
   - End conversation → cleanup
   - **AC Verification**: All Phase 3 voice component ACs pass

9. **T509**: Add error handling and edge cases
   - Microphone permission denied → clear error message
   - Connection failure → retry option
   - Barge-in support (SDK handles automatically)
   - **AC Verification**: Edge cases from specs (lines 217-248)

10. **T510**: Test complete integration
    - Landing page → button click → modal → voice conversation
    - Multiple conversation cycles
    - Close modal during conversation (cleanup)
    - **AC Verification**: End-to-end flow works

### Phase 5C: Polish & Verification (T511-T513)
**Duration**: 30-45 minutes
**Dependencies**: Phase 5A & 5B complete

11. **T511**: Performance optimization
    - Run `npm run build` → check bundle size
    - Lighthouse audit → Performance ≥ 90
    - Test animation smoothness (60fps)
    - **AC Verification**: NFRs from specs satisfied

12. **T512**: Accessibility verification
    - Keyboard navigation: Tab through all interactive elements
    - Screen reader test: VoiceOver/NVDA
    - Color contrast: Lighthouse Accessibility ≥ 95
    - **AC Verification**: WCAG AA compliance

13. **T513**: Cross-device testing
    - Test on iPhone (Safari), Android (Chrome)
    - Test on tablet (768px width)
    - Test on desktop (1920px+ width)
    - **AC Verification**: Responsive requirements satisfied

**Total Estimated Duration**: 120-180 minutes (2-3 hours)

---

## Technical Decisions & Rationale

### Decision 1: Modal Pattern for Voice UI
**Rationale**:
- Preserves landing page visibility (Aurora animation remains)
- Allows graceful entry/exit from voice mode
- Better UX than full-page takeover
- Follows modern web app patterns (Spotify, Discord)

**Alternatives Considered**:
- Full-page voice UI (rejected: loses Aurora context)
- Inline expansion (rejected: complex animation choreography)

**Evidence**: Modal pattern supports both landing page and voice interaction requirements without compromise.

### Decision 2: Server-Side Signed URL Generation
**Rationale**:
- Security: API key never exposed client-side
- Production-ready: Supports private agents
- Follows Next.js best practices (API routes)

**Alternatives Considered**:
- Public agent mode (rejected: not production-ready)
- Client-side API key (rejected: security risk)

**Evidence**: synthesis-report.md lines 139-185 (authentication flow)

### Decision 3: Separation of Landing Page and Voice UI
**Rationale**:
- Landing page can be server component (better performance)
- Voice UI must be client component (hooks, browser APIs)
- Clear separation of concerns (Constitution Article VI)

**Alternatives Considered**:
- Single client component (rejected: unnecessary client bundle for landing page)
- Separate routes /voice (rejected: breaks single-page flow)

**Evidence**: Next.js 15 App Router best practices (server components by default)

### Decision 4: useConversation Hook Direct Integration
**Rationale**:
- SDK provides complete state management
- No need for custom state logic
- Follows SDK documentation patterns

**Alternatives Considered**:
- Custom WebRTC implementation (rejected: reinventing the wheel)
- Wrapper abstraction (rejected: Constitution Article VI - trust framework features)

**Evidence**: research-elevenlabs-agent-sdk.md lines 59-194 (useConversation API)

---

## Risk Assessment

### Risk 1: WebRTC Connection Latency
**Probability**: Medium
**Impact**: High (fails AC: < 3s connection)
**Mitigation**:
- Pre-fetch signed URL when modal opens (before "Start Conversation")
- Show loading indicator with progress feedback
- Test on multiple networks (Wi-Fi, 4G, etc.)

### Risk 2: Microphone Permission Denied
**Probability**: High (user choice)
**Impact**: High (blocks entire feature)
**Mitigation**:
- Clear error message with instructions
- Link to browser settings documentation
- Retry mechanism after permission granted

### Risk 3: Browser Compatibility
**Probability**: Low
**Impact**: Medium (excludes some users)
**Mitigation**:
- Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Test on mobile browsers (Safari iOS 14+, Chrome Android 90+)
- Graceful degradation (show unsupported browser message)

### Risk 4: Bundle Size Exceeds Budget
**Probability**: Low
**Impact**: Medium (fails NFR: < 300 KB)
**Mitigation**:
- Monitor bundle size after each component installation
- Use Next.js code splitting (automatic)
- Tree-shake unused @elevenlabs-ui components

---

## Success Criteria

### Landing Page (Phase 3 Spec: nextjs-starter-specs.md)
- ✅ All user stories (P1-P4) acceptance criteria satisfied
- ✅ Lighthouse Performance ≥ 90
- ✅ Lighthouse Accessibility ≥ 95
- ✅ Responsive design works on 375px, 768px, 1920px
- ✅ Keyboard navigation functional
- ✅ Aurora animation smooth (60fps)

### Voice Component (Phase 3 Spec: elevenlabs-voice-component-specs.md)
- ✅ All user stories (P1-P6) acceptance criteria satisfied
- ✅ Connection latency < 3 seconds (p95)
- ✅ Speech transcription latency < 2 seconds
- ✅ Agent response latency < 2 seconds (p95)
- ✅ Conversation history displays correctly
- ✅ Error handling for all edge cases

### Integration
- ✅ End-to-end flow: Landing page → button → modal → conversation → close
- ✅ No console errors or warnings
- ✅ TypeScript strict mode passes
- ✅ Build successful with reasonable bundle size
- ✅ Works on target browsers and devices

---

## Next Steps

After Phase 4 completion:
1. Generate task breakdown (task-breakdown.md) organized by user stories (Article VII)
2. Begin Phase 5 implementation following the roadmap above
3. Execute tasks in user-story order: P1 → P2 → P3 → P4
4. Verify acceptance criteria at each checkpoint

**Evidence**: Constitution Article VII (User-Story-Centric Organization)

---

**Implementation Plan Version**: 1.0
**Ready for**: Task Breakdown Generation (T402)
**Estimated Implementation Time**: 2-3 hours
**Risk Level**: Low (all dependencies installed, architecture validated)
