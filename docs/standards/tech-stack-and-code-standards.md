# Tech Stack and Code Standards

**Version**: 2.0
**Last Updated**: 2025-11-04 (Phase 2 Research Complete)
**Project**: ElevenLabs Voice Agent Web App

---

## Core Technologies

### Framework & Runtime
- **Next.js**: 15.0.3 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.6.3
- **Node.js**: Latest LTS

### UI & Styling
- **Shadcn UI**: Latest (with @elevenlabs-ui registry)
- **Tailwind CSS**: 3.4.14
- **Framer Motion**: 11.11.11 (for Aurora animations)
- **Lucide React**: 0.454.0 (icons)

### ElevenLabs Integration
- **@elevenlabs/react**: 0.9.1 (Agent SDK)
- **Registry**: @elevenlabs-ui (via Shadcn)
- **Components Available**: 16 UI components (Orb, ConversationBar, Conversation, etc.)

### Development Tools
- **ESLint**: 8.57.1 (next/core-web-vitals)
- **PostCSS**: 8.4.47
- **Autoprefixer**: 10.4.20

---

## Project Structure

```
assistant-elevenlabs-lvmh/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main landing page
│   │   └── globals.css         # Global styles & CSS variables
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   │   └── aurora-background.tsx (Phase 1)
│   │   └── elevenlabs/         # ElevenLabs components
│   │       └── voice-agent.tsx (Phase 5)
│   └── lib/
│       └── utils.ts            # Utility functions (cn, etc.)
├── public/                     # Static assets
├── docs/
│   ├── research/               # Research documentation
│   ├── standards/              # Tech stack & code standards
│   ├── specs/                  # Feature specifications
│   └── plans/                  # Implementation plans
├── components.json             # Shadcn UI configuration
├── tailwind.config.js          # Tailwind + Aurora animation
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

---

## Code Standards

### TypeScript
- **Strict mode enabled**: All type checking enforced
- **Path aliases**: `@/*` resolves to `./src/*`
- **Target**: ES2017
- **Module**: ESNext with bundler resolution

### React Components
- **Use "use client" directive** for client-side interactivity
- **Server components by default** (App Router)
- **Prefer functional components** with hooks
- **Type all props** with TypeScript interfaces

### Styling
- **Tailwind utility classes** for all styling
- **CSS variables** for theme tokens (see globals.css)
- **Dark mode support** via `darkMode: ["class"]`
- **Component composition** over inline styles

### File Naming
- **Components**: PascalCase (e.g., `AuroraBackground.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Pages**: lowercase (e.g., `page.tsx`, `layout.tsx`)
- **Config files**: kebab-case (e.g., `tailwind.config.js`)

---

## Tailwind Configuration

### Aurora Animation

The tailwind.config.js includes custom Aurora animation:

```js
animation: {
  aurora: "aurora 60s linear infinite",
},
keyframes: {
  aurora: {
    from: { backgroundPosition: "50% 50%, 50% 50%" },
    to: { backgroundPosition: "350% 50%, 350% 50%" },
  },
},
```

### Color System
- Uses CSS variables for theming
- Supports light and dark modes
- Tailwind color palette exposed as CSS variables via plugin

---

## Shadcn UI Configuration

### Registries
- **@shadcn**: Default Shadcn UI components
- **@elevenlabs-ui**: ElevenLabs UI components

### Component Installation
```bash
npx shadcn@latest add <component-name>
```

### Component Path
- All Shadcn components in `src/components/ui/`
- Custom components in `src/components/<feature>/`

---

## ElevenLabs Integration Patterns

**Research Complete**: See `docs/research/` for comprehensive documentation.

### Core Hooks (from @elevenlabs/react 0.9.1)

**useConversation Hook**:
```typescript
const conversation = useConversation({
  agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
  auth: { type: "public" }, // or signed URL for private agents
  onConnect: () => console.log("Connected"),
  onDisconnect: () => console.log("Disconnected"),
  onMessage: (message) => console.log("Message:", message),
  onError: (error) => console.error("Error:", error),
});
```

**Key State Properties**:
- `conversation.status` - Connection status (connected, connecting, disconnected)
- `conversation.isSpeaking` - Agent speaking state
- `conversation.isProcessing` - Processing user input
- `conversation.messages` - Message history

**Key Methods**:
- `conversation.startSession()` - Initialize connection
- `conversation.endSession()` - Cleanup connection
- `conversation.sendFeedback()` - Send user feedback

### Available UI Components (@elevenlabs-ui)

**Voice Agent Components**:
- `Orb` - Animated voice agent orb with states
- `ConversationBar` - Complete conversation interface
- `VoiceButton` - Start/stop conversation button
- `MicSelector` - Microphone device selector

**Conversation Components**:
- `Conversation` - Message list container
- `Message` - Individual message display
- `Response` - Agent response display

**Audio Visualization**:
- `LiveWaveform` - Real-time audio waveform
- `Waveform` - Static waveform display
- `BarVisualizer` - Bar-style audio visualizer
- `Matrix` - Matrix-style visualizer

**Installation Example**:
```bash
npx shadcn@latest add https://ui.elevenlabs.io/r/orb
npx shadcn@latest add https://ui.elevenlabs.io/r/conversation-bar
```

### Authentication Patterns

**Public Agents** (for development):
```typescript
auth: { type: "public" }
```

**Private Agents** (production):
1. Create API route: `app/api/elevenlabs/route.ts`
2. Generate signed URL server-side
3. Use signed URL in client component

**Environment Variables Required**:
```bash
# Server-only (no prefix) - in API routes
ELEVENLABS_API_KEY=your_api_key

# Client-accessible (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
```

### Next.js Integration Requirements

**MANDATORY: "use client" Directive**:
```typescript
"use client"; // MUST be first line

import { useConversation } from "@elevenlabs/react";
```

**Client Component Pattern**:
```typescript
"use client";

import { useEffect } from "react";
import { useConversation } from "@elevenlabs/react";

export default function VoiceAgent() {
  const conversation = useConversation({
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
  });

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, [conversation]);

  return (
    <button onClick={() => conversation.startSession()}>
      Start Conversation
    </button>
  );
}
```

### Critical Integration Rules

1. **NEVER expose API keys client-side** - Always use server-side API routes
2. **ALWAYS use "use client"** - SDK requires browser APIs
3. **ALWAYS cleanup sessions** - Use useEffect cleanup for endSession()
4. **ALWAYS handle permissions** - Request microphone access before starting
5. **ALWAYS use NEXT_PUBLIC_ prefix** - For client-accessible env vars

### Common Pitfalls

❌ **Wrong**: Missing "use client" directive
```typescript
import { useConversation } from "@elevenlabs/react"; // ERROR!
```

✅ **Correct**: Include "use client"
```typescript
"use client";
import { useConversation } from "@elevenlabs/react";
```

❌ **Wrong**: API key in client component
```typescript
const conversation = useConversation({
  auth: { apiKey: "sk_..." } // NEVER DO THIS!
});
```

✅ **Correct**: Use signed URL from API route
```typescript
const signedUrl = await fetch("/api/elevenlabs").then(r => r.json());
const conversation = useConversation({
  auth: { type: "signedUrl", signedUrl }
});
```

---

## Development Workflow

### Available Scripts
```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Build Output
- Static pages pre-rendered at build time
- Optimized JavaScript bundles
- First Load JS: ~100 kB (baseline)

---

## Environment Variables

**TBD**: Will be configured in Phase 5

Expected variables:
- `NEXT_PUBLIC_ELEVENLABS_API_KEY`
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`

---

## Testing Strategy

**Phase 1-4**: Chrome DevTools MCP verification
- Visual testing via screenshots
- Network call inspection
- Console log monitoring
- HTML structure validation

**Phase 5**: Full integration testing
- Voice agent connection
- User interaction flows
- Error handling

---

## Deployment

### Platform
- **Vercel** (primary)
- Automatic deployments via Git integration
- Vercel MCP for monitoring (Phase 6)

### Build Configuration
- Next.js 15 automatic optimization
- Static generation where possible
- Edge runtime compatible

---

## Dependencies Overview

### Production Dependencies (8)
1. next: 15.0.3
2. react: 18.3.1
3. react-dom: 18.3.1
4. @elevenlabs/react: 0.3.0
5. framer-motion: 11.11.11
6. clsx: 2.1.1
7. tailwind-merge: 2.5.4
8. lucide-react: 0.454.0

### Dev Dependencies (8)
1. @types/node: 22.9.0
2. @types/react: 18.3.12
3. @types/react-dom: 18.3.1
4. typescript: 5.6.3
5. tailwindcss: 3.4.14
6. postcss: 8.4.47
7. autoprefixer: 10.4.20
8. eslint: 8.57.1
9. eslint-config-next: 15.0.3

---

## Version History

### v1.0 (2025-11-04 - Phase 0 & 1)
- Initial setup complete
- Next.js 15 + TypeScript + Tailwind configured
- Shadcn UI with @elevenlabs-ui registry
- Aurora animation Tailwind plugin
- Build verified successful
- Project structure established

### v2.0 (2025-11-04 - Phase 2 Research)
- Updated @elevenlabs/react to 0.9.1
- Comprehensive research documentation created:
  - research-elevenlabs-agent-sdk.md (495 lines)
  - research-elevenlabs-ui.md (1,039 lines)
  - research-nextjs-elevenlabs.md (1,529 lines)
  - synthesis-report.md (590 lines)
- ElevenLabs integration patterns documented
- Authentication flows defined
- Component integration matrix created
- Implementation roadmap established

---

## Next Steps

1. **Phase 1**: Implement Aurora background component
2. **Phase 2**: Research ElevenLabs integration patterns
3. **Phase 3**: Create feature specifications
4. **Phase 4**: Generate implementation plan
5. **Phase 5**: Implement voice agent integration

---

**Status**: ✅ Phase 0 Complete
**Build Status**: ✅ Passing
**Ready for**: Phase 1 (Aurora Background Integration)
