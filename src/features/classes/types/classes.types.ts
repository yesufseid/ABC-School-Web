export type Subject = {
  id: string;
  name: string;
};

export type Grade = {
  id: string;
  grade: number;
  subjects: Subject[];
  createdAt: string;
  updatedAt: string;
};
