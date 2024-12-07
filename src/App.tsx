import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import JoinUsPage from "./pages/auth/join";
import TopNavBar from "./components/common/nav/TopNavBar";
import ProfilePage from "./pages/profile";
import { Toaster } from "react-hot-toast";
import "react-image-crop/dist/ReactCrop.css";
import MaterialsPage from "./pages/materials";
import BottomNavBar from "./components/common/nav/BottomNavBar";
import NotePage from "./pages/note";
import AnnouncementsPage from "./pages/announcements";
import ScoreboardPage from "./pages/scoreboard";
import CourseAnnouncementPage from "./pages/announcements/CourseAnnouncementPage";
import ChatPage from "./pages/chat";
import QuestionsPage from "./pages/questions";
import ChosenQuestionPage from "./pages/questions/ChosenQuestionPage";

// Import messaging and relevant functions
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

function App() {
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BI5HgYOsNI0RuAhXlomJkLBAvEyoAGm6JQJTjYvXZL9mjUPY2k23ew6qu2K6gQBt2HYkIF0AJ3xkVvaEuuoU_cQ",
        });
        console.log("FCM Token:", token);
        // Send the token to your server
      } else {
        console.log("Notification permission denied");
      }
    };

    requestPermission();

    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      // Handle incoming messages here
    });
  }, []);

  return (
    <>
      <Toaster />
      <TopNavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/join-us" element={<JoinUsPage />} />
        <Route path="/materials/:id" element={<MaterialsPage />} />
        <Route path="/note/:username/:id" element={<NotePage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route
          path="/announcements/:courseId"
          element={<CourseAnnouncementPage />}
        />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/questions/:id" element={<ChosenQuestionPage />} />
        <Route path="/scoreboard" element={<ScoreboardPage />} />
      </Routes>

      <BottomNavBar />
    </>
  );
}

export default App;
