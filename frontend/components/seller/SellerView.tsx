import {
	Box, Button,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { ModalCreateProduct } from './ModalCreateProduct';
import { TableProducts } from './TableProducts';

export const SellerView = () => {
	const [open, setOpen] = useState(false);
	const [productId, setProductId] = useState(null);

	const openModal = useCallback(() => {
		setOpen(true);
	}, []);
	const closeModal = useCallback(() => {
		setOpen(false);
		setProductId(null);
	}, []);

	const onEdit = useCallback((id: number) => {
		setProductId(id);
		openModal();
	}, [openModal]);

	return (
		<>
			<Box>
				<Button
					onClick={openModal}
					variant="contained"
					sx={{ mt: 2, mb: 2 }}
				>
					Create a product
				</Button>
				<TableProducts onEdit={onEdit}/>
			</Box>

			<ModalCreateProduct
				open={open}
				onClose={closeModal}
				productId={productId}
			/>
		</>

	);
};
