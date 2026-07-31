export type MaterialType =
  | "document"
  | "slides"
  | "worksheet"
  | "video"
  | "link";

export type Material = {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  subject: string;
  grade: number;
  branch: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  downloads: number;
};
