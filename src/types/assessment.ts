// Risk assessment types based on the Python backend's response models

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  UNKNOWN = "UNKNOWN"
}

// This interface matches the Python backend's AssessmentResponse model
export interface AssessmentResponse {
  risk_score: number;
  risk_level: RiskLevel | string; // Backend sends string, we convert to enum
  threat_text_score: number;
  location_risk_index: number;
  driver_history_score: number;
  transcribed_text: string;
  action_required: boolean;
  push_notification: string | null;
}

export interface EvidenceKit {
  evidence_kit_id: string;
  processing_timestamp: string;
  ride_details: {
    incident_id: string;
    ride_id: string;
    passenger_id: string;
    driver_id: string;
    additional_context: string;
    audio_filename: string;
    file_size_bytes: number;
  };
  audio_analysis: {
    duration_seconds: number;
    transcript_length: number;
    speech_detected: boolean;
    processing_quality: string;
  };
  executive_summary: string;
  incident_classification: {
    primary_category: string;
    secondary_categories: string[];
    severity_level: string;
    urgency: string;
    requires_immediate_action: boolean;
  };
  evidence_details: {
    full_transcript: string;
    audio_duration_seconds: number;
    processing_timestamp: string;
    threat_indicators: any[];
    risk_assessment: {
      threat_text_score: number;
      overall_score: number;
      assessment_type: string;
      processing_method: string;
    };
  };
  detailed_analysis: {
    conversation_tone: string;
    power_dynamics: string;
    escalation_pattern: string;
    safety_concerns: string[];
    protective_factors: string[];
  };
  recommended_actions: string[];
  follow_up_required: boolean;
  overall_risk_score: number;
  confidence_level: number;
}
