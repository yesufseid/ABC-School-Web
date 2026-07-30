import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type {
  AssessmentSlot,
  SlotWindow,
  Assignment,
  GradingRule,
  CorrectionRequest,
} from "../types/academics.types";

export const slotKeys = {
  all: ["slots"] as const,
  lists: () => [...slotKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...slotKeys.lists(), params] as const,
  details: () => [...slotKeys.all, "detail"] as const,
  detail: (id: string) => [...slotKeys.details(), id] as const,
};

export const slotWindowKeys = {
  all: ["slot-windows"] as const,
  lists: () => [...slotWindowKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...slotWindowKeys.lists(), params] as const,
  details: () => [...slotWindowKeys.all, "detail"] as const,
  detail: (id: string) => [...slotWindowKeys.details(), id] as const,
};

export const assignmentKeys = {
  all: ["assignments"] as const,
  lists: () => [...assignmentKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...assignmentKeys.lists(), params] as const,
};

export const gradingRuleKeys = {
  all: ["grading-rules"] as const,
  lists: () => [...gradingRuleKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...gradingRuleKeys.lists(), params] as const,
  details: () => [...gradingRuleKeys.all, "detail"] as const,
  detail: (id: string) => [...gradingRuleKeys.details(), id] as const,
};

export const resultKeys = {
  all: ["results"] as const,
  bySection: (sectionId: string) => [...resultKeys.all, sectionId] as const,
};

export const rosterKeys = {
  all: ["rosters"] as const,
  bySection: (sectionId: string) => [...rosterKeys.all, sectionId] as const,
};

export const correctionKeys = {
  all: ["corrections"] as const,
  lists: () => [...correctionKeys.all, "list"] as const,
};

export function useFetchSlots() {
  return useFetchQuery<{ data: AssessmentSlot[] }>(
    API.ACADEMIC_SLOTS,
    slotKeys.lists(),
  );
}

export function useFetchSlot(id: string) {
  return useFetchQuery<{ data: AssessmentSlot }>(
    API.ACADEMIC_SLOT(id),
    slotKeys.detail(id),
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
    invalidateQueries: [{ key: slotKeys.lists() }],
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
      { key: slotKeys.lists() },
      { key: slotKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteSlot() {
  return useApiMutation<{ message: string }, string>(
    API.ACADEMIC_SLOTS,
    "delete",
    {
      successMessage: "Assessment slot deleted!",
      invalidateQueries: [{ key: slotKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useFetchSlotWindows(branchId: string) {
  return useFetchQuery<{ data: SlotWindow[] }>(
    API.ACADEMIC_SLOT_WINDOWS,
    slotWindowKeys.lists(),
    { branchId },
    { enabled: !!branchId },
  );
}

export function useCreateSlotWindow() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateSlotWindowDto"]
  >(API.ACADEMIC_SLOT_WINDOWS, "post", {
    successMessage: "Slot window created!",
    invalidateQueries: [{ key: slotWindowKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateSlotWindow(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateSlotWindowDto"]
  >(API.ACADEMIC_SLOT_WINDOW(id), "patch", {
    successMessage: "Slot window updated!",
    invalidateQueries: [
      { key: slotWindowKeys.lists() },
      { key: slotWindowKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useFetchAssignments() {
  return useFetchQuery<{ data: Assignment[] }>(
    API.ACADEMIC_ASSIGNMENTS,
    assignmentKeys.lists(),
  );
}

export function useCreateAssignment() {
  return useApiMutation<
    { message: string },
    components["schemas"]["TeacherGradeLinkDto"]
  >(API.ACADEMIC_ASSIGNMENTS, "post", {
    successMessage: "Teacher assigned!",
    invalidateQueries: [{ key: assignmentKeys.lists() }],
    mutationOptions: {},
  });
}

export function useDeleteAssignment() {
  return useApiMutation<{ message: string }, string>(
    API.ACADEMIC_ASSIGNMENTS,
    "delete",
    {
      successMessage: "Assignment removed!",
      invalidateQueries: [{ key: assignmentKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useFetchGradingRules() {
  return useFetchQuery<{ data: GradingRule[] }>(
    API.ACADEMIC_GRADING_RULES,
    gradingRuleKeys.lists(),
  );
}

export function useFetchGradingRule(id: string) {
  return useFetchQuery<{ data: GradingRule }>(
    API.ACADEMIC_GRADING_RULE(id),
    gradingRuleKeys.detail(id),
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
    invalidateQueries: [{ key: gradingRuleKeys.lists() }],
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
      { key: gradingRuleKeys.lists() },
      { key: gradingRuleKeys.detail(id) },
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
      invalidateQueries: [{ key: gradingRuleKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useGradebookEntry() {
  return useApiMutation<
    { message: string },
    components["schemas"]["GradebookEntryBatchDto"]
  >(API.ACADEMIC_RESULTS_ENTRY, "post", {
    successMessage: "Grades entered!",
    invalidateQueries: [{ key: resultKeys.all }],
    mutationOptions: {},
  });
}

export function useSubmitResults() {
  return useApiMutation<
    { message: string },
    components["schemas"]["SubmitResultsDto"]
  >(API.ACADEMIC_RESULTS_SUBMIT, "post", {
    successMessage: "Results submitted!",
    invalidateQueries: [{ key: resultKeys.all }],
    mutationOptions: {},
  });
}

export function useFetchResults(sectionId: string) {
  return useFetchQuery<{ data: unknown }>(
    API.ACADEMIC_RESULTS(sectionId),
    resultKeys.bySection(sectionId),
    undefined,
    { enabled: !!sectionId },
  );
}

export function useFallback() {
  return useApiMutation<
    { message: string },
    components["schemas"]["FallbackDto"]
  >(API.ACADEMIC_RESULTS_FALLBACK, "post", {
    successMessage: "Score saved!",
    invalidateQueries: [{ key: resultKeys.all }],
    mutationOptions: {},
  });
}

export function useFetchRoster(sectionId: string) {
  return useFetchQuery<{ data: unknown }>(
    API.ACADEMIC_ROSTER(sectionId),
    rosterKeys.bySection(sectionId),
    undefined,
    { enabled: !!sectionId },
  );
}

export function useApproveRoster(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.ACADEMIC_ROSTER_APPROVE(id),
    "post",
    {
      successMessage: "Roster approved!",
      invalidateQueries: [{ key: rosterKeys.all }],
      mutationOptions: {},
    },
  );
}

export function useRejectRoster(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["RejectRosterDto"]
  >(API.ACADEMIC_ROSTER_REJECT(id), "post", {
    successMessage: "Roster rejected!",
    invalidateQueries: [{ key: rosterKeys.all }],
    mutationOptions: {},
  });
}

export function usePublishRoster() {
  return useApiMutation<
    { message: string },
    components["schemas"]["PublishRosterDto"]
  >(API.ACADEMIC_ROSTER_PUBLISH, "post", {
    successMessage: "Roster published!",
    invalidateQueries: [{ key: rosterKeys.all }],
    mutationOptions: {},
  });
}

export function useGenerateRoster(sectionId: string) {
  return useApiMutation<{ message: string }, void>(
    API.ACADEMIC_ROSTER_GENERATE(sectionId),
    "post",
    {
      successMessage: "Roster generated!",
      invalidateQueries: [{ key: rosterKeys.all }],
      mutationOptions: {},
    },
  );
}

export function useFetchCorrections() {
  return useFetchQuery<{ data: CorrectionRequest[] }>(
    API.ACADEMIC_CORRECTIONS,
    correctionKeys.lists(),
  );
}

export function useRequestCorrection() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CorrectionRequestDto"]
  >(API.ACADEMIC_CORRECTIONS, "post", {
    successMessage: "Correction requested!",
    invalidateQueries: [{ key: correctionKeys.lists() }],
    mutationOptions: {},
  });
}

export function useApproveCorrection(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.ACADEMIC_CORRECTION_APPROVE(id),
    "post",
    {
      successMessage: "Correction approved!",
      invalidateQueries: [{ key: correctionKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useRejectCorrection(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["RejectCorrectionDto"]
  >(API.ACADEMIC_CORRECTION_REJECT(id), "post", {
    successMessage: "Correction rejected!",
    invalidateQueries: [{ key: correctionKeys.lists() }],
    mutationOptions: {},
  });
}

export function useFetchAudit() {
  return useFetchQuery<{ data: unknown }>(
    API.ACADEMIC_AUDIT,
    [...slotKeys.all, "audit"],
  );
}

export function useCheckCompletion(sectionId: string) {
  return useFetchQuery<{ data: unknown }>(
    API.ACADEMIC_COMPLETION(sectionId),
    [...slotKeys.all, "completion", sectionId],
    undefined,
    { enabled: !!sectionId },
  );
}
