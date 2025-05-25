"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import EvidenceKitCard from "../components/EvidenceKitCard";
import { EvidenceKit } from "@/types/assessment";

export default function EvidenceKitPage() {
  const [evidenceKit, setEvidenceKit] = useState<EvidenceKit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Try to get evidence kit data from URL params (URI encoded)
    const evidenceKitParam = searchParams.get('data');
    
    if (evidenceKitParam) {
      try {
        // First decode the URI component, then parse JSON
        const decodedData = decodeURIComponent(evidenceKitParam);
        const parsedData = JSON.parse(decodedData);
        setEvidenceKit(parsedData);
      } catch (error) {
        console.error('Error parsing evidence kit data:', error);
      }
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading evidence kit...</p>
        </div>
      </div>
    );
  }

  if (!evidenceKit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Evidence Kit Found</h1>
          <p className="text-gray-600 mb-6">
            No evidence kit data was found. This may be because the session expired or the data was not properly transmitted.
          </p>
          <Link
            href="/record-audio"
            className="inline-flex items-center px-4 py-2 bg-[#00AA13] text-white rounded-lg hover:bg-[#00AA13]/90 transition-colors"
          >
            Start New Recording Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            GoShield Evidence Kit
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis of your ride safety session
          </p>
        </div>

        {/* Evidence Kit Card */}
        <EvidenceKitCard evidenceKit={evidenceKit} />

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/record-audio"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#00AA13] text-white rounded-lg hover:bg-[#00AA13]/90 transition-colors font-medium"
          >
            Start New Session
          </Link>
          
          <button
            onClick={() => {
              // Create a downloadable summary
              const summaryText = `
GoShield Evidence Kit Summary
============================

Evidence Kit ID: ${evidenceKit.evidence_kit_id}
Processing Time: ${evidenceKit.processing_timestamp}

EXECUTIVE SUMMARY:
${evidenceKit.executive_summary}

INCIDENT CLASSIFICATION:
Primary Category: ${evidenceKit.incident_classification.primary_category}
Severity Level: ${evidenceKit.incident_classification.severity_level}
Urgency: ${evidenceKit.incident_classification.urgency}
Immediate Action Required: ${evidenceKit.incident_classification.requires_immediate_action ? 'Yes' : 'No'}

AUDIO ANALYSIS:
Duration: ${evidenceKit.audio_analysis.duration_seconds} seconds
Speech Detected: ${evidenceKit.audio_analysis.speech_detected ? 'Yes' : 'No'}
Processing Quality: ${evidenceKit.audio_analysis.processing_quality}

RISK ASSESSMENT:
Overall Score: ${evidenceKit.evidence_details.risk_assessment.overall_score}
Threat Text Score: ${evidenceKit.evidence_details.risk_assessment.threat_text_score}

TRANSCRIPT:
${evidenceKit.evidence_details.full_transcript}

RECOMMENDED ACTIONS:
${evidenceKit.recommended_actions.map((action: string) => `- ${action}`).join('\n')}
              `.trim();

              const blob = new Blob([summaryText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `evidence-kit-${evidenceKit.evidence_kit_id.substring(0, 8)}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Download Summary
          </button>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>

        {/* Additional Actions for High Risk */}
        {evidenceKit.incident_classification.requires_immediate_action && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  Immediate Action Required
                </h3>
                <p className="mt-1 text-red-700">
                  Based on the analysis, this situation may require immediate attention. 
                  Consider contacting emergency services or reaching out to someone you trust.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:911"
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Call Emergency (911)
                  </a>
                  <a
                    href="tel:988"
                    className="inline-flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Crisis Lifeline (988)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
