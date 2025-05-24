import dynamic from "next/dynamic";

// Dynamically import the AudioRecorder component with SSR disabled
const AudioRecorder = dynamic(() => import("./components/AudioRecorder"), {
  ssr: false,
});

export default function RecordAudioPage() {
  return (
    <div className="min-h-screen bg-merah/10">
      <AudioRecorder />
    </div>
  );
}
