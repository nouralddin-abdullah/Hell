export interface User {
  user: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    photo: string;
    userFrame: string;
    caption: string;
    role: "student" | "doctor" | "admin" | "group-leader";
    group: "A" | "B" | "C" | "D";
    badges: [];
    recentNotes: [];
    points: number;
    rank: number;
    followers: [User];
    following: [User];
    showToDo: boolean;
    __v: 0;
    toDoList: [];
    id: string;
  };
  isFollowed: boolean | null;
}
