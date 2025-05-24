"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { GrLocation } from "react-icons/gr";

export default function VerifyTruePage() {
  return <FlowControl />;
}

function FlowControl() {
  const [step, setStep] = useState<
    "sorry" | "needShelter" | "lookingForShelter" | "foundShelter"
  >("sorry");
  const router = useRouter();

  useEffect(() => {
    if (step === "sorry") {
      setTimeout(() => setStep("needShelter"), 3000);
    }
  }, [step]);

  const handleNeedShelterResponse = (needsShelter: boolean) => {
    if (needsShelter) {
      setStep("lookingForShelter");
      setTimeout(() => setStep("foundShelter"), 3000);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      {step === "sorry" && <Sorry />}
      {step === "needShelter" && (
        <NeedShelter onRespond={handleNeedShelterResponse} />
      )}
      {step === "lookingForShelter" && <LookingForShelter />}
      {step === "foundShelter" && <FoundShelter />}
    </>
  );
}

function Sorry() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ijo-muda/10 px-[5%]">
      <div className="mt-4 flex aspect-square w-80 items-center justify-center self-center rounded-full bg-ijo-muda/40 shadow-md">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-ijo-muda/30 shadow-lg shadow-ijo-muda">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-white shadow-lg shadow-ijo-muda">
            <Image src="/sad.svg" alt="Logo" width={100} height={100} />
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">
          {"We’re sorry that happened :("}
        </h1>
        <p className="text-center">IRIS will be here with you soon</p>
      </div>
    </div>
  );
}

interface NeedShelterProps {
  onRespond: (needsShelter: boolean) => void;
}

function NeedShelter({ onRespond }: NeedShelterProps) {
  return (
    <div className="flex min-h-screen items-end bg-[url('/map.svg')] bg-cover bg-no-repeat">
      <div className="flex w-full flex-col gap-4 bg-gradient-to-b from-transparent to-white px-[5%] py-16 text-center">
        <h1 className="text-2xl font-bold">Do you need a shelter?</h1>
        <p>
          {
            "If you don’t feel safe, we can help you look for your nearest safe place."
          }
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            className="rounded-lg bg-slate-300 px-6 py-3 text-white"
            onClick={() => onRespond(false)}
          >
            {"I'm Okay"}
          </button>
          <button
            className="rounded-lg bg-primary px-6 py-3 text-white"
            onClick={() => onRespond(true)}
          >
            Yes, please
          </button>
        </div>
      </div>
    </div>
  );
}

function LookingForShelter() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-biru/10">
      <div className="relative mt-4 flex aspect-square w-80 items-center justify-center self-center overflow-hidden rounded-full bg-biru/50 shadow-2xl shadow-biru">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-biru/30 shadow-lg shadow-biru">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-biru/60 shadow-lg shadow-biru">
            <GrLocation className="text-6xl text-white" />
          </div>
        </div>
        {/* Circles for animation */}
        <div className="flex items-center justify-center">
          <div className="animate-expand absolute inset-0 aspect-square rounded-full border-4 border-biru opacity-75"></div>
          <div className="animate-expand animation-delay-1 absolute inset-0 aspect-square rounded-full border-4 border-biru opacity-75"></div>
          <div className="animate-expand animation-delay-2 absolute inset-0 aspect-square rounded-full border-4 border-biru opacity-75"></div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">
          Looking around you
        </h1>
      </div>
    </div>
  );
}

function FoundShelter() {
  return (
    <div className="flex min-h-screen items-end bg-[url('/pinned-map.svg')] bg-cover bg-no-repeat">
      <div className="flex w-full flex-col gap-4 bg-white px-[5%] py-8">
        <hr className="h-2 w-1/3 self-center rounded-lg bg-slate-200" />
        <h1 className="text-2xl font-bold">Nearest Shelter</h1>
        <div className="flex gap-4 rounded-xl border-2 border-secondary bg-gradient-to-l from-transparent to-secondary/20 p-4">
          <CgProfile className="black text-6xl" />
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Auvarifqi</p>
            <p className="text-slate-500">21 y.o., Male</p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border-2 border-secondary bg-white p-4">
          <CgProfile className="black text-6xl" />
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Auvarifqi</p>
            <p className="text-slate-500">21 y.o., Male</p>
          </div>
        </div>

        <button className="w-full rounded-lg bg-secondary py-4 text-white">
          Seek Shelter Now
        </button>
      </div>
    </div>
  );
}
