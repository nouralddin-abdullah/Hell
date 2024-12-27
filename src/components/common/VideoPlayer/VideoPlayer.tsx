import React, { useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [currentTime, setCurrentTime] = useState(0);
  //   const [duration, setDuration] = useState(0);

  //   useEffect(() => {
  //     const videoElement = videoRef.current;

  //     const updateTime = () => {
  //       if (videoElement) {
  //         setCurrentTime(videoElement.currentTime);
  //       }
  //     };

  //     const updateDuration = () => {
  //       if (videoElement) {
  //         setDuration(videoElement.duration);
  //       }
  //     };

  //     if (videoElement) {
  //       videoElement.addEventListener("timeupdate", updateTime);
  //       videoElement.addEventListener("loadedmetadata", updateDuration);
  //     }

  //     return () => {
  //       if (videoElement) {
  //         videoElement.removeEventListener("timeupdate", updateTime);
  //         videoElement.removeEventListener("loadedmetadata", updateDuration);
  //       }
  //     };
  //   }, []);

  //   const togglePlayPause = () => {
  //     const videoElement = videoRef.current;
  //     if (!videoElement) return;

  //     if (isPlaying) {
  //       videoElement.pause();
  //     } else {
  //       videoElement.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   };

  //   const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const videoElement = videoRef.current;
  //     if (!videoElement) return;

  //     const seekTime = parseFloat(event.target.value);
  //     videoElement.currentTime = seekTime;
  //     setCurrentTime(seekTime);
  //   };

  //   const formatTime = (time: number): string => {
  //     const hours = Math.floor(time / 3600);
  //     const minutes = Math.floor((time % 3600) / 60);
  //     const seconds = Math.floor(time % 60);

  //     return `${hours > 0 ? `${hours}:` : ""}${minutes
  //       .toString()
  //       .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  //   };

  return (
    <div className="video-player">
      <video ref={videoRef} src={videoUrl} width="100%" controls></video>
      {/* <div className="controls">
        <button onClick={togglePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          step="0.1"
        />
      </div> */}
    </div>
  );
};

export default VideoPlayer;
