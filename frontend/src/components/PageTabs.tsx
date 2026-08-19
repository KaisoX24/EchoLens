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
  return (
    <div className="page-tabs">
      {pages.map((page) => (
        <button
          key={page.page}
          className={activePage === page.page ? "active" : ""}
          onClick={() => setActivePage(page.page)}
        >
          Page {page.page}
        </button>
      ))}
    </div>
  );
}

export default PageTabs;