/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

// const headers = [
//   "Accept", "Accept-Version", "Content-Length",
//   "Content-MD5", "Content-Type", "Date", "X-Api-Version",
//   "X-CSRF-Token", "X-Requested-With",
// ];

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // env: {
  //   ALLOWED_NEXT_AUTH_URLS:
  //     ["https://(.+\\.|)domain.com/?", "https://(.+\\.|)someotherdomain.com/?"], ALLOWED_HEADERS:
  //     headers.join(", "), CORS_DEFAULTS: {
  //       methods: [], // making this blank by default - you have to override it per-call
  //       origin: "*",
  //       allowedHeaders: headers.join(", "),
  //       credentials: true,
  //     },
  // }, async headers() {
  //   return [
  //     {
  //       source: "/api/(.*)", headers: [
  //         {
  //           key: "Access-Control-Allow-Credentials", value:
  //             "true"
  //         }, {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*"
  //         }, {
  //           key: "Access-Control-Allow-Methods", value:
  //             "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  //         }, {
  //           key: "Access-Control-Allow-Headers", value:
  //             headers.join(", "),
  //         },
  //       ],
  //     },
  //   ];
  // }
};
export default config;
