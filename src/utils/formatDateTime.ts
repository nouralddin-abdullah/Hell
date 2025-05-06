export function formatDateTime(input: string): {
  date: string;
  time: string;
  dayOfWeek: string;
} {
  const dateObj = new Date(input);

  // Get parts of the date
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getUTCFullYear()).slice(-2);

  // Format time
  const hours = dateObj.getUTCHours();
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  // Get day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[dateObj.getUTCDay()];

  return {
    date: `${day}/${month}/20${year}`,
    time: `${hour12}:${minutes} ${ampm}`,
    dayOfWeek,
  };
}
