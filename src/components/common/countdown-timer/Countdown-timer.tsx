import { useState, useEffect } from "react";
import styles from "./countdown-timer.module.css";

interface CountdownTimerProps {
  deadline: string;
}

const CountdownTimer = ({ deadline }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    // Only set up the timer if we have a valid deadline
    if (!deadline) return;

    const calculateTimeLeft = () => {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const difference = deadlineDate.getTime() - now.getTime();

      // Check if deadline has passed
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        };
      }

      // Calculate remaining time
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Set up interval to update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className={styles["countdown-timer"]}>
      {timeLeft.isExpired ? (
        <div className={styles["timer-expired"]}>Deadline has passed</div>
      ) : (
        <div className={styles["timer-container"]}>
          <div className={styles["timer-header"]}>Time Remaining</div>
          <div className={styles["timer-units"]}>
            <div className={styles["timer-unit"]}>
              <div className={styles["timer-value"]}>{timeLeft.days}</div>
              <div className={styles["timer-label"]}>Days</div>
            </div>
            <div className={styles["timer-unit"]}>
              <div className={styles["timer-value"]}>{timeLeft.hours}</div>
              <div className={styles["timer-label"]}>Hours</div>
            </div>
            <div className={styles["timer-unit"]}>
              <div className={styles["timer-value"]}>{timeLeft.minutes}</div>
              <div className={styles["timer-label"]}>Minutes</div>
            </div>
            <div className={styles["timer-unit"]}>
              <div className={styles["timer-value"]}>{timeLeft.seconds}</div>
              <div className={styles["timer-label"]}>Seconds</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
