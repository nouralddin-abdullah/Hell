import "./App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Routes, Route } from "react-router-dom";
import { messaging } from "./firebase";
import { onMessage, getToken } from "firebase/messaging";
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
import NotePage from "./pages/note";
import AnnouncementsPage from "./pages/announcements";
import ScoreboardPage from "./pages/scoreboard";
import CourseAnnouncementPage from "./pages/announcements/CourseAnnouncementPage";
import ChatPage from "./pages/chat";
import QuestionsPage from "./pages/questions";
import ChosenQuestionPage from "./pages/questions/ChosenQuestionPage";
import toast from "react-hot-toast";

function App() {
const navigate = useNavigate();
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          if (registration.active) {
            const token = await getToken(messaging, {
              vapidKey: "BI5HgYOsNI0RuAhXlomJkLBAvEyoAGm6JQJTjYvXZL9mjUPY2k23ew6qu2K6gQBt2HYkIF0AJ3xkVvaEuuoU_cQ"
            });
            console.log("FCM Token:", token);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      
      const notification = payload.notification;
      const data = payload.data;

      // Show toast notification
      toast((t) => (
        <div 
          onClick={() => {
            if (data?.link) {
              navigate(data.link);
            }
            toast.dismiss(t.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          <h4>{notification?.title || 'New Notification'}</h4>
          <p>{notification?.body || 'You have a new message'}</p>
        </div>
      ), {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
        },
      });
    });
  }, [navigate]);

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