import { create } from "zustand";

type CalendarStore = {
  cache: Record<string, Date[]>;
  fetched: Set<string>;
  getCachedDates: (key: string) => Date[] | undefined;
  isFetched: (key: string) => boolean;
  setDates: (key: string, dates: Date[]) => void;
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  cache: {},
  fetched: new Set(),

  getCachedDates: (key) => get().cache[key],

  isFetched: (key) => get().fetched.has(key),

  setDates: (key, dates) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: dates,
      },
      fetched: new Set(state.fetched).add(key),
    }));
  },
}));
