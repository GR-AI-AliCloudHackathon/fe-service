"use client";

import { useState } from "react";

export default function Home() {
  const [batteryPercentage, setBatteryPercentage] = useState(80); // Replace with your dynamic value
  const [isSavingMode, setIsSavingMode] = useState(false);

  const getBatteryColor = (percentage: number) => {
    if (percentage >= 75) return "#4caf50"; // Green for 75% and above
    if (percentage >= 50) return "#ffeb3b"; // Yellow for 50% and above
    if (percentage >= 25) return "#ff9800"; // Orange for 25% and above
    return "#f44336"; // Red for below 25%
  };

  const handleToggle = () => {
    setIsSavingMode(!isSavingMode);
  };

  return (
    <div className="w-full">
      <div className="flex gap-5">
        <div className="flex w-1/2 flex-col gap-6 rounded-lg bg-white p-4 shadow-lg">
          <p className="font-semibold">Battery</p>

          <div className="relative h-56 rounded-2xl bg-gray-100">
            <div
              className="bg-battery absolute bottom-0 flex w-full items-center justify-center rounded-2xl font-semibold text-white"
              style={{
                height: `${batteryPercentage}%`,
                backgroundColor: getBatteryColor(batteryPercentage),
              }}
            >
              <p className="text-4xl">{batteryPercentage}%</p>
            </div>
          </div>

          <div className="flex gap-4">
            <p className="text-sm font-semibold">Saving mode</p>

            <label className="inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" className="peer sr-only" />
              <div className="peer-checked:bg-primary peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
            </label>
          </div>
        </div>
        <div className="flex w-1/2 flex-col justify-between">
          <div className="flex flex-col gap-3 rounded-lg bg-white p-4 font-semibold shadow-lg">
            <p>🩷 Heart Rate</p>
            <p className="font-semibold">
              <span className="text-4xl">32</span> bpm
            </p>

            <p className="text-primary">Normal</p>
          </div>
          <div className="flex flex-col gap-3 rounded-lg bg-white p-4 font-semibold shadow-lg">
            <p>📈 Repository</p>
            <p className="font-semibold">
              <span className="text-4xl">32</span> bpm
            </p>

            <p className="text-primary">Normal</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <button className="bg-secondary w-full rounded-lg py-4 text-center font-semibold text-white">
          Emergency Alert
        </button>
        <button className="w-full rounded-lg bg-[#E2E0E1] py-4 text-center font-semibold text-white">
          Privacy
        </button>
      </div>
    </div>
  );
}
