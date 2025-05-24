"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosLock } from "react-icons/io";
import toast from "react-hot-toast";

type AudioRecorderProps = {
  onComplete: () => Promise<void>;
};

export default function AudioRecorder({ onComplete }: AudioRecorderProps) {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingCount, setRecordingCount] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const allAudioChunksRef = useRef<Blob[]>([]);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const currentSegmentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const sendAudioToAPI = async (audioBlob: Blob, recordingNumber: number) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, `recording_${recordingNumber}.webm`);
      formData.append("timestamp", new Date().toISOString());
      formData.append("recordingNumber", recordingNumber.toString());

      const response = await fetch("/api/audio-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(`Audio recording ${recordingNumber} sent successfully`);
        toast.success(`Recording ${recordingNumber} uploaded!`);
      } else {
        console.error(`Failed to send audio recording ${recordingNumber}`);
        toast.error(`Failed to upload recording ${recordingNumber}`);
      }
    } catch (error) {
      console.error("Error sending audio to API:", error);
      toast.error("Error uploading audio");
    }
  };

  const sendFullAudioToAPI = async () => {
    if (allAudioChunksRef.current.length === 0) {
      console.log("No audio chunks to send for full recording");
      return;
    }

    try {
      const fullAudioBlob = new Blob(allAudioChunksRef.current, {
        type: "audio/webm",
      });

      const totalDuration = Math.round(
        (Date.now() - sessionStartTimeRef.current) / 1000,
      );

      const formData = new FormData();
      formData.append(
        "audio",
        fullAudioBlob,
        `full_session_${sessionStartTimeRef.current}.webm`,
      );
      formData.append("timestamp", new Date().toISOString());
      formData.append("totalDuration", totalDuration.toString());
      formData.append("segmentCount", recordingCount.toString());

      console.log(
        `Sending complete audio session - Duration: ${totalDuration}s, Segments: ${recordingCount}`,
      );

      const response = await fetch("/api/full-audio-upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Full audio session sent successfully");
        toast.success("Full recording session uploaded!");
      } else {
        console.error("Failed to send full audio session");
        toast.error("Failed to upload full session");
      }
    } catch (error) {
      console.error("Error sending full audio to API:", error);
      toast.error("Error uploading full session");
    }
  };

  const stopCurrentRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const startNewRecording = async () => {
    if (!isMountedRef.current || isRecording) {
      return;
    }

    try {
      console.log("Starting new recording segment...");

      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        });
        streamRef.current = stream;
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
          allAudioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (!isMountedRef.current) return;

        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        setRecordingCount((prevCount) => {
          const newCount = prevCount + 1;
          sendAudioToAPI(audioBlob, newCount);
          return newCount;
        });

        setIsRecording(false);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Schedule stop after 10 seconds
      if (currentSegmentTimeoutRef.current) {
        clearTimeout(currentSegmentTimeoutRef.current);
      }

      currentSegmentTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          stopCurrentRecording();

          // Start next recording after a brief pause
          setTimeout(() => {
            if (isMountedRef.current) {
              startNewRecording();
            }
          }, 100);
        }
      }, 10000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Unable to access microphone. Please check permissions.");
      setIsRecording(false);
    }
  };

  const cleanup = () => {
    isMountedRef.current = false;

    if (currentSegmentTimeoutRef.current) {
      clearTimeout(currentSegmentTimeoutRef.current);
    }

    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
  };

  useEffect(() => {
    isMountedRef.current = true;
    sessionStartTimeRef.current = Date.now();
    allAudioChunksRef.current = [];
    setRecordingCount(0);

    // Start first recording
    startNewRecording();

    // Set session timeout for 25 seconds
    sessionTimeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      console.log("Session timeout reached, ending recording...");
      cleanup();
      await sendFullAudioToAPI();
      await onComplete();
    }, 25000);

    return cleanup;
  }, [onComplete]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-merah/10">
      <div className="relative mt-4 flex aspect-square w-80 items-center justify-center self-center overflow-hidden rounded-full bg-merah/50 shadow-2xl shadow-merah">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-merah/30 shadow-lg shadow-merah">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-merah/60 shadow-lg shadow-merah">
            <IoIosLock className="text-6xl text-white" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-expand absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
          <div className="animate-expand animation-delay-1 absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
          <div className="animate-expand animation-delay-2 absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">Danger Detected</h1>
        <p className="text-center">{"We'll be here until you're safe"}</p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${isRecording ? "animate-pulse bg-red-500" : "bg-gray-400"}`}
          ></div>
          <span className="text-sm text-gray-600">
            {isRecording ? "Recording..." : "Standby"}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Audio segments recorded: {recordingCount}
        </p>
      </div>
    </div>
  );
}
