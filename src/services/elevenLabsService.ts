/**
 * ElevenLabs & Web Speech AI Telephony Voice Service for Docket
 * Provides real-time audio playback for supplier calls and voice wire verification.
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

// Default high-clarity professional voices
// '21m00Tcm4TlvDq8ikWAM' = Rachel (Clean professional agent)
// 'ErXwobaYiN019PkySvjV' = Antoni (Verified technical supplier rep)
export const DEFAULT_AGENT_VOICE = '21m00Tcm4TlvDq8ikWAM';
export const DEFAULT_VENDOR_VOICE = 'ErXwobaYiN019PkySvjV';

let currentAudio: HTMLAudioElement | null = null;

/**
 * Speaks text using ElevenLabs TTS if API key is provided, or Web Speech API fallback.
 */
export async function playSpeech(text: string, voiceId: string = DEFAULT_VENDOR_VOICE): Promise<void> {
  // Stop any currently playing audio
  stopSpeech();

  // Try ElevenLabs if an API key is available
  if (ELEVENLABS_API_KEY && ELEVENLABS_API_KEY.trim() !== '') {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY.trim()
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.8
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        currentAudio = new Audio(audioUrl);
        await currentAudio.play();
        return;
      } else {
        console.warn('ElevenLabs API response status:', response.status, await response.text());
      }
    } catch (err) {
      console.warn('ElevenLabs synthesis error, falling back to Web Speech API:', err);
    }
  }

  // Graceful browser fallback via native SpeechSynthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Pick standard English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Halts any ongoing voice playback
 */
export function stopSpeech(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
