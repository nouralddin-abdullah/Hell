import { Post } from "../types/Post";

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Introduction to React",
    content: "<p>Learn the fundamentals of React...</p>",
    quillContent: {
      ops: [{ insert: "Learn the fundamentals of React...\n" }],
    },
    user: {
      username: "johndoe",
      fullName: "John Doe",
      photo: "JD",
      role: "instructor",
      userFrame: "",
      badges: [],
    },
    category: "Statistics",
    stats: {
      likesCount: 42,
      isLikedByCurrentUser: false,
      bookmarksCount: 10,
      isbookmarkedByCurrentUser: false,
      commentsCount: 15,
    },
    attachments: [],
    timestamps: {
      created: "2024-03-15T00:00:00Z",
      formatted: "March 15, 2024",
    },
  },
  {
    id: "2",
    title: "TypeScript Basics",
    content: "<p>Understanding TypeScript types...</p>",
    quillContent: {
      ops: [{ insert: "Understanding TypeScript types...\n" }],
    },
    user: {
      username: "janesmith",
      fullName: "Jane Smith",
      photo: "JS",
      role: "instructor",
      userFrame: "",
      badges: [],
    },
    category: "Statistics",
    stats: {
      likesCount: 30,
      isLikedByCurrentUser: false,
      bookmarksCount: 5,
      isbookmarkedByCurrentUser: false,
      commentsCount: 8,
    },
    attachments: [],
    timestamps: {
      created: "2024-03-14T00:00:00Z",
      formatted: "March 14, 2024",
    },
  },
];
