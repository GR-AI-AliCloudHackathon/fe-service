import Image from "next/image";

export default function PostCarePage() {
  return (
    <div className="flex min-h-screen flex-col gap-7 bg-[#007808] px-6 py-[84px] text-white">
      <h1 className="text-3xl font-bold">We're sorry that happened to you.</h1>
      <p className="font-light">
        You deserve to feel safe during and after every ride. With 
        <span className="font-semibold">GoShield</span>, your support system
        when you face any safety concerns during our rides.
      </p>

      <div className="flex flex-col gap-2">
        <p className="font-bold">Our Post-Incident Care includes :</p>
        <div className="flex flex-col gap-4 text-black">
          <div className="flex w-fit rounded-full bg-white p-2">
            <p>🎧 Instant Access ride audio & visual logs</p>
          </div>

          <div className="flex w-fit rounded-full bg-white p-2">
            <p>🤝 Report easily, without retraumatization</p>
          </div>

          <div className="flex w-fit rounded-full bg-white p-2">
            <p>🛡️ Get help filing claims & accessing care</p>
          </div>
        </div>
      </div>

      <p className="font-light">
        We believe safety doesn’t stop when the ride ends. GoShield is our
        promise that your voice matters and we’re here for you.
      </p>

      <Image
        src="/goshield/sorry.png"
        alt="Post Care Image"
        width={500}
        height={300}
        className="absolute bottom-0 right-0 h-[300px] w-[350px] rounded-lg object-cover md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px]"
      />
    </div>
  );
}
