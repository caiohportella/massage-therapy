import { create } from "zustand";

type ServiceStore = {
  services: Service[] | null;
  isFetched: boolean;
  setServices: (services: Service[]) => void;
};

export const useServiceStore = create<ServiceStore>((set) => ({
  services: null,
  isFetched: false,
  setServices: (services) => set({ services, isFetched: true }),
}));
