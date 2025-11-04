import { NextResponse } from "next/server";

/**
 * API Route: Generate Signed URL for ElevenLabs Agent
 *
 * This route handles server-side signed URL generation for private ElevenLabs agents.
 * It keeps the API key secure on the server and returns a time-limited signed URL
 * that the client can use to establish a WebSocket connection.
 *
 * @returns JSON response with signedUrl or error message
 */
export async function GET() {
  // Retrieve environment variables
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  // Validate required environment variables
  if (!apiKey || !agentId) {
    console.error("Missing required environment variables:", {
      hasApiKey: !!apiKey,
      hasAgentId: !!agentId,
    });
    return NextResponse.json(
      { error: "Missing API key or Agent ID" },
      { status: 500 }
    );
  }

  try {
    // Call ElevenLabs API to generate signed URL
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    // Handle ElevenLabs API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Parse and return signed URL
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
