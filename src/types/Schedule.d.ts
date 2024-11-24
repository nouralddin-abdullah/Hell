import { CourseType } from "./Course";

export type Schedule = {
  _id: string;
  group: string;
  building: string;
  startTime: string;
  endTime: string;
  day: string;
  courseId: CourseType;
  __v: number;
};
