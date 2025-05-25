/**
 * Convert AudioBuffer to WAV format
 * This is a simplified implementation, you might want to use a library like audiobuffer-to-wav
 */
export function toWav(audioBuffer: AudioBuffer): ArrayBuffer {
  // Get audio data
  const numOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;
  const channels: Float32Array[] = [];
  
  for (let i = 0; i < numOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  // Validate channels
  if (channels.length === 0) {
    throw new Error('No audio channels found');
  }

  // Interleave channels
  const interleaved = interleave(channels);
  
  // Create WAV file
  const buffer = new ArrayBuffer(44 + interleaved.length * 2);
  const view = new DataView(buffer);
  
  // WAV header
  // RIFF chunk identifier
  writeString(view, 0, 'RIFF');
  // File length minus RIFF identifier length and file description length
  view.setUint32(4, 36 + interleaved.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (raw)
  view.setUint16(20, 1, true);
  // Channel count
  view.setUint16(22, numOfChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 4, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, numOfChannels * 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, interleaved.length * 2, true);

  // Write the PCM samples
  let offset = 44;
  for (let i = 0; i < interleaved.length; i++, offset += 2) {
    const sampleValue = interleaved[i];
    const sample = Math.max(-1, Math.min(1, sampleValue ?? 0));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }

  return buffer;
}

function interleave(channels: Float32Array[]): Float32Array {
  const numOfChannels = channels.length;
  
  if (numOfChannels === 0) {
    return new Float32Array(0);
  }
  
  const firstChannel = channels[0];
  if (!firstChannel) {
    return new Float32Array(0);
  }
  
  const length = firstChannel.length;
  const result = new Float32Array(length * numOfChannels);
  
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      const channelData = channels[channel];
      if (channelData && i < channelData.length) {
        const sampleValue = channelData[i];
        result[i * numOfChannels + channel] = sampleValue ?? 0;
      } else {
        result[i * numOfChannels + channel] = 0; // Fill with silence if data is missing
      }
    }
  }
  
  return result;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
