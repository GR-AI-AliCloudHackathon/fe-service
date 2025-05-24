"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyInput() {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    if (value.length === 1) {
      if (index < inputRefs.current.length - 1) {
        inputRefs?.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    router.push("/verify/false");
  };

  return (
    <div>
      <div className="mt-6 flex justify-center gap-2 md:gap-20">
        {Array(4)
          .fill("")
          .map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="aspect-square w-16 rounded-lg border border-slate-300 text-center font-bold focus:outline-none"
              onChange={(event) => handleChange(index, event)}
              ref={(element) => {
                if (element) inputRefs.current[index] = element;
              }}
            />
          ))}
      </div>

      <button
        onClick={handleVerify}
        className="mt-6 w-full rounded-lg bg-secondary py-2 text-white"
      >
        Verify
      </button>
    </div>
  );
}
