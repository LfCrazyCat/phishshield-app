// i18n.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  /* ===================== NORWEGIAN ===================== */
  no: {
    tabs: {
      home: 'Hjem',
      checklist: 'Sjekkliste',
      quiz: 'Quiz',
      learn: 'Lær mer',
    },

    actions: {
      back: 'Tilbake',
      backToHome: 'Tilbake til Hjem',
    },

    onboarding: {
      slides: [
        { title: 'Velkommen 👋', body: 'Lær å avsløre phishing med quiz, sjekklister og praktiske tips.' },
        { title: 'Sjekk lenker 🔗', body: 'Hold over lenker og kontroller toppdomenet før du klikker.' },
        { title: 'Bruk 2FA 🔐', body: 'Aktiver tofaktor og bruk passordmanager for bedre sikkerhet.' },
      ],
      next: 'Neste',
      start: 'Kom i gang',
    },

    home: {
      title: 'Velkommen til PhishShield 🔒',
      subtitle: 'Velg kategori og test deg selv.',
      startQuiz: 'Start quiz',
      checklist: 'Sjekkliste',
      tip: 'Tips: 1) Sjekk avsender 2) Sjekk lenker 3) Bruk 2FA.',
      best: 'Beste i «{label}»: {score}/{total} ({pct}%)',
      categories: {
        blandet: 'Blandet',
        avsender: 'Avsender',
        lenker: 'Lenker',
        okonomi: 'Økonomi',
        kjarlighet: 'Kjærlighet',
        passord2fa: 'Passord / 2FA',
      },
    },

    checklist: {
      title: 'Før du klikker… ✅',
      items: [
        'Sjekk avsender: domene, e-post og telefonnummer',
        'Hold over lenken: er toppdomenet ekte?',
        'Ikke la deg stresse av tidsfrister og trusler',
        'Skriv aldri inn passord via en lenke',
        'Bruk 2FA og egne bokmerker',
        'Se etter stavefeil og generiske hilsener',
        'Ikke åpne mistenkelige vedlegg',
        'Bekreft via offisielle kanaler',
        'Rapportér mistenkelige meldinger',
        'Bytt passord ved mistanke',
      ],
      tip: 'Tips: Bruk passordmanager og unike passord.',
    },

    quiz: {
      start: 'Start quizen',
      choicePhish: 'Dette er PHISH',
      choiceSafe: 'Dette ser TRYGT ut',
      correct: 'Riktig!',
      wrong: 'Feil',
      next: 'Neste',
      resultTitle: 'Ferdig! 🎉',
      replay: 'Spill igjen',
      backHome: 'Til Hjem',
    },

    learn: {
      title: 'Lær mer 🔎',

      featuresTitle: 'Kjennetegn på phishing',
      features: [
        'Uvanlig avsender eller domene',
        'Hastverk, trusler eller «for godt til å være sant»',
        'Lenker som etterligner kjente tjenester',
        'Filer som ber om innlogging eller makroer',
      ],

      verifyTitle: 'Slik verifiserer du meldinger',
      verify: [
        'Gå selv til nettsiden via bokmerke eller app',
        'Kontroller domenet nøye',
        'Ring offisielle nummer – ikke de i meldingen',
      ],

      habitsTitle: 'Gode sikkerhetsvaner',
      habits: [
        'Unike passord for hver tjeneste',
        'Bruk passordmanager',
        'Aktiver tofaktorautentisering',
        'Hold enheter og apper oppdatert',
      ],

      sourcesTitle: 'Pålitelige kilder',
      sources: [
        'Nasjonal sikkerhetsmyndighet (NSM)',
        'NorCERT',
        'Politiet',
        'Banker og offentlige etater',
      ],

      aboutTitle: 'Om PhishShield',
      aboutText:
        'PhishShield hjelper deg å gjenkjenne og unngå phishing og digital svindel.',

      contactTitle: 'Kontakt',
      emailLabel: 'E-post',

      privacyTitle: 'Personvern',
    },
  },

  /* ===================== ENGLISH ===================== */
  en: {
    tabs: {
      home: 'Home',
      checklist: 'Checklist',
      quiz: 'Quiz',
      learn: 'Learn More',
    },

    actions: {
      back: 'Back',
      backToHome: 'Back to Home',
    },

    home: {
      title: 'Welcome to PhishShield 🔒',
      subtitle: 'Choose a category and test yourself.',
      startQuiz: 'Start quiz',
      checklist: 'Checklist',
      tip: 'Tip: 1) Check sender 2) Inspect links 3) Use 2FA.',
      categories: {
        blandet: 'Mixed',
        avsender: 'Sender',
        lenker: 'Links',
        okonomi: 'Economy',
        kjarlighet: 'Romance',
        passord2fa: 'Passwords / 2FA',
      },
    },

    checklist: {
      title: 'Before you click… ✅',
      items: [
        'Check the sender: domain, email and phone number',
        'Hover over links: is the top-level domain legitimate?',
        'Do not rush: urgency and threats are red flags',
        'Never enter passwords through a received link',
        'Use 2FA and your own bookmarks',
        'Look for spelling errors and generic greetings',
        'Do not open suspicious attachments',
        'Verify via official channels',
        'Report suspicious messages',
        'Change passwords if in doubt',
      ],
      tip: 'Tip: Use a password manager and unique passwords.',
    },

    quiz: {
      start: 'Start quiz',
      choicePhish: 'This is PHISH',
      choiceSafe: 'This looks SAFE',
      correct: 'Correct!',
      wrong: 'Incorrect',
      next: 'Next',
      resultTitle: 'Finished! 🎉',
      replay: 'Play again',
      backHome: 'Back to Home',
    },

    learn: {
      title: 'Learn more 🔎',

      featuresTitle: 'Signs of phishing',
      features: [
        'Unusual sender or domain',
        'Urgency or threats',
        'Links imitating known services',
        'Files requesting login or macros',
      ],

      verifyTitle: 'How to verify messages',
      verify: [
        'Visit websites via bookmarks or official apps',
        'Carefully inspect the domain',
        'Call official numbers – not those in the message',
      ],

      habitsTitle: 'Good security habits',
      habits: [
        'Use unique passwords',
        'Use a password manager',
        'Enable two-factor authentication',
        'Keep devices and apps updated',
      ],

      sourcesTitle: 'Trusted sources',
      sources: [
        'National Cyber Security Centre',
        'CERT',
        'Police',
        'Banks and government agencies',
      ],

      aboutTitle: 'About PhishShield',
      aboutText:
        'PhishShield helps you recognize and avoid phishing and online scams.',

      contactTitle: 'Contact',
      emailLabel: 'Email',

      privacyTitle: 'Privacy',
    },
  },
};

/* =========================================================
   CONTEXT
========================================================= */

const I18nContext = createContext();

export const I18nProvider = ({ children, defaultLang = 'no' }) => {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('phishshield_lang');
      if (saved) setLang(saved);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('phishshield_lang', lang).catch(() => {});
  }, [lang]);

  const t = (key, params) => {
    const parts = key.split('.');
    let value = parts.reduce((acc, k) => acc?.[k], translations[lang]);

    if (typeof value === 'string' && params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replaceAll(`{${k}}`, String(v));
      });
    }

    return value ?? key;
  };

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
