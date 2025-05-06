import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

interface AudioPlayerProps {
  audioFile: string;
}

const formWaveSurferOptions = (
  ref: HTMLElement | null
  // @ts-ignore
): WaveSurfer.WaveSurferParams => ({
  container: ref!,
  waveColor: "#ccc",
  progressColor: "#818cf8",
  cursorColor: "transparent",
  responsive: true,
  height: 20,
  normalize: true,
  backend: "WebAudio",
  barWidth: 2,
  barGap: 3,
});

export default function AudioPlayer({ audioFile }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(audioFile);

    wavesurfer.current.on("ready", () => {
      if (!wavesurfer.current) return;
    });

    // Set playing to false when audio finishes
    wavesurfer.current.on("finish", () => {
      setPlaying(false);
    });

    return () => {
      // @ts-ignore
      wavesurfer.current?.un("audioprocess");
      // @ts-ignore
      wavesurfer.current?.un("ready");
      // @ts-ignore
      wavesurfer.current?.un("finish");
      wavesurfer.current?.destroy();
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    if (!wavesurfer.current) return;
    setPlaying((prev) => !prev);
    wavesurfer.current.playPause();
  };

  return (
    <div className="audio-player-container">
      <div id="waveform" ref={waveformRef} style={{ width: "100%" }}></div>
      <div className="controls">
        <button
          className="audio-waveform__btn"
          type="button"
          onClick={handlePlayPause}
          style={{
            background: "var(--background)",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0.8rem 1rem",
          }}
        >
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </button>
      </div>
    </div>
  );
}
