import defaultConfig, { config } from "@/config";

/**
 * Represents the configuration object, combining both the default configuration and custom configuration.
 */
export type Config = typeof defaultConfig & typeof config;

/**
 * Retrieves a specific configuration value based on the provided key.
 *
 * @param key The key of the configuration value to retrieve.
 * @returns The value corresponding to the provided key in the configuration object.
 */
export default function getConfig<K extends keyof Config>(
  key: K,
): Config[K] {
  return {
    ...defaultConfig,
    ...config,
  }[key];
}
