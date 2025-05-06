// VoiceRecorder.tsx - Add a new prop to expose recording state
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./style.css";
import AudioPlayer from "../AudioVisualPlayer/AudioPlayer";
import { Disc, Mic, Trash } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onClearRecording?: () => void;
  onRecordingStateChange?: (isRecording: boolean) => void; // New prop
  visualizerColor?: string;
}

const VoiceRecorder = ({
  onRecordingComplete,
  onClearRecording,
  onRecordingStateChange, // Add the new prop
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

  // Notify parent component when recording state changes
  useEffect(() => {
    onRecordingStateChange?.(recording);
  }, [recording, onRecordingStateChange]);

  // Cleanup effects
  useEffect(
    () => () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    },
    [audioUrl]
  );

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
      source.current?.disconnect();
      // Clear frequency data
      setFrequencyData(new Uint8Array(0));
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setFrequencyData(new Uint8Array(0));
    onClearRecording?.();
  };

  return (
    <div className="voice-recorder">
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

      {audioUrl && (
        <div className="recording-preview">
          <AudioPlayer audioFile={audioUrl} />
        </div>
      )}

      {frequencyData.length > 0 && (
        <div className="visualizer">
          {Array.from(frequencyData)
            .slice(0, 64)
            .map((value, index) => (
              <motion.div
                key={index}
                className="bar"
                initial={{ height: 0 }}
                animate={{
                  height: `${Math.min(100, value)}px`, // Cap maximum height
                  background: visualizerColor,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
