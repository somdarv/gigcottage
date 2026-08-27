/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": '#44180f',
        "primary2": '#352522',
        "gig-black": '#363636',
        "secondary": '#dfb854',

        // v2 palette. Ground and text follow aman.com; the gold is the original
        // brand #dfb854 desaturated so it stops fighting the bone.
        "bone": '#fdfbf8',
        "bone-2": '#f5f0e9',
        "oxblood": '#44180f',
        "oxblood-deep": '#2b0f09',
        "ink": '#2a2320',
        "ink-soft": '#6e675f',
        "gold": '#c9a24a',
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-source-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
