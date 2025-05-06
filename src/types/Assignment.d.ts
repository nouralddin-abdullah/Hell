export type Assignment = {
  _id?: string;
  title: string;
  description: string;
  deadline: Date;
  courseId: string;
  attachedFile?: string;
  createdBy: {
    _id: string;
    username: string;
    photo: string;
    badges: [];
    id: string;
  };
  status?: "active" | "archived" | "deleted";
  createdAt?: Date;
  updatedAt?: Date;
};
