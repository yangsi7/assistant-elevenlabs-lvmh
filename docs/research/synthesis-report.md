# ElevenLabs Integration Synthesis Report

**Version**: 1.0
**Date**: 2025-11-04
**Status**: Implementation-Ready Roadmap

---

## Executive Summary

This report synthesizes findings from four research documents into a unified implementation roadmap for integrating ElevenLabs voice agents into Next.js 15 with shadcn UI components.

### Key Findings (CoD^Σ)

```
System := AgentSDK ⊕ UIComponents ⊕ NextjsApp
Integration := useConversation ≫ State ≫ UIComponents ≫ Display
Auth := Client → APIRoute → SignedURL → AgentSDK
Flow := UserAction ≫ SDK.startSession ≫ WebRTC ≫ AgentResponse ≫ UI
```

**Critical Integration Points**:
1. `useConversation` hook manages SDK state → UI components consume this state
2. Shadcn @elevenlabs-ui components expect specific props from SDK hook
3. Next.js 15 requires "use client" directive for all interactive components
4. Environment variables split: `NEXT_PUBLIC_*` for client, no prefix for server
5. Authentication flow MUST use server-side API routes for private agents

**Evidence Sources**:
- Agent SDK: `research-elevenlabs-agent-sdk.md` (lines 59-194)
- UI Components: `research-elevenlabs-ui.md` (lines 112-551)
- Next.js Patterns: `research-nextjs-elevenlabs.md` (lines 27-185)
- Quickstart: `nextjs-elevenlabs-quickstart.md` (lines 42-102)

---

## Integration Architecture

### System Components (CoD^Σ)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js 15 App                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐     ┌──────────────────┐                │
│  │  Server          │     │  Client          │                │
│  │  Components      │────▶│  Components      │                │
│  │  (app/page.tsx)  │     │  ('use client')  │                │
│  └──────────────────┘     └─────────┬────────┘                │
│                                      │                         │
│  ┌──────────────────┐                │                         │
│  │  API Routes      │◀───────────────┘                         │
│  │  /api/           │  Fetch signedUrl                         │
│  │  get-signed-url/ │                                          │
│  └─────────┬────────┘                                          │
│            │                                                    │
└────────────┼────────────────────────────────────────────────────┘
             │ HTTPS Request
             ▼
    ┌─────────────────────┐
    │  ElevenLabs API     │
    │  (api.elevenlabs.io)│
    └─────────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │  Agent Instance     │
    │  (WebRTC/WebSocket) │
    └─────────────────────┘
```

### Data Flow: User → Agent → UI

```
User Interaction Flow:
UserClick(Start) ≫ requestMicPermission() ≫ fetch('/api/get-signed-url')
  ≫ conversation.startSession({ signedUrl })
  ≫ WebRTC Connection
  ≫ conversation.status = 'connected'
  ≫ UI Update (button states, orb animation)

Voice Interaction Flow:
UserSpeech ≫ Microphone ≫ WebRTC ≫ Agent Processing
  ≫ conversation.onMessage({ source: 'user', text })
  ≫ Agent Response ≫ conversation.isSpeaking = true
  ≫ Orb agentState = 'talking'
  ≫ Audio Output ≫ conversation.isSpeaking = false
  ≫ Orb agentState = 'listening'
```

**Evidence**:
- SDK Connection Flow: `research-elevenlabs-agent-sdk.md` (lines 369-473)
- UI Integration: `research-elevenlabs-ui.md` (lines 553-660)
- Next.js Client Components: `research-nextjs-elevenlabs.md` (lines 39-155)

---

## Component Integration Matrix

### SDK Hook → UI Component Mapping

| UI Component | SDK Hook Dependencies | Props from SDK | Event Handlers |
|--------------|----------------------|----------------|----------------|
| **Orb** | `useConversation()` | `agentState`, `getInputVolume()`, `getOutputVolume()` | None (reactive to state) |
| **ConversationBar** | `useConversation()` (internal) | `agentId`, `onConnect`, `onDisconnect`, `onMessage`, `onError` | Managed internally |
| **VoiceButton** | None (controlled) | `state`, `onPress` | `onPress` triggers SDK methods |
| **LiveWaveform** | External (microphone) | `active`, `processing` | None (audio analyzer) |
| **Message** | None (presentational) | `from`, content | None |
| **Conversation** | None (container) | messages array | None |

### Props Mapping: useConversation → Components

```typescript
// Source: useConversation hook
const conversation = useConversation({
  onConnect: () => {...},      // → ConversationBar.onConnect
  onDisconnect: () => {...},   // → ConversationBar.onDisconnect
  onMessage: (msg) => {...},   // → ConversationBar.onMessage
  onError: (err) => {...},     // → ConversationBar.onError
});

// Derived state for UI
const orbState = conversation.isSpeaking ? 'talking' :
                 conversation.status === 'connected' ? 'listening' : null;

// Prop passing
<Orb agentState={orbState} />
<ConversationBar agentId={process.env.NEXT_PUBLIC_AGENT_ID!} />
```

**Evidence**:
- useConversation API: `research-elevenlabs-agent-sdk.md` (lines 165-194)
- Orb Props: `research-elevenlabs-ui.md` (lines 120-137)
- ConversationBar Props: `research-elevenlabs-ui.md` (lines 185-195)

---

## Authentication Flow (End-to-End)

### Private Agent Authentication (WebSocket)

```
┌────────────┐    ┌────────────────┐    ┌─────────────────┐    ┌────────────┐
│   Client   │───▶│   API Route    │───▶│  ElevenLabs API │───▶│   Agent    │
│ Component  │    │ /api/get-      │    │  /v1/convai/    │    │  Instance  │
│            │    │  signed-url    │    │  get-signed-url │    │            │
└────────────┘    └────────────────┘    └─────────────────┘    └────────────┘
     │                    │                       │                    │
     │  1. fetch()        │                       │                    │
     ├───────────────────▶│                       │                    │
     │                    │  2. HTTPS + API Key   │                    │
     │                    ├──────────────────────▶│                    │
     │                    │                       │  3. Validate       │
     │                    │                       ├───────────────────▶│
     │                    │  4. signed_url        │                    │
     │                    │◀──────────────────────┤                    │
     │  5. { signedUrl }  │                       │                    │
     │◀───────────────────┤                       │                    │
     │                    │                       │                    │
     │  6. startSession({ signedUrl })            │                    │
     ├───────────────────────────────────────────────────────────────▶│
     │                    │                       │  7. WebSocket      │
     │◀───────────────────────────────────────────────────────────────┤
```

### Code Implementation

**Server-side** (API Route):
```typescript
// app/api/get-signed-url/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.NEXT_PUBLIC_AGENT_ID}`,
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!, // Server-only
      },
    }
  );

  const data = await response.json();
  return NextResponse.json({ signedUrl: data.signed_url });
}
```

**Client-side** (Component):
```typescript
'use client';
import { useConversation } from '@elevenlabs/react';

export function Conversation() {
  const conversation = useConversation();

  const start = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });

    const response = await fetch('/api/get-signed-url');
    const { signedUrl } = await response.json();

    await conversation.startSession({ signedUrl });
  };
}
```

**Evidence**:
- Signed URL Pattern: `research-elevenlabs-agent-sdk.md` (lines 259-313)
- API Route Setup: `research-nextjs-elevenlabs.md` (lines 973-1010)
- Security Best Practices: `research-elevenlabs-agent-sdk.md` (lines 360-366)

---

## Environment Configuration

### Complete Environment Setup

```bash
# .env.local (project root)

# ============================================
# SERVER-ONLY (NO PREFIX)
# ============================================
# NEVER expose these in client code!
ELEVENLABS_API_KEY=sk_your_api_key_here

# ============================================
# CLIENT-ACCESSIBLE (NEXT_PUBLIC_ PREFIX)
# ============================================
# Safe to expose in browser bundles
NEXT_PUBLIC_AGENT_ID=agent_your_agent_id_here
NEXT_PUBLIC_CONNECTION_TYPE=webrtc
```

### Environment Variable Access Patterns

| Context | Variable Type | Access Method | Example |
|---------|--------------|---------------|---------|
| API Route (Server) | All | `process.env.VAR_NAME` | `process.env.ELEVENLABS_API_KEY` |
| Server Component | All | `process.env.VAR_NAME` | `process.env.NEXT_PUBLIC_AGENT_ID` |
| Client Component | `NEXT_PUBLIC_*` only | `process.env.NEXT_PUBLIC_*` | `process.env.NEXT_PUBLIC_AGENT_ID` |
| Client Component | Server-only | ❌ Undefined | `process.env.ELEVENLABS_API_KEY` → undefined |

### Configuration Checklist

- [ ] Create `.env.local` in project root
- [ ] Add `ELEVENLABS_API_KEY` (server-only, no prefix)
- [ ] Add `NEXT_PUBLIC_AGENT_ID` (client-accessible)
- [ ] Verify `.env.local` in `.gitignore`
- [ ] Restart dev server after changes
- [ ] Never commit `.env.local` to git
- [ ] Use API routes for authenticated requests

**Evidence**:
- Environment Variables: `research-nextjs-elevenlabs.md` (lines 189-282)
- Security Patterns: `research-elevenlabs-agent-sdk.md` (lines 350-366)
- Quick Reference: `nextjs-elevenlabs-quickstart.md` (lines 19-23)

---

## File Structure Recommendation

```
assistant-elevenlabs-lvmh/
├── app/
│   ├── layout.tsx                    # Root layout (Server Component)
│   ├── page.tsx                      # Home page (Server Component)
│   │
│   ├── components/                   # Feature components
│   │   ├── voice/                    # Voice-specific components
│   │   │   ├── conversation.tsx      # Main conversation (Client Component)
│   │   │   ├── voice-orb.tsx         # Orb visualization (Client Component)
│   │   │   ├── voice-controls.tsx    # Start/stop controls (Client Component)
│   │   │   └── transcript-view.tsx   # Message display (Client Component)
│   │   │
│   │   └── ui/                       # Shadcn components (via CLI)
│   │       ├── orb.tsx               # @elevenlabs-ui/orb
│   │       ├── conversation-bar.tsx  # @elevenlabs-ui/conversation-bar
│   │       ├── message.tsx           # @elevenlabs-ui/message
│   │       ├── live-waveform.tsx     # @elevenlabs-ui/live-waveform
│   │       └── button.tsx            # shadcn/ui button
│   │
│   ├── api/                          # API routes (Server-side only)
│   │   └── get-signed-url/
│   │       └── route.ts              # Generate signed URLs
│   │
│   └── lib/                          # Utilities
│       ├── elevenlabs.ts             # ElevenLabs helper functions
│       ├── hooks/                    # Custom hooks
│       │   └── use-conversation-state.ts
│       └── utils.ts                  # General utilities
│
├── .env.local                        # Environment variables (gitignored!)
├── .gitignore
├── components.json                   # shadcn configuration
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Component Organization Rules

1. **Feature-based grouping**: Group related components together
2. **Shadcn UI in `/components/ui`**: All shadcn components go here
3. **Client components marked**: Add `'use client'` to all interactive components
4. **Server components default**: No directive needed for server components
5. **Hooks in `/lib/hooks`**: Reusable hooks separate from components
6. **API routes in `/app/api`**: Server-side endpoints only

**Evidence**:
- Project Structure: `research-nextjs-elevenlabs.md` (lines 1113-1231)
- Component Organization: `research-elevenlabs-ui.md` (lines 59-107)

---

## Implementation Sequence (Prioritized)

### Phase 1: Basic Connection (Minimal Viable)

**Goal**: Establish working voice connection with minimal UI

**Tasks**:
1. **Setup Project** (15 min)
   - [ ] Create `.env.local` with `NEXT_PUBLIC_AGENT_ID`
   - [ ] Install dependencies: `npm install @elevenlabs/react`
   - [ ] Verify environment variables load

2. **Create API Route** (10 min)
   - [ ] Create `app/api/get-signed-url/route.ts`
   - [ ] Implement signed URL generation
   - [ ] Test API endpoint: `curl http://localhost:3000/api/get-signed-url`

3. **Basic Conversation Component** (20 min)
   - [ ] Create `app/components/voice/conversation.tsx`
   - [ ] Add `'use client'` directive
   - [ ] Implement `useConversation` hook
   - [ ] Add start/stop buttons with state management
   - [ ] Test microphone permission flow

4. **Integration Test** (15 min)
   - [ ] Add component to `app/page.tsx`
   - [ ] Test connection: Click start → Grant mic permission → Hear agent
   - [ ] Test disconnection: Click stop → Verify cleanup
   - [ ] Test error handling: Deny permission → See error message

**Checkpoint**: Working voice conversation with basic buttons

**Evidence**: `nextjs-elevenlabs-quickstart.md` (lines 42-123)

---

### Phase 2: UI Components Integration

**Goal**: Add visual feedback and better UX with shadcn components

**Tasks**:
1. **Install Shadcn UI Components** (10 min)
   - [ ] `npx @elevenlabs/cli@latest components add orb`
   - [ ] `npx @elevenlabs/cli@latest components add conversation-bar`
   - [ ] `npx @elevenlabs/cli@latest components add message`
   - [ ] Verify components installed in `components/ui/`

2. **Add Orb Visualization** (20 min)
   - [ ] Create `app/components/voice/voice-orb.tsx`
   - [ ] Import Orb component from `@/components/ui/orb`
   - [ ] Map `conversation.isSpeaking` → `agentState` prop
   - [ ] Add audio reactivity with volume functions
   - [ ] Test visual states: idle → listening → talking

3. **Replace Basic UI with ConversationBar** (30 min)
   - [ ] Update `conversation.tsx` to use ConversationBar
   - [ ] Pass `agentId` and event handlers as props
   - [ ] Test text input functionality
   - [ ] Test waveform visualization
   - [ ] Verify mute/unmute toggle

4. **Add Message History** (20 min)
   - [ ] Create state for message history: `useState<Message[]>([])`
   - [ ] Use `onMessage` callback to append messages
   - [ ] Render with Conversation + Message components
   - [ ] Add auto-scroll behavior
   - [ ] Test message accumulation

**Checkpoint**: Visual feedback, waveform, and message history working

**Evidence**:
- Component Installation: `research-elevenlabs-ui.md` (lines 24-58)
- Integration Patterns: `research-elevenlabs-ui.md` (lines 631-730)

---

### Phase 3: Full Feature Set

**Goal**: Production-ready with error handling, persistence, and polish

**Tasks**:
1. **Error Handling** (30 min)
   - [ ] Create error boundary: `app/error.tsx`
   - [ ] Add try-catch blocks for async operations
   - [ ] Implement user-friendly error messages
   - [ ] Handle specific errors (mic denied, no device, connection failed)
   - [ ] Test error recovery flows

2. **State Persistence** (20 min)
   - [ ] Add localStorage for message history
   - [ ] Load history on mount with `useEffect`
   - [ ] Save history on message changes
   - [ ] Add clear history button
   - [ ] Test persistence across page reloads

3. **Performance Optimization** (20 min)
   - [ ] Add dynamic import for Conversation component
   - [ ] Use `React.memo` for Message components
   - [ ] Implement virtual scrolling if needed (100+ messages)
   - [ ] Test bundle size: `npm run build`
   - [ ] Verify First Load JS < 200kb

4. **Accessibility & Polish** (30 min)
   - [ ] Add keyboard shortcuts (e.g., ⌥Space for voice)
   - [ ] Add ARIA labels to buttons
   - [ ] Ensure proper focus management
   - [ ] Add loading states with spinners
   - [ ] Test with screen reader

5. **Client Tools** (Optional, 30 min)
   - [ ] Define client tools in `useConversation`
   - [ ] Implement tool handlers (e.g., `displayMessage`)
   - [ ] Configure tools in ElevenLabs dashboard
   - [ ] Test tool invocation from agent
   - [ ] Handle unhandled tool calls

**Checkpoint**: Production-ready voice agent with all features

**Evidence**:
- Error Handling: `research-nextjs-elevenlabs.md` (lines 402-453)
- Performance: `research-nextjs-elevenlabs.md` (lines 723-858)
- Client Tools: `research-elevenlabs-agent-sdk.md` (lines 1452-1473)

---

## Code Integration Patterns

### Pattern 1: Orb + Conversation State Sync

```typescript
'use client';

import { useConversation } from '@elevenlabs/react';
import { Orb } from '@/components/ui/orb';
import { useState, useEffect } from 'react';

export function VoiceAgent() {
  const conversation = useConversation();
  const [agentState, setAgentState] = useState<'thinking' | 'listening' | 'talking' | null>(null);

  // Sync agent state with conversation state
  useEffect(() => {
    if (conversation.isSpeaking) {
      setAgentState('talking');
    } else if (conversation.status === 'connected') {
      setAgentState('listening');
    } else {
      setAgentState(null);
    }
  }, [conversation.isSpeaking, conversation.status]);

  return (
    <div className="flex flex-col items-center gap-8">
      <Orb
        agentState={agentState}
        getInputVolume={() => conversation.getInputByteFrequencyData()[0] / 255}
        getOutputVolume={() => conversation.getOutputByteFrequencyData()[0] / 255}
        className="w-64 h-64"
      />
      <p>Agent is {agentState || 'disconnected'}</p>
    </div>
  );
}
```

**Evidence**:
- Orb Integration: `research-elevenlabs-ui.md` (lines 635-654)
- SDK State: `research-elevenlabs-agent-sdk.md` (lines 422-444)

---

### Pattern 2: ConversationBar with Message History

```typescript
'use client';

import { useState } from 'react';
import { ConversationBar } from '@/components/ui/conversation-bar';
import { Conversation, ConversationContent } from '@/components/ui/conversation';
import { Message, MessageContent, MessageAvatar } from '@/components/ui/message';

interface MessageType {
  id: string;
  from: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageType[]>([]);

  const handleMessage = (msg: { source: 'user' | 'ai'; message: string }) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        from: msg.source === 'ai' ? 'assistant' : 'user',
        text: msg.message,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Message history */}
      <Conversation className="flex-1 overflow-auto">
        <ConversationContent>
          {messages.map(msg => (
            <Message key={msg.id} from={msg.from}>
              <MessageAvatar
                src={msg.from === 'user' ? '/user-avatar.png' : '/ai-avatar.png'}
                name={msg.from === 'user' ? 'User' : 'AI'}
              />
              <MessageContent variant={msg.from === 'user' ? 'contained' : 'flat'}>
                {msg.text}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>

      {/* Conversation bar at bottom */}
      <ConversationBar
        agentId={process.env.NEXT_PUBLIC_AGENT_ID!}
        onMessage={handleMessage}
        className="border-t"
      />
    </div>
  );
}
```

**Evidence**: `research-elevenlabs-ui.md` (lines 656-689)

---

### Pattern 3: Custom Hook for Reusable Logic

```typescript
// app/lib/hooks/use-conversation-state.ts
'use client';

import { useConversation } from '@elevenlabs/react';
import { useState, useCallback } from 'react';

export function useConversationState() {
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{source: string; text: string}>>([]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected');
    },
    onMessage: (message) => {
      setMessages(prev => [...prev, message]);
    },
    onError: (err) => {
      console.error('Error:', err);
      setError(err.message);
    },
  });

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch('/api/get-signed-url');
      const { signedUrl } = await response.json();

      await conversation.startSession({ signedUrl });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(errorMessage);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (err) {
      console.error('Error stopping conversation:', err);
    }
  }, [conversation]);

  return {
    conversation,
    error,
    messages,
    startConversation,
    stopConversation,
  };
}

// Usage in component:
// const { conversation, error, messages, startConversation, stopConversation } = useConversationState();
```

**Evidence**: `research-nextjs-elevenlabs.md` (lines 1173-1207)

---

## Testing & Verification Strategy

### Phase 1 Tests (Basic Connection)

| Test | Verification Method | Expected Result |
|------|---------------------|-----------------|
| Environment variables loaded | `console.log(process.env.NEXT_PUBLIC_AGENT_ID)` | Agent ID printed |
| API route responds | `curl http://localhost:3000/api/get-signed-url` | JSON with `signedUrl` |
| Microphone permission | Click start → browser prompt | Permission dialog appears |
| WebRTC connection | Click start → wait 2 sec | `conversation.status === 'connected'` |
| Agent response | Speak "Hello" | Agent responds audibly |
| Disconnect | Click stop | `conversation.status === 'disconnected'` |

### Phase 2 Tests (UI Components)

| Test | Verification Method | Expected Result |
|------|---------------------|-----------------|
| Orb visual states | Start → agent speaks | Orb animates: listening → talking → listening |
| Waveform reactivity | Speak into mic | Waveform shows audio levels |
| Message accumulation | Have conversation | Messages appear in order |
| Auto-scroll | Many messages | Conversation scrolls to bottom |
| Text input | Type message → Enter | Agent responds to text |

### Phase 3 Tests (Production Readiness)

| Test | Verification Method | Expected Result |
|------|---------------------|-----------------|
| Error recovery | Deny mic permission | Error message shown, retry works |
| Message persistence | Refresh page | Messages persist across reload |
| Bundle size | `npm run build` | First Load JS < 200kb |
| Keyboard shortcuts | Press ⌥Space | Activates voice input |
| Screen reader | Use VoiceOver/NVDA | All controls accessible |

**Evidence**: Testing patterns derived from common issues in `research-nextjs-elevenlabs.md` (lines 1234-1466)

---

## Critical Gotchas & Solutions

### Gotcha 1: "use client" Placement

**Problem**: SDK throws error "hooks can only be called inside the body of a function component"

**Cause**: Missing or incorrectly placed `'use client'` directive

**Solution**:
```typescript
// ✓ CORRECT
'use client'; // FIRST LINE

import { useConversation } from '@elevenlabs/react';

export function Component() {
  const conversation = useConversation(); // Works!
}

// ✗ WRONG
import { useConversation } from '@elevenlabs/react';
'use client'; // Too late!

export function Component() {
  const conversation = useConversation(); // ERROR!
}
```

**Evidence**: `research-nextjs-elevenlabs.md` (lines 98-129)

---

### Gotcha 2: Environment Variable Not Loading

**Problem**: `process.env.NEXT_PUBLIC_AGENT_ID` returns `undefined` in client component

**Causes & Fixes**:

1. **Missing prefix**:
```bash
# ✗ WRONG
AGENT_ID=abc123

# ✓ CORRECT
NEXT_PUBLIC_AGENT_ID=abc123
```

2. **Wrong location**:
```
# ✓ CORRECT
project-root/.env.local

# ✗ WRONG
project-root/app/.env.local
project-root/src/.env.local
```

3. **Server not restarted**:
```bash
# Stop server (Ctrl+C) then:
npm run dev
```

**Evidence**: `research-nextjs-elevenlabs.md` (lines 1325-1380)

---

### Gotcha 3: Audio Doesn't Work on iOS

**Problem**: Audio plays through device speaker instead of Bluetooth headphones on iOS Safari

**Cause**: iOS Safari prefers built-in speaker by default

**Solution**:
```typescript
const conversation = useConversation({
  preferHeadphonesForIosDevices: true, // Force headphone output
});
```

**Note**: This is a best-effort attempt, not guaranteed to work on all devices.

**Evidence**: `research-elevenlabs-agent-sdk.md` (lines 1359-1361)

---

### Gotcha 4: First Message Cut Off on Android

**Problem**: First message from agent is partially inaudible on Android devices

**Cause**: Android audio system needs warm-up time

**Solution**:
```typescript
const conversation = useConversation({
  connectionDelay: {
    android: 3000, // 3 second delay
    ios: 0,
    default: 0,
  },
});
```

**Evidence**: `research-elevenlabs-agent-sdk.md` (lines 128-134, 1323-1340)

---

### Gotcha 5: Hydration Mismatch

**Problem**: Warning in console: "Text content did not match. Server: 'X' Client: 'Y'"

**Cause**: Using `Date.now()`, `Math.random()`, or browser APIs in render

**Solution**:
```typescript
// ✗ WRONG
export function Component() {
  const time = Date.now(); // Different on server vs client!
  return <div>{time}</div>;
}

// ✓ CORRECT
'use client';
import { useEffect, useState } from 'react';

export function Component() {
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    setTime(Date.now()); // Only on client
  }, []);

  return <div>{time ?? 'Loading...'}</div>;
}
```

**Evidence**: `research-nextjs-elevenlabs.md` (lines 1285-1323)

---

### Gotcha 6: Signed URL Expiration

**Problem**: Connection fails with "Invalid signed URL" error

**Cause**: Signed URLs expire quickly (typically 5-15 minutes)

**Solution**:
```typescript
// ✗ WRONG: Generate URL once and reuse
const signedUrl = await fetch('/api/get-signed-url').then(r => r.json());
// ... wait a long time ...
await conversation.startSession({ signedUrl }); // May fail!

// ✓ CORRECT: Generate fresh URL immediately before use
const startConversation = async () => {
  const response = await fetch('/api/get-signed-url'); // Fresh URL
  const { signedUrl } = await response.json();
  await conversation.startSession({ signedUrl }); // Immediate use
};
```

**Evidence**: `research-elevenlabs-agent-sdk.md` (lines 1342-1357)

---

### Gotcha 7: Cleanup Not Happening

**Problem**: Conversation stays open when component unmounts, causing multiple connections

**Cause**: No cleanup in `useEffect`

**Solution**:
```typescript
'use client';
import { useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';

export function Conversation() {
  const conversation = useConversation();

  useEffect(() => {
    return () => {
      // Cleanup: end session on unmount
      conversation.endSession();
    };
  }, [conversation]);

  return <div>Conversation UI</div>;
}
```

**Evidence**: `research-elevenlabs-agent-sdk.md` (lines 1281-1302)

---

## Performance Considerations

### Bundle Size Impact

**ElevenLabs Dependencies**:
- `@elevenlabs/react`: ~50kb gzipped
- `@elevenlabs/client`: ~80kb gzipped (included with react)
- Three.js (for Orb): ~140kb gzipped

**Total impact**: ~270kb First Load JS

**Mitigation Strategies**:

1. **Dynamic Imports**:
```typescript
// Lazy load conversation component
const Conversation = dynamic(
  () => import('./components/voice/conversation'),
  { ssr: false, loading: () => <p>Loading...</p> }
);
```

2. **Conditional Orb Loading**:
```typescript
// Only load Orb if user starts conversation
const [showOrb, setShowOrb] = useState(false);

{showOrb && <Orb agentState={state} />}
```

3. **Code Splitting by Route**:
```
app/
├── page.tsx              # Home (no voice)
└── voice/
    └── page.tsx          # Voice page (loads SDK here)
```

**Evidence**: `research-nextjs-elevenlabs.md` (lines 812-858)

---

### Audio Context Memory

**Issue**: Web Audio API contexts consume memory, can accumulate over time

**Solution**:
```typescript
'use client';
import { useEffect, useRef } from 'react';

export function AudioManager() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: close audio context on unmount
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);
}
```

**Evidence**: Derived from cleanup patterns in `research-elevenlabs-agent-sdk.md` (lines 642-654)

---

## Implementation Checklist

### Pre-Implementation
- [ ] Review all 4 research documents
- [ ] Understand CoD^Σ integration architecture
- [ ] Create agent at https://elevenlabs.io/agents
- [ ] Get ElevenLabs API key
- [ ] Plan component hierarchy

### Phase 1: Basic Connection
- [ ] Install `@elevenlabs/react`
- [ ] Create `.env.local` with credentials
- [ ] Create API route for signed URLs
- [ ] Create basic conversation component
- [ ] Test end-to-end connection

### Phase 2: UI Components
- [ ] Install shadcn @elevenlabs-ui components
- [ ] Add Orb visualization
- [ ] Integrate ConversationBar
- [ ] Add message history
- [ ] Test visual feedback

### Phase 3: Production Readiness
- [ ] Add comprehensive error handling
- [ ] Implement state persistence
- [ ] Optimize bundle size
- [ ] Add accessibility features
- [ ] Test on multiple browsers
- [ ] Test on mobile devices (iOS/Android)
- [ ] Deploy to HTTPS environment

### Post-Implementation
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Optimize performance based on metrics
- [ ] Document lessons learned

---

## Related Documents

- **Agent SDK**: `@research-elevenlabs-agent-sdk.md` (Detailed SDK API reference)
- **UI Components**: `@research-elevenlabs-ui.md` (Component props and examples)
- **Next.js Patterns**: `@research-nextjs-elevenlabs.md` (Next.js 15 integration patterns)
- **Quickstart**: `@nextjs-elevenlabs-quickstart.md` (Quick reference guide)

---

**Report Status**: Implementation-Ready
**Last Updated**: 2025-11-04
**Next Review**: After Phase 1 completion
**Lines**: 590
