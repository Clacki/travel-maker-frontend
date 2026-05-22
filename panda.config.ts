import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,

  // app, components 폴더 포함
  include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  exclude: [],

  theme: {
    extend: {},
  },

  outdir: "styled-system",
});
