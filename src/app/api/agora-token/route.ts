import { RtcRole, RtcTokenBuilder } from "agora-token";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const channelName = searchParams.get("channelName")?.trim();
  const uid = Number(searchParams.get("uid") || 0);
  const isPublisher = searchParams.get("isPublisher") === "true";
  const tokenExpire = Number(searchParams.get("tokenExpire") || 7200); // default 2 hours

  // Validate inputs
  if (!channelName || channelName.length === 0) {
    return new Response(JSON.stringify({ error: "channelName is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (isNaN(uid) || uid < 0 || uid > 4294967295) {
    return new Response(
      JSON.stringify({
        error: "uid must be a valid number between 0 and 4294967295",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (tokenExpire <= 0 || tokenExpire > 86400) {
    return new Response(
      JSON.stringify({
        error: "tokenExpire must be between 1 and 86400 seconds",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Load environment variables
  const APP_ID = process.env.AGORA_APP_ID;
  const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

  if (!APP_ID || !APP_CERTIFICATE) {
    return new Response(
      JSON.stringify({
        error: "Server configuration error: Missing Agora credentials",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Both tokenExpire and privilegeExpire are durations in seconds
    const privilegeExpire = tokenExpire;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      tokenExpire, // Token validity duration in seconds
      privilegeExpire // Privilege validity duration in seconds
    );

    return new Response(JSON.stringify({ token, expiresIn: tokenExpire }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return new Response(JSON.stringify({ error: "Failed to generate token" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
