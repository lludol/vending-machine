import type { AppProps } from 'next/app';
import ProtectedRoutes from '../components/ProtectedRoutes';
import { ToastContextProvider } from '../contexts/ToastProvider';
import { TokenContextProvider } from '../contexts/TokenProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<TokenContextProvider>
			<ToastContextProvider>
				<ProtectedRoutes>
					<Component {...pageProps} />
				</ProtectedRoutes>
			</ToastContextProvider>
		</TokenContextProvider>
	);
}
