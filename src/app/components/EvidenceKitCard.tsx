"use client";

import React, { useState } from 'react';
import { EvidenceKit } from '@/types/assessment';
import { FaExclamationTriangle, FaShieldAlt, FaFileAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface EvidenceKitCardProps {
  evidenceKit: EvidenceKit;
  className?: string;
}

export default function EvidenceKitCard({ evidenceKit, className = "" }: EvidenceKitCardProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    return urgency.toLowerCase() === 'high' ? <FaExclamationTriangle className="text-red-500" /> : <FaShieldAlt className="text-orange-500" />;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-[#00AA13] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaFileAlt className="text-xl" />
            <h2 className="text-lg font-semibold">Evidence Kit Report</h2>
          </div>
          <div className="text-sm opacity-90">
            {new Date(evidenceKit.processing_timestamp).toLocaleString()}
          </div>
        </div>
        <p className="text-sm mt-1 opacity-90">ID: {evidenceKit.evidence_kit_id}</p>
      </div>

      {/* Risk Overview */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Risk Assessment</h3>
          <div className="flex items-center space-x-2">
            {getUrgencyIcon(evidenceKit.incident_classification.urgency)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(evidenceKit.incident_classification.severity_level)}`}>
              {evidenceKit.incident_classification.severity_level.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Overall Score</p>
            <p className="font-semibold text-lg">{evidenceKit.overall_risk_score}/100</p>
          </div>
          <div>
            <p className="text-gray-600">Confidence</p>
            <p className="font-semibold text-lg">{Math.round(evidenceKit.confidence_level * 100)}%</p>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <p className="font-semibold capitalize">{evidenceKit.incident_classification.primary_category}</p>
          </div>
          <div>
            <p className="text-gray-600">Action Required</p>
            <p className={`font-semibold ${evidenceKit.incident_classification.requires_immediate_action ? 'text-red-600' : 'text-green-600'}`}>
              {evidenceKit.incident_classification.requires_immediate_action ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
        <p className="text-gray-700 leading-relaxed">{evidenceKit.executive_summary}</p>
      </div>

      {/* Collapsible Sections */}
      
      {/* Audio Analysis */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('audio')}
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold">Audio Analysis</h3>
          {expandedSections.audio ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.audio && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium">{evidenceKit.audio_analysis.duration_seconds}s</p>
              </div>
              <div>
                <p className="text-gray-600">Speech Detected</p>
                <p className="font-medium">{evidenceKit.audio_analysis.speech_detected ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Quality</p>
                <p className="font-medium capitalize">{evidenceKit.audio_analysis.processing_quality}</p>
              </div>
              <div>
                <p className="text-gray-600">Transcript Length</p>
                <p className="font-medium">{evidenceKit.audio_analysis.transcript_length} chars</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Full Transcript:</p>
              <div className="bg-gray-100 p-3 rounded border italic">
                "{evidenceKit.evidence_details.full_transcript}"
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('analysis')}
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold">Detailed Analysis</h3>
          {expandedSections.analysis ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.analysis && (
          <div className="px-4 pb-4 space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Conversation Tone</h4>
              <p className="text-gray-700 text-sm">{evidenceKit.detailed_analysis.conversation_tone}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Power Dynamics</h4>
              <p className="text-gray-700 text-sm">{evidenceKit.detailed_analysis.power_dynamics}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Escalation Pattern</h4>
              <p className="text-gray-700 text-sm">{evidenceKit.detailed_analysis.escalation_pattern}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Safety Concerns</h4>
                <ul className="text-sm space-y-1">
                  {evidenceKit.detailed_analysis.safety_concerns.map((concern, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span className="text-gray-700">{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Protective Factors</h4>
                <ul className="text-sm space-y-1">
                  {evidenceKit.detailed_analysis.protective_factors.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-[#00AA13] mt-0.5">•</span>
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Actions */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('actions')}
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold">Recommended Actions</h3>
          {expandedSections.actions ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.actions && (
          <div className="px-4 pb-4">
            <ol className="space-y-3">
              {evidenceKit.recommended_actions.map((action, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-[#00AA13] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 text-sm">{action}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Ride Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Ride Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Incident ID</p>
            <p className="font-medium break-all">{evidenceKit.ride_details.incident_id}</p>
          </div>
          <div>
            <p className="text-gray-600">Audio File</p>
            <p className="font-medium">{evidenceKit.ride_details.audio_filename}</p>
          </div>
          <div>
            <p className="text-gray-600">File Size</p>
            <p className="font-medium">{Math.round(evidenceKit.ride_details.file_size_bytes / 1024)} KB</p>
          </div>
          <div>
            <p className="text-gray-600">Context</p>
            <p className="font-medium text-xs">{evidenceKit.ride_details.additional_context}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
