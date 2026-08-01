export const API = {
  AUTH_LOGIN: "/auth/login",

  TENANTS: "/tenant",
  TENANT_SUBSCRIBE: "/tenant/subscribe",
  TENANT: (id: string) => `/tenant/${id}`,
  TENANT_SUBSCRIBE_REMOVE: (id: string) => `/tenant/subscribe/${id}`,
  TENANT_BRANCHES: (tenantId: string) => `/tenant/${tenantId}/branches`,
  TENANT_BRANCH: (tenantId: string, id: string) => `/tenant/${tenantId}/branches/${id}`,

  SUBSCRIPTIONS: "/subscription",
  SUBSCRIPTION: (id: string) => `/subscription/${id}`,

  ANALYTICS_DASHBOARD: "/analytics/dashboard",

  ACADEMIC_SLOTS: "/academics/config/slots",
  ACADEMIC_SLOT: (id: string) => `/academics/config/slots/${id}`,
  ACADEMIC_SLOT_WINDOWS: "/academics/config/slot-windows",
  ACADEMIC_SLOT_WINDOW: (id: string) => `/academics/config/slot-windows/${id}`,
  ACADEMIC_ASSIGNMENTS: "/academics/config/assignments",
  ACADEMIC_ASSIGNMENT: (id: string) => `/academics/config/assignments/${id}`,
  ACADEMIC_GRADING_RULES: "/academics/config/grading-rules",
  ACADEMIC_GRADING_RULE: (id: string) => `/academics/config/grading-rules/${id}`,
  ACADEMIC_RESULTS_ENTRY: "/academics/results/entry",
  ACADEMIC_RESULTS_SUBMIT: "/academics/results/submit",
  ACADEMIC_RESULTS: (sectionId: string) => `/academics/results/${sectionId}`,
  ACADEMIC_RESULTS_FALLBACK: "/academics/results/fallback",
  ACADEMIC_ROSTER: (sectionId: string) => `/academics/rosters/${sectionId}`,
  ACADEMIC_ROSTER_APPROVE: (id: string) => `/academics/rosters/${id}/approve`,
  ACADEMIC_ROSTER_REJECT: (id: string) => `/academics/rosters/${id}/reject`,
  ACADEMIC_ROSTER_PUBLISH: "/academics/rosters/publish",
  ACADEMIC_ROSTER_GENERATE: (sectionId: string) => `/academics/rosters/generate/${sectionId}`,
  ACADEMIC_CORRECTIONS: "/academics/corrections",
  ACADEMIC_CORRECTION_APPROVE: (id: string) => `/academics/corrections/${id}/approve`,
  ACADEMIC_CORRECTION_REJECT: (id: string) => `/academics/corrections/${id}/reject`,
  ACADEMIC_AUDIT: "/academics/audit",
  ACADEMIC_COMPLETION: (sectionId: string) => `/academics/completion/${sectionId}`,

  ACADEMIC_YEARS: "/academics/academic-calendar/years",
  ACADEMIC_YEAR: (id: string) => `/academics/academic-calendar/years/${id}`,
  ACADEMIC_YEAR_CURRENT: "/academics/academic-calendar/years/current",
  ACADEMIC_YEAR_SET_CURRENT: (id: string) =>
    `/academics/academic-calendar/years/${id}/set-current`,
  ACADEMIC_YEAR_PERIODS: (yearId: string) =>
    `/academics/academic-calendar/years/${yearId}/periods`,
  ACADEMIC_PERIOD: (id: string) => `/academics/academic-calendar/periods/${id}`,

  ATTENDANCE_STUDENTS: "/attendance/students",
  ATTENDANCE_STUDENTS_SECTION: (sectionId: string, date: string) =>
    `/attendance/students/section/${sectionId}/date/${date}`,
  ATTENDANCE_STUDENTS_HISTORY: (studentId: string) =>
    `/attendance/students/history/${studentId}`,
  ATTENDANCE_STUDENTS_STATISTICS: "/attendance/students/statistics",
  ATTENDANCE_STUDENT: (id: string) => `/attendance/students/${id}`,
  ATTENDANCE_STUDENT_CORRECT: (id: string) => `/attendance/students/${id}/correct`,

  ATTENDANCE_STAFF_CHECK_IN: "/attendance/staff/check-in",
  ATTENDANCE_STAFF_CHECK_OUT: "/attendance/staff/check-out",
  ATTENDANCE_STAFF: "/attendance/staff",
  ATTENDANCE_STAFF_MEMBER: (id: string) => `/attendance/staff/${id}`,
  ATTENDANCE_STAFF_CORRECT: (id: string) => `/attendance/staff/${id}/correct`,
  ATTENDANCE_STAFF_PAYROLL: (branchId: string) => `/attendance/staff/payroll/${branchId}`,

  REGISTRATION_STUDENTS: "/registration/student",
  REGISTRATION_STUDENT_SEARCH: "/registration/student/search",
  REGISTRATION_STUDENT: (id: string) => `/registration/student/${id}`,
  REGISTRATION_STUDENT_CONFIRMATION: (id: string) =>
    `/registration/student/${id}/confirmation`,
  REGISTRATION_STUDENT_RE_ADMIT: (id: string) =>
    `/registration/student/${id}/re-admit`,

  REGISTRATION_PARENT_SEARCH: "/registration/parent/search",
  REGISTRATION_PARENTS: "/registration/parent",
  REGISTRATION_PARENT: (id: string) => `/registration/parent/${id}`,

  REGISTRATION_SECTIONS: "/registration/sections",
  REGISTRATION_SECTION: (id: string) => `/registration/sections/${id}`,
  REGISTRATION_SECTION_STUDENTS: (id: string) =>
    `/registration/sections/${id}/students`,
  REGISTRATION_SECTIONS_ASSIGN: "/registration/sections/assign",
  REGISTRATION_SECTIONS_AUTO_ASSIGN: "/registration/sections/auto-assign",
  REGISTRATION_SECTIONS_AUTO_ASSIGN_CONFIRM:
    "/registration/sections/auto-assign/confirm",

  STAFF: "/staff",
  STAFF_MEMBER: (id: string) => `/staff/${id}`,

  TEACHERS: "/teacher",
  TEACHER: (id: string) => `/teacher/${id}`,
  TEACHER_GRADES: "/teacher/grades",
  TEACHER_GRADE: (id: string) => `/teacher/grades/${id}`,

  PRINCIPALS: "/principal",
  PRINCIPAL: (id: string) => `/principal/${id}`,

  SCHEDULE_CALENDAR: "/schedule/calendar",
  SCHEDULE_CALENDAR_UPCOMING: "/schedule/calendar/report/upcoming",
  SCHEDULE_CALENDAR_BY_CATEGORY: "/schedule/calendar/report/by-category",
  SCHEDULE_CALENDAR_EVENT: (id: string) => `/schedule/calendar/${id}`,

  SCHEDULE_TIMETABLE_GENERATE: "/schedule/timetable/generate",
  SCHEDULE_TIMETABLE: "/schedule/timetable",
  SCHEDULE_TIMETABLE_TEACHER_LOAD: "/schedule/timetable/report/teacher-load",
  SCHEDULE_TIMETABLE_ENTRY: (id: string) => `/schedule/timetable/${id}`,
  SCHEDULE_TIMETABLE_ACTIVATE: (id: string) => `/schedule/timetable/${id}/activate`,
} as const;
