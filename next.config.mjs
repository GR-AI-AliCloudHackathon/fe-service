/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_LOW_RISK_THRESHOLD: process.env.NEXT_PUBLIC_LOW_RISK_THRESHOLD || '39',
    NEXT_PUBLIC_MEDIUM_RISK_THRESHOLD: process.env.NEXT_PUBLIC_MEDIUM_RISK_THRESHOLD || '69'
  },
};

export default config;
