import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  file: File | null;
  pageNumber: number;
}

function PDFPreview({
  file,
  pageNumber,
}: Props) {
  const [fileUrl, setFileUrl] =
    useState<string | null>(null);

  const [numPages, setNumPages] =
    useState<number>(0);

  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      setNumPages(0);
      return;
    }

    const url = URL.createObjectURL(file);

    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file || !fileUrl) {
    return (
      <div className="pdf-preview empty-pdf">
        <div>
          <p>PDF Preview</p>

          <span>
            Upload a PDF to preview it here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-preview">

      <div className="pdf-document">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => {
            console.log(
              "PDF loaded:",
              numPages,
              "pages"
            );

            setNumPages(numPages);
          }}
          onLoadError={(error) => {
            console.error(
              "PDF LOAD ERROR:",
              error
            );
          }}
          loading={
            <div className="pdf-status">
              Loading PDF...
            </div>
          }
          error={
            <div className="pdf-status">
              Unable to load PDF.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={800}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>
      </div>

      {numPages > 0 && (
        <div className="pdf-page-info">
          Page {pageNumber} of {numPages}
        </div>
      )}

    </div>
  );
}

export default PDFPreview;