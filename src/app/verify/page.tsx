import VerifyInput from "./VerifyInput";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/home-left.svg')] bg-left-top bg-no-repeat">
      <div className="w-full px-[10%]">
        <div className="gap-2">
          <h1 className="text-4xl font-semibold">Hold on..</h1>
          <p>{"We're making sure it's really you"}</p>
        </div>

        <VerifyInput />
      </div>
    </div>
  );
}
