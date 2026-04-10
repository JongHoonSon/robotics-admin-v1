/**
 * Centralized API configuration.
 * All values are read from environment / constants — never hardcode inline.
 */
export const API_CONFIG = {
  BASE_URL:
    "https://9y7qmb3g0k.execute-api.ap-northeast-2.amazonaws.com" as const,
  REGION: "ap-northeast-2" as const,
  SERVICE: "execute-api" as const,
} satisfies Record<string, string>;
