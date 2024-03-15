import { colorize } from "./colorize";
import { Color, level } from "./logging";

export const LoggingConfig = {
  display<T extends unknown>(message: T, displayLevel: Color): string {
    const date = (new Date()).toISOString();

    return `[${date} ${colorize(displayLevel.toUpperCase(), level.indexOf(displayLevel))}] ${message}`;
  },
};
