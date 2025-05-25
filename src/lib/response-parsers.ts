/**
 * Utility file to handle conversions between frontend data types
 * and the Python backend's response formats
 */

import { RiskLevel, AssessmentResponse } from "@/types/assessment";

/**
 * Converts a risk level string from the Python backend to our frontend enum
 */
export function convertRiskLevel(riskLevelFromBackend: string): RiskLevel {
  switch (riskLevelFromBackend.toUpperCase()) {
    case "LOW":
      return RiskLevel.LOW;
    case "MEDIUM":
      return RiskLevel.MEDIUM;
    case "HIGH":
      return RiskLevel.HIGH;
    default:
      return RiskLevel.UNKNOWN;
  }
}

/**
 * Normalizes the assessment response from the backend
 * to handle potential inconsistencies in property names
 */
export function normalizeAssessmentResponse(responseData: any): AssessmentResponse {
  return {
    risk_score: responseData.risk_score || 0,
    risk_level: convertRiskLevel(responseData.risk_level || "UNKNOWN"),
    threat_text_score: responseData.threat_text_score || 0,
    location_risk_index: responseData.location_risk_index || 0,
    driver_history_score: responseData.driver_history_score || 0,
    transcribed_text: responseData.transcribed_text || "",
    action_required: responseData.action_required || false,
    push_notification: responseData.push_notification || null
  };
}
