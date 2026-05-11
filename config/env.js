import { config } from "dotenv";

config({ path: ".env", quiet: true });

const env = {
  ...process.env,
  APP_ENV:
    process.env.npm_lifecycle_event === "dev"
      ? "development"
      : process.env.APP_ENV ?? "development",
};

export const APP_ENV = env.APP_ENV;
export const DB_HOST = env.DB_HOST ?? env.PROD_DB_HOST;
export const DB_USERNAME = env.DB_USERNAME ?? env.PROD_DB_USER;
export const DB_PASSWORD = env.DB_PASSWORD ?? env.PROD_DB_PASS;
export const DB_DEV_DATABASE = env.DB_DEV_DATABASE;
export const DB_DATABASE = env.DB_DATABASE ?? env.DB_NAME;
export const DB_PORT = env.DB_PORT;
export const DB_SSL = env.DB_SSL;
export const SECRET_KEY = env.SECRET_KEY;
export const APP_PORT = env.APP_PORT;
export const HUGGING_FACE_TRANSLATOR_API_URL =
  env.HUGGING_FACE_TRANSLATOR_API_URL;
export const OPENAI_API_KEY = env.OPENAI_API_KEY;
export const OPENAI_API_URL =
  env.OPENAI_API_URL ?? "https://api.openai.com/v1/chat/completions";
export const OPENAI_MODEL = env.OPENAI_MODEL ?? "gpt-4o-mini";
export const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;
export const OPENROUTER_API_URL =
  env.OPENROUTER_API_URL ?? "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_MODEL =
  env.OPENROUTER_MODEL ?? "openai/gpt-oss-120b:free";
export const OPENROUTER_SITE_URL =
  env.OPENROUTER_SITE_URL ?? "https://chabacano-translator.vercel.app";
export const OPENROUTER_APP_TITLE =
  env.OPENROUTER_APP_TITLE ?? "Chabacano Translator";
export const GEMINI_API_KEY = env.GEMINI_API_KEY;
export const GEMINI_API_URL =
  env.GEMINI_API_URL ?? "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_MODEL = env.GEMINI_MODEL ?? "gemini-2.5-flash";
export const TRANSLATION_REQUEST_TIMEOUT_MS = Number(
  env.TRANSLATION_REQUEST_TIMEOUT_MS ?? 60000
);
