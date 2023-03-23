import { useCallback, useContext, useState } from 'react';
import ToastContext, { ToastContextType } from '../contexts/ToastProvider';
import TokenContext from '../contexts/TokenProvider';
import signin from '../data/auth';

const useSignIn = () => {
	const [loading, setLoading] = useState(false);
	const { toast } = useContext<ToastContextType>(ToastContext);
	const { setToken } = useContext(TokenContext);

	const signInCb = useCallback(async (values) => {
		setLoading(true);
		try {
			const { token } = await signin(values);

			if (token) {
				setToken(token, true);
			}

			setLoading(false);
			return token;
		} catch (e) {
			if (e.code === 'ERR_BAD_REQUEST') {
				toast('Invalid username or password.');
			} else {
				toast('An unknown error occurred.');
			}

			setLoading(false);
			return null;
		}
	}, [setToken, toast]);

	return {
		signIn: signInCb,
		loading,
	};
};

export default useSignIn;
