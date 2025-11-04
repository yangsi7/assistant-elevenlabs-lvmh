"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConversationBar } from "@/components/ui/conversation-bar";

interface VoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Voice Modal Component
 *
 * Wraps the ElevenLabs ConversationBar component in a Dialog modal.
 * The ConversationBar handles all voice interaction logic including:
 * - WebRTC connection management
 * - useConversation hook integration
 * - Microphone controls
 * - Text input with contextual updates
 * - Live waveform visualization
 * - Connection state feedback
 * - Message history display
 *
 * @param open - Controls modal visibility
 * @param onOpenChange - Callback to update modal state
 */
export function VoiceModal({ open, onOpenChange }: VoiceModalProps) {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  if (!agentId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configuration Error</DialogTitle>
            <DialogDescription>
              The voice agent is not properly configured. Please contact support or try again later.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">
              Missing Agent Configuration
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              The application is missing required environment variables.
              Please ensure NEXT_PUBLIC_ELEVENLABS_AGENT_ID is configured.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Voice Conversation</DialogTitle>
          <DialogDescription>
            Start a natural voice conversation with the AI agent. You can speak
            or type your messages.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mx-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">
              Connection Error
            </p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-destructive underline mt-2 hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center py-4">
          <ConversationBar
            agentId={agentId}
            className="w-full"
            onConnect={() => {
              setIsConnected(true);
              setError(null);
            }}
            onDisconnect={() => setIsConnected(false)}
            onError={(error) => {
              setError(
                error.message || "Failed to connect to voice agent. Please try again."
              );
            }}
            onMessage={(message) => {
              // Message handling - can be extended for message history if needed
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
