import defaultConfig, { config } from "@/config";

export type Config = typeof defaultConfig & typeof config;

export default function getConfig<K extends keyof Config>(
  key: K,
): Config[K] {
  return {
    ...defaultConfig,
    ...config,
  }[key];
}
