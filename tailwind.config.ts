import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "#2FBFA6",
        secondary: "#36E1BC",
        error: "#E4626F",
        "ijo-muda": "#9CFFEA",
        biru: "#18BEFD",
        merah: "#FF0000",
      },
    },
  },
  plugins: [],
} satisfies Config;
