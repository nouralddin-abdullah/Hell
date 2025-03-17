export interface MentionItem {
  id: string;
  username: string;
  fullName: string;
  photo: string;
  role: "student" | "group-leader" | "instructor";
}
