"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { LuPencil } from "react-icons/lu";
import { FaCheck, FaFileAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { EvidenceKit } from "@/types/assessment";

export default function VerifyTruePage() {
  return <FlowControl />;
}

function FlowControl() {
  const [step, setStep] = useState<
    "issue-confirm" | "creating-issue" | "issue-created"
  >("issue-confirm");
  const [evidenceKit, setEvidenceKit] = useState<EvidenceKit | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for evidence kit data from sessionStorage
    const storedEvidenceKit = sessionStorage.getItem('evidenceKit');
    if (storedEvidenceKit) {
      try {
        const parsedEvidenceKit = JSON.parse(storedEvidenceKit);
        setEvidenceKit(parsedEvidenceKit);
      } catch (error) {
        console.error('Error parsing evidence kit from sessionStorage:', error);
      }
    }
  }, []);

  const handleIssueConfirmationResponse = (needsShelter: boolean) => {
    if (needsShelter) {
      setStep("creating-issue");
      setTimeout(() => setStep("issue-created"), 3000);
    } else {
      // User says they're okay - clear evidence kit data and return to recording
      sessionStorage.removeItem('evidenceKit');
      router.push("/record-audio");
    }
  };

  const handleViewEvidenceKit = () => {
    if (evidenceKit) {
      // Use encodeURIComponent to safely encode Unicode characters
      const encodedData = encodeURIComponent(JSON.stringify(evidenceKit));
      router.push(`/evidence-kit?data=${encodedData}`);
    }
  };

  return (
    <>
      {step === "issue-confirm" && (
        <IssueConfirmation 
          onRespond={handleIssueConfirmationResponse} 
          evidenceKit={evidenceKit}
          onViewEvidenceKit={handleViewEvidenceKit}
        />
      )}
      {step === "creating-issue" && <CreatingIssue />}
      {step === "issue-created" && <IssueCreated evidenceKit={evidenceKit} onViewEvidenceKit={handleViewEvidenceKit} />}
    </>
  );
}

interface IssueConfirmationProps {
  onRespond: (needsShelter: boolean) => void;
  evidenceKit: EvidenceKit | null;
  onViewEvidenceKit: () => void;
}

function IssueConfirmation({ onRespond, evidenceKit, onViewEvidenceKit }: IssueConfirmationProps) {
  // Get risk level from evidence kit or fallback to default
  const riskLevel = evidenceKit?.incident_classification?.severity_level || 'Medium';
  const riskColor = riskLevel === 'High' ? 'text-red-500' : 
                   riskLevel === 'Medium' ? 'text-orange-500' : 'text-yellow-500';

  return (
    <div className="flex min-h-screen items-end bg-[url('/goshield/map.png')] bg-cover bg-no-repeat">
      <div className="flex w-full flex-col gap-4 bg-gradient-to-b from-transparent to-white px-[5%] py-16 text-center">
        <h1 className="text-2xl font-bold">
          Based on our risk assessment, we found that your risk is at{" "}
          <span className={riskColor}>{riskLevel}</span>
        </h1>
        <p>{"Do you want to raise an issue to our system?"}</p>

        {evidenceKit && (
          <div className="mt-4">
            <button
              onClick={onViewEvidenceKit}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FaFileAlt />
              View Detailed Evidence Kit
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button
            className="rounded-lg bg-slate-300 px-6 py-3 text-white"
            onClick={() => onRespond(false)}
          >
            {"I'm Okay"}
          </button>
          <button
            className="rounded-lg bg-[#00AA13] px-6 py-3 text-white"
            onClick={() => onRespond(true)}
          >
            Yes, please
          </button>
        </div>
      </div>
    </div>
  );
}

function CreatingIssue() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#00AA13]/10">
      <div className="relative mt-4 flex aspect-square w-80 items-center justify-center self-center overflow-hidden rounded-full bg-[#00AA13]/50 shadow-2xl shadow-[#00AA13]">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-[#00AA13]/30 shadow-lg shadow-[#00AA13]">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-[#00AA13]/60 shadow-lg shadow-[#00AA13]">
            <LuPencil className="text-4xl text-white" />
          </div>
        </div>
        {/* Circles for animation */}
        <div className="flex items-center justify-center">
          <div className="animate-expand absolute inset-0 aspect-square rounded-full border-4 border-[#00AA13] opacity-75"></div>
          <div className="animate-expand animation-delay-1 absolute inset-0 aspect-square rounded-full border-4 border-[#00AA13] opacity-75"></div>
          <div className="animate-expand animation-delay-2 absolute inset-0 aspect-square rounded-full border-4 border-[#00AA13] opacity-75"></div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">
          Creating Issue...
        </h1>
      </div>
    </div>
  );
}

interface IssueCreatedProps {
  evidenceKit: EvidenceKit | null;
  onViewEvidenceKit: () => void;
}

function IssueCreated({ evidenceKit, onViewEvidenceKit }: IssueCreatedProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/issue-created/post-care");
  };

  // Use evidence kit data if available, otherwise use dummy data
  const reportDetail = evidenceKit ? {
    title: evidenceKit.incident_classification.primary_category || "Emergency Issue Report",
    status: "In Review" as const,
    whatHappened: evidenceKit.executive_summary || "Based on the audio recording analysis, we detected potential danger.",
    location: evidenceKit.ride_details.additional_context || "Location from ride details",
    date: new Date(evidenceKit.processing_timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: new Date(evidenceKit.processing_timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    witness: "There were some people nearby who might have witnessed the situation.",
    reportStatus: "Currently being processed by emergency response team",
  } : {
    title: "Emergency Issue Report",
    status: "In Review" as const,
    whatHappened:
      "Based on the audio recording analysis, we detected potential danger through keywords such as 'help', 'emergency', and distress signals in your voice. The system identified threatening language and unusual vocal patterns that indicated an unsafe situation. You confirmed this emergency alert, triggering our immediate response protocol.",
    location: "Jalan Haji Naim, Blok B No. 31, Jakarta Selatan",
    date: "Friday, 4 July 2024",
    time: "02:00 PM",
    witness:
      "There were some people nearby who might have witnessed the situation.",
    reportStatus: "Currently being processed by emergency response team",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#00AA13]/10 px-[5%] py-16">
      {/* Check icon and title side by side */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00AA13]">
          <FaCheck className="text-lg text-white" />
        </div>
        <h1 className="text-center text-2xl font-semibold">Issue Created</h1>
      </div>

      {/* Detailed Report card */}
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[#00AA13] bg-white p-4 shadow-md">
          <div className="mb-2 flex flex-col">
            <h2 className="text-lg font-semibold">{reportDetail.title}</h2>
            <span
              className={`mt-2 w-1/3 p-1 text-center text-xs font-medium ${reportDetail.status === "In Review" ? "rounded-3xl bg-error text-white" : "rounded-3xl bg-[#00AA13] text-white"}`}
            >
              {reportDetail.status}
            </span>
          </div>
          <div className="mt-6 flex flex-col space-y-4">
            <div className="flex flex-col">
              <p className="mb-2 text-sm font-bold">What Happened</p>
              <p className="mb-2 text-sm">{reportDetail.whatHappened}</p>
            </div>

            <div className="flex flex-col">
              <p className="mb-2 text-sm font-bold">Location</p>
              <p className="mb-2 text-sm">{reportDetail.location}</p>
            </div>

            <div className="flex flex-col">
              <p className="mb-2 text-sm font-bold">
                Date and Time of Incident
              </p>
              <p className="mb-2 text-sm text-gray-500">
                {reportDetail.date}, at {reportDetail.time}
              </p>
            </div>
          </div>

          {/* Evidence Kit button if available */}
          {evidenceKit && (
            <div className="mt-4 border-t pt-4">
              <button
                onClick={onViewEvidenceKit}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <FaFileAlt />
                View Evidence Kit Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="mt-8">
        <button
          onClick={handleRedirect}
          className="rounded-lg bg-[#00AA13] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#00AA13]/90"
        >
          See Gojek Post Incident Care
        </button>
      </div>
    </div>
  );
}
