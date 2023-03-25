import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import ProtectedRoutes from '../components/ProtectedRoutes';
import { ToastContextProvider } from '../contexts/ToastProvider';
import { TokenContextProvider } from '../contexts/TokenProvider';
import theme from '../style/theme';
import createEmotionCache from '../utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>Vending machine</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<TokenContextProvider>
					<ToastContextProvider>
						<ProtectedRoutes>
							<Component {...pageProps} />
						</ProtectedRoutes>
					</ToastContextProvider>
				</TokenContextProvider>
			</ThemeProvider>
		</CacheProvider>
	);
}
