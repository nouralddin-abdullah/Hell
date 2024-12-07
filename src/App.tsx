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
    const registerServiceWorker = async () => {
      try {
        // Check if service workers are supported
        if (!('serviceWorker' in navigator)) {
          throw new Error('Service Worker not supported');
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        console.log('Service Worker registered:', registration);
        
        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;
        
        await requestPermission(registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    const requestPermission = async (registration: ServiceWorkerRegistration) => {
      try {
        console.log('Requesting permission...');
        const permission = await Notification.requestPermission();
        console.log('Permission status:', permission);

        if (permission === "granted") {
          // Subscribe to push service first
          try {
            const subscribeOptions = {
              userVisibleOnly: true,
              applicationServerKey: "BI5HgYOsNI0RuAhXlomJkLBAvEyoAGm6JQJTjYvXZL9mjUPY2k23ew6qu2K6gQBt2HYkIF0AJ3xkVvaEuuoU_cQ"
            };
            
            const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
            console.log('Push Subscription:', pushSubscription);

            // Now get FCM token
            if (registration.active) {
              console.log('Getting FCM token...');
              const token = await getToken(messaging, {
                vapidKey: "BI5HgYOsNI0RuAhXlomJkLBAvEyoAGm6JQJTjYvXZL9mjUPY2k23ew6qu2K6gQBt2HYkIF0AJ3xkVvaEuuoU_cQ",
                serviceWorkerRegistration: registration
              });
              console.log("FCM Token:", token);
              
              // Store token in localStorage or send to your server
              localStorage.setItem('fcm_token', token);
            }
          } catch (subscribeError) {
            console.error('Push subscription failed:', subscribeError);
            // Check if error is because of existing subscription
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
              await subscription.unsubscribe();
              // Retry subscription
              await requestPermission(registration);
            }
          }
        }
      } catch (error) {
        console.error("Permission request error:", error);
      }
    };

    // Start registration process
    registerServiceWorker();

    // Cleanup
    return () => {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          if (subscription) {
            subscription.unsubscribe();
          }
        });
      });
    };
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