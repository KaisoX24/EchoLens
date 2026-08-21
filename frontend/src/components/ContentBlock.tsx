import {
  AlignLeft,
  BarChart3,
  Table2,
} from "lucide-react";

interface Props {
  type: string;
  content: string;
}

function ContentBlock({
  type,
  content,
}: Props) {
  if (type === "text") {
    return (
      <div className="content-card text-card">
        <div className="card-title">
          <AlignLeft size={20} />
          TEXT
        </div>

        <p>{content}</p>
      </div>
    );
  }

  if (
    type === "visual_description" ||
    type === "visual"
  ) {
    return (
      <div className="content-card visual-card">
        <div className="card-title">
          <BarChart3 size={20} />
          VISUAL DESCRIPTION
        </div>

        <p>{content}</p>
      </div>
    );
  }

  if (
    type === "table_description" ||
    type === "table"
  ) {
    return (
      <div className="content-card table-card">
        <div className="card-title">
          <Table2 size={20} />
          TABLE DESCRIPTION
        </div>

        <p>{content}</p>
      </div>
    );
  }

  // If backend sends an unknown block type
  return (
    <div className="content-card text-card">
      <div className="card-title">
        TEXT
      </div>

      <p>{content}</p>
    </div>
  );
}

export default ContentBlock;