export interface User {
  user: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    photo: string;
    userFrame: string;
    caption: string;
    role: "student" | "instructor" | "admin" | "group-leader";
    group: "A" | "B" | "C" | "D";
    badges: [];
    recentNotes: [];
    points: number;
    rank: number;
    followers: [string];
    following: [string];
    showToDo: boolean;
    __v: 0;
    toDoList: [];
    id: string;
    isPrivate: boolean;
    stats?: {
      coins: number;
      questionCount: number;
      likesCount: number;
      solvedCount: number;
    };
  };
  isFollowed: boolean | null;
}
