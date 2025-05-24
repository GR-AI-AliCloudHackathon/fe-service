"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosLock } from "react-icons/io";
import toast from "react-hot-toast";

export default function VerifyTruePage() {
  const router = useRouter();

  useEffect(() => {
    // Show toast after 5 seconds
    const toastTimeout = setTimeout(() => {
      toast.success("Stay alert, help is on the way!");
    }, 5000);

    // Redirect after 8 seconds
    const redirectTimeout = setTimeout(() => {
      router.push("/verify/false/safe");
    }, 8000);

    // Cleanup function to clear timeouts if the component unmounts
    return () => {
      clearTimeout(toastTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-merah/10">
      <div className="relative mt-4 flex aspect-square w-80 items-center justify-center self-center overflow-hidden rounded-full bg-merah/50 shadow-2xl shadow-merah">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-merah/30 shadow-lg shadow-merah">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-merah/60 shadow-lg shadow-merah">
            <IoIosLock className="text-6xl text-white" />
          </div>
        </div>
        {/* Circles for animation */}
        <div className="flex items-center justify-center">
          <div className="animate-expand absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
          <div className="animate-expand animation-delay-1 absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
          <div className="animate-expand animation-delay-2 absolute inset-0 aspect-square rounded-full border-4 border-merah opacity-75"></div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">Danger Detected</h1>
        <p className="text-center">{"We'll be here until you're safe"}</p>
      </div>
    </div>
  );
}
