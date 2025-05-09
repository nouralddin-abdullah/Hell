// VoiceRecorder.tsx - Fixed layout and cleanup issues
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./style.css";
import AudioPlayer from "../AudioVisualPlayer/AudioPlayer";
import { Disc, Mic, Trash } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onClearRecording?: () => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  visualizerColor?: string;
}

const VoiceRecorder = ({
  onRecordingComplete,
  onClearRecording,
  onRecordingStateChange,
  visualizerColor = "#4a90e2",
}: VoiceRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(0)
  );

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const source = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  // Notify parent component when recording state changes
  useEffect(() => {
    onRecordingStateChange?.(recording);
  }, [recording, onRecordingStateChange]);

  // Cleanup function to properly stop all recording resources
  const cleanupRecordingResources = () => {
    // Cancel any ongoing animation frame
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    // Stop the media recorder if it's recording
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }

    // Disconnect audio source if it exists
    if (source.current) {
      source.current.disconnect();
      source.current = null;
    }

    // Close audio context if it exists
    if (audioContext.current?.state !== "closed") {
      audioContext.current?.close();
      audioContext.current = null;
    }

    // Stop all media tracks
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStream.current = null;
    }

    setRecording(false);
  };

  // Cleanup on component unmount or page navigation
  useEffect(() => {
    return () => {
      cleanupRecordingResources();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      // Clean up any previous recording resources first
      cleanupRecordingResources();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      // Audio analysis setup
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;

      source.current = audioContext.current.createMediaStreamSource(stream);
      source.current.connect(analyser.current);

      // MediaRecorder setup
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete(blob);

        // Stop all media tracks after recording is complete
        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
      };

      mediaRecorder.current.start();
      setRecording(true);

      // Visualization loop
      const updateFrequencyData = () => {
        if (!analyser.current) return;

        const bufferLength = analyser.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.current.getByteFrequencyData(dataArray);
        setFrequencyData(dataArray);

        animationFrameId.current = requestAnimationFrame(updateFrequencyData);
      };
      updateFrequencyData();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setRecording(false);

      // Clean up audio processing resources
      if (source.current) {
        source.current.disconnect();
      }

      // Clear frequency data
      setFrequencyData(new Uint8Array(0));

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setFrequencyData(new Uint8Array(0));
    onClearRecording?.();
  };

  return (
    <div className="voice-recorder">
      <div className="voice-recorder-container">
        <div className="icon-button voice-icon">
          {recording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="record-button recording"
            >
              <Disc />
            </button>
          ) : (
            !audioUrl && (
              <button type="button" onClick={startRecording}>
                <Mic />
              </button>
            )
          )}

          {audioUrl && (
            <button
              type="button"
              onClick={clearRecording}
              style={{
                padding: "8px 15px",
                border: "none",
                borderRadius: "4px",
                background: "var(--primary)",
                color: "white",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              <Trash />
            </button>
          )}
        </div>

        {recording && (
          <div className="visualizer">
            {Array.from({ length: 64 }).map((_, index) => {
              // Use frequency data if available, otherwise use a small default height
              const value = frequencyData[index] || 2;
              return (
                <motion.div
                  key={index}
                  className="bar"
                  style={{
                    height: `${Math.max(2, Math.min(35, value))}px`,
                    backgroundColor: visualizerColor,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="recording-preview">
          <AudioPlayer audioFile={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
