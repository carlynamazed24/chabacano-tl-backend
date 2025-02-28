const ALLOWED_ORIGINS = [
  "https://chabacano-tl-frontend.vercel.app",
  "https://chabacano-translator.vercel.app",
  "http://localhost:5173",
];

const DB_TABLES = {
  DICTIONARY: "dictionary_tb",
  HOMEPAGE: "home_page_content_tb",
  STORY: "story_headers_tb",
  SUBHEADERS: "story_subheaders_tb",
  ADMINS: "admins_tb",
};

export { ALLOWED_ORIGINS, DB_TABLES };
