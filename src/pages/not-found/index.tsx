import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";

const subjects = [
  { name: "Statistics", url: "/materials/67a3d81509b2220bddade3d5" },
  { name: "Auditing", url: "/materials/67a3d6cf09b2220bddade381" },
  { name: "Human Resources", url: "/materials/67a3d79709b2220bddade3bc" },
  { name: "Feasibility Studies", url: "/materials/67a3d7fb09b2220bddade3cf" },
];

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState<number>(10);
  const [pencilAngle, setPencilAngle] = useState<number>(0);

  useEffect(() => {
    const timer =
      countdown > 0 &&
      setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

    const pencilInterval = setInterval(() => {
      setPencilAngle((prev) => (prev + 1) % 360);
    }, 50);

    if (countdown === 0) navigate("/");

    return () => {
      clearInterval(timer as unknown as NodeJS.Timeout);
      clearInterval(pencilInterval);
    };
  }, [countdown]);

  const handleHomeClick = (): void => {
    navigate("/");
  };

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.backgroundElements}>
        {/* Animated background elements */}
        <div
          className={`${styles.pencil} ${styles.pencil1}`}
          style={{ transform: `rotate(${pencilAngle}deg)` }}
        ></div>
        <div
          className={`${styles.pencil} ${styles.pencil2}`}
          style={{ transform: `rotate(${-pencilAngle}deg)` }}
        ></div>
        <div className={styles.book1}></div>
        <div className={styles.book2}></div>
        <div className={styles.notebook}></div>
        <div className={styles.ruler}></div>
        <div className={styles.apple}></div>

        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className={styles.formula}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {
              [
                "E=mc²",
                "∫f(x)dx",
                "a²+b²=c²",
                "πr²",
                "Σ(n)",
                "∛x",
                "Δx",
                "√2",
                "f(x)",
                "x²",
              ][index % 10]
            }
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles["error-code"]}>
          <span className={styles.digit}>4</span>
          <div className={styles["missing-digit"]}>
            <div className={styles["magnifying-glass"]}></div>
          </div>
          <span className={styles.digit}>4</span>
        </div>

        <h1 className={styles.title}>Page Not Found</h1>

        <div className={styles.divider}></div>

        <p className={styles.message}>
          Oops! It seems like you visited an invalid URL Don't worry, you are
          still welcomed!
        </p>

        <div className={styles.actions}>
          <button className={styles["home-button"]} onClick={handleHomeClick}>
            Go To Home Page
          </button>

          <div className={styles.suggestion}>
            <p>Try checking out these subjects materials instead:</p>
            <ul className={styles["suggestion-list"]}>
              {subjects.map((sub) => (
                <li onClick={() => navigate(sub.url)}>{sub.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className={styles["redirect-text"]}>
          Redirecting to the Home page in{" "}
          <span className={styles.countdown}>{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
};

export default NotFound;
