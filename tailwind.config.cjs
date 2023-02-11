const daisyui = require('daisyui');
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			sans: ['Lato', 'sans-serif'],
			serif: ['Gabriela', 'serif'],
			display: ['Raleway', 'sans-serif'],
		},
		extend: {}
	},

	plugins: [forms, typography, daisyui]
};

module.exports = config;
