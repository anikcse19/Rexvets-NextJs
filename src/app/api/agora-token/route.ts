/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/agora-token/route.ts
import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import { NextResponse } from "next/server";

const APP_ID = process.env.AGORA_APP_ID!;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelName = searchParams.get("channelName");
  const uid = searchParams.get("uid");

  if (!channelName || !uid) {
    return NextResponse.json(
      { error: "Missing channelName or uid" },
      { status: 400 }
    );
  }

  const role = RtcRole.PUBLISHER;
  const expireTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpire = currentTimestamp + expireTimeInSeconds;
  console.log("agora app id", APP_ID);
  console.log("agora app certificate", APP_CERTIFICATE);
  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      parseInt(uid),
      role,
      privilegeExpire
    );
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to generate token:${error.message}` },
      { status: 500 }
    );
  }
}
