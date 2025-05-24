"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const data = {
      email,
      password,
    };
    console.log(data);
    toast.success("Login successful");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[url('/home-left.svg')] bg-left-top bg-no-repeat">
      <div className="flex min-h-screen flex-col items-center justify-center gap-16 bg-[url('/tompel-biru.svg')] bg-right-bottom bg-no-repeat px-[10%]">
        <div className="flex flex-col text-center">
          <h1 className="text-2xl font-semibold">Log in to your account</h1>
          <p className="text-slate-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 self-start lg:w-1/3 lg:self-center">
          <label className="flex flex-col gap-1">
            <span>Email</span>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="rounded-lg border border-slate-200 p-2 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Password</span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="rounded-lg border border-slate-200 p-2 focus:outline-none"
            />
          </label>
        </div>
        <div className="flex w-full flex-col gap-4 self-start lg:w-1/3 lg:self-center">
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-primary py-2 text-white"
          >
            Sign in
          </button>

          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-4 rounded-lg border border-slate-200 bg-white py-2 text-black"
          >
            <Image src="/logo-google.svg" alt="Google" width={24} height={24} />
            <p>Sign In with Google</p>
          </button>
        </div>

        <p>
          {"Don't have an account?"}{" "}
          <Link href={"/register"} className="font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
