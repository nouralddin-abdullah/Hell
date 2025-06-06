interface PostUser {
  _id: string;
  username: string;
  photo: string;
  id: string;
}

// content structure to hanlde the order of the text / image
export interface ContentBlock {
  orderIndex: number;
  type: "text" | "image";
  content: string;
  _id: string;
  id: string;
  imageUrl?: string;
}

// post types enum as backend
export type PostLabel = "Summary" | "Notes" | "Solutions" | "General";

export interface Course {
  _id: string;
  courseName: string;
}

// post module as api
export interface Post {
  _id: string;
  userId: PostUser;
  courseId?: {
    _id: string;
    courseName: string;
  };
  title: string;
  contentBlocks: ContentBlock[];
  likes: string[];
  label: PostLabel;
  views: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  slug: string;
}
// api respose structure
export interface PostsResponse {
  status: string;
  data: {
    posts: Post[];
    currentPage: number;
    totalPages: number;
    total: number;
  };
}

// display importnt conetent for index.tsx
export interface PostPreviewProps {
  title: string;
  description: string;
  label: PostLabel;
  image: string;
  views: number;
  courseName: string;
}
