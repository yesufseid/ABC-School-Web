export type MessageChannel = "sms" | "email" | "push";

export type MessageRecipient =
  | "all-students"
  | "all-parents"
  | "all-teachers"
  | "branch"
  | "grade"
  | "section"
  | "specific";

export type SentMessage = {
  id: string;
  subject: string;
  body: string;
  channel: MessageChannel;
  recipientType: MessageRecipient;
  recipientLabel: string;
  sentBy: string;
  sentAt: string;
  status: "delivered" | "pending" | "failed";
  deliveredCount: number;
  totalCount: number;
};

export type MessageThread = {
  id: string;
  participant: string;
  participantRole: "Student" | "Parent" | "Teacher" | "Principal" | "Admin";
  lastMessage: string;
  lastAt: string;
  unread: number;
};

export type ConversationMessage = {
  id: string;
  threadId: string;
  sender: string;
  senderRole: string;
  body: string;
  sentAt: string;
};
