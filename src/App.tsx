import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import JoinUsPage from "./pages/auth/join";
import TopNavBar from "./components/common/nav/TopNavBar";
import ProfilePage from "./pages/profile";
import toast, { Toaster } from "react-hot-toast";
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
import useAuthStore from "./store/authTokenStore";
import JoinUsPopup from "./components/common/JoinUsPopup/JoinUsPopup";
// import LandingPage from "./pages/landing";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { messaging } from "./firebase";
import { updateDeviceToken } from "../src/hooks/notifications/updateDeviceToken";
import RamadanModal from "./components/common/ramadan/RamadanModal";
import NotificationPage from "./pages/notifications";
import SettingsPage from "./pages/settings";
import "react-quill/dist/quill.snow.css";
import "react-toggle/style.css"; // for ES6 modules

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function App() {
  const tokenAvailable = useAuthStore((state) => state.token);

  const navigate = useNavigate();

  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if (!("serviceWorker" in navigator)) {
          throw new Error("Service Worker not supported");
        }

        // Register the service worker
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );
        console.log("Service Worker registered:", registration);

        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;

        await requestPermission(registration);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    const requestPermission = async (
      registration: ServiceWorkerRegistration
    ) => {
      try {
        console.log("Requesting permission...");
        const permission = await Notification.requestPermission();
        console.log("Permission status:", permission);

        if (permission === "granted") {
          console.log("Getting Push Subscription...");
          const vapidPublicKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          };

          const pushSubscription = await registration.pushManager.subscribe(
            subscribeOptions
          );
          console.log("Push Subscription:", pushSubscription);

          console.log("Getting FCM token...");
          const newToken = await getToken(messaging, {
            vapidKey: vapidPublicKey,
            serviceWorkerRegistration: registration,
          });

          if (newToken) {
            // Store token in localStorage
            localStorage.setItem("fcm_token", newToken);

            // Always send token to backend if user is authenticated
            if (tokenAvailable) {
              try {
                await updateDeviceToken(newToken);
                console.log("Device token sent to backend");
              } catch (error) {
                console.error(
                  "Failed to update device token in backend:",
                  error
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Permission request error:", error);
      }
    };

    // Start the registration process
    registerServiceWorker();

    // Cleanup process
    return () => {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.pushManager.getSubscription().then((subscription) => {
            if (subscription) {
              subscription.unsubscribe();
            }
          });
        })
        .catch((error) => console.error("Cleanup error:", error));
    };
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);

      const data = payload.data;

      // Show toast notification
      toast(
        (t) => (
          <div
            onClick={() => {
              if (data?.link) {
                navigate(data.link);
              }
              toast.dismiss(t.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <h4>{data?.title || "New Notification"}</h4>
            <p>{data?.body || "You have a new message"}</p>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "14px",
            maxWidth: "350px",
          },
          icon: "👋",
        }
      );
    });
  }, [navigate]);

  return (
    <>
      <Toaster />
      <TopNavBar />

      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
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
        <Route path="/chat/:courseName" element={<ChatPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/questions/:id" element={<ChosenQuestionPage />} />
        <Route path="/scoreboard" element={<ScoreboardPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      {!tokenAvailable && <JoinUsPopup />}

      <BottomNavBar />

      <RamadanModal />
    </>
  );
}

export default App;
