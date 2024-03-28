import { Local } from "@/i18n";

const flags: Record<Local, string> = {
  [Local.US]: "🇺🇸",
  [Local.JP]: "🇯🇵",
  [Local.MM]: "🇲🇲",
};

export function getUnicodeFlags(local: Local) {
  return flags[local];
}
