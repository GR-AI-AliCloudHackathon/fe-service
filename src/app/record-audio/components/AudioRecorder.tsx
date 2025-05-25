"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosLock } from "react-icons/io";
import toast from "react-hot-toast";
import { RiskLevel } from "@/types/assessment";
import { TiMediaRecord } from "react-icons/ti";
import toWav from "audiobuffer-to-wav";

// Custom toast function for different risk levels
const showRiskToast = (message: string, riskLevel?: string) => {
  const options = { duration: 4000 };

  switch (riskLevel) {
    case RiskLevel.HIGH:
      return toast.error(message, options);
    case RiskLevel.MEDIUM:
      return toast(message, {
        ...options,
        icon: "⚠️",
        style: {
          backgroundColor: "#FEF3C7", // Light amber
          color: "#92400E", // Dark amber
          border: "1px solid #F59E0B",
        },
      });
    case RiskLevel.LOW:
    default:
      return toast.success(message, options);
  }
};

type AudioRecorderProps = {
  onComplete?: () => Promise<void>;
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
  const hasInitializedRef = useRef<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  const isRealUnmountRef = useRef<boolean>(false);
  const currentRecordingIdRef = useRef<string | null>(null);
  const recordingCountRef = useRef<number>(0);
  const sessionEndedRef = useRef<boolean>(false);

  // Update the ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    try {
      console.log(`Converting audio blob to WAV, size: ${audioBlob.size} bytes`);
      
      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();

      // Decode audio data
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      console.log(`Audio decoded: ${audioBuffer.duration.toFixed(2)}s, ${audioBuffer.numberOfChannels} channels, ${audioBuffer.sampleRate}Hz`);

      // Convert to WAV
      const wavArrayBuffer = toWav(audioBuffer);

      // Create WAV blob
      const wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });
      console.log(`WAV conversion completed, new size: ${wavBlob.size} bytes`);

      return wavBlob;
    } catch (error) {
      console.error("Error converting audio to WAV:", error);
      toast.error("Error processing audio. Please try again.");
      throw error;
    }
  };

  const sendAudioToAPI = async (audioBlob: Blob, recordingNumber: number) => {
    try {
      // Convert to WAV format
      const wavBlob = await convertToWav(audioBlob);

      const formData = new FormData();
      formData.append("audio", wavBlob, `recording_${recordingNumber}.wav`);
      formData.append("timestamp", new Date().toISOString());
      formData.append("recordingNumber", recordingNumber.toString());

      // Show recording in progress toast
      const loadingToast = toast.loading(`Processing recording ${recordingNumber}...`);

      try {
        const response = await fetch("/api/audio-upload", {
          method: "POST",
          body: formData,
        });
  
        // Dismiss the loading toast regardless of the outcome
        toast.dismiss(loadingToast);
  
        if (response.ok) {
          const responseData = await response.json();
          console.log(
            `Audio recording ${recordingNumber} sent successfully`,
            responseData,
          );
  
          // Check if we received a degraded response (backend unavailable)
          if (responseData.backendConnected === false) {
            toast(`Recording ${recordingNumber} stored locally`, {
              icon: '📱',
              style: {
                background: '#E0E7FF', // light indigo
                border: '1px solid #6366F1', // indigo
                color: '#3730A3' // dark indigo
              }
            });
            return;
          }
  
          // Check if assessment is available (from our Python backend)
          if (responseData.data?.assessment) {
            const assessment = responseData.data.assessment;
            const riskLevel = assessment.risk_level;
  
            // Display different toast messages based on risk level
            if (riskLevel === "HIGH") {
              toast.error(`Recording ${recordingNumber}: High risk detected!`);
            } else if (riskLevel === "MEDIUM") {
              toast(`Recording ${recordingNumber}: Medium risk detected`, {
                icon: '⚠️',
                style: {
                  background: '#FFF0C2',
                  border: '1px solid #FFB800',
                  color: '#664500'
                }
              });
            } else if (riskLevel === "LOW") {
              toast.success(`Recording ${recordingNumber}: Low risk detected`);
            } else {
              // Unknown or other risk level
              toast.success(`Recording ${recordingNumber} uploaded!`);
            }
  
            // If there's a push notification from the backend, show it
            if (assessment.action_required && assessment.push_notification) {
              toast.error(assessment.push_notification);
            }
          } else {
            // Fallback if no assessment in response
            toast.success(`Recording ${recordingNumber} uploaded!`);
          }
        } else {
          console.error(`Failed to send audio recording ${recordingNumber}`, await response.text());
          toast.error(`Failed to upload recording ${recordingNumber}`);
        }
      } catch (networkError) {
        // Dismiss the loading toast
        toast.dismiss(loadingToast);
        
        console.error("Network error when calling API:", networkError);
        toast(`Recording ${recordingNumber} stored locally (offline mode)`, {
          icon: '🔄',
          style: {
            background: '#E0E7FF', // light indigo
            border: '1px solid #6366F1', // indigo
            color: '#3730A3' // dark indigo
          }
        });
      }
    } catch (error) {
      console.error("Error sending audio to API:", error);
      toast.error("Error processing audio");
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

      // Convert to WAV format
      const wavBlob = await convertToWav(fullAudioBlob);

      const totalDuration = Math.round(
        (Date.now() - sessionStartTimeRef.current) / 1000,
      );

      const formData = new FormData();
      formData.append(
        "audio",
        wavBlob,
        `full_session_${sessionStartTimeRef.current}.wav`,
      );
      formData.append("timestamp", new Date().toISOString());
      formData.append("totalDuration", totalDuration.toString());
      formData.append("segmentCount", recordingCountRef.current.toString());

      console.log(
        `Sending complete audio session - Duration: ${totalDuration}s, Segments: ${recordingCountRef.current}`,
      );
      
      // Show loading toast for the full session upload
      const loadingToast = toast.loading("Processing complete recording session...");

      try {
        const response = await fetch("/api/full-audio-upload", {
          method: "POST",
          body: formData,
        });

        // Dismiss the loading toast
        toast.dismiss(loadingToast);
        
        if (response.ok) {
          const responseData = await response.json();
          
          // Check if backend was connected
          if (responseData.backendConnected === false) {
            console.log("Backend unavailable - storing audio locally");
            toast("Full recording session stored locally (offline mode)", {
              icon: '📱',
              style: {
                background: '#E0E7FF', // light indigo
                border: '1px solid #6366F1', // indigo
                color: '#3730A3' // dark indigo
              }
            });
            
            // Still navigate to issue-created page with fallback data if available
            if (responseData.data?.evidenceKit) {
              const evidenceKit = responseData.data.evidenceKit;
              // Store evidence kit data in sessionStorage for issue-created page
              sessionStorage.setItem('evidenceKit', JSON.stringify(evidenceKit));
            }
            
            // Navigate to issue-created page for risk assessment flow
            if (onCompleteRef.current) {
              await onCompleteRef.current();
            } else {
              router.push("/issue-created");
            }
            return;
          }
          
          console.log("Full audio session sent successfully");
          
          // Check if we received evidence kit data
          if (responseData.data?.evidenceKit) {
            const evidenceKit = responseData.data.evidenceKit;
            toast.success(`Recording complete - Evidence kit ${evidenceKit.evidence_kit_id.substring(0, 8)} created!`);
            
            // Store evidence kit data in sessionStorage for issue-created page
            sessionStorage.setItem('evidenceKit', JSON.stringify(evidenceKit));
            
            // Navigate to issue-created page which will show risk assessment and ask user if they want to raise an issue
            if (onCompleteRef.current) {
              await onCompleteRef.current();
            } else {
              router.push("/issue-created");
            }
          } else {
            toast.success("Full recording session uploaded!");
            // Navigate to issue-created page even without evidence kit
            if (onCompleteRef.current) {
              await onCompleteRef.current();
            } else {
              router.push("/issue-created");
            }
          }
        } else {
          console.error("Failed to send full audio session", await response.text());
          toast.error("Failed to upload full session");
          
          // Navigate to fallback flow even if upload failed
          if (onCompleteRef.current) {
            await onCompleteRef.current();
          } else {
            router.push("/issue-created");
          }
        }
      } catch (networkError) {
        // Dismiss the loading toast
        toast.dismiss(loadingToast);
        
        console.error("Network error when sending full audio:", networkError);
        toast("Full recording session stored locally (offline mode)", {
          icon: '🔄',
          style: {
            background: '#E0E7FF',
            border: '1px solid #6366F1',
            color: '#3730A3'
          }
        });
        
        // Navigate to fallback flow even with network error
        if (onCompleteRef.current) {
          await onCompleteRef.current();
        } else {
          router.push("/issue-created");
        }
      }
    } catch (error) {
      console.error("Error sending full audio to API:", error);
      toast.error("Error processing full recording session");
      
      // Navigate to fallback flow even with processing error
      if (onCompleteRef.current) {
        await onCompleteRef.current();
      } else {
        router.push("/issue-created");
      }
    }
  };

  const stopCurrentRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const startNewRecording = async () => {
    if (!isMountedRef.current || isRecording || sessionEndedRef.current) {
      return;
    }

    try {
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

      // Generate unique ID for this recording session
      const recordingId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      currentRecordingIdRef.current = recordingId;

      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
          allAudioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Check if this is still the current recording session
        if (
          !isMountedRef.current ||
          currentRecordingIdRef.current !== recordingId
        ) {
          return;
        }

        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        // Increment and use ref to avoid React StrictMode double execution
        recordingCountRef.current += 1;
        const currentCount = recordingCountRef.current;

        // Update state for UI
        setRecordingCount(currentCount);

        // Send API call outside of state setter to prevent double execution
        sendAudioToAPI(audioBlob, currentCount);

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
        if (isMountedRef.current && !sessionEndedRef.current) {
          stopCurrentRecording();

          // Start next recording after a brief pause
          setTimeout(() => {
            if (isMountedRef.current && !sessionEndedRef.current) {
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

  const cleanup = (isRealCleanup = false) => {
    console.log(
      `[DEBUG] cleanup called - isRealCleanup: ${isRealCleanup}, sessionTimeout exists: ${!!sessionTimeoutRef.current}`,
    );

    // Only mark session as ended if this is a real cleanup (session timeout or unmount)
    if (isRealCleanup) {
      sessionEndedRef.current = true;
    }

    // Invalidate current recording session
    currentRecordingIdRef.current = null;

    // Don't set isMountedRef to false here - let it be controlled by actual unmount
    // isMountedRef.current = false;

    if (currentSegmentTimeoutRef.current) {
      clearTimeout(currentSegmentTimeoutRef.current);
    }

    // Only clear session timeout if this is a real cleanup (not React dev mode)
    if (isRealCleanup && sessionTimeoutRef.current) {
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
    // Prevent double initialization in development mode
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    isMountedRef.current = true;
    sessionStartTimeRef.current = Date.now();
    allAudioChunksRef.current = [];
    setRecordingCount(0);
    recordingCountRef.current = 0;
    sessionEndedRef.current = false;

    // Start first recording
    startNewRecording();

    // Set session timeout for 25 seconds
    console.log("Setting 25-second session timeout...");
    sessionTimeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      console.log("Session timeout reached, ending recording...");
      console.log(
        `[DEBUG] Session stats - Total segments: ${recordingCountRef.current}, Session duration: ${Math.round(
          (Date.now() - sessionStartTimeRef.current) / 1000,
        )}s`,
      );

      // First, stop all recording activity with real cleanup flag
      cleanup(true);

      // Then send the full audio and complete
      // The navigation to evidence kit will happen inside sendFullAudioToAPI
      await sendFullAudioToAPI();
    }, 25000);

    return () => cleanup(false);
  }, []); // Remove onComplete from dependency array

  // Separate effect to handle actual component unmount
  useEffect(() => {
    // Reset the mounted flag in case React dev mode set it to false
    isMountedRef.current = true;

    return () => {
      // In production, this will be a real unmount
      // In development, React may call this during StrictMode double-invocation
      if (process.env.NODE_ENV === "production") {
        isMountedRef.current = false;
        cleanup(true); // This is a real unmount in production
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-merah/10">
      <div className="relative mt-4 flex aspect-square w-80 items-center justify-center self-center overflow-hidden rounded-full bg-merah/50 shadow-2xl shadow-merah">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-merah/30 shadow-lg shadow-merah">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-merah/60 shadow-lg shadow-merah">
            <TiMediaRecord className="text-6xl text-white" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-expand absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
          <div className="animate-expand animation-delay-1 absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
          <div className="animate-expand animation-delay-2 absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">Recording Audio</h1>
        <p className="text-center">
          {"We'll record what's happening around you"}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isRecording ? "animate-pulse bg-red-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm text-gray-600 font-medium">
            {isRecording ? "Recording..." : "Standby"}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-700 mb-1">
            Audio segments recorded: <span className="font-medium">{recordingCount}</span>
          </p>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-merah transition-all duration-300" 
              style={{ width: `${Math.min(100, (recordingCount / 3) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Session will complete after 25 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
