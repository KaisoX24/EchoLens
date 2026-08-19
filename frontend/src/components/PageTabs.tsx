import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface Page {
  page: number;
}

interface Props {
  pages: Page[];
  activePage: number;
  setActivePage: (page: number) => void;
}

function PageTabs({
  pages,
  activePage,
  setActivePage,
}: Props) {
  const totalPages = pages.length;

  const [inputPage, setInputPage] =
    useState(String(activePage));

  const goToPreviousPage = () => {
    if (activePage > 1) {
      const newPage = activePage - 1;

      setActivePage(newPage);
      setInputPage(String(newPage));
    }
  };

  const goToNextPage = () => {
    if (activePage < totalPages) {
      const newPage = activePage + 1;

      setActivePage(newPage);
      setInputPage(String(newPage));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputPage(e.target.value);
  };

  const goToTypedPage = () => {
    const page = Number(inputPage);

    if (!page || page < 1) {
      setInputPage(String(activePage));
      return;
    }

    const validPage = Math.min(
      page,
      totalPages
    );

    setActivePage(validPage);
    setInputPage(String(validPage));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      goToTypedPage();
    }
  };

  return (
    <div className="page-navigation">

      {/* Previous */}
      <button
        className="page-nav-button"
        onClick={goToPreviousPage}
        disabled={activePage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page input */}
      <div className="page-counter">
        <span>Page</span>

        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onBlur={goToTypedPage}
          onKeyDown={handleKeyDown}
          aria-label="Enter page number"
        />

        <span>of {totalPages}</span>
      </div>

      {/* Next */}
      <button
        className="page-nav-button"
        onClick={goToNextPage}
        disabled={activePage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  );
}

export default PageTabs;