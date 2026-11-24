"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { kz } from "./kz";
import { ru } from "./ru";

export type Language = "kz" | "ru";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof kz;
}

const I18nContext = createContext<I18nContextType>({
  lang: "kz",
  setLang: () => {},
  t: kz,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("kz");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang") as Language;
    if (saved === "kz" || saved === "ru") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("preferred_lang", newLang);
  };

  const t = lang === "kz" ? kz : ru;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
