/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'], // Font sans mặc định
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'], // Font serif
        mono: ['Courier New', 'Courier', 'monospace'], // Font monospace
        display: ['Oswald', 'sans-serif'], // Font cho tiêu đề
        body: ['Lora', 'serif'], // Font cho body
        heading: ['Playfair Display', 'serif'], // Font cho heading
      },
    },
  },
  plugins: [],
}
