/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4F46E5', // Indigo 600
                    light: '#818CF8',   // Indigo 400
                    dark: '#3730A3',    // Indigo 800
                },
                secondary: {
                    DEFAULT: '#EC4899', // Pink 500
                    light: '#F472B6',
                },
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',
                info: '#3B82F6',
                body: '#F8FAFC', // Slate 50
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
