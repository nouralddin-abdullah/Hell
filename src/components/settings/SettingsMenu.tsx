import React from "react";

interface Props {
  selectedMenuCategory: string;
  setSelectedMenuCategory: React.Dispatch<React.SetStateAction<string>>;
}

const MENU = [
  { category: "Privacy" },
  { category: "Policies" },
  { category: "Preference" },
];

const SettingsMenu = ({
  selectedMenuCategory,
  setSelectedMenuCategory,
}: Props) => {
  return (
    <nav
      className="settings-menu"
      role="navigation"
      aria-label="Settings Navigation"
    >
      {MENU.map((item) => (
        <button
          key={item.category}
          className={`settings-menu-button ${
            item.category === selectedMenuCategory &&
            "settings-menu-button-selected"
          }`}
          onClick={() => setSelectedMenuCategory(item.category)}
          aria-selected={item.category === selectedMenuCategory}
        >
          {item.category}
        </button>
      ))}
    </nav>
  );
};

export default SettingsMenu;
