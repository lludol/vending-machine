import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { blue, red } from '@mui/material/colors';

export const roboto = Roboto({
	weight:   ['300', '400', '500', '700'],
	subsets:  ['latin'],
	display:  'swap',
	fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const theme = createTheme({
	palette: {
		primary: {
			main: blue[500],
		},
		error: {
			main: red[500],
		},
	},
	typography: {
		fontFamily: roboto.style.fontFamily,
	},
});

export default theme;
