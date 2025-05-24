"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ReportDetail {
  id: number;
  title: string;
  status: "In Review" | "Accepted";
  whatHappened: string;
  location: string;
  date: string;
  time: string;
  witness: string;
  reportStatus: string;
}

const reportDetail: ReportDetail = {
  id: 1,
  title: "Sexual Harassment at the Workplace",
  status: "In Review",
  whatHappened:
    "On July 4, 2024, I experienced sexual harassment at the workplace. The incident occurred around 2:00 PM in the shared office space. The perpetrator, a colleague, engaged in inappropriate behavior by touching my body without consent and making obscene comments.",
  location: "Jalan Haji Naim, Blok B No. 31, Jakarta Selatan",
  date: "Friday, 4 July 2024",
  time: "02:00 PM",
  witness:
    "There were no direct witnesses, but some colleagues were nearby and might have heard the conversation.",
  reportStatus: "Currently under investigation",
};

const ReportDetailPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[url('/tompel-ijo-v2.svg')] bg-right-bottom bg-no-repeat px-[10%] py-16">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center">
          <Link href="/report-history">
            <Image src="/back-button.svg" alt="Back" width={36} height={36} />
          </Link>
          <h1 className="ml-4 w-4/5 text-center text-2xl font-semibold">
            Report History
          </h1>
        </div>
        <div className="rounded-3xl border border-primary bg-white p-4 shadow-md">
          <div className="mb-2 flex flex-col">
            <h2 className="text-lg font-semibold">{reportDetail.title}</h2>
            <span
              className={`mt-2 w-1/3 p-1 text-center text-xs font-medium ${reportDetail.status === "In Review" ? "rounded-3xl bg-error text-white" : "rounded-3xl bg-primary text-white"}`}
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

            <div className="flex flex-col">
              <p className="mb-2 text-sm font-bold">Witness</p>
              <p className="mb-2 text-sm">{reportDetail.witness}</p>
            </div>

            <div className="flex flex-col">
              <p className="mb-2 text-sm font-bold">Report Status</p>
              <p className="mb-2 text-sm">{reportDetail.reportStatus}</p>
            </div>

            <div className="flex flex-row gap-8">
              <div className="flex flex-col">
                <Image
                  src="/voice-recording.svg"
                  alt="Back"
                  width={36}
                  height={36}
                />

                <div className="flex flex-col">
                  <p className="mt-2 text-sm">Voice</p>
                  <p className="text-sm">Recording</p>
                </div>
              </div>

              <div className="flex flex-col">
                <Image
                  src="/image-icon.svg"
                  alt="Back"
                  width={36}
                  height={36}
                />
                <p className="mt-2 text-sm">Image</p>
              </div>
            </div>
            <Link href="/report-history/report-detail/evidence">
            <p className="mt-2 pb-8 text-sm font-bold text-primary">
              See More →
            </p>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-row items-center justify-center gap-4 rounded-xl bg-primary p-4 shadow-md">
          <Image src="/download-button.svg" alt="Back" width={18} height={18} />
          <p className="text-lg font-normal text-white">
            Download Full Report
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
