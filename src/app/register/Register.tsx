"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    const data = {
      phone,
      email,
      password,
      confirmPassword,
    };

    router.push("/register/complete");
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[url('/register-atas.svg')] bg-no-repeat">
      <div className="flex min-h-screen flex-col justify-center gap-12 bg-[url('/register-bawah.svg')] bg-right-bottom bg-no-repeat px-[10%]">
        <h1 className="text-center text-3xl font-bold">Create Account</h1>

        <div className="flex flex-col gap-3 lg:w-1/2 lg:self-center">
          <div className="flex flex-col gap-2">
            <label className="text-slate-400">Enter your phone number</label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="+234 xxxxx"
              className="w-full border border-slate-200 p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-400">Email Address</label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-slate-200 p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-400">Create Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full border border-slate-200 p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-400">Confirm Password</label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Re-enter password"
              className="w-full border border-slate-200 p-2"
            />
          </div>
        </div>

        <div className="flex gap-4 lg:w-1/2 lg:self-center">
          <input type="checkbox" className="w-4" />
          <label>I agree with Terms of Service and Privacy Policy</label>
        </div>
        <button
          onClick={handleRegister}
          className="rounded-lg bg-secondary py-4 text-white lg:w-1/2 lg:self-center"
        >
          Verify Email
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link href={"/login"} className="font-semibold text-secondary">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
