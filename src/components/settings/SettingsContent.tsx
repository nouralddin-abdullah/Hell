import Policies from "./Policies";
import PreferenceSettings from "./PreferenceSettings";
import PrivacyContent from "./PrivacyContent";

interface Props {
  selectedMenuCategory: string;
}

const SettingsContent = ({ selectedMenuCategory }: Props) => {
  return (
    <div className="settings-content-container">
      {selectedMenuCategory === "Privacy" && <PrivacyContent />}
      {selectedMenuCategory === "Policies" && <Policies />}
      {selectedMenuCategory === "Preference" && <PreferenceSettings />}
    </div>
  );
};

export default SettingsContent;
