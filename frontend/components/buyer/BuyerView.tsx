import {
	Box, Button, Grid, Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useUser } from '../../data/users.swr';
import { TableProductsToBuy } from './TableProductsToBuy';
import { ModalDeposit } from './ModalDeposit';
import { ModalBuy } from './ModalBuy';
import { useReset } from '../../hooks/useReset';

export const BuyerView = () => {
	const { loading, reset } = useReset();

	const { data: user } = useUser();
	const [productId, setProductId] = useState(null);

	const [depositOpen, setDepositOpen] = useState(false);
	const [buyOpen, setBuyOpen] = useState(false);

	const openDepositModal = useCallback(() => { setDepositOpen(true); }, []);
	const closeDepositModal = useCallback(() => { setDepositOpen(false); }, []);

	const closeBuyModal = useCallback(() => { setBuyOpen(false); }, []);

	const onBuy = useCallback((id: number) => {
		setProductId(id);
		setBuyOpen(true);
	}, []);

	return (
		<>
			<Box>
				<Grid container alignItems="center">
					<Grid item xs>
						<Box sx={{
							display:       'flex',
							flexDirection: 'row',
							alignItems:    'center',
						}}>
							<Typography variant="h6" component="h2">
								Balance: ${user?.deposit}
							</Typography>
						</Box>
					</Grid>
					<Grid item>
						<Button
							onClick={openDepositModal}
							variant="contained"
							sx={{ mt: 2, mb: 2 }}
						>
							Deposit
						</Button>
						<Button
							disabled={loading || user?.deposit === 0}
							color="error"
							onClick={reset}
							variant="contained"
							sx={{ mt: 2, mb: 2, ml: 2 }}
						>
							Reset
						</Button>
					</Grid>
				</Grid>

				<TableProductsToBuy onBuy={onBuy}/>
			</Box>

			<ModalBuy open={buyOpen} onClose={closeBuyModal} productId={productId} />
			<ModalDeposit open={depositOpen} onClose={closeDepositModal} />
		</>
	);
};
