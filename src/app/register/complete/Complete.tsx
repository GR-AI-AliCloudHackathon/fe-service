"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Complete() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-no-repeat">
      <div className="flex min-h-screen flex-col justify-center gap-12 bg-[url('/register-bawah.svg')] bg-right-bottom bg-no-repeat px-[10%]">
        <div className="flex justify-center gap-4">
          <hr
            className={`h-1 w-20 ${step >= 1 ? "bg-secondary" : "bg-slate-200"}`}
          ></hr>
          <hr
            className={`h-1 w-20 ${step >= 2 ? "bg-secondary" : "bg-slate-200"}`}
          ></hr>
          <hr
            className={`h-1 w-20 ${step >= 3 ? "bg-secondary" : "bg-slate-200"}`}
          ></hr>
          <hr
            className={`h-1 w-20 ${step >= 4 ? "bg-secondary" : "bg-slate-200"}`}
          ></hr>
        </div>
        {step === 1 && <FirstStep setStep={setStep} />}
        {step === 2 && <SecondStep setStep={setStep} />}
        {step === 3 && <ThirdStep setStep={setStep} />}
        {step === 4 && <FourthStep />}
      </div>
    </div>
  );
}

interface StepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

function FirstStep({ setStep }: StepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  const handleRegister = () => {
    const data = {
      firstName,
      lastName,
      dob,
      address,
      gender,
    };

    toast.success("Tell us your emergency contact");
    console.log(data);
    setStep(2);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold">Create Account</h1>
        <p className="text-center text-slate-400">
          To proceed using your account, fill these information
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:w-1/2 lg:self-center">
        <div className="flex flex-col gap-2">
          <label className="text-slate-400">First Name</label>
          <input
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="Enter First Name"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Last Name</label>
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Date of Birth</label>
          <input
            onChange={(e) => setDob(e.target.value)}
            type="date"
            placeholder="Enter password"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Address</label>
          <input
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Enter Address"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Gender</label>
          <div className="rounded-lg border border-slate-200 p-2">
            <select
              className="w-full bg-transparent"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleRegister}
        className="rounded-lg bg-secondary py-4 text-white lg:w-1/2 lg:self-center"
      >
        Verify Email
      </button>
    </>
  );
}

function SecondStep({ setStep }: StepProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [gender, setGender] = useState("");

  const handleRegister = () => {
    const data = {
      firstName,
      lastName,
      relationship,
      gender,
    };

    toast.success("Next Step!");
    console.log(data);
    setStep(3);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold">Safety Measures</h1>
        <p className="text-center text-slate-400">
          Please give us your emergency contacts. P.S. Only fill them with ones
          you can trust
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:w-1/2 lg:self-center">
        <div className="flex flex-col gap-2">
          <label className="text-slate-400">First Name</label>
          <input
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="Enter First Name"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Last Name</label>
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Relationship</label>
          <input
            onChange={(e) => setRelationship(e.target.value)}
            type="text"
            placeholder="Enter Relationship"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Gender</label>
          <div className="rounded-lg border border-slate-200 p-2">
            <select
              className="w-full bg-transparent"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleRegister}
        className="rounded-lg bg-secondary py-4 text-white lg:w-1/2 lg:self-center"
      >
        Submit
      </button>
    </>
  );
}

function ThirdStep({ setStep }: StepProps) {
  const [willing, setWilling] = useState("");
  const [verifID, setVerifID] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = () => {
    const data = {
      willing,
      verifID,
      address,
    };

    toast.success("All Done!");
    console.log(data);
    setStep(4);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold">Volunteer</h1>
        <p className="text-center text-slate-400">
          We need you as a volunteer to help others in need. But please
          prioritize yourself first.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:w-1/2 lg:self-center">
        <div className="flex flex-col gap-2">
          <label className="text-slate-400">
            Are you willing to become a volunteer to provide shelter for those
            in need?{" "}
          </label>
          <div className="rounded-lg border border-slate-200 p-2">
            <select
              className="w-full"
              onChange={(e) => setWilling(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400">ID Verification</label>
          <input
            type="file"
            onChange={(e) => setVerifID(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-400">Address Details</label>
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Address Details"
            className="w-full rounded-lg border border-slate-200 p-2"
          />
        </div>
      </div>

      <button
        onClick={handleRegister}
        className="rounded-lg bg-secondary py-4 text-white lg:w-1/2 lg:self-center"
      >
        Create Account
      </button>
    </>
  );
}

function FourthStep() {
  const router = useRouter();
  useEffect(() => {
    toast.success("You’re all set!");
    router.push("/");
  }, []);
  return (
    <>
      <div className="mt-4 flex aspect-square w-80 items-center justify-center self-center rounded-full bg-ijo-muda/40 shadow-md">
        <div className="flex aspect-square w-64 items-center justify-center self-center rounded-full bg-ijo-muda/30 shadow-lg shadow-ijo-muda">
          <div className="flex aspect-square w-48 items-center justify-center self-center rounded-full bg-white shadow-lg shadow-ijo-muda">
            <Image
              src="/smile-register.svg"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">
          {"You’re all set!"}
        </h1>
        <p className="text-center text-slate-400">
          {
            "With IRIS, you’ll get a high level of safety and lots of other advantages. We’re glad you’re joining us in this journey<3"
          }
        </p>
      </div>
    </>
  );
}
