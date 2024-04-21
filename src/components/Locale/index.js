import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "en.json";
import viTranslations from "vi.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            vi: {
                translation: viTranslations
            }
        },
        lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });