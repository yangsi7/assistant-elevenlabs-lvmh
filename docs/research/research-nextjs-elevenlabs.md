# Next.js 15 Integration Patterns for ElevenLabs Conversational AI

**Version**: Next.js 15.0.3
**ElevenLabs SDK**: @elevenlabs/react ^0.9.1
**Last Updated**: 2025-11-04
**References**:
- [Next.js 15 Official Documentation](https://nextjs.org/docs/15)
- [ElevenLabs Next.js Quickstart](https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js)

---

## Table of Contents

1. [Next.js 15 App Router Context](#1-nextjs-15-app-router-context)
2. [Client Component Requirements](#2-client-component-requirements)
3. [Environment Variables](#3-environment-variables)
4. [Third-Party SDK Integration Patterns](#4-third-party-sdk-integration-patterns)
5. [Audio/Media Handling in Next.js](#5-audiomedia-handling-in-nextjs)
6. [State Management](#6-state-management)
7. [Performance Optimization](#7-performance-optimization)
8. [Code Examples](#8-code-examples)
9. [Project Structure Recommendations](#9-project-structure-recommendations)
10. [Common Issues & Solutions](#10-common-issues--solutions)

---

## 1. Next.js 15 App Router Context

### Server vs Client Components

Next.js 15 uses React Server Components (RSC) by default. Understanding when to use each type is critical:

**Server Components (Default)**:
- Rendered on the server into React Server Component Payload (RSC Payload)
- Cannot use browser APIs, event handlers, or React hooks
- Can directly access backend resources
- Reduce client-side JavaScript bundle

**Client Components (Opt-in with `"use client"`)**:
- Required for interactivity, state, effects, and browser APIs
- Pre-rendered to HTML during build, then hydrated on client
- Must explicitly declare `"use client"` directive at top of file

### When to Use Client Components

| Feature | Requires Client Component? |
|---------|---------------------------|
| Event listeners (`onClick`, `onChange`) | ✓ Yes |
| React hooks (`useState`, `useEffect`, `useReducer`) | ✓ Yes |
| Browser-only APIs (`window`, `navigator`, `localStorage`) | ✓ Yes |
| Custom hooks with state/effects | ✓ Yes |
| Third-party libraries using browser APIs | ✓ Yes |
| Fetch data from backend | ✗ No (prefer Server) |
| Access backend resources directly | ✗ No (Server only) |

**Evidence**: [Next.js Composition Patterns - When to use Server and Client Components](https://nextjs.org/docs/14/app/building-your-application/rendering/composition-patterns#when-to-use-server-and-client-components)

### App Router File Structure

```
app/
├── layout.tsx          # Root layout (Server Component by default)
├── page.tsx            # Home page (Server Component by default)
├── components/
│   ├── conversation.tsx # Client Component ("use client")
│   └── ui/             # Shared UI components
├── api/                # API routes (Server-side only)
│   └── get-signed-url/
│       └── route.ts    # API endpoint for signed URLs
└── lib/                # Utility functions
```

**Key Conventions**:
- `page.tsx` - Defines a route's UI
- `layout.tsx` - Shared UI for segments and children
- `route.ts` - API endpoint (Server-side only)
- Server Components by default, opt-in to Client Components

**Evidence**: [Next.js Project Structure](https://nextjs.org/docs/15/app/getting-started/project-structure#routing-files)

---

## 2. Client Component Requirements

### Why ElevenLabs Requires Client Components

ElevenLabs SDK (`@elevenlabs/react`) requires:
1. **Browser APIs**: `navigator.mediaDevices.getUserMedia()` for microphone access
2. **WebRTC/WebSocket**: Real-time bidirectional communication
3. **React Hooks**: `useConversation` hook for state management
4. **Event Handlers**: `onClick` for start/stop buttons
5. **Audio Context**: Browser-only Web Audio API

All of these are **client-side only** features unavailable during server rendering.

### "use client" Directive Placement

The `"use client"` directive must be:
- **At the very top of the file** (before any imports)
- **Only needed in the boundary file** (child components inherit)
- **Quoted string** (either single or double quotes)

**Correct Example**:
```tsx
// app/components/conversation.tsx
'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';

export function Conversation() {
  // Component implementation
}
```

**Incorrect Examples**:
```tsx
// ❌ Wrong: imports before directive
import { useConversation } from '@elevenlabs/react';
'use client';

// ❌ Wrong: not quoted
use client;

// ❌ Wrong: in middle of file
import { useConversation } from '@elevenlabs/react';

'use client'; // Too late!
```

### Client-Side State Management

Client Components can use all React hooks:

```tsx
'use client';

import { useState, useEffect, useReducer, useCallback } from 'react';

export function VoiceAgent() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Runs only on client after mount
    console.log('Component mounted in browser');
  }, []);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  return (/* JSX */);
}
```

### useEffect and Lifecycle Hooks

`useEffect` is **essential** for accessing browser APIs safely:

```tsx
'use client';

import { useEffect } from 'react';

export function BrowserAPIComponent() {
  useEffect(() => {
    // Safe: window is available here
    console.log(window.innerHeight);

    // Safe: navigator is available here
    navigator.mediaDevices.getUserMedia({ audio: true });

    // Cleanup function
    return () => {
      console.log('Component unmounting');
    };
  }, []); // Empty deps = run once on mount

  return <div>Component</div>;
}
```

**Evidence**: [Next.js Static Exports - Browser APIs](https://nextjs.org/docs/app/guides/static-exports#browser-apis)

---

## 3. Environment Variables

### NEXT_PUBLIC_ Prefix for Client-Side Access

**Rule**: Environment variables accessible in browser **MUST** be prefixed with `NEXT_PUBLIC_`

**Why**: Next.js bundles `NEXT_PUBLIC_*` variables at build time, inlining them into JavaScript sent to the client.

**Server-Side Only** (no prefix):
```bash
# .env.local
ELEVENLABS_API_KEY=sk_abc123...  # Server only
DATABASE_URL=postgresql://...     # Server only
```

**Client-Side Accessible** (NEXT_PUBLIC_ prefix):
```bash
# .env.local
NEXT_PUBLIC_AGENT_ID=agent_abc123  # Available in browser
NEXT_PUBLIC_API_URL=https://...    # Available in browser
```

**Evidence**: [Next.js Environment Variables](https://nextjs.org/docs/15/app/guides/environment-variables#bundling-environment-variables-for-the-browser)

### Environment Variable Naming Conventions

| Variable | Prefix | Access | Example |
|----------|--------|--------|---------|
| API keys | None | Server only | `ELEVENLABS_API_KEY` |
| Agent IDs | `NEXT_PUBLIC_` | Client + Server | `NEXT_PUBLIC_AGENT_ID` |
| Database URLs | None | Server only | `DATABASE_URL` |
| Public configs | `NEXT_PUBLIC_` | Client + Server | `NEXT_PUBLIC_APP_NAME` |

### .env.local Setup

**File: `.env.local`** (in project root, NOT in `/src` folder)

```bash
# Server-side only - NEVER expose in browser
ELEVENLABS_API_KEY=your_api_key_here

# Client-side accessible
NEXT_PUBLIC_AGENT_ID=your_agent_id_here
NEXT_PUBLIC_CONNECTION_TYPE=webrtc
```

**Important**:
1. Add `.env.local` to `.gitignore` (done by default in `create-next-app`)
2. Never commit secrets to version control
3. Prefix with `NEXT_PUBLIC_` ONLY when client needs access
4. `.env.local` loads ONLY from project root (not `/src`)

### Security Considerations

**DO**:
- ✓ Keep API keys server-side only (no `NEXT_PUBLIC_`)
- ✓ Use API routes to proxy sensitive requests
- ✓ Validate and sanitize user inputs
- ✓ Use signed URLs for authenticated agents (generated server-side)

**DON'T**:
- ✗ Expose API keys with `NEXT_PUBLIC_` prefix
- ✗ Call authenticated APIs directly from client
- ✗ Commit `.env.local` to git
- ✗ Hardcode secrets in code

**Example: Secure API Key Usage**

```tsx
// ❌ WRONG: Exposes API key in browser
'use client';

export function BadComponent() {
  const apiKey = process.env.ELEVENLABS_API_KEY; // undefined or exposed!
  // ...
}

// ✓ CORRECT: API key stays on server
// app/api/get-signed-url/route.ts (Server Component)
export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY; // Server-side only
  // Make authenticated request...
}

// app/components/conversation.tsx (Client Component)
'use client';

export function GoodComponent() {
  const getSignedUrl = async () => {
    const response = await fetch('/api/get-signed-url'); // Server handles auth
    return response.json();
  };
}
```

---

## 4. Third-Party SDK Integration Patterns

### Dynamic Imports for Client-Only Code

Use `next/dynamic` to lazy-load Client Components with browser dependencies:

```tsx
// app/page.tsx (Server Component)
import dynamic from 'next/dynamic';

// Client Component loaded only in browser
const Conversation = dynamic(
  () => import('./components/conversation').then(mod => mod.Conversation),
  {
    ssr: false, // Disable server-side rendering
    loading: () => <p>Loading conversation...</p>
  }
);

export default function Home() {
  return (
    <main>
      <h1>ElevenLabs Voice Agent</h1>
      <Conversation />
    </main>
  );
}
```

**Options**:
- `ssr: false` - Skip server-side rendering (prevents "window is not defined" errors)
- `loading` - Show fallback while component loads
- `ssr: false` ONLY works in Client Components (will error in Server Components)

**Evidence**: [Next.js Lazy Loading](https://nextjs.org/docs/15/app/guides/lazy-loading#how-to-lazy-load-client-components-and-libraries)

### useEffect Initialization Patterns

**Pattern 1: Initialize SDK on Mount**

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function VoiceAgent() {
  const sdkRef = useRef<SomeSDK | null>(null);

  useEffect(() => {
    // Initialize SDK only on client
    sdkRef.current = new SomeSDK({
      apiKey: process.env.NEXT_PUBLIC_API_KEY
    });

    return () => {
      // Cleanup on unmount
      sdkRef.current?.destroy();
    };
  }, []); // Empty deps = run once

  return <div>Agent</div>;
}
```

**Pattern 2: Lazy Load External Libraries**

```tsx
'use client';

import { useState } from 'react';

export function SearchComponent() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query: string) => {
    // Load library only when needed
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(data);
    setResults(fuse.search(query));
  };

  return (
    <input onChange={(e) => handleSearch(e.target.value)} />
  );
}
```

**Evidence**: [Next.js Lazy Loading - External Libraries](https://nextjs.org/docs/15/app/guides/lazy-loading#loading-external-libraries)

### Cleanup and Unmounting

**Always cleanup resources in useEffect return**:

```tsx
'use client';

import { useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
  });

  useEffect(() => {
    // Setup code...

    return () => {
      // Cleanup: end session on unmount
      conversation.endSession();
    };
  }, [conversation]);

  return <div>Conversation UI</div>;
}
```

### Error Boundaries

Create error boundaries for Client Components:

```tsx
// app/components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
// <ErrorBoundary>
//   <Conversation />
// </ErrorBoundary>
```

**Evidence**: [Next.js Error Handling](https://nextjs.org/docs/15/app/getting-started/error-handling#error-js)

---

## 5. Audio/Media Handling in Next.js

### Browser API Access

Audio APIs are **client-side only**. Always wrap in `useEffect`:

```tsx
'use client';

import { useEffect, useState } from 'react';

export function MicrophoneAccess() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Check microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  return (
    <div>
      {hasPermission === null && <p>Checking permission...</p>}
      {hasPermission === true && <p>Microphone access granted</p>}
      {hasPermission === false && <p>Microphone access denied</p>}
    </div>
  );
}
```

### Microphone Permissions

**Best Practices**:
1. Request permission **before** starting conversation
2. Provide clear user feedback
3. Handle permission denied gracefully
4. Test on multiple browsers (permission APIs vary)

```tsx
'use client';

import { useCallback, useState } from 'react';

export function VoiceAgent() {
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const requestPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionStatus('denied');
    }
  }, []);

  return (
    <div>
      {permissionStatus === 'prompt' && (
        <button onClick={requestPermission}>
          Allow Microphone Access
        </button>
      )}
      {permissionStatus === 'denied' && (
        <p>Please enable microphone in browser settings</p>
      )}
      {permissionStatus === 'granted' && (
        <p>Ready to start conversation</p>
      )}
    </div>
  );
}
```

### Audio Stream Management

**Pattern: Manage audio lifecycle**

```tsx
'use client';

import { useEffect, useRef } from 'react';

export function AudioManager() {
  const streamRef = useRef<MediaStream | null>(null);

  const startAudio = async () => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
  };

  const stopAudio = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    return () => {
      // Cleanup: stop all tracks on unmount
      stopAudio();
    };
  }, []);

  return <div>Audio Manager</div>;
}
```

### WebRTC Considerations

ElevenLabs uses WebRTC for real-time audio:

**Key Points**:
- WebRTC only works in browser (Client Component required)
- Requires HTTPS in production (localhost works with HTTP)
- Handles peer-to-peer connections for low latency
- Falls back to WebSocket if WebRTC unavailable

**Connection Types**:
```tsx
await conversation.startSession({
  agentId: 'YOUR_AGENT_ID',
  connectionType: 'webrtc', // or 'websocket'
});
```

---

## 6. State Management

### React Hooks for Voice Agent State

**ElevenLabs useConversation Hook**:

```tsx
'use client';

import { useConversation } from '@elevenlabs/react';

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  // Available state:
  // - conversation.status: 'disconnected' | 'connecting' | 'connected'
  // - conversation.isSpeaking: boolean

  return (
    <div>
      <p>Status: {conversation.status}</p>
      <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
    </div>
  );
}
```

### Context Providers (If Needed)

For sharing state across multiple components:

```tsx
// app/providers/conversation-provider.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useConversation } from '@elevenlabs/react';

const ConversationContext = createContext<ReturnType<typeof useConversation> | null>(null);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
  });

  return (
    <ConversationContext.Provider value={conversation}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversationContext must be used within ConversationProvider');
  }
  return context;
}

// Usage in app/layout.tsx:
// <ConversationProvider>
//   {children}
// </ConversationProvider>
```

### State Persistence

For persisting conversation state (e.g., message history):

```tsx
'use client';

import { useState, useEffect } from 'react';

export function PersistentConversation() {
  const [messages, setMessages] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('conversation-history');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when messages change
  useEffect(() => {
    localStorage.setItem('conversation-history', JSON.stringify(messages));
  }, [messages]);

  return <div>{/* UI */}</div>;
}
```

### Real-Time Updates

Handle real-time state updates from conversation:

```tsx
'use client';

import { useConversation } from '@elevenlabs/react';
import { useState, useCallback } from 'react';

export function RealtimeConversation() {
  const [transcript, setTranscript] = useState<string[]>([]);

  const conversation = useConversation({
    onMessage: useCallback((message) => {
      // Update transcript in real-time
      setTranscript(prev => [...prev, message.text]);
    }, []),
  });

  return (
    <div>
      <ul>
        {transcript.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 7. Performance Optimization

### Code Splitting for Voice Components

Use `next/dynamic` to reduce initial bundle size:

```tsx
// app/page.tsx (Server Component)
import dynamic from 'next/dynamic';

// Load conversation component only when needed
const Conversation = dynamic(
  () => import('./components/conversation'),
  {
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export default function Home() {
  return <Conversation />;
}
```

### Lazy Loading Patterns

**Pattern 1: Load on User Interaction**

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const Conversation = dynamic(() => import('./conversation'), { ssr: false });

export function LazyVoiceAgent() {
  const [showConversation, setShowConversation] = useState(false);

  return (
    <div>
      {!showConversation && (
        <button onClick={() => setShowConversation(true)}>
          Start Voice Chat
        </button>
      )}
      {showConversation && <Conversation />}
    </div>
  );
}
```

**Pattern 2: Load on Viewport Enter**

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Conversation = dynamic(() => import('./conversation'), { ssr: false });

export function ViewportLoadedAgent() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible && <Conversation />}
    </div>
  );
}
```

### Bundle Size Considerations

**Analyze bundle size**:
```bash
npm run build
# Check output for bundle sizes
```

**Next.js automatically**:
- Code-splits by route
- Tree-shakes unused code
- Minifies production builds

**Manual optimization**:
```tsx
// Import only what you need
import { useConversation } from '@elevenlabs/react'; // Good
// import * as ElevenLabs from '@elevenlabs/react'; // Avoid (imports everything)
```

### First Load JS Impact

**Goal**: Keep First Load JS < 200kb for fast initial render

**Strategies**:
1. Use `dynamic` imports for heavy components
2. Defer loading non-critical features
3. Use `ssr: false` for client-only components
4. Lazy load third-party libraries

**Measure**:
```bash
npm run build
# Look for "First Load JS" column in output
```

**Example output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         87.3 kB
└ ○ /conversation                        2.1 kB         89.2 kB
+ First Load JS shared by all            82.1 kB
  ├ chunks/framework-abc123.js           45 kB
  ├ chunks/main-def456.js                32 kB
  └ other shared chunks (total)          5.1 kB
```

---

## 8. Code Examples

### Complete Client Component with ElevenLabs

**File: `app/components/conversation.tsx`**

```tsx
'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState } from 'react';

export function Conversation() {
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to agent');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from agent');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setError(error.message);
    },
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID!, // From .env.local
        userId: 'user_123', // Optional: your user's ID
        connectionType: 'webrtc', // or 'websocket'
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError('Failed to start conversation. Please check microphone permissions.');
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">Voice Conversation</h2>

      {/* Status Display */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-600">
          Status: <span className="font-semibold">{conversation.status}</span>
        </p>
        <p className="text-sm text-gray-600">
          Agent is {conversation.isSpeaking ?
            <span className="text-green-600 font-semibold">speaking</span> :
            <span className="text-blue-600 font-semibold">listening</span>
          }
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Stop Conversation
        </button>
      </div>
    </div>
  );
}
```

### Environment Variable Access

**File: `.env.local`**

```bash
# Server-side only (API routes)
ELEVENLABS_API_KEY=sk_your_api_key_here

# Client-side accessible
NEXT_PUBLIC_AGENT_ID=agent_your_agent_id_here
NEXT_PUBLIC_CONNECTION_TYPE=webrtc
```

**File: `app/api/get-signed-url/route.ts`** (Server Component)

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY; // Server-side only

    if (!apiKey || !agentId) {
      throw new Error('Missing configuration');
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get signed URL');
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}
```

### Error Handling Patterns

**Pattern 1: Try-Catch with User Feedback**

```tsx
'use client';

import { useState } from 'react';

export function ErrorHandlingExample() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startConversation = async () => {
    setError(null);
    setLoading(true);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Start conversation...
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone permission denied. Please enable it in browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No microphone found. Please connect a microphone.');
        } else {
          setError('Microphone access error: ' + err.message);
        }
      } else {
        setError('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      <button onClick={startConversation}>Start</button>
    </div>
  );
}
```

**Pattern 2: Error Boundary Wrapper**

```tsx
// app/error.tsx (Next.js convention for error boundaries)
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

### Complete Page Example

**File: `app/page.tsx`** (Server Component)

```tsx
import { Conversation } from './components/conversation';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          ElevenLabs Voice Agent
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Have a natural conversation with our AI assistant
        </p>
        <Conversation />
      </div>
    </main>
  );
}
```

---

## 9. Project Structure Recommendations

### Recommended Directory Organization

```
assistant-elevenlabs-lvmh/
├── app/
│   ├── layout.tsx                # Root layout (Server Component)
│   ├── page.tsx                  # Home page (Server Component)
│   ├── components/               # Feature components
│   │   ├── conversation.tsx      # Main conversation component (Client)
│   │   ├── voice-controls.tsx    # Voice UI controls (Client)
│   │   └── transcript.tsx        # Message transcript (Client)
│   ├── api/                      # API routes (Server-side)
│   │   └── get-signed-url/
│   │       └── route.ts          # Signed URL endpoint
│   └── lib/                      # Utilities
│       ├── elevenlabs.ts         # ElevenLabs helper functions
│       └── utils.ts              # General utilities
├── public/                       # Static assets
│   ├── favicon.ico
│   └── images/
├── .env.local                    # Environment variables (gitignored)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Component Organization

**Principle**: Organize by feature, not by type

**Good** (feature-based):
```
app/components/
├── conversation/
│   ├── conversation.tsx         # Main component
│   ├── conversation-controls.tsx
│   ├── conversation-status.tsx
│   └── use-conversation-state.ts # Custom hook
└── ui/
    ├── button.tsx
    └── card.tsx
```

**Avoid** (type-based):
```
app/
├── components/
├── hooks/
├── utils/
└── types/
```

### Hook Organization

Create custom hooks for reusable logic:

**File: `app/components/conversation/use-conversation-state.ts`**

```tsx
'use client';

import { useConversation } from '@elevenlabs/react';
import { useState, useCallback } from 'react';

export function useConversationState() {
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => setError(null),
    onError: (err) => setError(err.message),
  });

  const startConversation = useCallback(async (agentId: string) => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId });
    } catch (err) {
      setError('Failed to start conversation');
    }
  }, [conversation]);

  return {
    conversation,
    error,
    startConversation,
  };
}

// Usage:
// const { conversation, error, startConversation } = useConversationState();
```

### Utility Functions

**File: `app/lib/elevenlabs.ts`**

```tsx
export async function getSignedUrl(): Promise<string> {
  const response = await fetch('/api/get-signed-url');
  if (!response.ok) {
    throw new Error('Failed to get signed URL');
  }
  const { signedUrl } = await response.json();
  return signedUrl;
}

export function getAgentId(): string {
  const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
  if (!agentId) {
    throw new Error('NEXT_PUBLIC_AGENT_ID is not configured');
  }
  return agentId;
}
```

---

## 10. Common Issues & Solutions

### Issue 1: "window is not defined" Error

**Symptom**: Error during build or SSR:
```
ReferenceError: window is not defined
```

**Cause**: Accessing browser APIs in Server Component or during server rendering

**Solutions**:

**Solution A: Use "use client" directive**
```tsx
'use client'; // Add this at top of file

export function Component() {
  const width = window.innerWidth; // Now works
}
```

**Solution B: Wrap in useEffect**
```tsx
'use client';

import { useEffect, useState } from 'react';

export function Component() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth); // Safe in useEffect
  }, []);
}
```

**Solution C: Use dynamic import with ssr: false**
```tsx
import dynamic from 'next/dynamic';

const ClientComponent = dynamic(
  () => import('./client-component'),
  { ssr: false } // Skip server-side rendering
);
```

**Evidence**: [Next.js Static Exports - Browser APIs](https://nextjs.org/docs/app/guides/static-exports#browser-apis)

---

### Issue 2: Hydration Mismatch

**Symptom**: Console warning:
```
Warning: Text content did not match. Server: "X" Client: "Y"
```

**Cause**: Server-rendered HTML differs from client-rendered HTML

**Common Causes**:
- Using `Date.now()` or `Math.random()` directly in render
- Accessing `localStorage` outside `useEffect`
- Browser-only values in initial render

**Solution**:

```tsx
'use client';

import { useEffect, useState } from 'react';

// ❌ WRONG: Causes hydration mismatch
export function BadComponent() {
  const time = Date.now(); // Different on server vs client
  return <div>{time}</div>;
}

// ✓ CORRECT: Consistent rendering
export function GoodComponent() {
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    setTime(Date.now()); // Only set on client
  }, []);

  return <div>{time ?? 'Loading...'}</div>;
}
```

---

### Issue 3: Environment Variable Not Loading

**Symptom**: `process.env.NEXT_PUBLIC_AGENT_ID` is `undefined`

**Causes & Solutions**:

**Cause A: Missing NEXT_PUBLIC_ prefix**
```bash
# ❌ WRONG
AGENT_ID=abc123

# ✓ CORRECT
NEXT_PUBLIC_AGENT_ID=abc123
```

**Cause B: .env.local in wrong location**
```
# ✓ CORRECT
project-root/
├── .env.local         # Here (project root)
├── app/
└── src/               # NOT in /src or /app

# ❌ WRONG
project-root/
├── app/
│   └── .env.local     # Wrong location
└── src/
    └── .env.local     # Wrong location
```

**Cause C: Server not restarted after .env change**
```bash
# Stop dev server (Ctrl+C) and restart:
npm run dev
```

**Cause D: Variable accessed during build time**
```tsx
// ❌ WRONG: Evaluated at build time
const agentId = process.env.NEXT_PUBLIC_AGENT_ID;

export function Component() {
  return <div>{agentId}</div>; // May be undefined
}

// ✓ CORRECT: Evaluated at runtime
export function Component() {
  const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
  return <div>{agentId}</div>;
}
```

**Evidence**: [Next.js Environment Variables](https://nextjs.org/docs/15/app/guides/environment-variables#bundling-environment-variables-for-the-browser)

---

### Issue 4: Audio Permission Issues

**Symptom**: Microphone access fails or no prompt appears

**Causes & Solutions**:

**Cause A: HTTPS required in production**
```
Development (localhost): HTTP works
Production: HTTPS required for getUserMedia()
```

**Solution**: Ensure production uses HTTPS

**Cause B: Permission previously denied**
```tsx
'use client';

export function PermissionCheck() {
  const checkPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });

      if (result.state === 'denied') {
        alert('Microphone access denied. Please enable it in browser settings.');
      } else if (result.state === 'prompt') {
        // Will prompt user
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (error) {
      console.error('Permission check failed:', error);
    }
  };

  return <button onClick={checkPermission}>Check Permission</button>;
}
```

**Cause C: No microphone connected**
```tsx
'use client';

import { useEffect, useState } from 'react';

export function MicrophoneDetection() {
  const [hasMicrophone, setHasMicrophone] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const audioInput = devices.some(device => device.kind === 'audioinput');
        setHasMicrophone(audioInput);
      });
  }, []);

  if (!hasMicrophone) {
    return <div>No microphone detected. Please connect a microphone.</div>;
  }

  return <div>Microphone detected</div>;
}
```

**Cause D: Browser doesn't support getUserMedia**
```tsx
'use client';

import { useEffect, useState } from 'react';

export function BrowserSupport() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  }, []);

  if (!isSupported) {
    return <div>Your browser doesn't support audio input. Please use a modern browser.</div>;
  }

  return <div>Browser supports audio</div>;
}
```

---

### Issue 5: Build Errors with Dynamic Imports

**Symptom**: Build fails with dynamic import errors

**Solution**: Ensure correct syntax for dynamic imports

```tsx
// ❌ WRONG
const Component = dynamic('./component');

// ✓ CORRECT
const Component = dynamic(() => import('./component'));

// ✓ CORRECT: With options
const Component = dynamic(
  () => import('./component'),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

// ✓ CORRECT: Named export
const Component = dynamic(
  () => import('./component').then(mod => mod.ComponentName)
);
```

---

## Summary

### Key Takeaways

1. **Use "use client" for ElevenLabs**: Voice agent components require client-side APIs
2. **Prefix with NEXT_PUBLIC_**: Environment variables for browser access
3. **Wrap browser APIs in useEffect**: Prevents SSR errors
4. **Use dynamic imports**: Reduce bundle size with `next/dynamic`
5. **Handle permissions gracefully**: Request microphone access with clear UX
6. **Keep API keys server-side**: Use API routes for authenticated requests
7. **Test on HTTPS in production**: Audio APIs require secure context

### Quick Reference

| Task | Solution |
|------|----------|
| Access browser APIs | `'use client'` + `useEffect` |
| Client-side env vars | `NEXT_PUBLIC_` prefix |
| Lazy load component | `dynamic(() => import('./component'), { ssr: false })` |
| Audio permission | `navigator.mediaDevices.getUserMedia()` |
| Secure API calls | API route (`app/api/*/route.ts`) |
| Error handling | Try-catch + error state |
| Bundle optimization | Dynamic imports + code splitting |

---

**Version History**:
- v1.0 (2025-11-04): Initial documentation based on Next.js 15.0.3 and @elevenlabs/react 0.9.1

**Last Reviewed**: 2025-11-04
**Next Review**: When Next.js 16 or @elevenlabs/react 1.0 releases
