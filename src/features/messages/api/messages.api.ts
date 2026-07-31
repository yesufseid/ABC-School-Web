import type {
  MessageThread,
  ConversationMessage,
  SentMessage,
} from "../types/message.types";

const MOCK_THREADS: MessageThread[] = [
  {
    id: "th-001",
    participant: "Abebe Mekonnen",
    participantRole: "Parent",
    lastMessage: "Thank you, I will make sure she submits the assignment on time.",
    lastAt: "2026-07-30T16:20:00Z",
    unread: 2,
  },
  {
    id: "th-002",
    participant: "Hanna Wondimu",
    participantRole: "Student",
    lastMessage: "Could I get an extension on the physics project?",
    lastAt: "2026-07-30T14:05:00Z",
    unread: 0,
  },
  {
    id: "th-003",
    participant: "Tigist Abera",
    participantRole: "Teacher",
    lastMessage: "The grade 10 English test results are ready for review.",
    lastAt: "2026-07-29T11:45:00Z",
    unread: 1,
  },
  {
    id: "th-004",
    participant: "Dawit Haile",
    participantRole: "Parent",
    lastMessage: "Is there a parent-teacher meeting next week?",
    lastAt: "2026-07-28T09:30:00Z",
    unread: 0,
  },
  {
    id: "th-005",
    participant: "Selam Tesfaye",
    participantRole: "Student",
    lastMessage: "I lost my school ID card, how do I get a new one?",
    lastAt: "2026-07-27T13:10:00Z",
    unread: 3,
  },
];

const MOCK_CONVERSATIONS: ConversationMessage[] = [
  {
    id: "cm-001",
    threadId: "th-001",
    sender: "Abebe Mekonnen",
    senderRole: "Parent",
    body: "Good morning, I heard the term exams are coming up. When will the schedule be published?",
    sentAt: "2026-07-30T15:40:00Z",
  },
  {
    id: "cm-002",
    threadId: "th-001",
    sender: "You",
    senderRole: "Admin",
    body: "Good morning. The exam schedule was published on the Schedules page today. Please review it there.",
    sentAt: "2026-07-30T16:00:00Z",
  },
  {
    id: "cm-003",
    threadId: "th-001",
    sender: "Abebe Mekonnen",
    senderRole: "Parent",
    body: "Thank you, I will make sure she submits the assignment on time.",
    sentAt: "2026-07-30T16:20:00Z",
  },
  {
    id: "cm-004",
    threadId: "th-002",
    sender: "Hanna Wondimu",
    senderRole: "Student",
    body: "Could I get an extension on the physics project? My group is one experiment behind.",
    sentAt: "2026-07-30T14:05:00Z",
  },
  {
    id: "cm-005",
    threadId: "th-003",
    sender: "Tigist Abera",
    senderRole: "Teacher",
    body: "The grade 10 English test results are ready for review. I will upload them by tomorrow.",
    sentAt: "2026-07-29T11:45:00Z",
  },
  {
    id: "cm-006",
    threadId: "th-004",
    sender: "Dawit Haile",
    senderRole: "Parent",
    body: "Is there a parent-teacher meeting next week? My daughter mentioned it but I want to confirm.",
    sentAt: "2026-07-28T09:30:00Z",
  },
  {
    id: "cm-007",
    threadId: "th-005",
    sender: "Selam Tesfaye",
    senderRole: "Student",
    body: "I lost my school ID card, how do I get a new one? Is there a replacement fee?",
    sentAt: "2026-07-27T13:10:00Z",
  },
];

const MOCK_SENT: SentMessage[] = [
  {
    id: "sm-001",
    subject: "Parent-Teacher Conference Reminder",
    body: "This is a reminder that the annual parent-teacher conference will take place next Friday from 9:00 AM to 3:00 PM.",
    channel: "sms",
    recipientType: "all-parents",
    recipientLabel: "All Parents",
    sentBy: "School Office",
    sentAt: "2026-07-29T08:00:00Z",
    status: "delivered",
    deliveredCount: 1450,
    totalCount: 1500,
  },
  {
    id: "sm-002",
    subject: "Grade 12 Graduation Ceremony",
    body: "The Grade 12 graduation ceremony will be held at the main hall on August 20th. Attendance is mandatory.",
    channel: "sms",
    recipientType: "grade",
    recipientLabel: "Grade 12",
    sentBy: "School Office",
    sentAt: "2026-07-27T10:30:00Z",
    status: "delivered",
    deliveredCount: 210,
    totalCount: 210,
  },
  {
    id: "sm-003",
    subject: "Monthly Newsletter - July",
    body: "Catch up on last month's highlights: sports day results, new library books, and the upcoming exam schedule.",
    channel: "email",
    recipientType: "all-parents",
    recipientLabel: "All Parents",
    sentBy: "Marketing Team",
    sentAt: "2026-07-25T09:00:00Z",
    status: "delivered",
    deliveredCount: 1398,
    totalCount: 1500,
  },
  {
    id: "sm-004",
    subject: "Staff Meeting Notice",
    body: "All staff are requested to attend a brief meeting on Monday morning to discuss the new attendance policy.",
    channel: "email",
    recipientType: "all-teachers",
    recipientLabel: "All Teachers",
    sentBy: "HR Office",
    sentAt: "2026-07-24T15:45:00Z",
    status: "pending",
    deliveredCount: 0,
    totalCount: 96,
  },
  {
    id: "sm-005",
    subject: "Exam Results Published",
    body: "Mid-term results for the first term have been published. Parents can view them on the portal.",
    channel: "push",
    recipientType: "all-parents",
    recipientLabel: "All Parents",
    sentBy: "Academic Office",
    sentAt: "2026-07-22T12:00:00Z",
    status: "failed",
    deliveredCount: 900,
    totalCount: 1500,
  },
];

export function useFetchMessageThreads() {
  return { data: MOCK_THREADS, isLoading: false };
}

export function useFetchConversation(threadId: string) {
  const messages = MOCK_CONVERSATIONS.filter(
    (message) => message.threadId === threadId,
  );
  return { data: messages, isLoading: false };
}

export function useFetchSentMessages() {
  return { data: MOCK_SENT, isLoading: false };
}
