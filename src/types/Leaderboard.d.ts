export interface Leaderboard {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  photo: string;
  role: "student" | "admin";
  group: "A" | "B" | "C" | "D";
  badges: any[];
  recentNotes: any[];
  points: 100000000;
  followers: any[];
  following: any[];
  showToDo: boolean;
  __v: number;
  caption: string;
  rank: number;
  id: string;
}
