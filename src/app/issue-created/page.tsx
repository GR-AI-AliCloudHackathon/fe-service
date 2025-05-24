"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { LuPencil } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";

export default function VerifyTruePage() {
  return <FlowControl />;
}

function FlowControl() {
  const [step, setStep] = useState<
    "issue-confirm" | "creating-issue" | "issue-created"
  >("issue-confirm");
  const router = useRouter();

  const handleIssueConfirmationResponse = (needsShelter: boolean) => {
    if (needsShelter) {
      setStep("creating-issue");
      setTimeout(() => setStep("issue-created"), 3000);
    } else {
      router.push("/record-audio");
    }
  };

  return (
    <>
      {step === "issue-confirm" && (
        <IssueConfirmation onRespond={handleIssueConfirmationResponse} />
      )}
      {step === "creating-issue" && <CreatingIssue />}
      {step === "issue-created" && <IssueCreated />}
    </>
  );
}

interface IssueConfirmationProps {
  onRespond: (needsShelter: boolean) => void;
}

function IssueConfirmation({ onRespond }: IssueConfirmationProps) {
  return (
    <div className="flex min-h-screen items-end bg-[url('/goshield/map.png')] bg-cover bg-no-repeat">
      <div className="flex w-full flex-col gap-4 bg-gradient-to-b from-transparent to-white px-[5%] py-16 text-center">
        <h1 className="text-2xl font-bold">
          Based on our risk assestment, we found that your risk is at{" "}
          <span className="text-red-500">Hi/Medium</span>
        </h1>
        <p>{"Do you want to raise an issue to our system?"}</p>

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

function IssueCreated() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#00AA13]/10">
      <div className="relative mt-4 flex aspect-square w-80 items-center justify-center self-center overflow-hidden rounded-full bg-[#00AA13]/50 shadow-2xl shadow-[#00AA13]">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-[#00AA13]/30 shadow-lg shadow-[#00AA13]">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-[#00AA13]/60 shadow-lg shadow-[#00AA13]">
            <FaCheck className="text-4xl text-white" />
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">Issue Created</h1>
      </div>

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
