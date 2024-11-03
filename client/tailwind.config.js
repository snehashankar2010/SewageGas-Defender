module.exports = {
    content: ['./src/**/*.{js,jsx}'],
    safelist: [
        // CustomDialog Title
        {
            pattern: /text-(red|green|blue)-600/,
        },
        // CustomDialog border
        {
            pattern: /border-(red|green|blue)-300/,
        },
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            screens: {
                navsm: '670px',
            },
            transitionProperty: {
                height: 'max-h',
            },
        },
    },
    plugins: [],
};
