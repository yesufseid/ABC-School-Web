export type SlotType = "TEST" | "MID_ASSIGNMENT" | "FINAL" | "ASSESSMENT_COMPONENT";
export type GradeCycle = "KG" | "LOWER_PRIMARY" | "UPPER_PRIMARY" | "SECONDARY";

export type AssessmentSlot = {
  id: string;
  name: string;
  slotType: SlotType;
  weight: number;
  maxMark: number;
  gradeCycle: GradeCycle;
  createdAt: string;
  updatedAt: string;
};

export type SlotWindow = {
  id: string;
  slotId: string;
  branchId: string;
  isScheduled: boolean;
  startDate?: string;
  endDate?: string;
  assessmentPeriodStart?: string;
  assessmentPeriodEnd?: string;
  createdAt: string;
  updatedAt: string;
};

export type GradingRule = {
  id: string;
  minMarks: number;
  maxMarks: number;
  grade: string;
  points: number;
  isPass: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Assignment = {
  id: string;
  teacherId: string;
  sectionId: string;
  subjectId: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
};

export type GradebookStudent = {
  studentId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  sex?: string;
  score?: number | null;
  resultId?: string;
  status?: string;
};

export type Gradebook = {
  sectionId: string;
  subjectId: string;
  slotId: string;
  term: string;
  entries: GradebookStudent[];
};

export type Roster = {
  id: string;
  sectionId: string;
  term: string;
  year: string;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "PUBLISHED";
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type Correction = {
  id: string;
  resultId: string;
  reason: string;
  newScore: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditEntry = {
  id: string;
  action: string;
  branchId?: string;
  sectionId?: string;
  studentId?: string;
  user?: string;
  createdAt: string;
  details?: Record<string, unknown>;
};
