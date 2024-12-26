import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: null,
  stations: null,
  ltd: null,
  addItemModal: false,
  regions: null,
  cities: null,
  setUser: (user) => {
    set(() => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else localStorage.removeItem("user");
      return { user, users: null };
    });
  },
  setUsers: (users) => set((state) => ({ users })),
  setStations: (stations) => set((state) => ({ stations })),
  setLtd: (ltd) => set((state) => ({ ltd })),
  setRegions: (regions) => set((state) => ({ regions })),
  setCities: (cities) => set((state) => ({ cities })),
  setAddItemModal: () =>
    set((state) => ({ addItemModal: !state.addItemModal })),
}));
