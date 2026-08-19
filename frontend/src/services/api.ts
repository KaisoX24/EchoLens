export interface ContentBlock {
  type: string;
  content: string;
}

export interface PageResult {
  page_number: number;
  blocks: ContentBlock[];
}

export interface ProcessResponse {
  pages: PageResult[];
  audio_url: string | null;
}

export async function processPDF(
  file: File
): Promise<ProcessResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    "http://localhost:8000/process",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Backend returned ${response.status}: ${errorText}`
    );
  }

  return response.json();
}