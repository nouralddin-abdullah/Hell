interface User {
  id: string;
  username: string;
  fullName: string;
  photo: string;
  userFrame: string | null; // Assuming 'null' as a string is intentional, otherwise 'null' type
  badges: any[]; // Replace 'any' with a more specific type if the structure of badge is known
}

interface Stats {
  likesCount: number;
  isLikedByCurrentUser: boolean;
}

interface Timestamps {
  created: string; // Could also be 'Date' if you plan to parse it
  formatted: string;
}

interface Attachment {
  name: string;
  size: number;
  mimeType: string;
  url: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  stats: Stats;
  attachment: Attachment | null; // Replace 'any' with a more specific type if the structure of attachment is known
  timestamps: Timestamps;
}
