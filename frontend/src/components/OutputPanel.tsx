import type { ProcessResponse } from "../services/api";

import PageTabs from "./PageTabs";
import ContentBlock from "./ContentBlock";
import AudioPlayer from "./AudioPlayer";

interface Props {
  result: ProcessResponse | null;
  activePage: number;
  setActivePage: (page: number) => void;
}

function OutputPanel({
  result,
  activePage,
  setActivePage,
}: Props) {
  if (!result) {
    return (
      <section className="output-panel">
        <div className="output-header">
          <h2>Processed Output</h2>
        </div>

        <div className="empty-output">
          <p>
            Upload a PDF and click{" "}
            <strong>Process File</strong> to see
            the processed content here.
          </p>
        </div>
      </section>
    );
  }

  const pages = result.pages;

  const currentPage = pages.find(
    (page) => page.page_number === activePage
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

      {result.audio_url && <AudioPlayer />}
    </section>
  );
}

export default OutputPanel;