# Next.js 15 + ElevenLabs Quick Start Guide

**Version**: Next.js 15.0.3 | @elevenlabs/react ^0.9.1
**Last Updated**: 2025-11-04

---

## Essential Rules

### 1. Always Use "use client" Directive
```tsx
// app/components/conversation.tsx
'use client';  // MUST be first line before imports

import { useConversation } from '@elevenlabs/react';
```

### 2. Environment Variables for Browser
```bash
# .env.local
ELEVENLABS_API_KEY=sk_xxx           # Server-only (no prefix)
NEXT_PUBLIC_AGENT_ID=agent_xxx      # Client-accessible (NEXT_PUBLIC_ prefix)
```

### 3. Browser APIs in useEffect Only
```tsx
'use client';
import { useEffect } from 'react';

export function Component() {
  useEffect(() => {
    // Safe: window is available here
    console.log(window.innerHeight);
  }, []);
}
```

---

## Minimal Working Example

### Step 1: Create Conversation Component

**File: `app/components/conversation.tsx`**

```tsx
'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID!,
        connectionType: 'webrtc',
      });
    } catch (error) {
      console.error('Failed to start:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Status: {conversation.status}</p>
      <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>

      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
```

### Step 2: Add to Page

**File: `app/page.tsx`**

```tsx
import { Conversation } from './components/conversation';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ElevenLabs Voice Agent
        </h1>
        <Conversation />
      </div>
    </main>
  );
}
```

### Step 3: Configure Environment

**File: `.env.local`**

```bash
NEXT_PUBLIC_AGENT_ID=your_agent_id_here
```

---

## Authentication (Private Agents)

### Create API Route

**File: `app/api/get-signed-url/route.ts`**

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.NEXT_PUBLIC_AGENT_ID}`,
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to get signed URL');

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}
```

### Update Conversation Component

```tsx
'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';

export function Conversation() {
  const conversation = useConversation({/* ... */});

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Fetch signed URL from API route
      const response = await fetch('/api/get-signed-url');
      const { signedUrl } = await response.json();

      // Start with signed URL
      await conversation.startSession({ signedUrl });
    } catch (error) {
      console.error('Failed to start:', error);
    }
  }, [conversation]);

  // ... rest of component
}
```

---

## Common Issues & Fixes

### "window is not defined"
```tsx
// ✗ WRONG (no "use client")
export function Component() {
  const width = window.innerWidth; // Error!
}

// ✓ CORRECT (with "use client")
'use client';
export function Component() {
  const width = window.innerWidth; // Works!
}

// ✓ BEST (with useEffect)
'use client';
import { useEffect, useState } from 'react';

export function Component() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth); // Safe!
  }, []);
}
```

### Environment Variable Undefined
```bash
# ✗ WRONG (no NEXT_PUBLIC_ prefix for client)
AGENT_ID=abc123

# ✓ CORRECT (with NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_AGENT_ID=abc123

# Server-only (no prefix)
ELEVENLABS_API_KEY=sk_xxx
```

**After changing .env.local, restart dev server:**
```bash
npm run dev  # Restart required!
```

### Hydration Mismatch
```tsx
// ✗ WRONG (different on server vs client)
export function BadComponent() {
  const time = Date.now(); // Mismatch!
  return <div>{time}</div>;
}

// ✓ CORRECT (client-only)
'use client';
import { useEffect, useState } from 'react';

export function GoodComponent() {
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    setTime(Date.now()); // Only on client
  }, []);

  return <div>{time ?? 'Loading...'}</div>;
}
```

### Microphone Permission Denied
```tsx
'use client';

export function PermissionHandler() {
  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Permission granted');
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          alert('Please enable microphone in browser settings');
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found');
        }
      }
    }
  };

  return <button onClick={requestPermission}>Allow Microphone</button>;
}
```

---

## Performance Optimization

### Lazy Load with Dynamic Import

```tsx
// app/page.tsx (Server Component)
import dynamic from 'next/dynamic';

const Conversation = dynamic(
  () => import('./components/conversation'),
  {
    ssr: false, // Skip server-side rendering
    loading: () => <p>Loading...</p>
  }
);

export default function Home() {
  return <Conversation />;
}
```

### Load on User Interaction

```tsx
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Conversation = dynamic(() => import('./conversation'), { ssr: false });

export function LazyAgent() {
  const [show, setShow] = useState(false);

  return (
    <div>
      {!show && <button onClick={() => setShow(true)}>Start Chat</button>}
      {show && <Conversation />}
    </div>
  );
}
```

---

## Project Structure

```
assistant-elevenlabs-lvmh/
├── app/
│   ├── page.tsx                  # Home page (Server Component)
│   ├── layout.tsx                # Root layout
│   ├── components/
│   │   ├── conversation.tsx      # Voice agent (Client Component)
│   │   └── voice-controls.tsx    # UI controls (Client Component)
│   ├── api/
│   │   └── get-signed-url/
│   │       └── route.ts          # API endpoint (Server)
│   └── lib/
│       └── utils.ts              # Helper functions
├── .env.local                    # Environment variables (gitignored!)
├── package.json
└── tsconfig.json
```

---

## Quick Reference

| Task | Solution |
|------|----------|
| Use browser APIs | Add `'use client'` + wrap in `useEffect` |
| Client env vars | Prefix with `NEXT_PUBLIC_` |
| Server-only env vars | No prefix (e.g., `ELEVENLABS_API_KEY`) |
| Request microphone | `navigator.mediaDevices.getUserMedia({ audio: true })` |
| Start conversation | `conversation.startSession({ agentId })` |
| Stop conversation | `conversation.endSession()` |
| Check status | `conversation.status` ('disconnected' \| 'connecting' \| 'connected') |
| Check if speaking | `conversation.isSpeaking` (boolean) |
| Lazy load | `dynamic(() => import('./component'), { ssr: false })` |

---

## Checklist

- [ ] Add `'use client'` to conversation component
- [ ] Create `.env.local` with `NEXT_PUBLIC_AGENT_ID`
- [ ] Add `.env.local` to `.gitignore`
- [ ] Request microphone permission before starting
- [ ] Handle errors with try-catch
- [ ] Test on HTTPS in production (required for audio)
- [ ] Verify environment variables load (restart dev server)

---

**For full documentation, see**: `docs/research/research-nextjs-elevenlabs.md`

**Official Resources**:
- [ElevenLabs Next.js Quickstart](https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js)
- [Next.js 15 Documentation](https://nextjs.org/docs/15)
- [@elevenlabs/react NPM](https://www.npmjs.com/package/@elevenlabs/react)
