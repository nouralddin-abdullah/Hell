import React from "react";
import useThemeStore from "../../../store/darkModeStore";
import Toggle from "react-toggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeToggle: React.FC = () => {
  const { theme, isDarkerMode, toggleTheme, toggleDarkerMode } =
    useThemeStore();

  return (
    <div className="dark-mode-settings">
      {/* First Toggle: Light vs Dark Mode */}
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>Dark Mode</h3>
          <span>Switch between Light and Dark mode.</span>
        </div>

        <Toggle
          checked={theme === "dark"}
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

      {theme === "dark" && (
        <div className="settings-privacy-item">
          <div className="privacy-text">
            <h3>Turn off the lights</h3>
            <span>An even darker dark mode.</span>
          </div>

          <Toggle
            checked={isDarkerMode}
            onChange={toggleDarkerMode}
            className="dark-mode-toggle"
          />
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
