# Task Breakdown: ElevenLabs Voice Agent Web App

**Version**: 1.0
**Created**: 2025-11-04
**Status**: READY FOR EXECUTION
**Organization**: User-Story-Centric (Constitution Article VII)

---

## Overview

This task breakdown organizes implementation into user-story-centric phases, NOT technical layers. Following Constitution Article VII, tasks are grouped by user story priority (P1 → P2 → P3) to enable progressive delivery and independent validation.

### Source Documents
- **Implementation Plan**: `docs/plans/implementation-plan.md`
- **Landing Page Spec**: `docs/specs/nextjs-starter-specs.md`
- **Voice Component Spec**: `docs/specs/elevenlabs-voice-component-specs.md`

### Execution Strategy
```
Phase 5A: Setup & Foundation (infrastructure only)
Phase 5B: P1 User Stories (highest priority, blocking)
Phase 5C: P2 User Stories (high priority, independently testable)
Phase 5D: P3 User Stories (lower priority, polish)
Phase 5E: Integration & Verification (cross-cutting concerns)
```

**Rationale**: Each user story can be validated independently, enabling early user feedback and iterative delivery.

---

## Phase 5A: Setup & Foundation
**Goal**: Install dependencies and create foundational infrastructure
**Duration**: 15-20 minutes
**Blocking**: ALL subsequent phases

### T501: Install UI Component Dependencies
**Description**: Install Shadcn Dialog and @elevenlabs-ui components

**Steps**:
```bash
# Dialog component (for modal)
npx shadcn@latest add dialog

# @elevenlabs-ui components
npx shadcn@latest add https://ui.elevenlabs.io/r/orb
npx shadcn@latest add https://ui.elevenlabs.io/r/conversation
```

**Acceptance Criteria**:
1. `src/components/ui/dialog.tsx` exists
2. `src/components/ui/orb.tsx` exists
3. `src/components/ui/conversation.tsx` exists
4. `components.json` updated with new registry entries
5. `npm run build` succeeds with no errors

**Evidence**: Implementation plan lines 440-451

---

### T502: Create Environment Variables Configuration
**Description**: Setup `.env.local` with ElevenLabs credentials

**Steps**:
1. Create `.env.local` file in project root
2. Add environment variables:
   ```bash
   # Server-only (no NEXT_PUBLIC prefix)
   ELEVENLABS_API_KEY=sk_your_api_key_here

   # Client-accessible (NEXT_PUBLIC prefix)
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
   ```
3. Add `.env.local` to `.gitignore` (if not already)

**Acceptance Criteria**:
1. `.env.local` file exists
2. Contains `ELEVENLABS_API_KEY` (no NEXT_PUBLIC prefix)
3. Contains `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` (with prefix)
4. `.gitignore` includes `.env.local`
5. Environment variables accessible in code

**Security Note**: NEVER commit `.env.local` to git

**Evidence**: Implementation plan lines 388-399

---

### T503: Create API Route for Signed URL Generation
**Description**: Implement server-side signed URL generation

**File**: `src/app/api/elevenlabs/route.ts` (NEW)

**Implementation**:
```typescript
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

**Acceptance Criteria**:
1. File created at `src/app/api/elevenlabs/route.ts`
2. Exports GET handler
3. Fetches signed URL from ElevenLabs API
4. Returns JSON response with `signedUrl` field
5. Handles errors gracefully
6. Test: `curl http://localhost:3000/api/elevenlabs` returns valid signed URL

**Evidence**: Implementation plan lines 363-399

---

## Phase 5B: P1 User Stories (Critical Priority)
**Goal**: Implement highest-priority user-facing features
**Duration**: 60-90 minutes
**Dependencies**: Phase 5A complete

### User Story P1 (Landing Page): Immediate Understanding
**Spec**: nextjs-starter-specs.md lines 35-44
**ACs**: 4 acceptance criteria

#### T504: Update Landing Page Content
**Description**: Update `src/app/page.tsx` with final heading, subheading, and CTA button

**File**: `src/app/page.tsx` (UPDATE existing)

**Changes**:
1. Update heading text: "ElevenLabs Voice Agent"
2. Update subheading text: "Experience natural voice conversations powered by AI"
3. Replace button with `<VoiceAgentButton />` import
4. Ensure responsive classes (text-3xl md:text-7xl)

**Acceptance Criteria**:
1. ✅ AC1 (Spec): Heading displays voice agent functionality clearly
2. ✅ AC2 (Spec): Subheading explains benefits in 1-2 sentences
3. ✅ AC3 (Spec): Content visible without scrolling (above the fold)
4. ✅ AC4 (Spec): Text concise (heading < 10 words, subheading < 20 words)
5. Visual inspection: Content centered, readable, aesthetically pleasing

**Evidence**: Implementation plan lines 81-132

---

#### T505: Create Voice Agent Button Component
**Description**: Create button component that triggers voice agent modal

**File**: `src/components/elevenlabs/voice-agent-button.tsx` (NEW)

**Implementation**:
```typescript
"use client";

import { useState } from "react";
import { VoiceAgentModal } from "./voice-agent-modal";

export function VoiceAgentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-6 py-3 text-lg font-medium hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500"
        aria-label="Start voice conversation"
      >
        Start Conversation
      </button>

      <VoiceAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
```

**Acceptance Criteria**:
1. ✅ AC1 (Spec): Button visible without scrolling
2. ✅ AC2 (Spec): Label "Start Conversation" clearly indicates voice interaction
3. ✅ AC3 (Spec): Visually distinct (high contrast, hover/focus states)
4. ✅ AC4 (Spec): Click triggers voice agent modal
5. ✅ AC5 (Spec): Keyboard accessible (Tab, Enter, Space)
6. Manual test: Button responds to click, keyboard navigation works
7. Manual test: Focus ring visible when tabbed to

**Evidence**: Implementation plan lines 137-171

---

### User Story P1 (Voice Component): Start Voice Conversation
**Spec**: elevenlabs-voice-component-specs.md lines 45-53
**ACs**: 5 acceptance criteria

#### T506: Create Voice Agent Modal Component (Structure)
**Description**: Create modal container with basic structure

**File**: `src/components/elevenlabs/voice-agent-modal.tsx` (NEW)

**Implementation** (Part 1 - Structure):
```typescript
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAgentModal({ isOpen, onClose }: VoiceAgentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="p-4">
          Voice Agent Modal - Structure Created
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Acceptance Criteria**:
1. Modal opens when `isOpen={true}`
2. Modal closes when clicking outside or pressing Escape
3. Modal closes when `onClose` called
4. TypeScript types correct
5. Build succeeds

**Evidence**: Implementation plan lines 196-201

---

#### T507: [P] Implement Signed URL Fetching Logic
**Description**: Add signed URL fetching when modal opens

**File**: `src/components/elevenlabs/voice-agent-modal.tsx` (UPDATE)

**Implementation** (Part 2 - Signed URL):
```typescript
const [signedUrl, setSignedUrl] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

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
```

**Acceptance Criteria**:
1. ✅ AC3 (Spec): Loading indicator shows while fetching signed URL
2. Fetch triggers automatically when modal opens
3. Error state captured if fetch fails
4. Signed URL stored in state
5. Console log: Signed URL retrieved successfully

**Evidence**: Implementation plan lines 211-226

**Parallelization**: [P] Can be developed simultaneously with T506 (different file sections)

---

#### T508: [P] Integrate useConversation Hook
**Description**: Integrate @elevenlabs/react useConversation hook

**File**: `src/components/elevenlabs/voice-agent-modal.tsx` (UPDATE)

**Implementation** (Part 3 - SDK Integration):
```typescript
import { useConversation } from "@elevenlabs/react";

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
```

**Acceptance Criteria**:
1. ✅ AC1 (Spec): Connection initiated when "Start Conversation" clicked
2. ✅ AC2 (Spec): Microphone permission requested automatically
3. ✅ AC4 (Spec): Connection completes within 3 seconds (measure with console.log timestamps)
4. ✅ AC5 (Spec): Error displayed if connection fails
5. Console logs: "Connected" appears after successful connection
6. Console logs: "Disconnected" appears when session ends

**Evidence**: Implementation plan lines 228-252

**Parallelization**: [P] Can be developed simultaneously with T507 (different concerns)

---

#### T509: Add Start/End Conversation Controls
**Description**: Add UI controls to start and end conversation

**File**: `src/components/elevenlabs/voice-agent-modal.tsx` (UPDATE)

**Implementation** (Part 4 - Controls):
```typescript
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
```

**Acceptance Criteria**:
1. "Start Conversation" button visible when disconnected
2. "End Conversation" button visible when connected
3. Start button triggers `conversation.startSession()`
4. End button triggers `conversation.endSession()`
5. Manual test: Click start → connection established → click end → connection terminated

**Evidence**: Implementation plan lines 272-283

---

## Phase 5C: P2 User Stories (High Priority)
**Goal**: Implement high-priority features (independently testable)
**Duration**: 30-45 minutes
**Dependencies**: Phase 5B complete

### User Story P2 (Voice Component): Speech Transcription
**Spec**: elevenlabs-voice-component-specs.md lines 54-63
**ACs**: 5 acceptance criteria

#### T510: Display Conversation History
**Description**: Render conversation messages from SDK

**File**: `src/components/elevenlabs/voice-agent-modal.tsx` (UPDATE)

**Implementation** (Part 5 - Conversation History):
```typescript
import { Conversation } from "@/components/ui/conversation";

<Conversation>
  {conversation.messages.map((msg, idx) => (
    <div key={idx} className={`p-2 ${msg.source === 'user' ? 'text-right' : 'text-left'}`}>
      <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
        {msg.message}
      </span>
    </div>
  ))}
</Conversation>
```

**Acceptance Criteria**:
1. ✅ AC2 (Spec): User speech appears as text within 2 seconds
2. ✅ AC3 (Spec): Speech captured clearly (no clipping)
3. ✅ AC5 (Spec): System handles pauses gracefully
4. User messages aligned right
5. Agent messages aligned left
6. Manual test: Speak → transcription appears in conversation history

**Evidence**: Implementation plan lines 290-300

---

### User Story P3 (Landing Page): Responsive Design
**Spec**: nextjs-starter-specs.md lines 56-66
**ACs**: 5 acceptance criteria

#### T511: Test Responsive Design at All Breakpoints
**Description**: Verify responsive behavior on mobile, tablet, desktop

**Testing Steps**:
1. Open DevTools responsive mode
2. Test 375px width (iPhone SE):
   - Content fits without horizontal scroll
   - Text readable (minimum 16px)
   - Button tappable (minimum 44x44px)
3. Test 768px width (iPad):
   - Content centered
   - Text scales appropriately
4. Test 1920px width (desktop):
   - Content centered
   - Maximum text size applied
   - Background fills screen

**Acceptance Criteria**:
1. ✅ AC1 (Spec): Content adapts to all screen sizes
2. ✅ AC2 (Spec): Text readable at all sizes (≥ 16px mobile)
3. ✅ AC3 (Spec): CTA button tappable on touch devices (≥ 44x44px)
4. ✅ AC4 (Spec): No horizontal scrolling at any width
5. ✅ AC5 (Spec): Content hierarchy maintained across breakpoints

**Evidence**: Implementation plan lines 173-187

---

## Phase 5D: P3 User Stories (Lower Priority, Polish)
**Goal**: Implement polish features (independently testable)
**Duration**: 30-45 minutes
**Dependencies**: Phase 5C complete

### User Story P4 (Landing Page): Visual Appeal
**Spec**: nextjs-starter-specs.md lines 67-77
**ACs**: 5 acceptance criteria

#### T512: Verify Aurora Animation Performance
**Description**: Test animation smoothness and dark mode

**Testing Steps**:
1. Open Chrome DevTools Performance tab
2. Record 10 seconds of page with Aurora animation
3. Check FPS: Should maintain 60fps (or 30fps minimum on mobile)
4. Toggle dark mode: Verify text contrast remains readable
5. Enable "prefers-reduced-motion": Verify static gradient fallback

**Acceptance Criteria**:
1. ✅ AC1 (Spec): Aurora animation active (Phase 1 complete)
2. ✅ AC2 (Spec): Smooth 60fps animation (or 30fps minimum on mobile)
3. ✅ AC3 (Spec): Aesthetically pleasing colors
4. ✅ AC4 (Spec): Dark mode support with good contrast
5. ✅ AC5 (Spec): Animation not distracting from content

**Evidence**: Implementation plan lines 189-200, Aurora already complete in Phase 1

---

### User Story P5 (Voice Component): Conversation History
**Spec**: elevenlabs-voice-component-specs.md lines 83-92
**ACs**: 5 acceptance criteria

#### T513: [P] Add Orb Visual Feedback
**Description**: Integrate Orb component with conversation state

**File**: `src/components/elevenlabs/voice-agent-modal.tsx` (UPDATE)

**Implementation** (Part 6 - Orb):
```typescript
import { Orb } from "@/components/ui/orb";

const orbState = conversation.isSpeaking ? "talking" :
                 conversation.status === "connected" ? "listening" : null;

<div className="flex justify-center">
  <Orb agentState={orbState} />
</div>
```

**Acceptance Criteria**:
1. ✅ AC (Voice Spec): Visual indicator shows agent state
2. Orb displays "listening" state when connected
3. Orb displays "talking" state when agent speaking
4. Orb displays null/idle state when disconnected
5. Manual test: Start conversation → orb animates based on agent state

**Evidence**: Implementation plan lines 266-270

**Parallelization**: [P] Can be developed/tested independently from other P3 tasks

---

## Phase 5E: Integration & Verification (Cross-Cutting)
**Goal**: Verify end-to-end integration and performance
**Duration**: 30-45 minutes
**Dependencies**: Phases 5B, 5C, 5D complete

### T514: End-to-End Integration Test
**Description**: Test complete user flow from landing page to voice conversation

**Test Scenario**:
1. Load landing page (http://localhost:3000)
2. Click "Start Conversation" button
3. Grant microphone permission
4. Verify connection established (< 3 seconds)
5. Speak: "Hello, how are you?"
6. Verify transcription appears in conversation history
7. Verify agent responds with audio
8. Speak again: "What can you do?"
9. Verify conversation continues smoothly
10. Click "End Conversation"
11. Verify connection terminated cleanly
12. Close modal
13. Verify no console errors

**Acceptance Criteria**:
1. All steps complete without errors
2. Connection latency < 3 seconds
3. Speech transcription latency < 2 seconds
4. Agent response latency < 2 seconds
5. No console errors or warnings
6. Memory leak check: Repeat flow 3 times, memory stable

**Evidence**: All Phase 3 specifications (landing page + voice component)

---

### T515: Performance Verification
**Description**: Verify performance meets non-functional requirements

**Testing Steps**:
1. Run `npm run build`
2. Check bundle size output:
   - Total First Load JS < 300 KB ✅
3. Run Lighthouse audit (production build):
   - Performance score ≥ 90 ✅
   - Accessibility score ≥ 95 ✅
   - Best Practices score ≥ 95 ✅
   - SEO score ≥ 90 ✅
4. Chrome DevTools FPS counter:
   - Aurora animation maintains 60fps desktop ✅
   - Aurora animation maintains ≥ 30fps mobile ✅

**Acceptance Criteria**:
1. ✅ NFR1 (Landing Spec): Page load < 1 second
2. ✅ NFR1 (Landing Spec): Animation 60fps desktop, 30fps mobile
3. ✅ NFR1 (Landing Spec): Bundle size < 300 KB
4. ✅ NFR1 (Voice Spec): Connection latency < 3 seconds
5. ✅ NFR1 (Voice Spec): Response latency < 2 seconds

**Evidence**: Implementation plan lines 202-211, specs NFR sections

---

### T516: Accessibility Verification
**Description**: Verify WCAG AA compliance

**Testing Steps**:
1. Keyboard navigation:
   - Tab through all interactive elements
   - Verify focus visible on all elements
   - Enter/Space activates buttons
   - Escape closes modal
2. Screen reader test (VoiceOver/NVDA):
   - Logical reading order
   - Buttons announced correctly
   - Modal role announced
3. Color contrast check:
   - Text-to-background ≥ 4.5:1 normal text
   - Text-to-background ≥ 3:1 large text
4. Lighthouse Accessibility audit:
   - Score ≥ 95 ✅

**Acceptance Criteria**:
1. ✅ NFR2 (Landing Spec): WCAG AA compliance
2. ✅ NFR2 (Landing Spec): Keyboard navigation works
3. ✅ NFR2 (Landing Spec): Screen reader accessible
4. ✅ NFR2 (Voice Spec): Visual accessibility (color + motion/icons)
5. ✅ NFR2 (Voice Spec): Captions (transcription serves as captions)

**Evidence**: Implementation plan lines 212-223, specs NFR2 sections

---

### T517: Cross-Device Testing
**Description**: Test on multiple devices and browsers

**Testing Matrix**:
| Device | Browser | Resolution | Expected Behavior |
|--------|---------|------------|-------------------|
| iPhone SE | Safari iOS | 375x667 | All features work, responsive layout |
| iPad | Safari iOS | 768x1024 | All features work, tablet layout |
| Desktop | Chrome | 1920x1080 | All features work, desktop layout |
| Desktop | Firefox | 1920x1080 | All features work, desktop layout |
| Android | Chrome | 412x915 | All features work, responsive layout |

**Acceptance Criteria**:
1. ✅ NFR3 (Landing Spec): Chrome 90+, Firefox 88+, Safari 14+ support
2. ✅ NFR3 (Landing Spec): Mobile Safari iOS 14+, Chrome Android 90+ support
3. ✅ NFR3 (Voice Spec): WebRTC works on all target browsers
4. All features functional on all devices
5. No visual regressions

**Evidence**: Implementation plan lines 224-230, specs NFR3 sections

---

## Task Dependencies (CoD^Σ)

```
Phase 5A (Setup):
  T501 → T502 → T503
  (All sequential, must complete in order)

Phase 5B (P1):
  T504 → T505 (sequential: page content before button)
  T506 ∥ T507 ∥ T508 (parallel: structure, URL fetch, SDK hook can be developed simultaneously)
  T509 depends on T506, T507, T508 complete

Phase 5C (P2):
  T510 depends on T508 (needs conversation.messages)
  T511 depends on T504, T505 (tests landing page responsiveness)

Phase 5D (P3):
  T512 (independent: tests existing Aurora animation)
  T513 depends on T508 (needs conversation state)

Phase 5E (Integration):
  T514 depends on ALL Phase 5B, 5C, 5D complete
  T515 ∥ T516 ∥ T517 (parallel: performance, accessibility, cross-device can be tested simultaneously)
```

**Legend**:
- `→` Sequential dependency (must complete before next)
- `∥` Parallel execution (can work simultaneously)
- `[P]` Parallelization marker (Constitution Article VIII)

---

## Progress Tracking

### Phase 5A: Setup & Foundation
- [ ] T501: Install UI component dependencies
- [ ] T502: Create environment variables configuration
- [ ] T503: Create API route for signed URL generation

### Phase 5B: P1 User Stories (Critical)
- [ ] T504: Update landing page content
- [ ] T505: Create voice agent button component
- [ ] T506: Create voice agent modal component (structure)
- [ ] T507: [P] Implement signed URL fetching logic
- [ ] T508: [P] Integrate useConversation hook
- [ ] T509: Add start/end conversation controls

### Phase 5C: P2 User Stories (High Priority)
- [ ] T510: Display conversation history
- [ ] T511: Test responsive design at all breakpoints

### Phase 5D: P3 User Stories (Polish)
- [ ] T512: Verify Aurora animation performance
- [ ] T513: [P] Add Orb visual feedback

### Phase 5E: Integration & Verification
- [ ] T514: End-to-end integration test
- [ ] T515: Performance verification
- [ ] T516: Accessibility verification
- [ ] T517: Cross-device testing

**Total Tasks**: 17
**Estimated Duration**: 2-3 hours
**Risk Level**: Low (all dependencies validated)

---

## Verification Checkpoints

### Checkpoint 1: After Phase 5A
**Verify**:
- All components installed (`npm run build` succeeds)
- API route returns valid signed URL (`curl http://localhost:3000/api/elevenlabs`)

**Blocker**: Cannot proceed to Phase 5B without functional API route

---

### Checkpoint 2: After Phase 5B
**Verify**:
- Landing page displays updated content
- "Start Conversation" button triggers modal
- Modal opens and fetches signed URL
- Conversation starts and microphone permission requested

**Blocker**: Cannot proceed to Phase 5C without working voice conversation

---

### Checkpoint 3: After Phase 5C
**Verify**:
- Conversation history displays user and agent messages
- Responsive design works on mobile, tablet, desktop

**Blocker**: None (Phase 5D is polish, can be deferred if needed)

---

### Checkpoint 4: After Phase 5D
**Verify**:
- Aurora animation smooth (60fps desktop)
- Orb visual feedback reacts to agent state

**Proceed to**: Phase 5E (Integration & Verification)

---

### Checkpoint 5: After Phase 5E
**Verify**:
- All acceptance criteria from Phase 3 specifications satisfied
- Lighthouse scores meet targets (Performance ≥ 90, Accessibility ≥ 95)
- No console errors or warnings
- Works on all target browsers and devices

**Ready for**: Production deployment (Phase 6)

---

## Constitution Compliance

### Article IV: Specification-First Development ✅
- Phase 3 produced WHAT/WHY (technology-agnostic specifications)
- Phase 4 produced HOW (this implementation plan + task breakdown)
- Phase 5 executes the implementation plan

### Article VII: User-Story-Centric Organization ✅
- Tasks organized by user story priority (P1 → P2 → P3)
- NOT organized by technical layer (no "implement all models" phase)
- Each user story independently testable
- Progressive delivery enabled (P1 can ship before P2 complete)

### Article VIII: Parallelization Markers ✅
- Tasks marked with [P] can execute in parallel
- Examples: T507 ∥ T508 (signed URL fetch and SDK integration)
- Dependencies explicit (sequential arrows, parallel pipes)

**Evidence**: Constitution Articles IV, VII, VIII

---

## Next Steps

After task breakdown complete:
1. Begin Phase 5 execution (implement tasks in order)
2. Use TodoWrite to track progress through tasks
3. Verify acceptance criteria at each checkpoint
4. Update event-stream.md with implementation progress
5. Proceed to Phase 6 (Deployment) after Phase 5E verification passes

**Total Implementation Time**: 2-3 hours
**Risk Level**: Low (validated architecture, clear acceptance criteria)
**Ready for**: Immediate execution

---

**Task Breakdown Version**: 1.0
**Generated From**: implementation-plan.md
**Organized By**: User Story Priority (Constitution Article VII)
