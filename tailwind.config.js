module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        nintendo: {
         primary: "#fef906",
         secondary: "#4f3c89",
         accent: "#f4290f",
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
