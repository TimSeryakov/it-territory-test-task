module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                "brand-dark-primary": "#232323",
                "brand-dark-secondary": "#292929",
                "brand-border": "#383838",
                "brand-white": "#E0E0E0"
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
