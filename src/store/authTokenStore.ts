import { create } from "zustand";
import Cookies from "js-cookie";
import { tokenKey } from "../constants/tokenKey";

// Define the shape of our store
interface AuthStore {
  token: string | null;
  setToken: (value: string) => void;
  getToken: () => string | null;
  updateToken: (newToken: string) => void;
  deleteToken: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  // State to hold the token
  token: Cookies.get(tokenKey) || null,

  // Function to create/set the token
  setToken: (value: string) => {
    // Set the token in cookies with 30-day expiration
    Cookies.set(tokenKey, value, { expires: 30 });
    set({ token: value }); // Update the state
  },

  // Function to get/read the token
  getToken: () => {
    const token = Cookies.get(tokenKey) || null;
    set({ token }); // Sync state with the cookie
    return token;
  },

  // Function to update the token
  updateToken: (newToken: string) => {
    // Update the token with 30-day expiration
    Cookies.set(tokenKey, newToken, { expires: 30 });
    set({ token: newToken });
  },

  // Function to delete the token
  deleteToken: () => {
    Cookies.remove(tokenKey); // Remove the token from cookies
    set({ token: null }); // Reset the state
  },
}));

export default useAuthStore;
