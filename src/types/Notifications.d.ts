export interface UnreadNotifications {
  total: number;
  groups: {
    materials: number;
    announcements: number;
    comments: number;
    questions: number;
    social: number;
  };
  byType: {
    "new-material": number;
    "like-question": number;
    "comment-on-question": number;
  };
}

export interface Notification {
  id: string;
  type: string;
  groupKey: string;
  title: string;
  message: string;
  link: string;
  isRead: false;
  actingUser: null;
  metadata: {
    courseId: string;
    courseName: string;
    materialId: string;
    title: string;
  };
  createdAt: string;
  timeAgo: string;
}
