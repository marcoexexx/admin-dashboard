import en, { Translations } from "./en";

import { getStore, setStore } from "@/libs/storage";
import { strTemplate } from "@/libs/strTemplate";
import _get from "lodash/get";
import jp from "./jp";
import mm from "./mm";

const LANGUAGE_PREFIX: "language" = "language";

export const Local = {
  US: "US",
  JP: "JP",
  MM: "MM",
} as const;
export type Local = keyof typeof Local;

export const localString: Record<Local, string> = {
  [Local.US]: "English",
  [Local.JP]: "Japan",
  [Local.MM]: "Myanmar",
};

export type I18nOptions = {
  [K: string]: string | undefined;
};

export type I18n = {
  translations: Record<Local, Translations>;
  local: Local;
  t: (key: TxPath, options?: I18nOptions) => string;
  load: (lang: Local) => void;
};

export const i18n: I18n = {
  translations: {
    [Local.US]: en,
    [Local.JP]: jp,
    [Local.MM]: mm,
  },
  local: getStore<Local>(LANGUAGE_PREFIX) || Local.US,

  t(key, options) {
    const localPrefix =
      this.translations[this.local as keyof I18n["translations"]];
    let msg = _get(localPrefix, key);
    if (options) msg = strTemplate(_get(localPrefix, key), options);
    return msg;
  },

  load(lang: Local) {
    setStore(LANGUAGE_PREFIX, lang);
    this.local = lang;
  },
};

type RecusiveKeyOfHandleValue<TValue, Text extends string> = TValue extends
  any[] ? Text
  : TValue extends object ? `${Text}.${RecusiveKeyOf<TValue>}`
  : Text;

type RecusiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string)]: RecusiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`
  >;
}[keyof TObj & string];

export type TxPath = RecusiveKeyOf<Translations>;
