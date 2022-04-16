module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        nintendo: {
         primary: "#d2c514",
         secondary: "#4f3c89",
         accent: "#c23f3d",
         neutral: "#211f20",
         "base-100": "#fefee6",
         info: "#CAE2E8",
         success: "#DFF2A1",
         warning: "#F7E488",
          error: "#F2B6B5",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
