"use client";

import { useEffect, useState } from 'react';
import { RiskLevel, AssessmentResponse } from '@/types/assessment';

interface AssessmentCardProps {
  assessment: AssessmentResponse | null;
  recordingNumber: number;
}

export default function AssessmentCard({ assessment, recordingNumber }: AssessmentCardProps) {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.UNKNOWN);
  
  useEffect(() => {
    if (assessment) {
      // Convert string risk level to enum if needed
      if (typeof assessment.risk_level === 'string') {
        switch (assessment.risk_level.toUpperCase()) {
          case 'LOW':
            setRiskLevel(RiskLevel.LOW);
            break;
          case 'MEDIUM':
            setRiskLevel(RiskLevel.MEDIUM);
            break;
          case 'HIGH':
            setRiskLevel(RiskLevel.HIGH);
            break;
          default:
            setRiskLevel(RiskLevel.UNKNOWN);
        }
      } else {
        setRiskLevel(assessment.risk_level);
      }
    }
  }, [assessment]);

  if (!assessment) return null;

  // Display color based on risk level
  const getRiskColor = () => {
    switch (riskLevel) {
      case RiskLevel.LOW:
        return 'bg-green-100 text-green-800';
      case RiskLevel.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case RiskLevel.HIGH:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg p-4 mb-4 ${getRiskColor()}`}>
      <h3 className="text-lg font-semibold">Recording {recordingNumber} Assessment</h3>
      
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className="font-medium">Risk Score:</span>
          <span>{assessment.risk_score.toFixed(1)}</span>
        </div>
        
        <div className="flex justify-between mb-1">
          <span className="font-medium">Risk Level:</span>
          <span className="font-bold">{riskLevel}</span>
        </div>
        
        {assessment.transcribed_text && (
          <div className="mt-2">
            <span className="font-medium">Transcription:</span>
            <p className="text-sm mt-1 italic">"{assessment.transcribed_text}"</p>
          </div>
        )}
        
        {assessment.action_required && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700">
            <span className="font-bold">Action required!</span>
            {assessment.push_notification && (
              <p className="text-sm mt-1">{assessment.push_notification}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
