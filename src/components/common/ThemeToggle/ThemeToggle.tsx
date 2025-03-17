import React, { useEffect } from "react";
import useThemeStore from "../../../store/darkModeStore";
import Toggle from "react-toggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme to document when component mounts or theme changes
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  return (
    <div className="dark-mode-settings">
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>Dark Mode</h3>
          <span>
            Just a dark mode what are you expecting us to describe? lol
          </span>
        </div>

        <Toggle
          checked={isDarkMode}
          onChange={toggleTheme}
          className="dark-mode-toggle"
          icons={{
            checked: <FontAwesomeIcon icon={faMoon} />,
            unchecked: (
              <FontAwesomeIcon icon={faSun} style={{ color: "#fff" }} />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default ThemeToggle;
