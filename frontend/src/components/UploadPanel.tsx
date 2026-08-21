import { FileUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { processPDF } from "../services/api";

interface Props {
  onProcessed: (result: any) => void;
}

function UploadPanel({ onProcessed }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (
    selectedFile: File | undefined
  ) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const result = await processPDF(file);

      console.log("Backend response:", result);

      onProcessed(result);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to process PDF. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-panel">
      <h2>Upload Course Content</h2>

      <label className="drop-zone">
        <FileUp size={48} />

        <strong>Drag & Drop PDF</strong>

        <span>
          or click to upload
        </span>

        <input
          type="file"
          accept=".pdf"
          hidden
          onChange={(e) =>
            handleFile(e.target.files?.[0])
          }
        />
      </label>

      {file && (
        <div className="selected-file">
          <div>
            <strong>{file.name}</strong>

            <span>
              {(file.size / 1024 / 1024).toFixed(1)} MB
              {" · "}
              Ready to Process
            </span>
          </div>

          <button
            onClick={() => setFile(null)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <button
        className="process-button"
        disabled={!file || loading}
        onClick={handleProcess}
      >
        {loading
          ? "Processing..."
          : "Process File"}
      </button>
    </section>
  );
}

export default UploadPanel;