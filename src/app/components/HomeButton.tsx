"use client";
import { MdHistory } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col justify-between gap-8 bg-[url('/goshield/start-left.png')] bg-no-repeat px-[10%] py-16">
      <div className="flex justify-between">
        <Link
          className="flex w-fit gap-4 rounded-full border border-[#00AA13] bg-white p-3 shadow-md"
          href={"/report-history"}
        >
          <MdHistory className="text-2xl" />
          <p>History</p>
        </Link>
        <Link
          href={"/login"}
          className="w-fit rounded-full border border-[#00AA13] bg-white p-3 shadow-md"
        >
          <CgProfile className="text-2xl" />
        </Link>
      </div>

      {/* Button Section */}
      <div
        onClick={() => router.push("/record-audio")}
        className="flex aspect-square w-80 items-center justify-center self-center rounded-full bg-white shadow-md"
      >
        <div className="flex aspect-square w-48 cursor-pointer items-center justify-center self-center rounded-full bg-white shadow-lg shadow-[#00AA13]">
          <p>
            Activate{" "}
            <strong>
              Go
              <span className="text-[#00AA13]">Shield</span>
            </strong>
          </p>
        </div>
      </div>

      {/* Foot Section */}
      <div className="flex w-full flex-col items-center justify-between gap-4 rounded-lg bg-white px-4 py-4 shadow-md md:flex-row">
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          <p className="text-sm font-bold">
            @Go
            <span className="text-[#00AA13]">Shield</span>
          </p>
          <p className="text-center text-sm">
            Protect your trip with GoShield.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="w-fit rounded-lg border border-[#00AA13] px-4 py-2 shadow-sm shadow-[#00AA13]">
            <p>
              Hi, <strong>Gibeh</strong> 👋
            </p>
          </div>

          <Image
            src={"/goshield/chat-button.png"}
            width={60}
            height={60}
            alt="chat-bot"
          />
        </div>
      </div>
    </div>
  );
}
