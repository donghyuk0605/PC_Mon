// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // ✅ 추가해야 함
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // 기존 App Router용
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
