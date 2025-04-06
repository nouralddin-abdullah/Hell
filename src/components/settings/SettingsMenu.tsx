import { File, Lock, Sliders } from "lucide-react";
import React from "react";


interface MenuItem {
  category: string;
}

interface SettingsMenuProps {
  selectedMenuCategory: string;
  setSelectedMenuCategory: (category: string) => void;
}

const MENU: MenuItem[] = [
  { category: "Privacy" },
  { category: "Policies" },
  { category: "Preference" },
];

const ICONS = {
  Privacy: <Lock />,
  Policies: <File />,
  Preference: <Sliders />,
};

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  selectedMenuCategory,
  setSelectedMenuCategory,
}) => {
  return (
    <div className="settings-menu">
      {MENU.map((item) => (
        <button
          key={item.category}
          className={`settings-menu-button ${item.category === selectedMenuCategory ? "settings-menu-button-selected" : ""
            }`}
          onClick={() => setSelectedMenuCategory(item.category)}
          aria-selected={item.category === selectedMenuCategory}
        >
          {/* @ts-ignore */}
          {ICONS[item.category]} {item.category}
        </button>
      ))}
    </div>
  );
};

export default SettingsMenu;
