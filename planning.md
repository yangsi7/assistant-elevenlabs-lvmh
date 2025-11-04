# Master Plan

**Status**: ACTIVE
**Version**: 1.1
**Last Updated**: 2025-11-04

---

## Project Overview

**Project Name**: ElevenLabs Voice Agent Web App

**Problem Statement**:
Users need intuitive voice-based interaction for web applications. Traditional text-based interfaces create friction for scenarios requiring hands-free operation, accessibility support, or natural conversation. ElevenLabs provides conversational AI agents, but integrating them into modern web apps requires understanding of WebRTC, audio streaming, state management, and UI/UX best practices.

**Core Innovation**:
Combine ElevenLabs' conversational AI with Next.js 15 App Router and a beautiful Aurora-animated UI. Deliver a production-ready template that demonstrates voice agent integration with proper authentication, error handling, and responsive design. Enable developers to clone and customize for their own voice-enabled applications.

**Success Criteria**:
1. Voice interaction works reliably (< 2 second response latency, 95%+ uptime)
2. UI is visually appealing (Aurora animations, responsive design, dark mode support)
3. Code is production-ready (proper authentication, error handling, TypeScript strict mode)
4. Documentation enables easy customization (clear specs, implementation guide, deployment instructions)

---

## Architecture (CoD^Σ)

### System Model

```
System := NextJS_App ⊕ ElevenLabs_SDK ⊕ UI_Components ⊕ Aurora_Background

Flow := User_Action ≫ State_Update ≫ SDK_Call ≫ Voice_Response ≫ UI_Feedback

Integration := NextJS_Client ⇄ ElevenLabs_API (via @elevenlabs/react 0.9.1)
              NextJS_Server → SignedURL_Generation (API route)
              Client_State ⇄ UI_Components (Orb, ConversationBar, etc.)
```

### Key Components

**Component 1**: Next.js 15 App Router
- **Purpose**: Modern React framework with server-side rendering, App Router architecture
- **Dependencies**: React 18.3.1 (NOT 19.x - compatibility requirement)
- **Interfaces**: Provides routing, layout system, API routes for authentication
- **Evidence**: package.json line 16, src/app/ structure

**Component 2**: @elevenlabs/react SDK (v0.9.1)
- **Purpose**: Voice agent integration via useConversation hook
- **Dependencies**: Browser APIs (WebRTC, MediaDevices), ElevenLabs Agent ID
- **Interfaces**: useConversation hook, connection management, message handling
- **Evidence**: docs/research/research-elevenlabs-agent-sdk.md, package.json line 12

**Component 3**: Shadcn UI + @elevenlabs-ui
- **Purpose**: UI component library with voice-specific components (Orb, ConversationBar, etc.)
- **Dependencies**: Tailwind CSS, Radix UI primitives
- **Interfaces**: 16 pre-built components for voice interaction
- **Evidence**: components.json line 18-20, docs/research/research-elevenlabs-ui.md

**Component 4**: Aurora Background
- **Purpose**: Animated gradient background for visual appeal
- **Dependencies**: Framer Motion 11.11.11, Tailwind custom animation
- **Interfaces**: React component wrapping children with animated background
- **Evidence**: src/components/ui/aurora-background.tsx, tailwind.config.js line 11-17

### Data Flow

```
User Action (Click "Start") → useConversation.startSession()
                            ↓
                     WebRTC Connection Established
                            ↓
                     User Speaks (Audio Input)
                            ↓
                     ElevenLabs Agent Processing
                            ↓
                     Agent Response (Audio Output)
                            ↓
                     UI State Update (isSpeaking, messages)
                            ↓
                     Visual Feedback (Orb animation, message display)
```

---

## Components (Must-Have for v1.0)

### Core Infrastructure

1. ✅ **Next.js 15 Project Structure** - COMPLETE
   - **Purpose**: Modern React framework with App Router, TypeScript, Tailwind CSS
   - **Key Features**: Server components, API routes, optimized builds
   - **Dependencies**: React 18.3.1, TypeScript 5.6.3
   - **Status**: COMPLETE (Phase 0)

2. ✅ **Shadcn UI Configuration** - COMPLETE
   - **Purpose**: Component library with @elevenlabs-ui registry
   - **Key Features**: 16 voice UI components, Tailwind-based styling
   - **Dependencies**: Tailwind CSS 3.4.14, Radix UI
   - **Status**: COMPLETE (Phase 0)

### User Interface

1. ✅ **Aurora Background Component** - COMPLETE
   - **Purpose**: Animated gradient background for landing page
   - **Key Features**: Smooth 60s animation, dark mode support, blur effects
   - **Dependencies**: Framer Motion 11.11.11
   - **Status**: COMPLETE (Phase 1)

2. ⏳ **Landing Page** - IN PROGRESS (Phase 3)
   - **Purpose**: Hero section with CTA to start voice conversation
   - **Key Features**: Responsive design, Aurora integration, clear messaging
   - **Dependencies**: Aurora component
   - **Status**: IN PROGRESS (specification phase)

3. ⏳ **Voice Agent Component** - PLANNED (Phase 5)
   - **Purpose**: Voice interaction interface with conversation state
   - **Key Features**: Start/stop controls, audio visualization, message display
   - **Dependencies**: @elevenlabs/react 0.9.1, @elevenlabs-ui components
   - **Status**: PLANNED (research complete)

### Integration Points

1. ✅ **Research Documentation** - COMPLETE
   - **Purpose**: Comprehensive ElevenLabs integration knowledge base
   - **Key Features**: SDK patterns, UI components catalog, integration architecture
   - **Dependencies**: Ref MCP, Firecrawl MCP
   - **Status**: COMPLETE (Phase 2 - 4 research docs, 3,653 total lines)

2. ⏳ **Authentication System** - PLANNED (Phase 5)
   - **Purpose**: Server-side signed URL generation for private agents
   - **Key Features**: API route, environment variable management, secure token handling
   - **Dependencies**: ElevenLabs API key
   - **Status**: PLANNED (architecture defined in synthesis-report.md)

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.0.3 (App Router)
- **State Management**: React hooks (useState, useEffect) + @elevenlabs/react useConversation
- **UI Components**: Shadcn UI + @elevenlabs-ui registry (16 components)
- **Styling**: Tailwind CSS 3.4.14 + custom Aurora animation

### Backend
- **Runtime**: Node.js LTS (Next.js API routes)
- **Framework**: Next.js 15 API routes (for signed URL generation)
- **Database**: N/A (stateless voice interaction)
- **Authentication**: Server-side signed URL generation (ElevenLabs API)

### Infrastructure
- **Hosting**: Vercel (automatic deployments)
- **CI/CD**: Vercel Git integration
- **Monitoring**: Vercel MCP (Phase 6)
- **Testing**: Manual testing + Chrome DevTools MCP (Phase 4-5)

---

## File Structure

```
assistant-elevenlabs-lvmh/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout ✅
│   │   ├── page.tsx            # Landing page (Aurora demo) ✅
│   │   ├── globals.css         # Global styles ✅
│   │   └── api/                # API routes (Phase 5)
│   │       └── elevenlabs/     # Signed URL generation
│   │           └── route.ts    # API endpoint
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   │   └── aurora-background.tsx ✅
│   │   └── elevenlabs/         # Voice agent components (Phase 5)
│   │       ├── voice-agent.tsx
│   │       └── conversation-display.tsx
│   └── lib/
│       └── utils.ts            # Utility functions ✅
├── docs/
│   ├── research/               # Research documentation ✅
│   │   ├── research-elevenlabs-agent-sdk.md (495 lines)
│   │   ├── research-elevenlabs-ui.md (1,039 lines)
│   │   ├── research-nextjs-elevenlabs.md (1,529 lines)
│   │   └── synthesis-report.md (590 lines)
│   ├── standards/              # Tech stack & code standards ✅
│   │   └── tech-stack-and-code-standards.md (v2.0)
│   ├── specs/                  # Feature specifications (Phase 3)
│   └── plans/                  # Implementation plans (Phase 4)
├── public/                     # Static assets
├── components.json             # Shadcn UI configuration ✅
├── tailwind.config.js          # Tailwind + Aurora animation ✅
├── tsconfig.json               # TypeScript configuration ✅
├── next.config.js              # Next.js configuration ✅
├── package.json                # Dependencies ✅
├── event-stream.md             # Chronological event log ✅
├── todo.md                     # Actionable tasks ✅
├── workbook.md                 # Active context ✅
└── planning.md                 # This file ✅
```

---

## Development Workflow

### 6-Phase Execution Plan

1. **Phase 0**: Project Setup & Foundation ✅ COMPLETE
2. **Phase 1**: Aurora Background Integration ✅ COMPLETE
3. **Phase 2**: ElevenLabs Research & Documentation ✅ COMPLETE
4. **Phase 3**: Specification Generation ✅ COMPLETE
5. **Phase 4**: Implementation Planning ✅ COMPLETE
6. **Phase 5**: Voice Agent Implementation ⏳ IN PROGRESS
7. **Phase 6**: Deployment ⏳ PENDING

### Quality Gates

- **Pre-Planning**: ✅ Quality checklist validated (Phase 2 research complete)
- **Pre-Implementation**: ⏳ Specification validation (Phase 3)
- **Pre-Deployment**: ⏳ Integration testing (Phase 5)

---

## Phases and Milestones

### Phase 0: Project Setup & Foundation ✅ COMPLETE
**Goal**: Establish Next.js project with Shadcn UI and Tailwind CSS

**Milestones**:
- [x] M0.1: Next.js 15 project structure created
- [x] M0.2: Shadcn UI configured with @elevenlabs-ui registry
- [x] M0.3: Tailwind CSS with Aurora animation plugin
- [x] M0.4: Build successful (100 kB baseline)

**Deliverables**:
- Working Next.js 15 project ✅
- 420 packages installed ✅
- TypeScript strict mode enabled ✅
- Build verified successful ✅

### Phase 1: Aurora Background Integration ✅ COMPLETE
**Goal**: Create animated background component

**Milestones**:
- [x] M1.1: Aurora component created (src/components/ui/aurora-background.tsx)
- [x] M1.2: Landing page updated with Aurora demo
- [x] M1.3: Build successful (143 kB with Aurora)
- [x] M1.4: Dev server tested on localhost:3000

**Deliverables**:
- Aurora background component ✅
- Demo landing page ✅
- Framer Motion integration ✅
- Visual verification ✅

### Phase 2: ElevenLabs Research & Documentation ✅ COMPLETE
**Goal**: Comprehensive research on ElevenLabs integration patterns

**Milestones**:
- [x] M2.1: Agent SDK research complete (495 lines)
- [x] M2.2: UI components research complete (1,039 lines)
- [x] M2.3: Next.js integration patterns research complete (1,529 lines)
- [x] M2.4: Synthesis report complete (590 lines)
- [x] M2.5: Tech stack standards updated to v2.0

**Deliverables**:
- 4 comprehensive research documents ✅
- Integration architecture defined ✅
- Component integration matrix ✅
- Implementation roadmap established ✅

### Phase 3: Specification Generation ✅ COMPLETE
**Goal**: Create technology-agnostic feature specifications

**Milestones**:
- [x] M3.1: nextjs-starter-specs.md created (356 lines)
- [x] M3.2: elevenlabs-voice-component-specs.md created (540 lines)

**Deliverables**:
- Landing page specification (WHAT/WHY, not HOW) ✅
- Voice component specification (WHAT/WHY, not HOW) ✅

### Phase 4: Implementation Planning ✅ COMPLETE
**Goal**: Generate implementation plan with tech stack decisions

**Milestones**:
- [x] M4.1: Create implementation-plan.md (735 lines)
- [x] M4.2: Generate task breakdown by user stories (P1, P2, P3) (801 lines)

**Deliverables**:
- Implementation plan with HOW details ✅
- Task list organized by priority ✅

### Phase 5: Voice Agent Implementation ✅ PHASE 5B COMPLETE (Under Verification)
**Goal**: Implement voice interaction using @elevenlabs/react 0.9.1

**Milestones**:
- [x] M5.1: Voice agent component implemented (ConversationBar wrapper)
- [x] M5.2: UI components integrated (@elevenlabs-ui - ConversationBar, Dialog, LiveWaveform)
- [x] M5.3: Authentication system setup (API route for signed URLs)
- [ ] M5.4: Complete interaction flow tested (Verification in progress with agentId: IUYmGRbdis9xqSciJKcg)

**Deliverables**:
- Working voice agent component
- Authentication via signed URLs
- Error handling implemented
- Test-driven development complete

**Sub-Phases**:
- Phase 5A: Setup & Foundation (T501-T503, 15-20 min) ✅ COMPLETE
- Phase 5B: P1 User Stories (T504-T505, 20 min) ✅ COMPLETE (simplified: 6 tasks → 2 tasks)
- Phase 5C: P2 User Stories (T510-T511, 30-45 min) ⏳ PENDING
- Phase 5D: P3 User Stories (T512-T513, 30-45 min) ⏳ PENDING
- Phase 5E: Integration & Verification (T514-T517, 30-45 min) 🔄 IN PROGRESS (verification phase)

### Phase 6: Deployment ⏳ PENDING
**Goal**: Deploy to Vercel production

**Milestones**:
- [ ] M6.1: Enable Vercel MCP
- [ ] M6.2: Deploy to Vercel
- [ ] M6.3: Verify production environment

**Deliverables**:
- Live production URL
- Monitoring configured
- Deployment documentation

---

## Success Metrics

### Technical Metrics

| Metric | Target | Current Status |
|--------|--------|---------------|
| Build Success | 100% | ✅ 100% (143 kB) |
| TypeScript Strict Mode | Enabled | ✅ Enabled |
| Research Documentation | > 3,000 lines | ✅ 3,653 lines |
| Phase Completion | Phases 0-3 | ✅ 88% (14/16 tasks) |

---

## Dependencies

### External Dependencies

- **@elevenlabs/react**: 0.9.1 (user explicitly required)
- **next**: 15.0.3
- **react**: 18.3.1 (NOT 19.x - compatibility constraint)
- **framer-motion**: 11.11.11
- **tailwindcss**: 3.4.14

### Internal Dependencies

- **Voice Agent Component** depends on **@elevenlabs/react SDK** (Phase 5)
- **Authentication System** depends on **ElevenLabs API Key** (Phase 5)
- **Landing Page** depends on **Aurora Component** (Phase 1 complete)

---

## Decision Log

### Major Architectural Decisions

**Decision**: Use @elevenlabs/react 0.9.1
- **Date**: 2025-11-04
- **Rationale**: User explicitly required version 0.9.1 for latest features
- **Alternatives**: v0.3.0 (initial), v1.0+ (future)
- **Evidence**: User message: "Please use elevenlabs react 0.9.1. Make sure of it!"
- **Impact**: All documentation updated to v0.9.1 API, research based on v0.9.1

**Decision**: Use React 18.3.1 (NOT 19.x)
- **Date**: 2025-11-04
- **Rationale**: React 19.0.0 incompatible with Next.js 15.0.3
- **Alternatives**: Wait for Next.js to support React 19
- **Evidence**: npm error during install, compatibility matrix
- **Impact**: Changed package.json from React 19.0.0 to 18.3.1

**Decision**: Manual Next.js project setup
- **Date**: 2025-11-04
- **Rationale**: create-next-app failed due to existing files
- **Alternatives**: Delete existing files, use create-next-app
- **Evidence**: create-next-app error message
- **Impact**: Manually created all config files (package.json, tsconfig.json, etc.)

**Decision**: 6-Phase progressive implementation
- **Date**: 2025-11-04
- **Rationale**: Incremental complexity, verification at each phase
- **Alternatives**: Big-bang implementation
- **Evidence**: Structured prompt from agentic-prompt-engineer agent
- **Impact**: Clear milestones, manageable scope, early issue detection

---

## Version History

### Version 1.0 (2025-11-04 - Phase 0)
- Initial plan created
- Core components defined (Next.js, Shadcn UI, Tailwind)
- Project structure established

### Version 1.1 (2025-11-04 - Phase 2)
- Updated with ElevenLabs integration details
- Research documentation complete (3,653 lines)
- Architecture defined with CoD^Σ notation
- Integration patterns documented

---

## Related Documents

- **Todo List**: @todo.md (actionable tasks, 103 lines)
- **Workbook**: @workbook.md (current context, patterns)
- **Event Stream**: @event-stream.md (chronological log, last 20 events)
- **Tech Stack**: @docs/standards/tech-stack-and-code-standards.md (v2.0)
- **Research**: @docs/research/ (4 comprehensive documents)
- **Constitution**: @.claude/shared-imports/constitution.md (7 articles)

---

**Last Review**: 2025-11-04
**Next Review**: After Phase 4 completion
**Status**: On Track (88% complete, Phase 4 in progress)
