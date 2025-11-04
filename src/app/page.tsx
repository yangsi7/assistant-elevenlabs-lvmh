"use client";

import { useEffect, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LiveWaveform } from "@/components/ui/live-waveform";
import { Mic, X } from "lucide-react";

export default function Home() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    agentId: agentId!,
    onConnect: () => setError(null),
    onDisconnect: () => {},
    onError: (error) => {
      setError(typeof error === "string" ? error : "Connection error");
    },
    onMessage: (message) => {
      console.log("Message:", message);
    },
  });

  const isActive = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle start conversation
  const handleStart = async () => {
    try {
      await conversation.startSession({
        agentId: agentId!,
        connectionType: "webrtc" as const,
      });
    } catch (err) {
      setError("Failed to start conversation");
    }
  };

  // Handle end conversation
  const handleEnd = () => {
    conversation.endSession();
  };

  if (!agentId) {
    return (
      <AuroraBackground>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-2xl font-bold text-red-400">Configuration Error</h1>
            <p className="text-white/60 text-sm">
              Missing NEXT_PUBLIC_ELEVENLABS_AGENT_ID environment variable.
            </p>
          </div>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col">
        {/* Minimal Branding - Top */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10">
          <h1 className="text-2xl md:text-3xl font-light text-white/80">
            Myant Health Assistant
          </h1>
        </div>

        {/* Center: Waveform Visualization */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            <LiveWaveform
              active={isActive}
              processing={isConnecting || conversation.isSpeaking}
              height={280}
              barColor="rgba(110, 231, 183, 0.9)"
              barWidth={4}
              barGap={2}
              sensitivity={1.4}
              smoothingTimeConstant={0.7}
              className="w-full waveform-glow"
            />
          </div>
        </div>

        {/* Bottom: Controls */}
        <div className="pb-16 flex flex-col items-center gap-6 z-10">
          {/* Error Display */}
          {error && (
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-sm text-white/60">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-emerald-400 animate-pulse" : "bg-white/40"
              }`}
            />
            <span>
              {isConnecting
                ? "Connecting..."
                : isActive
                ? "Connected"
                : "Ready"}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                disabled={isConnecting}
                className="mic-button group"
                aria-label="Start conversation"
              >
                <Mic className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleEnd}
                className="end-button group"
                aria-label="End conversation"
              >
                <X className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
