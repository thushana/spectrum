import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Scan the `app` directory
    './components/**/*.{js,ts,jsx,tsx}', // Optional: for components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
