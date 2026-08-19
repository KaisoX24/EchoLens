import {
  Pause,
  Volume2,
} from "lucide-react";

function AudioPlayer() {
  return (
    <div className="audio-player">
      <div className="audio-info">
        <strong>Playing Page 2 Audio</strong>
      </div>

      <button className="audio-button">
        <Pause size={18} />
      </button>

      <div className="audio-progress">
        <div className="progress-bar" />
      </div>

      <Volume2 size={20} />

      <button>1x</button>
      <button>1.25x</button>
      <button>1.5x</button>
    </div>
  );
}

export default AudioPlayer;