import { useState, useRef } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { generateAudio } from "../services/api";
import type { ContentBlock } from "../services/api";

interface Props {
  pageNumber: number;
  filename: string;
  blocks: ContentBlock[];
}

const SPEEDS = [1, 1.25, 1.5];

function AudioPlayer({ pageNumber, filename, blocks }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const handleGenerate = async () => {
    const text = blocks.map((b) => b.content).join(" ");
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const stem = filename.replace(/\.[^/.]+$/, "");
      const cacheKey = `${stem}/page${pageNumber}`;

      const { audio_url } = await generateAudio(text, cacheKey);
      setAudioUrl(`http://localhost:8000${audio_url}`);
    } catch (err) {
      console.error(err);
      setError("Failed to generate audio.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio?.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSpeedChange = (rate: number) => {
    setSpeed(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  if (!audioUrl) {
    return (
      <div className="audio-player">
        <div className="audio-info">
          <strong>Page {pageNumber} Audio</strong>
        </div>

        <button
          className="audio-button"
          onClick={handleGenerate}
          disabled={loading}
          aria-label="Generate audio"
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Play size={18} />}
        </button>

        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }

  return (
    <div className="audio-player">
      <div className="audio-info">
        <strong>Playing Page {pageNumber} Audio</strong>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
      />

      <button className="audio-button" onClick={togglePlay}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className="audio-progress" onClick={handleSeek}>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <Volume2 size={20} />

      {SPEEDS.map((rate) => (
        <button
          key={rate}
          className={speed === rate ? "active-speed" : ""}
          onClick={() => handleSpeedChange(rate)}
        >
          {rate}x
        </button>
      ))}
    </div>
  );
}

export default AudioPlayer;