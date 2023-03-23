import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';
import { mutate } from 'swr';
import TokenContext from '../contexts/TokenProvider';

const useLogout = () => {
	const router = useRouter();
	const { clearToken } = useContext(TokenContext);

	const logout = useCallback(() => {
		mutate(
			() => true,
			undefined,
			{ revalidate: false },
		);
		clearToken();
		router.push('/signin');
	}, [clearToken, router]);

	return {
		logout,
	};
};

export default useLogout;
