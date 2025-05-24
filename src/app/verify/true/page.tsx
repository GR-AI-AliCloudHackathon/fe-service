import Image from "next/image";
import Link from "next/link";

export default function VerifyTruePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ijo-muda/10 px-[5%]">
      <div className="mt-4 flex aspect-square w-80 items-center justify-center self-center rounded-full bg-ijo-muda/40 shadow-md">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-ijo-muda/30 shadow-lg shadow-ijo-muda">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-white shadow-lg shadow-ijo-muda">
            <Image src="/smile.svg" alt="Logo" width={100} height={100} />
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">
          {"Phew, we’re glad you’re safe!"}
        </h1>
        <p className="text-center">
          {"We’re here if you want to talk about what happened."}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-slate-300 px-6 py-3 text-white"
          >
            {"I'm Okay"}
          </Link>
          <button className="rounded-lg bg-primary px-6 py-3 text-white">
            Yes, please
          </button>
        </div>
      </div>
    </div>
  );
}
