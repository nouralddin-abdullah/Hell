interface User {
  username: string;
  fullName: string;
  userFrame: string;
  photo: string;
  role: "student" | "admin" | "instructor" | "group-leader";
  badges?: Badge[];
}

interface Badge {
  _id: string;
  name: string;
  icon: string;
}

interface Stats {
  likesCount: number;
  isLikedByCurrentUser: boolean;
  bookmarksCount: number;
  isbookmarkedByCurrentUser: boolean;
  commentsCount: number;
  authViews: number;
  anonViews: number;
  totalViews: number;
}

export interface Attachment {
  name: string;
  size: number;
  mimeType: `${string}/${string}`;
  url: string;
}

export interface Question {
  id: string;
  content: string;
  user: User;
  stats: Stats;
  timestamps: {
    created: string;
    formatted: string;
  };
  attachment: Attachment;
  verifiedAnswer: {
    id: string;
    content: string;
    user: User;
    stats: Stats;
    attachment: Attachment | null;
  };
}

export interface ChosenQuestion {
  id: string;
  content: string;
  user: User;
  stats: Stats;
  timestamps: Timestamps;
  attachment: Attachment;
  verifiedAnswer: VerifiedAnswer | null;
  comments: Comments;
}

export interface VerifiedAnswer {
  id: string;
  content: string;
  user: User;
  stats: Stats;
  createdAt: string; // ISO string
  replies: Reply[];
  attachment: Attachment;
}

export interface Reply {
  id: string;
  content: string;
  user: User;
  stats: Stats;
  createdAt: string; // ISO string
  attachment?: Attachment | null;
}

export interface Comments {
  results: number;
  pagination: Pagination;
  data: CommentData[];
}

export interface Pagination {
  totalComments: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface CommentData {
  id: string;
  content: string;
  user: User;
  stats: Stats;
  createdAt: string; // ISO string
  attachment: Attachment | null;
  replies: Reply[];
}
