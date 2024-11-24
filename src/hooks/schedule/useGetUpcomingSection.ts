import { Schedule } from "../../types/Schedule";

// Helper function to convert 12-hour time to 24-hour format
const convertTo24Hour = (time12h: string): number => {
  const [hourStr, period] = time12h.split(" ");
  let hour = parseInt(hourStr, 10);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour;
};

export const useGetUpcomingSection = (schedule: Schedule[]) => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const weekdays: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  let upcomingSection: Schedule | null = null;
  let minTimeDifference = Infinity;

  for (const section of schedule) {
    const sectionDay = weekdays[section.day];
    if (sectionDay === undefined) continue; // Skip if day is invalid

    const sectionHour = convertTo24Hour(section.startTime);

    // Calculate days until the next occurrence of this section
    let daysUntil = sectionDay - currentDay;
    if (daysUntil < 0) daysUntil += 7; // Wrap to next week
    else if (
      daysUntil === 0 &&
      (sectionHour < currentHour ||
        (sectionHour === currentHour && currentMinutes > 0))
    ) {
      daysUntil = 7; // Move to next week if today's section has passed
    }

    // Calculate total time difference in milliseconds
    const msPerDay = 24 * 60 * 60 * 1000;
    const msPerHour = 60 * 60 * 1000;

    const timeDifference =
      daysUntil * msPerDay +
      (sectionHour - currentHour) * msPerHour -
      currentMinutes * 60 * 1000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds();

    if (timeDifference > 0 && timeDifference < minTimeDifference) {
      upcomingSection = section;
      minTimeDifference = timeDifference;
    }
  }

  return { upcomingSection, minTimeDifference };
};
