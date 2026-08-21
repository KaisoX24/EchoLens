import { useState } from "react";
import {
  Volume2,
  Play,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { generateAudio } from "../services/api";

interface Props {
  pageNumber: number;
  text: string;
}

function PageAudio({
  pageNumber,
  text,
}: Props) {
  const [audioUrl, setAudioUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const cacheKey = `page-${pageNumber}-${text.length}`;

      const url =
        await generateAudio(
          text,
          cacheKey
        );

      setAudioUrl(url);
    } catch (err) {
      console.error(
        "Audio generation error:",
        err
      );

      setError(
        "Failed to generate audio."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-audio">

      <div className="page-audio-header">
        <div className="page-audio-title">
          <Volume2 size={18} />

          <strong>
            Page Audio
          </strong>
        </div>
      </div>

      {!audioUrl && (
        <button
          className="generate-audio-button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
                size={17}
                className="spin"
              />

              Generating...
            </>
          ) : (
            <>
              <Volume2 size={17} />

              Generate Audio
            </>
          )}
        </button>
      )}

      {audioUrl && (
        <div className="audio-controls">

          <audio
            controls
            src={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${audioUrl}`}
          />

          <button
            className="regenerate-audio-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2
                size={16}
                className="spin"
              />
            ) : (
              <RotateCcw size={16} />
            )}

            Regenerate
          </button>

        </div>
      )}

      {error && (
        <p className="audio-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default PageAudio;