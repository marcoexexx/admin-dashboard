import en, { Translations } from "./en";

import { getStore, setStore } from "@/libs/storage";
import { strTemplate } from "@/libs/strTemplate";
import _get from "lodash/get";

const LANGUAGE_PREFIX: "language" = "language";

export const countries = {
  en: "English",
  my: "Myanmar",
};

export type Local = keyof typeof countries;

export type I18nOptions = {
  [K: string]: string;
};

export type I18n = {
  translations: {
    [K: string]: Translations;
  };
  local: Local; // keyof I18n["translations"],
  t: (key: TxPath, options?: I18nOptions) => string;
  load: (lang: Local) => void;
};

export const i18n: I18n = {
  translations: { en },
  local: getStore<keyof typeof countries>(LANGUAGE_PREFIX) || "en",

  t(key, options) {
    const localPrefix = this.translations[this.local as keyof I18n["translations"]];
    let msg = _get(localPrefix, key);
    if (options) msg = strTemplate(_get(localPrefix, key), options);
    return msg;
  },

  load(lang: Local) {
    setStore(LANGUAGE_PREFIX, lang);
    this.local = lang;
  },
};

type RecusiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[] ? Text
  : TValue extends object ? `${Text}.${RecusiveKeyOf<TValue>}`
  : Text;

type RecusiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string)]: RecusiveKeyOfHandleValue<TObj[TKey], `${TKey}`>;
}[keyof TObj & string];

export type TxPath = RecusiveKeyOf<Translations>;
