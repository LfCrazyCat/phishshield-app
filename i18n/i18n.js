import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Oversettelser */
const translations = {
  no: {
    tabs: { home: 'Hjem', checklist: 'Sjekkliste', quiz: 'Quiz', learn: 'Lær mer' },
    actions: { back: 'Tilbake', backToHome: 'Tilbake til Hjem' },

    /** ONBOARDING */
    onboarding: {
      slides: [
        {
          title: 'Velkommen 👋',
          body: 'Lær å avsløre phishing med quiz, sjekklister og praktiske tips.',
        },
        {
          title: 'Sjekk lenker 🔗',
          body: 'Hold over lenker og kontroller toppdomenet før du klikker.',
        },
        {
          title: 'Bruk 2FA 🔐',
          body: 'Aktiver tofaktor og bruk passordmanager for bedre sikkerhet.',
        },
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
        passord2fa: 'Passord/2FA',
      },
    },

    checklist: {
      title: 'Før du klikker… ✅',
      items: [
        'Sjekk avsender: domene, e-post og telefonnummer',
        'Hold over/forhåndsvis lenken: er toppdomenet ekte?',
        'Ikke la deg stresse: tidsfrister og trusler = rødt flagg',
        'Skriv aldri inn passord via en lenke du fikk',
        'Bruk 2FA og egne bokmerker til pålogging',
        'Se etter stavefeil, dårlig språk og generiske hilsener',
        'Ikke åpne mistenkelige vedlegg (.zip/.exe/.html)',
        'Bekreft via offisielle kanaler (ring, app, nettbank)',
        'Rapportér mistenkelig e-post til IT eller leverandør',
        'Bytt passord og sjekk enhetslogg ved mistanke',
      ],
      tip: 'Tips: Bruk en passordmanager og unike passord – så tåler du at ett passord lekker.',
    },

    quiz: {
      progress: 'Spørsmål {i} av {total}',
      choicePhish: 'Dette er PHISH',
      choiceSafe: 'Dette ser TRYGT ut',
      feedbackPhish: 'Phish oppdaget 🧪',
      feedbackSafe: 'Ser trygt ut ✅',
      next: 'Neste',
      seeResult: 'Se resultat',
      resultTitle: 'Ferdig! 🎉',
      replay: 'Spill igjen',
      share: 'Del resultat',
      backHome: 'Til Hjem',
      explainer: 'Tips: Sjekk avsender, sjekk lenker, bruk 2FA.',
      bestNone: 'Ingen beste score ennå',
      bestText: 'Beste: {score}/{total} ({pct}%)',
      shareMsg:
        'Kategori: {category}\nResultat: {score}/{total} ({pct}%) i PhishShield 🛡️\nTest deg selv – lær å avsløre phishing!',
    },

    learn: {
      title: 'Lær mer 🔎',
      featuresTitle: 'Kjennetegn på phishing',
      features: [
        'Uvanlig avsender eller domene',
        'Hastverk, trusler eller «for godt til å være sant»',
        'Lenker som etterligner kjente tjenester',
        'Filer som ber om makroer eller pålogging',
      ],
      verifyTitle: 'Slik verifiserer du',
      verify: [
        'Gå selv til tjenesten via bokmerke eller app',
        'Sammenlign domenet nøye (vipps.no vs vipps-no-login.com)',
        'Ring offisielt nummer, ikke nummeret i meldingen',
      ],
      habitsTitle: 'Sikre vaner',
      habits: [
        'Unike passord + passordmanager',
        'Aktiver 2FA overalt',
        'Oppdater enheter og apper',
        'Rapportér mistenkelig aktivitet tidlig',
      ],
    },
  },

  en: {
    tabs: { home: 'Home', checklist: 'Checklist', quiz: 'Quiz', learn: 'Learn More' },
    actions: { back: 'Back', backToHome: 'Back to Home' },

    /** ONBOARDING */
    onboarding: {
      slides: [
        {
          title: 'Welcome 👋',
          body: 'Learn how to spot phishing using quizzes, checklists, and tips.',
        },
        {
          title: 'Check links 🔗',
          body: 'Hover over links and verify the top-level domain before clicking.',
        },
        {
          title: 'Use 2FA 🔐',
          body: 'Enable two-factor authentication and use a password manager.',
        },
      ],
      next: 'Next',
      start: 'Get started',
    },

    home: {
      title: 'Welcome to PhishShield 🔒',
      subtitle: 'Pick a category and test yourself.',
      startQuiz: 'Start quiz',
      checklist: 'Checklist',
      tip: 'Tips: 1) Check sender 2) Check links 3) Use 2FA.',
      best: 'Best in “{label}”: {score}/{total} ({pct}%)',
      categories: {
        blandet: 'Mixed',
        avsender: 'Sender',
        lenker: 'Links',
        okonomi: 'Finance',
        kjarlighet: 'Romance',
        passord2fa: 'Passwords/2FA',
      },
    },
  },
};

/** Context */
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
