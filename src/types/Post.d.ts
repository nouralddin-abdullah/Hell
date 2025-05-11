interface User {
  username: string;
  fullName: string;
  photo: string;
  role: "admin" | "instructor" | "student" | "group-leader";
  userFrame: string;
  badges: any[];
}

interface Attachment {
  name: string;
  size: size;
  mimeType: string;
  type: string;
  url: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  quillContent: {
    ops: [
      {
        insert: string;
      }
    ];
  };
  user: User;
  category: string;
  stats: {
    likesCount: ىعةلاثق;
    isLikedByCurrentUser: boolean;
    bookmarksCount: ىعةلاثق;
    isbookmarkedByCurrentUser: boolean;
    commentsCount: ىعةلاثق;
  };
  attachments: Attachment[];
  timestamps: {
    created: string;
    formatted: string;
  };
}

export interface SelectedPost {
  id: string;
  title: string;
  content: string;
  quillContent: {
    ops: {
      insert:
        | string
        | {
            image: string;
          };
    }[];
  };
  user: {
    username: string;
    fullName: string;
    photo: string;
    role: string;
    userFrame: string;
    badges: string[];
  };
  category: string;
  stats: {
    likesCount: number;
    isLikedByCurrentUser: boolean;
    bookmarksCount: number;
    isbookmarkedByCurrentUser: boolean;
    commentsCount: number;
    authViews: number;
    anonViews: number;
    totalViews: number;
  };
  attachments: {
    name: string;
    size: number;
    mimeType: string;
    type: string;
    url: string;
  }[];
  timestamps: {
    created: string; // ISO string
    formatted: string; // Localized string
  };
  comments: {
    results: number;
    pagination: {
      totalComments: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    };
    data: any[]; // Replace `any` with a proper comment type if known
  };
}
