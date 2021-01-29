module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: { // gruvbox theme colors
                "gb-dark-hard": "#1C2021",
                "gb-dark-medium": "#282828",
                "gb-dark-soft": "#3C3836",
                "gb-text": "#7c6f64", // 8E7F70
                "gb-light": "#fbf1c7", // FFE7C9
                "gb-red": "#cc241d",
                "gb-red-light": "#fb4934",
                "gb-blue": "#458588",
                "gb-blue-light": "#83a598",
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
