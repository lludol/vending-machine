import { Snackbar } from '@mui/material';
import {
	createContext, FunctionComponent, PropsWithChildren, useCallback, useContext, useState,
} from 'react';
import { SWRConfig } from 'swr';
import TokenContext from './TokenProvider';

export interface ToastContextType {
	toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>(null);

export const ToastContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const {
		clearToken,
	} = useContext(TokenContext);

	const onClose = useCallback(() => {
		setOpen(false);
		setMessage('');
	}, []);

	const toast = useCallback((msg: string) => {
		setMessage(msg);
		setOpen(true);
	}, []);

	return (
		<ToastContext.Provider value={{
			toast,
		}}>
			<SWRConfig value={{
				onError: (error) => {
					if (error && error.response && error.response.status === 401) {
						clearToken();
					} else {
						toast('An error occurred. Please try again later.');
					}
				},
			}}>
				{children}

				{ open && <Snackbar
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					open={open}
					onClose={onClose}
					message={message}
					autoHideDuration={3000}
				/> }
			</SWRConfig>
		</ToastContext.Provider>
	);
};

export default ToastContext;
