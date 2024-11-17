import { PostLabel } from "../types/PostPreview";
import summary from "../assets/summary.png";
import general from "../assets/general.png";
import notes from "../assets/notes.png";
import solutions from "../assets/solutions.png";

const images: Record<PostLabel, string> = {
  Summary: summary,
  General: general,
  Notes: notes,
  Solutions: solutions
};

export const getLabelImage = (label: PostLabel): string => {
  return images[label];
};