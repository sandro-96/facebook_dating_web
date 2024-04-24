import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./components/Locale/en.json"
import viTranslations from "./components/Locale/vi.json"

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
        lng: "vi",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });
export default i18n;