import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: null,
  stations: null,
  ltd: null,
  addItemModal: false,
  regions: null,
  cities: null,
  licenses: [],
  ngsertificates: [],
  humidity: [],
  gasanalyzers: [],
  prodinsurance: [],
  lifeinsurance: [],
  ecology: [],
  setUser: (user) => {
    set(() => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      return { user };
    });
  },
  setUsers: (users) => set((state) => ({ users })),
  setStations: (stations) => set((state) => ({ stations })),
  setLtd: (ltd) => set((state) => ({ ltd })),
  setRegions: (regions) => set((state) => ({ regions })),
  setCities: (cities) => set((state) => ({ cities })),
  setLicenses: (licenses) => set((state) => ({ licenses })),
  setNgsertificates: (ngsertificates) => set((state) => ({ ngsertificates })),
  setHumidity: (humidity) => set((state) => ({ humidity })),
  setGasanalyzers: (gasanalyzers) => set((state) => ({ gasanalyzers })),
  setProdinsurance: (prodinsurance) => set((state) => ({ prodinsurance })),
  setLifeinsurance: (lifeinsurance) => set((state) => ({ lifeinsurance })),
  setEcology: (ecology) => set((state) => ({ ecology })),
  setAddItemModal: () =>
    set((state) => ({ addItemModal: !state.addItemModal })),
}));
