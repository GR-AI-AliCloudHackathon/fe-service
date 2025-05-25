import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const timestamp = formData.get("timestamp") as string;
    const totalDuration = formData.get("totalDuration") as string;
    const segmentCount = formData.get("segmentCount") as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    console.log("Received full audio upload:", {
      filename: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
      timestamp,
      totalDuration,
      segmentCount,
    });

    // Create a new FormData to send to the backend
    const backendFormData = new FormData();
    backendFormData.append("audio_file", audioFile);
    
    // Generate an incident ID based on timestamp
    const incidentId = `incident-${Date.now()}`;
    
    // Add metadata for evidence kit creation
    backendFormData.append("incident_id", incidentId);
    backendFormData.append("ride_id", "unknown");
    backendFormData.append("passenger_id", "unknown");
    backendFormData.append("driver_id", "unknown");
    backendFormData.append("additional_context", 
      `Full audio session of ${totalDuration}s duration, containing ${segmentCount} segments recorded at ${timestamp}`
    );

    console.log(`Sending full audio to backend for summarization (incident: ${incidentId})...`);

    try {
      // Send to the summarize endpoint for comprehensive analysis
      const backendResponse = await fetch(getApiUrl("/api/summarize"), {
        method: "POST",
        body: backendFormData,
      });
  
      if (!backendResponse.ok) {
        console.error("Backend API error:", await backendResponse.text());
        throw new Error(`Backend API error: ${backendResponse.status}`);
      }
  
      const evidenceKit = await backendResponse.json();
      
      console.log("Evidence kit created:", evidenceKit);
  
      return NextResponse.json({
        success: true,
        message: "Full audio session processed and evidence kit created",
        data: {
          incidentId,
          filename: audioFile.name,
          size: audioFile.size,
          duration: totalDuration,
          segments: segmentCount,
          timestamp,
          evidenceKit
        },
      });
    } catch (apiError: any) {
      console.error("Backend API error during full audio processing:", apiError);
      
      // Return a graceful response when backend is unavailable
      if (apiError.message.includes("Failed to fetch") || apiError.message.includes("NetworkError")) {
        console.warn("Backend connection failed - returning minimal evidence kit");
        
        // Create a minimal evidence kit when backend is unavailable
        const fallbackEvidenceKit = {
          evidence_kit_id: `local-${incidentId}`,
          timestamp: new Date().toISOString(),
          transcript: "[Transcription unavailable - backend connection error]",
          summary: "Audio was recorded but could not be analyzed due to backend connection issues.",
          risk_factors: {
            key_phrases: [],
            threat_indicators: [],
            context_analysis: "Analysis unavailable due to backend connection error."
          },
          recommended_actions: [
            "Check backend server status",
            "Try uploading the audio again when the server is available"
          ],
          incident_details: {
            incident_id: incidentId,
            ride_id: "unknown",
            passenger_id: "unknown",
            driver_id: "unknown",
            audio_duration: parseInt(totalDuration, 10) || 0
          }
        };
        
        return NextResponse.json({
          success: true,
          backendConnected: false,
          message: "Full audio session recorded but backend processing unavailable",
          data: {
            incidentId,
            filename: audioFile.name,
            size: audioFile.size,
            duration: totalDuration,
            segments: segmentCount,
            timestamp,
            evidenceKit: fallbackEvidenceKit
          },
        });
      }
      
      // For other errors, pass through to client
      throw apiError;
    }
  } catch (error) {
    console.error("Error processing full audio upload:", error);
    return NextResponse.json(
      { 
        error: "Failed to process audio upload",
        message: (error as Error).message
      },
      { status: 500 },
    );
  }
}
