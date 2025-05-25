import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const timestamp = formData.get("timestamp") as string;
    const recordingNumber = formData.get("recordingNumber") as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    console.log("Received audio upload:", {
      filename: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      timestamp,
      recordingNumber,
    });

    // Create a new FormData to send to the backend
    const backendFormData = new FormData();
    backendFormData.append("audio_file", audioFile);
    
    // Add any available metadata that might help with risk assessment
    // These could be replaced with actual values if available in your app
    backendFormData.append("driver_id", "unknown");
    backendFormData.append("location_lat", "0");
    backendFormData.append("location_lng", "0");
    backendFormData.append("route_expected", "unknown");

    try {
      // Send the audio to the Python backend for assessment
      const backendResponse = await fetch(getApiUrl("/api/assessment"), {
        method: "POST",
        body: backendFormData,
      });

      if (!backendResponse.ok) {
        console.error("Backend API error:", await backendResponse.text());
        throw new Error(`Backend API error: ${backendResponse.status}`);
      }

      const assessmentResult = await backendResponse.json();
      
      console.log("Risk assessment result:", assessmentResult);
  
      return NextResponse.json({
        success: true,
        message: "Audio uploaded and processed successfully",
        data: {
          recordingNumber,
          timestamp,
          fileSize: audioFile.size,
          processedAt: new Date().toISOString(),
          assessment: assessmentResult,  // Already in the correct format from Python backend
        },
      });
    } catch (apiError: any) {
      console.error("Backend API error:", apiError);
      
      // Return a graceful degraded response when backend is unavailable
      // This allows the frontend to continue functioning without the backend
      if (apiError.message.includes("Failed to fetch") || apiError.message.includes("NetworkError")) {
        console.warn("Backend connection failed - returning degraded response");
        return NextResponse.json({
          success: true,
          backendConnected: false,
          message: "Audio recorded but backend processing unavailable",
          data: {
            recordingNumber,
            timestamp,
            fileSize: audioFile.size,
            processedAt: new Date().toISOString(),
            assessment: {
              risk_level: "UNKNOWN",
              risk_score: 0,
              transcribed_text: "[Backend connection error - transcription unavailable]",
              action_required: false,
              threat_text_score: 0,
              location_risk_index: 0,
              driver_history_score: 0,
              push_notification: null
            }
          }
        });
      }
      
      // For other errors, pass through to client
      throw apiError;
    }
  } catch (error) {
    console.error("Error processing audio upload:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 },
    );
  }
}
