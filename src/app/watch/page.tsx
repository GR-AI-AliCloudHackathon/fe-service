import Image from "next/image";
import Link from "next/link";
import Home from "./Home";

export default function Page() {
  return (
    <div className="min-h-screen bg-[url('/home-left.svg')] bg-no-repeat">
      <div className="flex min-h-screen flex-col items-start gap-12 bg-[url('/home-right.svg')] bg-right-bottom bg-no-repeat px-[10%] py-16">
        <Link href="/" className="bg-primary rounded-lg p-2 px-4 text-white">
          Back
        </Link>
        <h1 className="w-full text-center text-3xl font-semibold">My Band</h1>

        <Image
          src={"/band.svg"}
          alt="My Band"
          width={156}
          height={160}
          className="self-center rounded-lg"
        />

        <Home />
      </div>
    </div>
  );
}
