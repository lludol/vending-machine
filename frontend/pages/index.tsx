import {
	Box, Button, Container, Grid, Typography,
} from '@mui/material';
import { useCallback, useContext, useState } from 'react';
import { BuyerView } from '../components/buyer/BuyerView';
import { SellerView } from '../components/seller/SellerView';
import { ModalProfile } from '../components/user/ModalProfile';
import ToastContext, { ToastContextType } from '../contexts/ToastProvider';
import { deleteUser } from '../data/users';
import { useUser } from '../data/users.swr';
import useLogout from '../hooks/useLogout';

const Home = () => {
	const { toast } = useContext<ToastContextType>(ToastContext);
	const { logout } = useLogout();
	const { data: user } = useUser();

	const [profileOpen, setProfileOpen] = useState(false);
	const openProfileModal = useCallback(() => { setProfileOpen(true); }, []);
	const closeProfileModal = useCallback(() => { setProfileOpen(false); }, []);

	const onDeleteMyAccount = useCallback(async () => {
		if (!user) {
			return;
		}

		try {
			await deleteUser(user.id);
			toast('Your account has been deleted');
			closeProfileModal();
			logout();
		} catch {
			toast('An unknown error occurred.');
		}
	}, [closeProfileModal, logout, toast, user]);

	return (
		<Container>
			<Box
				sx={{
					display:       'flex',
					flexDirection: 'column',
					alignItems:    'center',
				}}>

				<Grid container alignItems="center">
					<Grid item xs>
						<Typography align="left" variant="h5" component="h1" >
							Welcome {user?.username}
						</Typography>
					</Grid>
					<Grid item sx={{
						display:       'flex',
						flexDirection: 'row',
					}}>
						<Button
							onClick={openProfileModal}
							color='info'
							variant="contained"
							sx={{ mt: 2, mb: 2, mr: 1 }}
						>
							MY PROFILE
						</Button>
						<Button
							onClick={logout}
							color='error'
							variant="contained"
							sx={{ mt: 2, mb: 2 }}
						>
								LOGOUT
						</Button>
					</Grid>
				</Grid>

				{ user?.role === 'seller' && <SellerView/> }
				{ user?.role === 'buyer' && <BuyerView/> }
				{ profileOpen && user
					&& <ModalProfile
						open={profileOpen}
						onClose={closeProfileModal}
						user={user}
						onDeleteMyAccount={onDeleteMyAccount}
					/>
				}
			</Box>
		</Container>
	);
};

export default Home;
