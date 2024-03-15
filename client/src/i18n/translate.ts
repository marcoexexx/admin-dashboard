import { i18n, TxPath } from "./i18n";

export function translate(key: TxPath) {
  return i18n.t(key);
}
