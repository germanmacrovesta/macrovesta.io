"use client"
import { useState, useEffect } from 'react';

const useWeglotLang = () => {
  const [currentLang, setCurrentLang] = useState(null);

  useEffect(() => {
    // Set initial language
    if (window.Weglot) {
      console.log("Weglot", window.Weglot.getCurrentLang())
      setCurrentLang(window.Weglot.getCurrentLang());

      // Update language on change
      window.Weglot.on('languageChanged', (newLang) => {
        console.log("Weglot", newLang)
        setCurrentLang(newLang);
      });
    }

    // Cleanup listener
    return () => {
      if (window.Weglot) {
        window.Weglot.off('languageChanged');
      }
    };
  }, []);

  return currentLang;
};

export default useWeglotLang;
