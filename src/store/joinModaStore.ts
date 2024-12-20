import { create } from "zustand";

// Define the shape of our store
interface JoinUsStore {
  isOpen: boolean;
  changeOpenState: (value: boolean) => void;
  getIsOpen: () => boolean;
}

const useJoinUsStore = create<JoinUsStore>((set, get) => ({
  isOpen: false,

  // Function to update the open state
  changeOpenState: (value: boolean) => {
    set({ isOpen: value });
  },

  // Function to get the current open state
  getIsOpen: () => {
    return get().isOpen;
  },
}));

export default useJoinUsStore;
