import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import "../../styles/settings/style.css";
import SettingsMenu from "../../components/settings/SettingsMenu";
import SettingsContent from "../../components/settings/SettingsContent";
import { useState } from "react";

const SettingsPage = () => {
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("Privacy");

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="settings-wrapper">
          {/* sidebar */}
          <SettingsMenu
            selectedMenuCategory={selectedMenuCategory}
            setSelectedMenuCategory={setSelectedMenuCategory}
          />
          {/* content */}
          <SettingsContent selectedMenuCategory={selectedMenuCategory} />
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default SettingsPage;
