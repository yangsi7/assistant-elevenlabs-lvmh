# ElevenLabs Voice Agent Web App - Project Prompt

**Version**: 1.0
**Created**: 2025-11-04
**Status**: ACTIVE

---

## Project Mission

Build a production-ready, single-page Next.js web application that enables users to interact with ElevenLabs voice agents through a clean, modern UI featuring an Aurora animated background and ElevenLabs UI components.

**Core Principle**: Simple, progressive implementation with research-first approach and test-driven development.

---

## Critical Requirements (NON-NEGOTIABLE)

### 1. Research-First Imperative

**MANDATORY**: You MUST review the latest official documentation before planning or implementing ANY feature.

**Required Research Activities**:
- Review ElevenLabs Agent SDK documentation (NOT the REST API)
- Review ElevenLabs UI component documentation
- Study official examples and implementation patterns
- Verify library versions and compatibility

**Prohibited Actions**:
- Planning without documented research
- Implementation based on assumptions
- Using outdated patterns or deprecated APIs

**Evidence Required**:
- All research findings documented in session directory
- References to official documentation with URLs
- Code examples extracted from official sources

### 2. Test-Driven Development Protocol

**MANDATORY**: Verify every implementation step using Chrome DevTools MCP.

**Required Verification Steps**:
1. Kill existing servers before starting new ones
2. Run development server and review logs for errors
3. Access localhost via Chrome DevTools MCP
4. Capture screenshots and analyze visual output
5. Review HTML structure and network calls
6. Verify console logs for errors or warnings

**Prohibited Actions**:
- Deploying without local verification
- Assuming functionality works without testing
- Skipping visual verification steps

### 3. Progressive Complexity Principle

**MANDATORY**: Start simple and build incrementally.

**Implementation Sequence**:
1. **Phase 0**: Project setup with Next.js best practices
2. **Phase 1**: Aurora background integration and verification
3. **Phase 2**: ElevenLabs component research and documentation
4. **Phase 3**: ElevenLabs agent integration
5. **Phase 4**: Testing, refinement, and deployment

**Prohibited Actions**:
- Implementing all features simultaneously
- Adding complexity before basics are verified
- Skipping intermediate verification steps

---

## Technical Stack & Architecture

### Core Technologies

**Framework**:
- Next.js (latest stable version)
- React (with TypeScript)
- Node.js runtime

**UI/Styling**:
- Shadcn UI component library
- Tailwind CSS for styling
- Framer Motion for animations (Aurora component)
- Lucide React for icons

**ElevenLabs Integration**:
- `@elevenlabs/react` package
- ElevenLabs Agent SDK (NOT REST API)
- `@elevenlabs-ui` registry via Shadcn CLI

**Deployment**:
- Vercel (primary platform)
- Vercel MCP for deployment monitoring

**Testing & Verification**:
- Chrome DevTools MCP (visual testing, network inspection)
- Jest or Vitest for unit tests (if applicable)

### Project Structure

```
assistant-elevenlabs-lvmh/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   │   └── aurora-background.tsx
│   │   └── elevenlabs/         # ElevenLabs components
│   │       └── voice-agent.tsx
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── docs/
│   ├── research/               # Research documentation
│   ├── standards/              # Tech stack and code standards
│   └── specs/                  # Feature specifications
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Multi-Phase Workflow (Orchestrated)

### Phase 0: Project Setup & Foundation

**Objective**: Establish Next.js project with proper folder structure, dependencies, and configuration.

**Tasks**:
1. Initialize Next.js project with TypeScript
2. Configure Shadcn UI with `@elevenlabs-ui` registry
3. Install and configure Tailwind CSS
4. Set up folder structure per best practices
5. Verify build and dev server functionality

**Deliverables**:
- Working Next.js project
- Documented tech stack versions
- Initial `tech-stack-and-code-standards.md`

**Verification**:
- Dev server runs without errors
- Build completes successfully
- Chrome DevTools MCP shows empty page rendering

---

### Phase 1: Aurora Background Integration

**Objective**: Implement and verify Aurora animated background component.

**Tasks**:
1. Create `/components/ui/aurora-background.tsx` component
2. Extend `tailwind.config.js` with Aurora animation
3. Create demo page with Aurora background
4. Test responsive behavior and animations

**Component Source**:
```tsx
// See lines 88-142 in starting-prompt.md for full component code
"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
              [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
              [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
              [background-image:var(--white-gradient),var(--aurora)]
              dark:[background-image:var(--dark-gradient),var(--aurora)]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              filter blur-[10px] invert dark:invert-0
              after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)]
              after:dark:[background-image:var(--dark-gradient),var(--aurora)]
              after:[background-size:200%,_100%]
              after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
              pointer-events-none
              absolute -inset-[10px] opacity-50 will-change-transform`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
```

**Tailwind Config Extension**:
```js
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({ ":root": newVars });
}
```

**Deliverables**:
- Working Aurora background component
- Integrated demo page
- Chrome DevTools screenshots showing animations

**Verification**:
- Aurora animation visible and smooth
- Responsive across mobile/desktop
- No console errors
- Screenshots captured via Chrome DevTools MCP

---

### Phase 2: ElevenLabs Research & Documentation

**Objective**: Create comprehensive, AI-agent-ready documentation for ElevenLabs Agent SDK and UI component integration.

**Orchestration Strategy**:

This phase uses parallel research agents with systematic recombination:

1. **Agent 1 (Parallel)**: Research ElevenLabs Agent SDK
   - Focus: Agent initialization, authentication, connection patterns
   - Tools: Ref MCP, Firecrawl MCP
   - Output: `docs/research/research-elevenlabs-agent-sdk.md`

2. **Agent 2 (Parallel)**: Research ElevenLabs UI Components
   - Focus: Component API, props, integration patterns
   - Tools: Ref MCP, Firecrawl MCP
   - Output: `docs/research/research-elevenlabs-ui.md`

3. **Agent 3 (Parallel)**: Research Next.js Integration Patterns
   - Focus: Client components, server actions, environment variables
   - Tools: Ref MCP
   - Output: `docs/research/research-nextjs-elevenlabs.md`

4. **Agent 4 (Sequential)**: Synthesize Research Reports
   - Focus: Connect dots between Agent SDK and UI components
   - Input: All parallel agent outputs
   - Process: Deep recursive analysis, identify relationships, create unified context
   - Output: `docs/research/synthesis-report.md`

**Research Sources** (MANDATORY):
- https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js
- https://elevenlabs.io/docs/agents-platform (scrape all relevant pages)
- https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/conversational-ai/nextjs
- https://www.npmjs.com/package/@elevenlabs/react
- https://ui.elevenlabs.io/docs (scrape all relevant pages)
- https://ui.elevenlabs.io/docs/setup

**Research Documentation Requirements**:
- Concise, focused content (avoid large documents)
- Abundant code examples and snippets
- Clear implementation patterns for Next.js context
- Step-by-step integration guides
- Common pitfalls and anti-patterns
- Authentication and API key management
- Agent ID connection patterns

**Deliverables**:
- `docs/research/research-elevenlabs-agent-sdk.md`
- `docs/research/research-elevenlabs-ui.md`
- `docs/research/research-nextjs-elevenlabs.md`
- `docs/research/synthesis-report.md`
- Updated `tech-stack-and-code-standards.md` with ElevenLabs patterns

**Verification**:
- All research documents created
- Code examples extracted from official sources
- Synthesis report connects all components
- Standards document updated with patterns

---

### Phase 3: Specification Generation

**Objective**: Create detailed specifications for the Next.js starter page and ElevenLabs voice component.

**Tasks**:
1. Create `nextjs-starter-specs.md`:
   - Landing page layout
   - Aurora background integration
   - Content structure
   - Responsive behavior

2. Create `elevenlabs-voice-component-specs.md`:
   - Component requirements
   - Agent ID integration
   - User interaction flow
   - Error handling

**Deliverables**:
- `docs/specs/nextjs-starter-specs.md`
- `docs/specs/elevenlabs-voice-component-specs.md`

**Verification**:
- Specifications are technology-agnostic (WHAT/WHY not HOW)
- All requirements testable and measurable
- Success criteria clearly defined

---

### Phase 4: Implementation Plan Generation

**Objective**: Create detailed implementation plan with task breakdown.

**Tasks**:
1. Generate implementation plan based on specifications
2. Break down into user stories with priorities (P1, P2, P3)
3. Define acceptance criteria for each task
4. Identify dependencies and parallel work opportunities

**Deliverables**:
- `docs/plans/implementation-plan.md`
- `docs/plans/task-breakdown.md`

**Verification**:
- Plan maps to specifications
- Tasks have clear acceptance criteria
- Dependencies identified
- Parallel work opportunities marked

---

### Phase 5: Implementation Execution

**Objective**: Build the voice agent web app following test-driven development.

**Implementation Sequence**:
1. Create main landing page with Aurora background
2. Integrate ElevenLabs UI component from `@elevenlabs-ui` registry
3. Connect component to ElevenLabs Agent SDK
4. Configure agent ID (provided by user)
5. Test user interaction flow
6. Refine UI/UX based on testing

**Test-Driven Workflow** (per feature):
1. Write test criteria for feature
2. Implement feature
3. Run dev server and verify via Chrome DevTools MCP
4. Capture screenshots and analyze
5. Review network calls (API requests/responses)
6. Check console logs for errors
7. Iterate until tests pass

**Deliverables**:
- Working voice agent web app
- All features verified via Chrome DevTools
- Deployment to Vercel

**Verification**:
- Voice agent connects successfully
- User can interact with agent
- UI is responsive and accessible
- No console errors
- Network calls show successful API communication
- Screenshots confirm expected behavior

---

## Quality Gates & Verification

### Infrastructure Verification Agent

**Purpose**: Ensure general application infrastructure and repository conventions are respected.

**Verification Checklist**:
- [ ] Next.js project structure follows best practices
- [ ] TypeScript configuration is correct
- [ ] Tailwind CSS integration is complete
- [ ] Shadcn UI components are properly configured
- [ ] Build completes without errors
- [ ] Dev server runs without warnings
- [ ] Environment variables are properly configured

**Evidence Required**:
- Build output logs
- Dev server console output
- Chrome DevTools screenshots

### ElevenLabs Integration Verification Agent

**Purpose**: Verify ElevenLabs Agent SDK and UI component integration is correct.

**Verification Checklist**:
- [ ] Agent SDK initialized correctly
- [ ] Agent ID configured properly
- [ ] UI component connected to Agent SDK
- [ ] Authentication/API keys properly managed
- [ ] Voice interaction works end-to-end
- [ ] Error handling implemented
- [ ] Network calls show successful communication

**Reference Documents**:
- `docs/research/research-elevenlabs-agent-sdk.md`
- `docs/research/research-elevenlabs-ui.md`
- `docs/research/synthesis-report.md`
- `tech-stack-and-code-standards.md`

**Evidence Required**:
- Chrome DevTools network tab showing API calls
- Console logs showing agent connection
- Screenshots of working voice interaction

**Escalation Protocol**:
- If verification fails, agent can research official documentation
- Use Ref MCP and Firecrawl MCP for clarification
- Update research documents if new patterns discovered

---

## Deliverables (Comprehensive)

### Phase 0 Deliverables
- [ ] Working Next.js project with TypeScript
- [ ] `tech-stack-and-code-standards.md` (initial version)

### Phase 1 Deliverables
- [ ] Aurora background component integrated
- [ ] Chrome DevTools screenshots showing animations
- [ ] Verified responsive behavior

### Phase 2 Deliverables
- [ ] `docs/research/research-elevenlabs-agent-sdk.md`
- [ ] `docs/research/research-elevenlabs-ui.md`
- [ ] `docs/research/research-nextjs-elevenlabs.md`
- [ ] `docs/research/synthesis-report.md`
- [ ] Updated `tech-stack-and-code-standards.md` with ElevenLabs patterns

### Phase 3 Deliverables
- [ ] `docs/specs/nextjs-starter-specs.md`
- [ ] `docs/specs/elevenlabs-voice-component-specs.md`

### Phase 4 Deliverables
- [ ] `docs/plans/implementation-plan.md`
- [ ] `docs/plans/task-breakdown.md`

### Phase 5 Deliverables
- [ ] Working voice agent web app
- [ ] Deployed to Vercel
- [ ] Chrome DevTools verification screenshots
- [ ] Network call logs showing successful API communication
- [ ] User interaction demonstration

---

## Skills to Import & Use

Execute these skills as needed throughout the project:

- `/skill nextjs` - Next.js best practices and implementation patterns
- `/skill shadcn-ui` - Shadcn UI component integration
- `/skill tailwindcss` - Tailwind CSS styling and configuration
- `/skill test-driven-development` - TDD methodology
- `/skill webapp-testing` - Web app testing with Chrome DevTools

---

## MCP Tools & Usage

### Ref MCP (Documentation Research)

**Purpose**: Retrieve latest official documentation for libraries

**Usage**:
- Research ElevenLabs Agent SDK API
- Research `@elevenlabs/react` package documentation
- Research Next.js App Router patterns
- Research Shadcn UI component APIs

**When to Use**: Before planning or implementing ANY feature

### Firecrawl MCP (Web Scraping)

**Purpose**: Scrape examples, guides, and GitHub repositories

**Usage**:
- Scrape ElevenLabs documentation pages
- Extract code examples from official repos
- Gather implementation patterns from guides

**When to Use**: During research phase (Phase 2)

### Chrome DevTools MCP (Visual Testing)

**Purpose**: Verify implementation at every step

**Usage**:
- Navigate to localhost and capture screenshots
- Review HTML structure and DOM
- Inspect network calls (API requests/responses)
- Review console logs for errors/warnings
- Analyze performance and render behavior

**When to Use**: After EVERY implementation step, before proceeding

### Vercel MCP (Deployment)

**Purpose**: Deploy and monitor production application

**Usage**:
- Deploy to Vercel
- Monitor deployment logs
- Review production environment
- Troubleshoot deployment issues

**When to Use**: After local verification is complete (Phase 5)

---

## Critical Resources (MANDATORY REVIEW)

### ElevenLabs Documentation

**Agent Platform Quickstart**:
- https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js

**Agent Platform Docs** (scrape all relevant pages):
- https://elevenlabs.io/docs/agents-platform

**Official Next.js Example**:
- https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/conversational-ai/nextjs

**React Package**:
- https://www.npmjs.com/package/@elevenlabs/react

**UI Documentation** (scrape all relevant pages):
- https://ui.elevenlabs.io/docs
- https://ui.elevenlabs.io/docs/setup

---

## Success Criteria

### Technical Success Criteria

- [ ] Next.js project builds without errors
- [ ] Aurora background animates smoothly
- [ ] ElevenLabs voice agent connects successfully
- [ ] User can interact with voice agent via UI
- [ ] All network calls to ElevenLabs API succeed
- [ ] No console errors in Chrome DevTools
- [ ] Responsive design works on mobile and desktop
- [ ] Application deployed to Vercel
- [ ] All verification steps pass

### Documentation Success Criteria

- [ ] All research documents created and concise (<500 lines each)
- [ ] Code examples extracted from official sources
- [ ] Tech stack standards document complete
- [ ] Specifications are clear and testable
- [ ] Implementation plan maps to specifications
- [ ] All deliverables documented with evidence

### Process Success Criteria

- [ ] Research completed BEFORE planning
- [ ] Planning completed BEFORE implementation
- [ ] Each implementation step verified via Chrome DevTools
- [ ] Test-driven approach followed consistently
- [ ] Progressive complexity maintained (simple → complex)
- [ ] Quality gates passed before proceeding

---

## Anti-Patterns to Avoid

### Research Anti-Patterns
- ❌ Implementing without reviewing latest documentation
- ❌ Using outdated patterns or deprecated APIs
- ❌ Assuming implementation details without evidence
- ❌ Skipping code example extraction from official sources

### Implementation Anti-Patterns
- ❌ Building all features simultaneously
- ❌ Deploying without local verification
- ❌ Skipping Chrome DevTools visual testing
- ❌ Ignoring console errors or warnings
- ❌ Not verifying network calls and API responses

### Documentation Anti-Patterns
- ❌ Creating oversized documents (>500 lines)
- ❌ Writing documentation without code examples
- ❌ Mixing WHAT/WHY with HOW in specifications
- ❌ Creating implementation plans before specifications

### Process Anti-Patterns
- ❌ Planning without research
- ❌ Implementing without planning
- ❌ Proceeding without verification
- ❌ Ignoring quality gate failures

---

## User Clarification Protocol

**Proactive Clarification**: Always clarify with the user if anything is unclear.

**When to Clarify**:
- Ambiguous requirements in specifications
- Multiple viable technical approaches
- Uncertain about agent ID or API key configuration
- Unclear about UI/UX expectations
- Questions about deployment configuration

**How to Clarify**:
- Present specific questions with context
- Offer recommendations based on research
- Provide examples or mockups when helpful
- Document clarifications in session artifacts

---

## Session Artifacts & Logging

All session work should be documented in:
- `docs/sessions/{session-id}/` - Session-specific artifacts
- `event-stream.md` - Chronological log of all events
- `todo.md` - Current tasks and progress
- `workbook.md` - Active context and reflections

**Event Types to Log**:
- `Message` - User messages and requests
- `tool-call` - MCP tool invocations
- `research-docs` - Internal documentation research
- `research-external` - External research via MCP
- `observation` - Key findings or insights
- `decision` - Important decisions made
- `plan` - Planning activities
- `verification` - Testing and verification results

---

## Execution Checklist

Before starting implementation, verify:

- [ ] This prompt has been read and understood completely
- [ ] Research-first requirement is clear
- [ ] Test-driven development protocol is clear
- [ ] Progressive complexity principle is clear
- [ ] All required MCP tools are available
- [ ] Skills can be imported as needed
- [ ] Quality gates are understood
- [ ] Deliverables are documented
- [ ] User clarification protocol is clear

**Ready to Begin**: Proceed with Phase 0 (Project Setup & Foundation)

---

**Last Updated**: 2025-11-04
**Status**: ACTIVE
**Version**: 1.0
