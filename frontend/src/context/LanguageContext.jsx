import { createContext, useContext, useEffect, useState } from "react";

import { translations } from "../utils/translations.js";

const LanguageContext = createContext(null);

const STORAGE_KEY = "refmatch-language";

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || "fr";
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((currentLanguage) => (currentLanguage === "fr" ? "en" : "fr"));
    };

    const t = (key) => {
        return translations[language][key] || translations.fr[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}