import {
	useState, createContext, useCallback, FunctionComponent, PropsWithChildren,
} from 'react';

export interface TokenContextType {
	token: string | null;
	loadTokenFromLocalStorage: () => void;
	setToken: (token: string, save?: boolean) => void;
	clearToken: () => void;
	isTokenLoaded: boolean;
}

const TokenContext = createContext<TokenContextType>(null);

export const TokenContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [token, setToken] = useState();
	const [isTokenLoaded, setIsTokenLoaded] = useState(false);

	const setTokenCb = useCallback((newToken, save = false) => {
		if (save) {
			localStorage.setItem('token', newToken);
		}
		setToken(newToken);
		setIsTokenLoaded(true);
	}, []);

	const clearToken = useCallback(() => {
		localStorage.clear();
		setToken(null);
		setIsTokenLoaded(true);
	}, []);

	const loadTokenFromLocalStorage = useCallback(() => {
		const localToken = localStorage.getItem('token');
		if (!localToken || localToken === 'null') {
			clearToken();
		} else {
			setTokenCb(localToken);
		}
	}, [clearToken, setTokenCb]);

	return (
		<TokenContext.Provider value={{
			token,
			loadTokenFromLocalStorage,
			setToken: setTokenCb,
			clearToken,

			isTokenLoaded,
		}}>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenContext;
