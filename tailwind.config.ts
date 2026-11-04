import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        khroma: {
          DEFAULT: '#cbfa1f',
          hover: '#b8e619',
          dark: '#0d121f'
        }
      }
    }
  },
  plugins: [],
};
export default config;
