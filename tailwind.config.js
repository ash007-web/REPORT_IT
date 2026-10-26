/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Clash Display",
          "sans-serif",
        ],
        display: [
          "Clash Display",
          "sans-serif",
        ],
        body: [
          "Syne",
          "sans-serif",
        ],
      },

      colors: {
        campus: {
          background: "#F3F4F1",
          surface: "#FFFFFF",
          text: "#111827",
          secondary: "#374151",
          muted: "#6B7280",
          border: "#111827",
          strong: "#111827",
        },

        lost: {
          DEFAULT: "#E63946",
          soft: "#FCA5A5",
        },

        found: {
          DEFAULT: "#4361EE",
          soft: "#93C5FD",
        },

        radar: {
          cyan: "#4361EE",
        },
      },

      boxShadow: {
        "hard-orange": "8px 8px 0px #E63946",
        "hard-cyan": "8px 8px 0px #4361EE",
        "hard-white": "8px 8px 0px #FFFFFF",
        "hard-dark": "6px 6px 0px #111827",
        "hard-orange-sm": "5px 5px 0px #E63946",
        "hard-cyan-sm": "5px 5px 0px #4361EE",
      },

      backdropBlur: {
        brutal: "20px",
      },

      borderWidth: {
        3: "3px",
      },

      backgroundImage: {
        "campus-mesh": `
          radial-gradient(
            circle at 15% 20%,
            rgba(255, 94, 0, 0.05),
            transparent 28%
          ),
          radial-gradient(
            circle at 85% 30%,
            rgba(0, 184, 199, 0.05),
            transparent 30%
          ),
          radial-gradient(
            circle at 50% 100%,
            rgba(90, 50, 150, 0.03),
            transparent 35%
          )
        `,
      },

      transitionTimingFunction: {
        brutal: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },

  plugins: [],
};
