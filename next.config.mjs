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
};

export default config;
