"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Report {
  id: number;
  date: string;
  title: string;
  location: string;
  time: string;
  status: "In Review" | "Accepted";
}

const reports: Report[] = [
  {
    id: 1,
    date: "Friday, 4 July 2024",
    title: "Sexual Harassment at the Workplace",
    location: "Jalan Haji Naim, Blok B No. 31, Jakarta Selatan",
    time: "02:00 WIB",
    status: "In Review",
  },
  {
    id: 2,
    date: "Thursday, 3 July 2024",
    title: "Domestic Violence",
    location: "Jalan Haji Naim, Blok B No. 31, Jakarta Selatan",
    time: "02:00 WIB",
    status: "Accepted",
  },
  {
    id: 3,
    date: "Wednesday, 2 July 2024",
    title: "Sexual Harassment at the Workplace",
    location: "Jalan Haji Naim, Blok B No. 31, Jakarta Selatan",
    time: "02:30 WIB",
    status: "Accepted",
  },
];

const ReportHistory: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center bg-[url('/tompel-ijo.svg')] bg-no-repeat px-[10%] py-16">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center">
          <Link href="/">
            <Image src="/back-button.svg" alt="Back" width={36} height={36} />
          </Link>
          <h1 className="w-4/5 text-center text-2xl font-semibold">History</h1>
        </div>
        {reports.map((report, index) => (
          <div key={index}>
            <p className="pb-2 pl-2 text-sm text-gray-500">{report.date}</p>
            <div
              className="mb-4 cursor-pointer rounded-3xl border border-primary bg-white p-4 shadow-md"
              onClick={() => router.push(`/report-history/report-detail`)}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-md w-2/3 font-semibold">{report.title}</h2>
                <span
                  className={`w-1/3 p-1 text-center text-xs font-medium ${report.status === "In Review" ? "bg-error rounded-3xl text-white" : "rounded-3xl bg-primary text-white"}`}
                >
                  {report.status}
                </span>
              </div>

              <div className="mt-2 flex flex-row items-center gap-2">
                <Image
                  src="/loc-pin-point.svg"
                  alt="Back"
                  width={14}
                  height={14}
                />
                <p className="text-sm">{report.location}</p>
              </div>

              <div className="mt-2 flex flex-row items-center gap-2">
                <Image
                  src="/mini-clock.svg"
                  alt="Back"
                  width={16}
                  height={16}
                />
                <p className="text-sm">{report.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory;
