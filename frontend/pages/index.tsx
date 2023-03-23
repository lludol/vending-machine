import {
	Box, Button, Container, Grid, Typography,
} from '@mui/material';
import { BuyerView } from '../components/buyer/BuyerView';
import { SellerView } from '../components/seller/SellerView';
import { useUser } from '../data/users.swr';
import useLogout from '../hooks/useLogout';

const Home = () => {
	const { logout } = useLogout();
	const { data: user } = useUser();

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
					<Grid item>
						<Button
							onClick={logout}
							color='error'
							fullWidth
							variant="contained"
							sx={{ mt: 2, mb: 2 }}
						>
								LOGOUT
						</Button>
					</Grid>
				</Grid>

				{ user?.role === 'seller' && <SellerView/> }
				{ user?.role === 'buyer' && <BuyerView/> }
			</Box>
		</Container>
	);
};

export default Home;
