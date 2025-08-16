import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

const AGORA_APP_ID = process.env.AGORA_APP_ID?.trim();
const AGORA_CUSTOMER_ID = process.env.AGORA_CUSTOMER_ID;
const AGORA_CUSTOMER_SECRET = process.env.AGORA_CUSTOMER_SECRET;

const getAuthHeader = () => {
  const credentials = `${AGORA_CUSTOMER_ID}:${AGORA_CUSTOMER_SECRET}`;
  const encoded = Buffer.from(credentials).toString("base64");
  return `Basic ${encoded}`;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // start | stop
    const channelName = searchParams.get("channelName");
    const uid = searchParams.get("uid");
    const resourceId = searchParams.get("resourceId");
    const sid = searchParams.get("sid");

    if (!channelName || !uid) {
      console.error("Missing parameters:", { channelName, uid });
      return NextResponse.json(
        { error: "Missing channelName or uid" },
        { status: 400 }
      );
    }

    // Ensure uid is treated as a string and is an integer
    const uidString = String(uid);
    if (!/^\d+$/.test(uidString)) {
      console.error("Invalid UID format:", uidString);
      return NextResponse.json(
        { error: "UID must be an integer string" },
        { status: 400 }
      );
    }

    if (action === "start") {
      const acquireUrl = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/acquire`;
      const acquireBody = {
        cname: channelName,
        uid: uid,
        clientRequest: {
          resourceExpiredHour: 24, // Resource ID is valid for 24 hours
        },
      };

      const acquireResponse = await fetch(acquireUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(acquireBody),
      });

      if (!acquireResponse.ok) {
        const errorData = await acquireResponse.json();
        console.error("Failed to acquire resource:", errorData);
        return NextResponse.json(
          { error: "Failed to acquire recording resource" },
          { status: acquireResponse.status }
        );
      }

      const acquireData = await acquireResponse.json() as { resourceId: string };
      const { resourceId } = acquireData;

      // Step 2: Start the recording
      const startUrl = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/mode/individual/start`;

      const startBody = {
        cname: channelName,
        uid: uid,
        clientRequest: {
          // Mode is 'individual' for separate files for each user
          // Configure to record audio only
          recordingConfig: {
            channelType: 0,
            streamTypes: 0, // This is the key change: 0 means "audio only"

            // Remove these explicit subscription parameters to avoid conflicts
            // with streamTypes: 0
            // subscribeAudio: true,
            // subscribeVideo: false,

            // This is still needed for subscribing to all users
            subscribeUidGroup: 0,
            subscribeAudioUids: ["#allstream#"],
          },
          // Storage configuration for your S3 bucket
          // You must configure this in the Agora Console first
          storageConfig: {
            vendor: 0, // Agora Cloud Storage
            region: 3, // AP (Asia Pacific) — pick 0=CN, 1=NA, 2=EU, 3=AP
            bucket: "agora", // Required! Just put "agora"
            accessKey: "", // Not needed
            secretKey: "", // Not needed
            fileNamePrefix: ["recordings"], // optional folder prefix
          },
        },
      };

      const startResponse = await fetch(startUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(startBody),
      });

      if (!startResponse.ok) {
        const errorData = await startResponse.json();
        console.error("Failed to start recording:", errorData);
        return NextResponse.json(
          { error: "Failed to start recording" },
          { status: startResponse.status }
        );
      }

      const startData = await startResponse.json() as { sid: string };
      const { sid } = startData; // Session ID

      return NextResponse.json({
        message: "Recording started successfully",
        resourceId,
        sid,
      });
    }

    if (action === "stop") {
      if (!resourceId || !sid) {
        console.error("Missing parameters:", { resourceId, sid });
        return NextResponse.json(
          { error: "Missing resourceId or sid" },
          { status: 400 }
        );
      }

      const stopUrl = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/individual/stop`;

      const stopBody = {
        cname: channelName,
        uid: uid,
        clientRequest: {},
      };

      const stopResponse = await fetch(stopUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(stopBody),
      });

      if (!stopResponse.ok) {
        const errorData = await stopResponse.json();
        console.error("Failed to stop recording:", errorData);
        return NextResponse.json(
          { error: "Failed to stop recording" },
          { status: stopResponse.status }
        );
      }

      const stopData = await stopResponse.json() as { serverResponse: any };
      // The response will contain file information and status
      // You can process this data as needed.
      return NextResponse.json({
        message: "Recording stopped successfully",
        serverResponse: stopData.serverResponse,
      });
    }

    console.error("Invalid action:", action);
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Recording API error:", {
      message: (err as any).message,
      stack: (err as any).stack,
    });
    return NextResponse.json(
      { error: "Recording API failed", details: (err as any).message },
      { status: 500 }
    );
  }
}
