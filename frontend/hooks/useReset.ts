import { useCallback, useContext, useState } from 'react';
import ToastContext, { ToastContextType } from '../contexts/ToastProvider';
import { reset } from '../data/users';
import { useUser } from '../data/users.swr';

export const useReset = () => {
	const { mutate: mutateUser } = useUser();
	const { toast } = useContext<ToastContextType>(ToastContext);
	const [loading, setLoading] = useState(false);

	const resetCb = useCallback(async () => {
		setLoading(true);
		try {
			await reset();
			await mutateUser();
			toast('Your balance has been reset.');
		} catch {
			toast('An error occurred while resetting your balance.');
		}
		setLoading(false);
	}, [mutateUser, toast]);

	return {
		loading,
		reset: resetCb,
	};
};
