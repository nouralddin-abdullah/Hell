import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import JoinUsPage from "./pages/auth/join";
import TopNavBar from "./components/common/nav/TopNavBar";
import ProfilePage from "./pages/profile";
import { Toaster } from "react-hot-toast";
import "react-image-crop/dist/ReactCrop.css"; // needed for the crop uploaded img functionalities
import MaterialsPage from "./pages/materials";
import BottomNavBar from "./components/common/nav/BottomNavBar";

function App() {
  return (
    <>
      <Toaster />
      <TopNavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/join-us" element={<JoinUsPage />} />
        <Route path="/materials/:id" element={<MaterialsPage />} />
      </Routes>

      <BottomNavBar />
    </>
  );
}

export default App;
