import { create } from "zustand";
import Cookies from "js-cookie";
import { tokenKey } from "../constants/tokenKey";

// Define the shape of our store
interface AuthStore {
  token: string | null;
  fcmToken: string | null;
  setToken: (value: string) => void;
  getToken: () => string | null;
  updateToken: (newToken: string) => void;
  deleteToken: () => void;
  setFCMToken: (token: string | null) => void;
  getFCMToken: () => string | null;
}

const FCM_TOKEN_KEY = "fcm_token";

const useAuthStore = create<AuthStore>((set) => ({
  // State to hold the tokens
  token: Cookies.get(tokenKey) || null,
  fcmToken: localStorage.getItem(FCM_TOKEN_KEY) || null,

  // Function to create/set the auth token
  setToken: (value: string) => {
    Cookies.set(tokenKey, value, { expires: 30 });
    set({ token: value });
  },

  // Function to get/read the auth token
  getToken: () => {
    const token = Cookies.get(tokenKey) || null;
    set({ token });
    return token;
  },

  // Function to update the auth token
  updateToken: (newToken: string) => {
    Cookies.set(tokenKey, newToken, { expires: 30 });
    set({ token: newToken });
  },

  // Function to delete both tokens
  deleteToken: () => {
    Cookies.remove(tokenKey);
    localStorage.removeItem(FCM_TOKEN_KEY);
    set({ token: null, fcmToken: null });
  },

  // FCM Token management
  setFCMToken: (token: string | null) => {
    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(FCM_TOKEN_KEY);
    }
    set({ fcmToken: token });
  },

  getFCMToken: () => {
    const fcmToken = localStorage.getItem(FCM_TOKEN_KEY);
    set({ fcmToken });
    return fcmToken;
  },
}));

export default useAuthStore;
