import { useRouter } from 'next/router';
import {
	FunctionComponent,
	PropsWithChildren,
	ReactElement,
	useCallback, useContext, useEffect, useState,
} from 'react';
import TokenContext from '../contexts/TokenProvider';

export const publicRoutes = [
	'/signin',
	'/signup',
];

const ProtectedRoutes: FunctionComponent<PropsWithChildren> = (
	{ children },
) => {
	const router = useRouter();
	const {
		isTokenLoaded, token, setToken, loadTokenFromLocalStorage,
	} = useContext(TokenContext);
	const [isAuthorized, setIsAuthorized] = useState(false);

	const authCheck = useCallback((pathname: string) => {
		if (!publicRoutes.includes(pathname)) {
			if (isTokenLoaded && token) {
				setIsAuthorized(true);
			} else {
				setIsAuthorized(false);
				router.push('/signin');
			}
		} else {
			setIsAuthorized(true);
		}
	}, [router, isTokenLoaded, token, setIsAuthorized]);

	useEffect(() => {
		if (!isTokenLoaded) {
			loadTokenFromLocalStorage();
		} else {
			authCheck(router.pathname);
		}
	}, [authCheck, isTokenLoaded, loadTokenFromLocalStorage, router.pathname, setToken]);

	useEffect(() => {
		const routeChangeStart = () => {
			setIsAuthorized(false);
		};
		const routeChangeComplete = (url) => {
			authCheck(url);
		};

		router.events.on('routeChangeStart', routeChangeStart);
		router.events.on('routeChangeComplete', routeChangeComplete);

		return () => {
			router.events.off('routeChangeStart', routeChangeStart);
			router.events.off('routeChangeComplete', routeChangeComplete);
		};
	}, [authCheck, router.events]);

	if (!isAuthorized) {
		return null;
	}

	return children as ReactElement;
};

export default ProtectedRoutes;
