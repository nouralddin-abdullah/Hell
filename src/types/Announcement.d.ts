export interface AnnouncementsPreview {
  _id: string;
  announcerId: {
    _id: string;
    username: string;
    photo: string;
    id: string;
  };
  title: string;
  importance: "Normal" | "Important" | "Urgent";
}

type Group = "A" | "B" | "C" | "D";

interface Attachment {
  name: string;
  size: number;
  mimeType: `${string}/${string}`;
  path: string;
  _id: string;
}

export interface Announcement {
  _id: string;
  announcerId: {
    _id: string;
    username: string;
    photo: string;
    id: string;
  };
  title: string;
  body: string;
  importance: "Normal" | "Important" | "Urgent";
  attach_files: Attachment[];
  groups: Group[];
  general: boolean;
  __v: number;
}
