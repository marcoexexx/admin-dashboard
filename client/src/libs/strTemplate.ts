import { I18nOptions } from "../i18n";

export function strTemplate(str: string, context: I18nOptions) {
  for (const key in context) {
    const value = context[key];
    const placeholder = `{{${key}}}`;
    if (value) str = str.replace(placeholder, value);
  }
  return str;
}
