import { useState } from "react";

import type { ProcessResponse } from "./services/api";
import PageTabs from "./components/PageTabs";
import ContentBlock from "./components/ContentBlock";
import AudioPlayer from "./components/AudioPlayer";

interface Props {
  result: ProcessResponse | null;
}

function OutputPanel({ result }: Props) {
  const [activePage, setActivePage] = useState(1);

  if (!result) {
    return (
      <section className="output-panel">
        <div className="empty-output">
          <h2>Processed Output</h2>

          <p>
            Upload a PDF and click
            <strong> Process File </strong>
            to see the results.
          </p>
        </div>
      </section>
    );
  }

  const pages = result.pages;

  const currentPage = pages.find(
    (page) =>
      page.page_number === activePage
  );

  return (
    <section className="output-panel">

      <div className="output-header">
        <div>
          <h2>Processed Output</h2>

          <span className="success-badge">
            Successful
          </span>
        </div>
      </div>

      <PageTabs
        pages={pages.map((page) => ({
          page: page.page_number,
        }))}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="content-area">

        {currentPage?.blocks.map(
          (block, index) => (
            <ContentBlock
              key={index}
              type={block.type}
              content={block.content}
            />
          )
        )}

      </div>

      <AudioPlayer />

    </section>
  );
}

export default OutputPanel;