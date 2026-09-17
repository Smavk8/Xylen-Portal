import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { t as translateFn, TranslationKey } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ru',
  setLanguage: () => {},
  t: (key: TranslationKey) => key as string,
});

export const LanguageProvider: React.FC<{
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: React.ReactNode;
}> = ({ language, onLanguageChange, children }) => {
  const t = (key: TranslationKey) => translateFn(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: onLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
