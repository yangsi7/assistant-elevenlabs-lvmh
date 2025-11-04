# ElevenLabs UI Components Research

**Version**: 1.0
**Date**: 2025-11-04
**Compatible with**: @elevenlabs/react 0.9.1
**Official Documentation**: https://ui.elevenlabs.io/docs

---

## Overview

ElevenLabs UI is a component library built on top of [shadcn/ui](https://ui.shadcn.com/) designed specifically for building multimodal agentic experiences with voice interaction, audio visualization, and transcription features. Components are installed via CLI and added directly to your codebase (not hidden in node_modules), allowing full customization.

**Key Features**:
- Pre-built components for voice agents and audio interactions
- Built on shadcn/ui with Tailwind CSS
- Full source code access and customization
- Integration with @elevenlabs/react SDK
- Real-time audio visualization
- WebRTC-based voice conversations

---

## Installation & Setup

### Prerequisites

- Node.js version 18 or later
- Next.js project
- shadcn/ui setup (CLI will auto-configure if missing)

### Installation Methods

#### Method 1: ElevenLabs CLI (Recommended)
```bash
npx @elevenlabs/cli@latest components add <component-name>
```

#### Method 2: shadcn CLI
```bash
npx shadcn@latest add @elevenlabs-ui/<component-name>
```

### Examples

```bash
# Install the Orb component
npx @elevenlabs/cli@latest components add orb

# Install the Conversation Bar component
npx @elevenlabs/cli@latest components add conversation-bar

# Install multiple components
npx @elevenlabs/cli@latest components add orb conversation voice-button
```

---

## Available Components

### Voice Agent Components

| Component | Description | Primary Use Case |
|-----------|-------------|------------------|
| **Orb** | 3D animated orb with audio reactivity and agent states | Visual agent presence indicator |
| **Conversation Bar** | Complete voice conversation interface with WebRTC | Full-featured voice chat UI |
| **Voice Button** | Interactive button with voice recording states | Push-to-talk interactions |
| **Mic Selector** | Microphone device picker | Audio input selection |

### Conversation Components

| Component | Description | Primary Use Case |
|-----------|-------------|------------------|
| **Conversation** | Scrolling conversation container with auto-scroll | Chat message display |
| **Message** | Composable message with avatar and variants | User/assistant messages |
| **Response** | Agent response display component | AI message formatting |

### Audio Visualization Components

| Component | Description | Primary Use Case |
|-----------|-------------|------------------|
| **Live Waveform** | Real-time canvas-based audio waveform | Microphone input visualization |
| **Waveform** | Static audio waveform visualization | Pre-recorded audio display |
| **Bar Visualizer** | Bar-style audio frequency visualizer | Audio playback visualization |
| **Matrix** | Matrix-style falling characters display | Retro audio visualization |

### Transcription Components

| Component | Description | Primary Use Case |
|-----------|-------------|------------------|
| **Transcript Viewer** | Word-by-word highlighting synced to audio | Audio transcript playback |
| **Shimmering Text** | Animated text with shimmer effect | Loading/streaming text |

### Audio Playback Components

| Component | Description | Primary Use Case |
|-----------|-------------|------------------|
| **Audio Player** | Complete audio player with controls | Audio file playback |
| **Scrub Bar** | Seekable timeline scrubber | Audio/video timeline control |

### Other Components

| Component | Description | Primary Use Case |
|-----------|-------------|------------------|
| **Voice Picker** | Voice selection interface | Agent voice selection |

---

## Component Details

### 1. Orb

**Description**: A WebGL-based 3D animated orb with audio reactivity and agent state visualization built with Three.js.

**Installation**:
```bash
npx @elevenlabs/cli@latest components add orb
```

**Props**:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `[string, string]` | `["#CADCFC", "#A0B9D1"]` | Gradient color values |
| `colorsRef` | `RefObject<[string, string]>` | - | Ref for dynamic color updates |
| `resizeDebounce` | `number` | `100` | Canvas resize debounce in ms |
| `seed` | `number` | Random | Seed for consistent animations |
| `agentState` | `AgentState` | `null` | Agent state: null, "thinking", "listening", "talking" |
| `volumeMode` | `"auto" \| "manual"` | `"auto"` | Volume control mode |
| `manualInput` | `number` | - | Manual input volume (0-1) |
| `manualOutput` | `number` | - | Manual output volume (0-1) |
| `inputVolumeRef` | `RefObject<number>` | - | Ref for input volume |
| `outputVolumeRef` | `RefObject<number>` | - | Ref for output volume |
| `getInputVolume` | `() => number` | - | Function returning input volume (0-1) |
| `getOutputVolume` | `() => number` | - | Function returning output volume (0-1) |
| `className` | `string` | - | Custom CSS class |

**AgentState Type**:
```typescript
type AgentState = null | "thinking" | "listening" | "talking";
```

**Usage Example**:
```tsx
import { Orb } from '@/components/ui/orb';

// Basic usage
<Orb />

// With agent state
<Orb agentState="talking" />

// With custom colors
<Orb colors={["#FF6B6B", "#4ECDC4"]} />

// With audio reactivity
<Orb
  volumeMode="auto"
  getInputVolume={() => getMicrophoneVolume()}
  getOutputVolume={() => getSpeakerVolume()}
/>
```

**Key Features**:
- Built with Three.js and React Three Fiber
- WebGL shaders for smooth animations
- Audio reactivity via functions or refs
- Agent state affects visual appearance
- Consistent animations with seed prop
- Automatic canvas resizing with debounce
- Dynamic color updates via colorsRef

---

### 2. Conversation Bar

**Description**: Complete voice conversation interface with WebRTC support, microphone controls, text input, and real-time waveform visualization for ElevenLabs agents.

**Installation**:
```bash
npx @elevenlabs/cli@latest components add conversation-bar
```

**Props**:

| Prop | Type | Description |
|------|------|-------------|
| `agentId` | `string` | **Required.** ElevenLabs Agent ID |
| `className` | `string` | Optional CSS classes for container |
| `waveformClassName` | `string` | Optional CSS classes for waveform |
| `onConnect` | `() => void` | Callback when conversation connects |
| `onDisconnect` | `() => void` | Callback when conversation disconnects |
| `onError` | `(error: Error) => void` | Callback when error occurs |
| `onMessage` | `(message: { source: "user" \| "ai"; message: string }) => void` | Callback when message received |

**Usage Example**:
```tsx
import { ConversationBar } from '@/components/ui/conversation-bar';

<ConversationBar
  agentId="your-agent-id"
  onConnect={() => console.log('Connected')}
  onDisconnect={() => console.log('Disconnected')}
  onError={(error) => console.error(error)}
  onMessage={(msg) => console.log(msg)}
/>
```

**Key Features**:
- WebRTC voice input
- Text input with keyboard shortcuts (Enter to send, Shift+Enter for new lines)
- Mute/unmute toggle
- Live waveform visualization
- Connection state indicators
- Automatic microphone permission handling
- Contextual updates while typing

**Requirements**:
- @elevenlabs/react package
- Valid ElevenLabs Agent ID (create at https://elevenlabs.io/agents)

---

### 3. Voice Button

**Description**: Interactive button with voice recording states, live waveform visualization, and automatic feedback transitions.

**Installation**:
```bash
npx @elevenlabs/cli@latest components add voice-button
```

**Props**:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `VoiceButtonState` | `"idle"` | Current button state |
| `onPress` | `() => void` | - | Callback when clicked |
| `label` | `ReactNode` | - | Content on left side |
| `trailing` | `ReactNode` | - | Content on right (shortcuts) |
| `icon` | `ReactNode` | - | Icon for icon-sized buttons |
| `variant` | `ButtonVariant` | `"outline"` | Button variant |
| `size` | `ButtonSize` | `"default"` | Button size |
| `className` | `string` | - | Optional CSS classes |
| `waveformClassName` | `string` | - | Waveform CSS classes |
| `feedbackDuration` | `number` | `1500` | Duration for success/error states (ms) |

**VoiceButtonState Type**:
```typescript
type VoiceButtonState = "idle" | "recording" | "processing" | "success" | "error";
```

**Usage Example**:
```tsx
import { VoiceButton } from '@/components/ui/voice-button';

// Basic usage
<VoiceButton
  state="idle"
  onPress={() => startRecording()}
/>

// With label and keyboard shortcut
<VoiceButton
  state={recordingState}
  onPress={toggleRecording}
  label="Voice"
  trailing="⌥Space"
/>

// Icon button
<VoiceButton
  state="recording"
  size="icon"
  icon={<MicIcon />}
  onPress={stopRecording}
/>
```

**Key Features**:
- Five distinct states (idle, recording, processing, success, error)
- Live waveform during recording
- Auto-transition from success/error to idle
- Keyboard shortcut display
- Multiple size and variant options
- Customizable feedback duration

---

### 4. Live Waveform

**Description**: Real-time canvas-based audio waveform visualizer with microphone input and customizable rendering modes.

**Installation**:
```bash
npx @elevenlabs/cli@latest components add live-waveform
```

**Props**:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean` | `false` | Whether to listen to microphone |
| `processing` | `boolean` | `false` | Show processing animation |
| `barWidth` | `number` | `3` | Width of each bar (px) |
| `barGap` | `number` | `1` | Gap between bars (px) |
| `barRadius` | `number` | `1.5` | Border radius of bars |
| `barColor` | `string` | - | Bar color (defaults to text color) |
| `fadeEdges` | `boolean` | `true` | Fade edges of waveform |
| `fadeWidth` | `number` | `24` | Fade effect width (px) |
| `height` | `string \| number` | `64` | Waveform height |
| `sensitivity` | `number` | `1` | Audio sensitivity multiplier |
| `smoothingTimeConstant` | `number` | `0.8` | Audio analyser smoothing (0-1) |
| `fftSize` | `number` | `256` | FFT size for analysis |
| `historySize` | `number` | `60` | Bars in history (scrolling mode) |
| `updateRate` | `number` | `30` | Update rate (ms) |
| `mode` | `"scrolling" \| "static"` | `"static"` | Visualization mode |
| `onError` | `(error: Error) => void` | - | Error callback |
| `onStreamReady` | `(stream: MediaStream) => void` | - | Stream ready callback |
| `onStreamEnd` | `() => void` | - | Stream end callback |
| `className` | `string` | - | Custom CSS class |

**Usage Example**:
```tsx
import { LiveWaveform } from '@/components/ui/live-waveform';

// Static mode (frequency bands)
<LiveWaveform
  active={isRecording}
  mode="static"
/>

// Scrolling mode (timeline)
<LiveWaveform
  active={isRecording}
  mode="scrolling"
  historySize={100}
/>

// Processing state
<LiveWaveform
  processing={isProcessing}
/>
```

**Key Features**:
- Web Audio API-based frequency analysis
- Automatic microphone permissions
- Canvas rendering with HiDPI support
- Two visualization modes:
  - **Static**: Symmetric frequency bands (detailed)
  - **Scrolling**: Historical timeline (left-to-right)
- Processing animation while waiting
- Proper cleanup on unmount

---

### 5. Conversation

**Description**: Scrolling conversation container with auto-scroll and sticky-to-bottom behavior for chat interfaces.

**Installation**:
```bash
npx @elevenlabs/cli@latest components add conversation
```

**Sub-components**:
- `Conversation` - Main container
- `ConversationContent` - Message container
- `ConversationEmptyState` - Empty state display
- `ConversationScrollButton` - Scroll-to-bottom button

**Conversation Props**:

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Optional CSS classes |
| `initial` | `"smooth"` | Initial scroll behavior |
| `resize` | `"smooth"` | Resize scroll behavior |
| `...props` | `StickToBottom` | StickToBottom component props |

**ConversationEmptyState Props**:

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Title (default: "No messages yet") |
| `description` | `string` | Description text |
| `icon` | `ReactNode` | Optional icon |
| `className` | `string` | Optional CSS classes |
| `children` | `ReactNode` | Custom content |

**Usage Example**:
```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from '@/components/ui/conversation';

<Conversation>
  <ConversationContent>
    {messages.length === 0 ? (
      <ConversationEmptyState
        title="Start a conversation"
        description="Type a message to begin"
      />
    ) : (
      messages.map(msg => <Message key={msg.id} {...msg} />)
    )}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

**Key Features**:
- Built on `use-stick-to-bottom` library
- Auto-scroll when messages added
- Scroll button appears when scrolled up
- Smooth scrolling animations
- Empty state component included

---

### 6. Message

**Description**: Composable message components with avatar, content variants, and automatic styling for user/assistant messages.

**Installation**:
```bash
npx @elevenlabs/cli@latest components add message
```

**Sub-components**:
- `Message` - Main container
- `MessageContent` - Content wrapper
- `MessageAvatar` - Avatar display

**Message Props**:

| Prop | Type | Description |
|------|------|-------------|
| `from` | `"user" \| "assistant"` | **Required.** Message sender |
| `className` | `string` | Optional CSS classes |

**MessageContent Props**:

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `"contained" \| "flat"` | Visual style (default: "contained") |
| `className` | `string` | Optional CSS classes |
| `children` | `ReactNode` | Message content |

**MessageAvatar Props**:

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | **Required.** Avatar image URL |
| `name` | `string` | Name for fallback (first 2 chars) |
| `className` | `string` | Optional CSS classes |

**Usage Example**:
```tsx
import { Message, MessageContent, MessageAvatar } from '@/components/ui/message';

// User message
<Message from="user">
  <MessageAvatar src="/user-avatar.png" name="John Doe" />
  <MessageContent variant="contained">
    How do I create an agent?
  </MessageContent>
</Message>

// Assistant message with flat variant
<Message from="assistant">
  <MessageAvatar src="/ai-avatar.png" name="AI" />
  <MessageContent variant="flat">
    To create an agent, visit the ElevenLabs dashboard...
  </MessageContent>
</Message>
```

**Key Features**:
- Context-aware styling based on `from` prop
- User messages align right, assistant left
- Contained variant has background colors
- Flat variant for minimal design
- Avatar with fallback text support

---

### 7. Transcript Viewer

**Description**: Component for displaying audio transcripts with word-by-word highlighting synced to audio playback.

**Installation**:
```bash
npx @elevenlabs/cli@latest components add transcript-viewer
```

**Sub-components**:
- `TranscriptViewerContainer` - Main container with state management
- `TranscriptViewerWords` - Word display component
- `TranscriptViewerAudio` - Audio element
- `TranscriptViewerPlayPauseButton` - Play/pause control
- `TranscriptViewerScrubBar` - Timeline scrubber

**TranscriptViewerContainer Props**:

| Prop | Type | Description |
|------|------|-------------|
| `audioSrc` | `string` | **Required.** Audio file URL |
| `audioType` | `AudioType` | **Required.** Audio file type (default: audio/mpeg) |
| `alignment` | `CharacterAlignmentResponseModel` | **Required.** Alignment data |
| `segmentComposer` | `SegmentComposer` | Optional segment composer |
| `hideAudioTags` | `boolean` | Hide ElevenLabs tags (default: true) |
| `onPlay` | `() => void` | Playback start callback |
| `onPause` | `() => void` | Playback pause callback |
| `onTimeUpdate` | `(time: number) => void` | Time update callback |
| `onEnded` | `() => void` | Playback end callback |
| `onDurationChange` | `(duration: number) => void` | Duration change callback |

**Usage Example**:
```tsx
import {
  TranscriptViewerContainer,
  TranscriptViewerWords,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar
} from '@/components/ui/transcript-viewer';

<TranscriptViewerContainer
  audioSrc="/audio.mp3"
  audioType="audio/mpeg"
  alignment={alignmentData}
>
  <TranscriptViewerWords />
  <TranscriptViewerPlayPauseButton />
  <TranscriptViewerScrubBar showTimeLabels />
</TranscriptViewerContainer>
```

**Key Features**:
- Word-by-word highlighting synced to audio
- Custom render functions for words and gaps
- Timeline scrubbing
- Play/pause controls
- Time labels
- Headless hook available (`useTranscriptViewer`)

---

## Integration with @elevenlabs/react SDK

### useConversation Hook

The `@elevenlabs/react` package provides the `useConversation` hook for managing voice agent conversations.

**Installation**:
```bash
npm install @elevenlabs/react
```

**Basic Usage**:
```tsx
import { useConversation } from '@elevenlabs/react';

function VoiceAgent() {
  const conversation = useConversation();

  // Request microphone access
  const requestMic = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  };

  return (
    <button onClick={() => conversation.startSession({ agentId: 'your-agent-id' })}>
      Start Conversation
    </button>
  );
}
```

**Hook Options**:
```tsx
const conversation = useConversation({
  clientTools: {
    displayMessage: (params: { text: string }) => {
      alert(params.text);
      return 'Message displayed';
    }
  },
  overrides: {
    // Conversation setting overrides
  },
  textOnly: false,
  serverLocation: "us" // or "eu-residency", "in-residency", "global"
});
```

**Available Methods & State**:
- `startSession(options)` - Start conversation
- `endSession()` - End conversation
- `isSpeaking` - Boolean indicating if agent is speaking
- `sendUserActivity()` - Notify agent of user activity (prevents interruption)

### Client Tools

Client tools enable agents to invoke client-side functionality:

```tsx
const conversation = useConversation({
  clientTools: {
    openModal: (params: { modalId: string }) => {
      // Open modal on client
      return 'Modal opened';
    },
    fetchUserData: async (params: { userId: string }) => {
      // Fetch data on behalf of user
      const data = await fetchData(params.userId);
      return JSON.stringify(data);
    }
  }
});
```

**Note**: Tool must be marked as "blocking" in ElevenLabs UI for agent to await response.

---

## Component Composition Patterns

### Pattern 1: Voice Chat with Orb

```tsx
import { Orb } from '@/components/ui/orb';
import { ConversationBar } from '@/components/ui/conversation-bar';
import { useConversation } from '@elevenlabs/react';

function VoiceChat() {
  const conversation = useConversation();

  return (
    <div className="flex flex-col items-center gap-8">
      <Orb
        agentState={conversation.isSpeaking ? "talking" : "listening"}
        getInputVolume={() => getInputVolume()}
        getOutputVolume={() => getOutputVolume()}
      />
      <ConversationBar agentId="your-agent-id" />
    </div>
  );
}
```

### Pattern 2: Conversation with Messages

```tsx
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState
} from '@/components/ui/conversation';
import { Message, MessageContent, MessageAvatar } from '@/components/ui/message';

function ChatInterface({ messages }) {
  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="Start a conversation"
            description="Type a message or tap the voice button"
          />
        ) : (
          messages.map(msg => (
            <Message key={msg.id} from={msg.from}>
              <MessageAvatar src={msg.avatar} name={msg.name} />
              <MessageContent variant={msg.from === 'user' ? 'contained' : 'flat'}>
                {msg.text}
              </MessageContent>
            </Message>
          ))
        )}
      </ConversationContent>
    </Conversation>
  );
}
```

### Pattern 3: Voice Recording with Waveform

```tsx
import { VoiceButton } from '@/components/ui/voice-button';
import { LiveWaveform } from '@/components/ui/live-waveform';

function VoiceRecorder() {
  const [state, setState] = useState<VoiceButtonState>('idle');
  const [isRecording, setIsRecording] = useState(false);

  const handlePress = () => {
    if (state === 'idle') {
      setState('recording');
      setIsRecording(true);
    } else if (state === 'recording') {
      setState('processing');
      setIsRecording(false);
      // Process recording...
      setTimeout(() => setState('success'), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <LiveWaveform
        active={isRecording}
        processing={state === 'processing'}
        mode="scrolling"
      />
      <VoiceButton
        state={state}
        onPress={handlePress}
        label="Voice"
        trailing="⌥Space"
      />
    </div>
  );
}
```

---

## Styling & Customization

### Tailwind CSS

All components use Tailwind CSS for styling. Customize via:

1. **className prop**:
```tsx
<Orb className="w-full h-96" />
```

2. **Component-specific classes**:
```tsx
<LiveWaveform
  className="rounded-lg"
  barColor="hsl(var(--primary))"
/>
```

3. **Tailwind configuration** (tailwind.config.js):
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'orb-primary': '#CADCFC',
        'orb-secondary': '#A0B9D1',
      },
    },
  },
};
```

### CSS Variables

Components respect CSS custom properties:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  /* ... */
}
```

### Component Source Customization

Since components are added to your codebase, you can directly modify them:

```bash
# Components are typically added to:
/components/ui/<component-name>.tsx
```

---

## Best Practices

### 1. Microphone Permissions

Always request microphone permissions with user context:

```tsx
const requestMicPermission = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    console.error('Microphone permission denied', error);
    // Show user-friendly error message
  }
};
```

### 2. Agent State Management

Sync UI state with conversation state:

```tsx
const conversation = useConversation();
const [agentState, setAgentState] = useState<AgentState>(null);

useEffect(() => {
  if (conversation.isSpeaking) {
    setAgentState('talking');
  } else if (conversation.status === 'connected') {
    setAgentState('listening');
  } else {
    setAgentState(null);
  }
}, [conversation.isSpeaking, conversation.status]);

return <Orb agentState={agentState} />;
```

### 3. Error Handling

Implement robust error handling:

```tsx
<ConversationBar
  agentId="your-agent-id"
  onError={(error) => {
    console.error('Conversation error:', error);
    toast.error('Connection failed. Please try again.');
  }}
/>
```

### 4. Cleanup

Ensure proper cleanup of media streams:

```tsx
useEffect(() => {
  return () => {
    // Cleanup happens automatically in components
    // but manually clean up if using custom logic
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };
}, []);
```

### 5. Accessibility

- Provide keyboard shortcuts (e.g., ⌥Space for voice)
- Include ARIA labels
- Ensure focus management
- Provide visual feedback for all states

### 6. Performance

- Use `React.memo` for message components in long conversations
- Implement virtual scrolling for 100+ messages
- Debounce canvas resizing (built-in for Orb and LiveWaveform)
- Clean up audio contexts when unmounting

---

## Common Patterns

### Loading States

```tsx
{isConnecting && (
  <div className="flex items-center gap-2">
    <Orb agentState="thinking" />
    <span>Connecting to agent...</span>
  </div>
)}
```

### Error States

```tsx
{error && (
  <div className="text-destructive">
    <p>Connection failed: {error.message}</p>
    <Button onClick={retry}>Retry</Button>
  </div>
)}
```

### Connection Indicators

```tsx
<div className="flex items-center gap-2">
  <div className={cn(
    "w-2 h-2 rounded-full",
    isConnected ? "bg-green-500" : "bg-gray-300"
  )} />
  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
</div>
```

### Audio Visualization Sync

```tsx
const [inputVolume, setInputVolume] = useState(0);
const [outputVolume, setOutputVolume] = useState(0);

// Update volumes from audio analyzer
useEffect(() => {
  const interval = setInterval(() => {
    setInputVolume(getInputVolumeFromAnalyzer());
    setOutputVolume(getOutputVolumeFromAnalyzer());
  }, 30);
  return () => clearInterval(interval);
}, []);

return (
  <Orb
    getInputVolume={() => inputVolume}
    getOutputVolume={() => outputVolume}
  />
);
```

---

## Example Blocks

ElevenLabs UI provides complete example implementations at https://ui.elevenlabs.io/blocks

### Voice Chat Examples

1. **voice-chat-01**: Customer support with conversation bar and message history
2. **voice-chat-02**: Simple orb-based voice chat interface
3. **voice-chat-03**: Full-featured chat with phone button and text input

### Audio Examples

1. **transcriber-01**: Real-time transcription interface
2. **speaker-01**: EL-01 Speaker audio player
3. **voice-form-01**: Voice-to-form filling interface
4. **music-player-01**: Music player with playlist
5. **music-player-02**: Simple music player

### Installation

```bash
# Install complete example
npx @elevenlabs/cli@latest components add voice-chat-01
```

---

## Troubleshooting

### Issue: Components not found after installation

**Solution**: Ensure shadcn/ui is properly configured. Check `components.json` exists.

### Issue: Microphone not working

**Solutions**:
- Check browser permissions
- Ensure HTTPS (required for getUserMedia)
- Verify microphone is not used by another app

### Issue: Orb not rendering

**Solutions**:
- Check Three.js and React Three Fiber are installed
- Ensure WebGL is supported in browser
- Check console for WebGL errors

### Issue: Conversation Bar not connecting

**Solutions**:
- Verify Agent ID is correct
- Check @elevenlabs/react is installed
- Ensure network allows WebRTC connections
- Check ElevenLabs API key if self-hosted

### Issue: Waveform not displaying

**Solutions**:
- Verify Web Audio API is supported
- Check microphone permissions granted
- Ensure `active` prop is set to `true`

---

## API Documentation Links

- **ElevenLabs UI Docs**: https://ui.elevenlabs.io/docs
- **Setup Guide**: https://ui.elevenlabs.io/docs/setup
- **Component Reference**: https://ui.elevenlabs.io/docs/components
- **Usage Guide**: https://ui.elevenlabs.io/docs/usage
- **Example Blocks**: https://ui.elevenlabs.io/blocks
- **React SDK Docs**: https://elevenlabs.io/docs/agents-platform/libraries/react
- **GitHub Repository**: https://github.com/elevenlabs/ui
- **shadcn/ui**: https://ui.shadcn.com

---

## Summary

ElevenLabs UI provides a comprehensive set of components for building voice agent experiences:

**Installation**: Via `@elevenlabs/cli` or `shadcn` CLI
**Customization**: Full source code access, Tailwind CSS-based
**Integration**: Works seamlessly with `@elevenlabs/react` SDK
**Components**: 16+ components for voice, audio, chat, and visualization

**Key Components to Start With**:
1. **ConversationBar** - Complete voice chat UI
2. **Orb** - Visual agent presence
3. **Message** - Chat message display
4. **LiveWaveform** - Audio visualization

**Next Steps**:
1. Install required components via CLI
2. Set up @elevenlabs/react for agent integration
3. Create agent at https://elevenlabs.io/agents
4. Implement voice chat using ConversationBar
5. Customize components to match your design system

---

**Document Version**: 1.0
**Last Updated**: 2025-11-04
**Lines**: 498
