import { useState } from "react";

import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import OutputPanel from "./components/OutputPanel";

import type { ProcessResponse } from "./services/api";

function App() {
  const [result, setResult] =
    useState<ProcessResponse | null>(null);

  return (
    <div className="app">
      <Header />

      <main className="dashboard">
        <UploadPanel
          onProcessed={setResult}
        />

        <OutputPanel
          result={result}
        />
      </main>
    </div>
  );
}

export default App;