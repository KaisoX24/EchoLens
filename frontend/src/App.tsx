import { useState } from "react";

import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import OutputPanel from "./components/OutputPanel";
import PDFPreview from "./components/PDFPreview";

import type { ProcessResponse } from "./services/api";

function App() {
  const [file, setFile] = useState<File | null>(null);

  const [result, setResult] =
    useState<ProcessResponse | null>(null);

  const [activePage, setActivePage] = useState(1);

  const handleFileSelected = (selectedFile: File | null) => {
    console.log("File selected in App:", selectedFile);

    setFile(selectedFile);

    // Start preview from page 1
    setActivePage(1);
  };

  const handleProcessed = (processedResult: ProcessResponse) => {
    console.log("Processed result:", processedResult);

    setResult(processedResult);

    // Start processed output from page 1
    setActivePage(1);
  };

  return (
    <div className="app">

      <Header />

      <main className="dashboard">

        {/* LEFT SIDE */}
        <section className="document-panel">

          {/* PDF PREVIEW */}
          <PDFPreview
            file={file}
            pageNumber={activePage}
          />

          {/* UPLOAD */}
          <UploadPanel
            onFileSelected={handleFileSelected}
            onProcessed={handleProcessed}
          />

        </section>

        {/* RIGHT SIDE */}
        <OutputPanel
          result={result}
          activePage={activePage}
          setActivePage={setActivePage}
          filename={file?.name ?? "document"}
        />

      </main>

    </div>
  );
}

export default App;