/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      'upload.wikimedia.org',
      'fqtizehthryjvqxqvpkl.supabase.co',
    ], // Added domain configuration
  },
  // Add any other existing config options here
};

export default config;