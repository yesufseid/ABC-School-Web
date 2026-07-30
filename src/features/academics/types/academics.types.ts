export type AssessmentSlot = {
  id: string;
  name: string;
  slotType: "TEST" | "MID_ASSIGNMENT" | "FINAL" | "ASSESSMENT_COMPONENT";
  weight: number;
  maxMark: number;
  gradeCycle: "KG" | "LOWER_PRIMARY" | "UPPER_PRIMARY" | "SECONDARY";
  createdAt: string;
  updatedAt: string;
};

export type SlotWindow = {
  id: string;
  slotId: string;
  branchId: string;
  isScheduled: boolean;
  startDate: string | null;
  endDate: string | null;
  assessmentPeriodStart: string | null;
  assessmentPeriodEnd: string | null;
};

export type Assignment = {
  id: string;
  teacherId: string;
  subjectId: string;
  sectionId: string;
  branchId: string;
};

export type GradingRule = {
  id: string;
  minMarks: number;
  maxMarks: number;
  grade: string;
  points: number;
  isPass: boolean;
};

export type RosterEntry = {
  studentId: string;
  studentName: string;
  subjectId: string;
  sectionId: string;
  score: number | null;
  grade: string | null;
};

export type CorrectionRequest = {
  id: string;
  studentId: string;
  subjectId: string;
  sectionId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};
