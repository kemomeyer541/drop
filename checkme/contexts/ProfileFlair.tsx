import React, { createContext, useContext, useState } from "react";

export type FlairType = "paw" | "heart" | "fire" | "sparkles" | "skull";

type Ctx = {
  flair: FlairType;
  setFlair: (f: FlairType) => void;
};
const ProfileFlairCtx = createContext<Ctx | null>(null);

export function ProfileFlairProvider({ children }: { children: React.ReactNode }) {
  const [flair, setFlair] = useState<FlairType>("paw");
  return <ProfileFlairCtx.Provider value={{ flair, setFlair }}>{children}</ProfileFlairCtx.Provider>;
}

export const useProfileFlair = () => {
  const v = useContext(ProfileFlairCtx);
  if (!v) throw new Error("useProfileFlair outside provider");
  return v;
};