import AgoraRTC from "agora-rtc-sdk-ng";
interface StartRecordingResponse {
  resourceId: string;
  setRecordingSid: string;
}

/**
 *
 * @param channelName
 * @param uid
 */
export const startRecording = async (
  channelName: string,
  uid: string
): Promise<StartRecordingResponse | undefined> => {
  try {
    const res = await fetch(
      `/api/record?action=start&channelName=${channelName}&uid=${uid}`
    );
    const data = await res.json();

    return {
      resourceId: data.resourceId,
      setRecordingSid: data.sid,
    };
  } catch (error) {
    console.error("Failed to start recording:", error);
  }
};
// utils/recording.ts
/**
 *
 * @param channelName
 * @param uid
 * @param resourceId
 * @param sid
 */
export const stopRecording = async (
  channelName: string,
  uid: string,
  resourceId: string,
  sid: string
): Promise<boolean> => {
  try {
    await fetch(
      `/api/record?action=stop&channelName=${channelName}&uid=${uid}&resourceId=${resourceId}&sid=${sid}`
    );

    console.log("Recording stopped");
    return true; // success
  } catch (error) {
    console.error("Failed to stop recording:", error);
    return false; // failed
  }
};

export const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
