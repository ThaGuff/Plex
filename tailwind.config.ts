import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pastel + retro palette
        cream: "#FFF9EC",
        bone: "#FBF1DC",
        ink: "#241638",
        ink2: "#3F2A66",
        ink3: "#7C6BA0",
        rule: "#E9DCC0",
        // Pastel pops
        pink: "#FF6B9D",
        pinkSoft: "#FFC3DC",
        mint: "#7BE3B5",
        mintSoft: "#CFF5E2",
        lavender: "#B79CFF",
        lavenderSoft: "#E6DAFF",
        peach: "#FFB58D",
        peachSoft: "#FFDCC4",
        sky: "#7CC4FF",
        skySoft: "#CDE6FF",
        sun: "#FFE066",
        sunSoft: "#FFF1A8",
        coral: "#FF8585",
        coralSoft: "#FFC9C9",
        lime: "#C6F26B",
        limeSoft: "#E7F8C2",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "ui-sans-serif", "system-ui"],
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        retro: "4px 4px 0 0 #241638",
        retroLg: "6px 6px 0 0 #241638",
        retroXl: "8px 8px 0 0 #241638",
        retroPink: "4px 4px 0 0 #FF6B9D",
        retroMint: "4px 4px 0 0 #7BE3B5",
        retroLavender: "4px 4px 0 0 #B79CFF",
      },
      borderWidth: {
        "3": "3px",
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
        floaty: "floaty 4s ease-in-out infinite",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
