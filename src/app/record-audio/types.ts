// Types for audio recording

export interface AudioRecording {
  audioBlob: Blob;
  timestamp: string;
  recordingNumber: number;
}

export interface FullAudioSession {
  audioBlob: Blob;
  timestamp: string;
  totalDuration: number;
  segmentCount: number;
}

export type RecordingState = 'idle' | 'starting' | 'recording' | 'stopping' | 'error';
