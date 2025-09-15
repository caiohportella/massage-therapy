import { create } from "zustand";

type CalendarStore = {
  cache: Record<string, { data: Date[]; timestamp: number }>;
  fetched: Set<string>;
  getCachedDates: (key: string) => Date[] | undefined;
  isFetched: (key: string) => boolean;
  setDates: (key: string, dates: Date[]) => void;
};

const CACHE_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  cache: {},
  fetched: new Set(),

  getCachedDates: (key) => {
    const entry = get().cache[key];
    if (entry && Date.now() - entry.timestamp < CACHE_EXPIRY_MS) {
      return entry.data;
    }
    return undefined;
  },

  isFetched: (key) => get().fetched.has(key),

  setDates: (key, dates) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: { data: dates, timestamp: Date.now() },
      },
      fetched: new Set(state.fetched).add(key),
    }));
  },
}));
