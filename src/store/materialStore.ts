import { create } from "zustand";

interface MaterialStoreState {
  selectedMaterial: { url: string; name: string } | null;
  setSelectedMaterial: (material: { url: string; name: string } | null) => void;
  isImporterOpen: boolean;
  setIsImporterOpen: (isOpen: boolean) => void;
}

const useMaterialStore = create<MaterialStoreState>((set) => ({
  selectedMaterial: null,
  setSelectedMaterial: (material) => set({ selectedMaterial: material }),
  isImporterOpen: false,
  setIsImporterOpen: (isOpen) => set({ isImporterOpen: isOpen }),
}));

export default useMaterialStore;
