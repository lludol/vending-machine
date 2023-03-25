import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';

const Page404 = () => (
	<Container>
		<Box
			sx={{
				display:       'flex',
				flexDirection: 'column',
				alignItems:    'center',
			}}>
			<Typography align="center" variant="h5" component="h1" >
				404 - Page not found
			</Typography>
			<Link href="/">Return</Link>
		</Box>
	</Container>
);

export default Page404;
