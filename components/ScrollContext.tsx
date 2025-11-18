"use client";

import { createContext, useContext } from "react";

export const ScrollContext = createContext(0);

export function useScrollIndex() {
  return useContext(ScrollContext);
}
