import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type {
  AssessmentSlot,
  SlotWindow,
  GradingRule,
  Assignment,
  Gradebook,
  Roster,
  Correction,
  AuditEntry,
} from "../types/academics.types";

export const academicKeys = {
  all: ["academics"] as const,
  slots: () => [...academicKeys.all, "slots"] as const,
  slot: (id: string) => [...academicKeys.slots(), id] as const,
  slotWindows: () => [...academicKeys.all, "slot-windows"] as const,
  slotWindowsByBranch: (branchId: string) =>
    [...academicKeys.slotWindows(), branchId] as const,
  assignments: () => [...academicKeys.all, "assignments"] as const,
  assignmentsBySection: (sectionId: string) =>
    [...academicKeys.assignments(), sectionId] as const,
  rules: () => [...academicKeys.all, "grading-rules"] as const,
  rule: (id: string) => [...academicKeys.rules(), id] as const,
  gradebook: (sectionId: string, subjectId: string, slotId: string, term: string) =>
    [...academicKeys.all, "gradebook", sectionId, subjectId, slotId, term] as const,
  rosters: () => [...academicKeys.all, "rosters"] as const,
  roster: (sectionId: string) => [...academicKeys.rosters(), sectionId] as const,
  corrections: (status: string) => [...academicKeys.all, "corrections", status] as const,
  audit: () => [...academicKeys.all, "audit"] as const,
  completion: (sectionId: string, term: string) =>
    [...academicKeys.all, "completion", sectionId, term] as const,
};

export function useFetchSlots() {
  return useFetchQuery<{ data: AssessmentSlot[] }>(API.ACADEMIC_SLOTS, academicKeys.slots());
}

export function useFetchSlot(id: string) {
  return useFetchQuery<{ data: AssessmentSlot }>(
    API.ACADEMIC_SLOT(id),
    academicKeys.slot(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateSlot() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateAssessmentSlotDto"]
  >(API.ACADEMIC_SLOTS, "post", {
    successMessage: "Assessment slot created!",
    invalidateQueries: [{ key: academicKeys.slots() }],
    mutationOptions: {},
  });
}

export function useUpdateSlot(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateAssessmentSlotDto"]
  >(API.ACADEMIC_SLOT(id), "patch", {
    successMessage: "Assessment slot updated!",
    invalidateQueries: [
      { key: academicKeys.slots() },
      { key: academicKeys.slot(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteSlot() {
  return useApiMutation<{ message: string }, string>(API.ACADEMIC_SLOTS, "delete", {
    successMessage: "Assessment slot deleted!",
    invalidateQueries: [{ key: academicKeys.slots() }],
    mutationOptions: {},
  });
}

export function useFetchSlotWindows(branchId: string) {
  return useFetchQuery<{ data: SlotWindow[] }>(
    API.ACADEMIC_SLOT_WINDOWS,
    academicKeys.slotWindowsByBranch(branchId),
    branchId ? { branchId } : undefined,
    { enabled: !!branchId },
  );
}

export function useCreateSlotWindow() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateSlotWindowDto"]
  >(API.ACADEMIC_SLOT_WINDOWS, "post", {
    successMessage: "Slot window created!",
    invalidateQueries: [{ key: academicKeys.slotWindows() }],
    mutationOptions: {},
  });
}

export function useUpdateSlotWindow(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateSlotWindowDto"]
  >(API.ACADEMIC_SLOT_WINDOW(id), "patch", {
    successMessage: "Slot window updated!",
    invalidateQueries: [{ key: academicKeys.slotWindows() }],
    mutationOptions: {},
  });
}

export function useFetchAssignments(sectionId: string) {
  return useFetchQuery<{ data: Assignment[] }>(
    API.ACADEMIC_ASSIGNMENTS,
    academicKeys.assignmentsBySection(sectionId),
    sectionId ? { sectionId } : undefined,
    { enabled: !!sectionId },
  );
}

export function useRemoveAssignment(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.ACADEMIC_ASSIGNMENT(id),
    "delete",
    {
      successMessage: "Assignment removed!",
      invalidateQueries: [{ key: academicKeys.assignments() }],
      mutationOptions: {},
    },
  );
}

export function useFetchGradingRules() {
  return useFetchQuery<{ data: GradingRule[] }>(API.ACADEMIC_GRADING_RULES, academicKeys.rules());
}

export function useFetchGradingRule(id: string) {
  return useFetchQuery<{ data: GradingRule }>(
    API.ACADEMIC_GRADING_RULE(id),
    academicKeys.rule(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateGradingRule() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateGradingRuleDto"]
  >(API.ACADEMIC_GRADING_RULES, "post", {
    successMessage: "Grading rule created!",
    invalidateQueries: [{ key: academicKeys.rules() }],
    mutationOptions: {},
  });
}

export function useUpdateGradingRule(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateGradingRuleDto"]
  >(API.ACADEMIC_GRADING_RULE(id), "patch", {
    successMessage: "Grading rule updated!",
    invalidateQueries: [
      { key: academicKeys.rules() },
      { key: academicKeys.rule(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteGradingRule() {
  return useApiMutation<{ message: string }, string>(
    API.ACADEMIC_GRADING_RULES,
    "delete",
    {
      successMessage: "Grading rule deleted!",
      invalidateQueries: [{ key: academicKeys.rules() }],
      mutationOptions: {},
    },
  );
}

export function useFetchGradebook(params: {
  sectionId?: string;
  subjectId?: string;
  slotId?: string;
  term?: string;
}) {
  const enabled = !!params.sectionId && !!params.subjectId && !!params.slotId && !!params.term;
  return useFetchQuery<{ data: Gradebook }>(
    API.ACADEMIC_RESULTS(params.sectionId ?? ""),
    academicKeys.gradebook(
      params.sectionId ?? "",
      params.subjectId ?? "",
      params.slotId ?? "",
      params.term ?? "",
    ),
    params,
    { enabled },
  );
}

export function useSubmitGradebookEntry() {
  return useApiMutation<
    { message: string },
    components["schemas"]["GradebookEntryBatchDto"]
  >(API.ACADEMIC_RESULTS_ENTRY, "post", {
    successMessage: "Grades saved!",
    invalidateQueries: [{ key: academicKeys.gradebook("", "", "", "") }],
    mutationOptions: {},
  });
}

export function useSubmitResults() {
  return useApiMutation<
    { message: string },
    components["schemas"]["SubmitResultsDto"]
  >(API.ACADEMIC_RESULTS_SUBMIT, "post", {
    successMessage: "Results submitted!",
    invalidateQueries: [{ key: academicKeys.gradebook("", "", "", "") }],
    mutationOptions: {},
  });
}

export function useFetchRoster(sectionId: string) {
  return useFetchQuery<{ data: Roster }>(
    API.ACADEMIC_ROSTER(sectionId),
    academicKeys.roster(sectionId),
    undefined,
    { enabled: !!sectionId },
  );
}

export function useGenerateRoster(sectionId: string, term: string, year: string) {
  return useApiMutation<{ message: string }, void>(
    API.ACADEMIC_ROSTER_GENERATE(sectionId),
    "post",
    {
      successMessage: "Roster generated!",
      invalidateQueries: [
        { key: academicKeys.roster(sectionId) },
        { key: academicKeys.completion(sectionId, term) },
      ],
      mutationOptions: {},
      queryParams: { term, year },
    },
  );
}

export function useApproveRoster(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.ACADEMIC_ROSTER_APPROVE(id),
    "post",
    {
      successMessage: "Roster approved!",
      invalidateQueries: [{ key: academicKeys.rosters() }],
      mutationOptions: {},
    },
  );
}

export function useRejectRoster(id: string) {
  return useApiMutation<{ message: string }, components["schemas"]["RejectRosterDto"]>(
    API.ACADEMIC_ROSTER_REJECT(id),
    "post",
    {
      successMessage: "Roster rejected!",
      invalidateQueries: [{ key: academicKeys.rosters() }],
      mutationOptions: {},
    },
  );
}

export function usePublishRoster() {
  return useApiMutation<{ message: string }, components["schemas"]["PublishRosterDto"]>(
    API.ACADEMIC_ROSTER_PUBLISH,
    "post",
    {
      successMessage: "Roster published!",
      invalidateQueries: [{ key: academicKeys.rosters() }],
      mutationOptions: {},
    },
  );
}

export function useFetchCorrections(status: string) {
  return useFetchQuery<{ data: Correction[] }>(
    API.ACADEMIC_CORRECTIONS,
    academicKeys.corrections(status),
    { status },
    { enabled: !!status },
  );
}

export function useRequestCorrection() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CorrectionRequestDto"]
  >(API.ACADEMIC_CORRECTIONS, "post", {
    successMessage: "Correction requested!",
    invalidateQueries: [
      { key: academicKeys.corrections("PENDING") },
      { key: academicKeys.corrections("APPROVED") },
      { key: academicKeys.corrections("REJECTED") },
    ],
    mutationOptions: {},
  });
}

export function useApproveCorrection(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.ACADEMIC_CORRECTION_APPROVE(id),
    "post",
    {
      successMessage: "Correction approved!",
      invalidateQueries: [
        { key: academicKeys.corrections("PENDING") },
        { key: academicKeys.corrections("APPROVED") },
      ],
      mutationOptions: {},
    },
  );
}

export function useRejectCorrection(id: string) {
  return useApiMutation<{ message: string }, components["schemas"]["RejectCorrectionDto"]>(
    API.ACADEMIC_CORRECTION_REJECT(id),
    "post",
    {
      successMessage: "Correction rejected!",
      invalidateQueries: [
        { key: academicKeys.corrections("PENDING") },
        { key: academicKeys.corrections("REJECTED") },
      ],
      mutationOptions: {},
    },
  );
}

export function useFetchAcademicAudit(params?: {
  action?: string;
  branchId?: string;
  sectionId?: string;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: string;
}) {
  return useFetchQuery<{ data: AuditEntry[] }>(
    API.ACADEMIC_AUDIT,
    academicKeys.audit(),
    params,
    { enabled: !!params?.action },
  );
}

export function useFetchCompletion(sectionId: string, term: string) {
  return useFetchQuery<{ data: { complete: boolean; message?: string } }>(
    API.ACADEMIC_COMPLETION(sectionId),
    academicKeys.completion(sectionId, term),
    { term },
    { enabled: !!sectionId && !!term },
  );
}
