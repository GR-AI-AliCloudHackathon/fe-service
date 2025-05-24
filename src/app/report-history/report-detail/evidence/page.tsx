"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[url('/tompel-ijo-v2.svg')] bg-right-bottom bg-no-repeat px-[10%] py-16">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="mb-4 flex">
          <Link href="/report-history">
            <Image src="/back-button.svg" alt="Back" width={36} height={36} />
          </Link>
          <h1 className="ml-4 w-4/5 text-center text-2xl font-semibold">
            Evidence
          </h1>
        </div>

        <div>
          <div className="gap-2 rounded-3xl border border-primary bg-white p-4 shadow-md flex flex-row justify-between">
            <div className="p-4 flex flex-row items-center gap-4">
              <Image src="/voice-recording.svg" alt="Back" width={56} height={60} />
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-black">
                  Voice Recording
                </p>

                <div className="flex flex-row items-center gap-2">
                  <Image src="/mini-clock.svg" alt="Back" width={14} height={14} />
                  <p className="text-sm font-normal text-slate-600">
                    5 : 30s
                  </p>
                </div>
              </div>
            </div>

            <Image src="/polygon.svg" alt="Back" width={24} height={24} />
          </div>

          <div className="flex justify-center">
            <div className="flex flex-row items-center gap-2 w-4/5 self-center rounded-lg border border-primary bg-white py-4 px-8 shadow-md">
              <Image src="/red-warning.svg" alt="Back" width={22} height={22} />
              <p className="text-xs font-normal text-black">
                Shouting Detected at 0:50
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between mt-2 rounded-3xl border border-primary bg-white py-8 px-8 shadow-md">
          <div className="flex flex-row gap-6 items-center">
            <Image src="/image-icon.svg" alt="Back" width={60} height={60} />
            <p className="text-lg font-semibold text-black">
              Images
            </p>
          </div>

          <Image src="/polygon.svg" alt="Back" width={24} height={24} />
        </div>
      </div>
    </div>
  );
};

export default page;
