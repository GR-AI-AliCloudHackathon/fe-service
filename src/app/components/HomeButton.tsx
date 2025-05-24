"use client";
import { MdMoreHoriz, MdHistory } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SafeProps {
  setSafe: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home() {
  const [safe, setSafe] = useState(true);

  return safe ? <Safe setSafe={setSafe} /> : <Danger setSafe={setSafe} />;
}

function Danger({ setSafe }: SafeProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/verify");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ijo-muda/50">
      <div
        onClick={() => setSafe(true)}
        className="relative mt-4 flex aspect-square w-80 items-center justify-center self-center overflow-hidden rounded-full bg-white shadow-2xl shadow-ijo-muda"
      >
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-white shadow-lg shadow-ijo-muda">
          <div className="flex aspect-square w-48 cursor-pointer items-center justify-center self-center rounded-full bg-white shadow-lg shadow-ijo-muda">
            <p>
              <strong>Stay Safe</strong>
            </p>
          </div>
        </div>
        {/* Circles for animation */}
        <div className="flex items-center justify-center">
          <div className="animate-expand absolute inset-0 aspect-square rounded-full border-4 border-ijo-muda opacity-75"></div>
          <div className="animate-expand animation-delay-1 absolute inset-0 aspect-square rounded-full border-4 border-ijo-muda opacity-75"></div>
          <div className="animate-expand animation-delay-2 absolute inset-0 aspect-square rounded-full border-4 border-ijo-muda opacity-75"></div>
        </div>
      </div>
    </div>
  );
}

function Safe({ setSafe }: SafeProps) {
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-[url('/start-left.svg')] bg-no-repeat px-[10%] py-16">
      <div className="flex justify-between">
        <Link
          href={"/report-history"}
          className="w-fit rounded-full border border-biru bg-white p-3 shadow-md"
        >
          <MdMoreHoriz className="text-2xl" />
        </Link>
        <Link
          href={"/login"}
          className="w-fit rounded-full border border-biru bg-white p-3 shadow-md"
        >
          <CgProfile className="text-2xl" />
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="flex w-fit gap-4 rounded-full border border-biru bg-white p-3 shadow-md">
          <CiSettings className="text-2xl" />
          <p>Settings</p>
        </div>
        <Link
          href={"/watch"}
          className="w-fit rounded-full border border-biru bg-white p-3 shadow-md"
        >
          <Image
            src={"/band-outline.svg"}
            alt="My Band"
            width={28}
            height={25}
          />
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="flex w-fit gap-4 rounded-full border border-biru bg-white p-3 shadow-md">
          <MdHistory className="text-2xl" />
          <p>History</p>
        </div>
      </div>

      {/* Button Section */}
      <div
        onClick={() => setSafe(false)}
        className="flex aspect-square w-80 items-center justify-center self-center rounded-full bg-white shadow-md"
      >
        <div className="flex aspect-square w-48 cursor-pointer items-center justify-center self-center rounded-full bg-white shadow-lg shadow-biru">
          <p>
            Hold to <strong>Start</strong>
          </p>
        </div>
      </div>

      {/* Foot Section */}
      <div className="flex items-center justify-end gap-2">
        <div className="w-fit rounded-lg border border-secondary px-4 py-2 shadow-sm shadow-secondary">
          <p>
            Hi, <strong>Gibeh</strong> 👋
          </p>
        </div>

        <Image src={"/chat-button.svg"} width={60} height={60} alt="chat-bot" />
      </div>
    </div>
  );
}
