import {
	Modal, Box, Typography, Button, TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import {
	FunctionComponent, useCallback, useContext, useEffect, useState,
} from 'react';
import * as yup from 'yup';
import ToastContext, { ToastContextType } from '../../contexts/ToastProvider';
import { useProduct, useProducts } from '../../data/products.swr';
import { buy } from '../../data/users';
import { useUser } from '../../data/users.swr';
import { useReset } from '../../hooks/useReset';
import { BuyPayload, BuyResponse } from '../../models/user';
import { Change } from './Change';

interface Props {
	open: boolean;
	onClose: () => void;
	productId: number | null;
}

const modalStyle = {
	position:  'absolute' as const,
	top:       '50%',
	left:      '50%',
	transform: 'translate(-50%, -50%)',
	width:     400,
	bgcolor:   'background.paper',
	border:    '2px solid #000',
	boxShadow: 24,
	p:         4,
};

const validationSchema = yup.object({
	amount: yup
		.number()
		.min(1, 'Amount must be at least 1')
		.required('Amount is required'),
});

export const ModalBuy: FunctionComponent<Props> = ({ open, onClose, productId }) => {
	const { loading: loadingReset, reset } = useReset();

	const { mutate: mutateProducts } = useProducts();
	const { data: product, mutate: mutateProduct } = useProduct(productId);
	const { mutate: mutateUser } = useUser();

	const [loading, setLoading] = useState(false);
	const { toast } = useContext<ToastContextType>(ToastContext);

	const [changeData, setChangeData] = useState<BuyResponse | null>(null);

	const onSubmit = useCallback(async (values: BuyPayload, { resetForm }) => {
		setLoading(true);
		try {
			const buyResponse = await buy(values);
			await mutateUser();
			await mutateProduct();
			await mutateProducts();

			if (buyResponse.remainingChange && buyResponse.remainingChange.length > 0) {
				setChangeData(buyResponse);
			} else {
				toast(`You bought ${values.amount} ${product.productName} for ${buyResponse.totalSpent}.`);
				resetForm();
				setChangeData(null);
				onClose();
			}
		} catch (error) {
			if (error.code === 'ERR_BAD_REQUEST') {
				toast('Please add more coins to buy this product!');
			} else {
				toast('An unknown error occurred.');
			}
		}
		setLoading(false);
	}, [mutateProduct, mutateProducts, mutateUser, onClose, product, toast]);

	const {
		values, setFieldValue, resetForm, handleChange, errors, touched,
		handleSubmit,
	} = useFormik({
		initialValues: {
			amount:    1,
			productId: 0,
		},
		validationSchema,
		onSubmit,
	});

	useEffect(() => {
		if (open && productId) {
			setFieldValue('productId', productId);
		}
	}, [open, product, productId, setFieldValue]);

	const onBeforeClose = useCallback(() => {
		setChangeData(null);
		onClose();
		resetForm();
	}, [onClose, resetForm]);

	const onKeep = useCallback(() => {
		onBeforeClose();
	}, [onBeforeClose]);

	const onReset = useCallback(async () => {
		await reset();
		onBeforeClose();
	}, [onBeforeClose, reset]);

	return (
		<Modal
			open={open}
			onClose={onBeforeClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<>
				{product && changeData && <Box sx={modalStyle}>
					<Typography variant="body1">
						You bought {values.amount} {product.productName} for ${changeData.totalSpent}.
						<br/>
						Here is your remaining change:
						<br/>
					</Typography>

					<Change change={changeData.remainingChange} />

					<Box sx={{
						mt:            2,
						display:       'flex',
						flexDirection: 'row',
						alignItems:    'center',
					}}>
						<Button
							onClick={onKeep}
							fullWidth
							color="success"
							variant="contained"
							sx={{ mr: 2 }}
						>
							Keep
						</Button>
						<Button
							onClick={onReset}
							disabled={loadingReset}
							fullWidth
							color="error"
							variant="contained"
						>
							Reset
						</Button>
					</Box>
				</Box> }

				{product && !changeData && <Box sx={modalStyle}>
					<Typography variant="h6" component="h2">
						Buy {values.amount > 0 ? values.amount : 0} {product.productName}
						{' for '}
						${values.amount > 0 ? values.amount * product.cost : 0}
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							type="number"
							id="amount"
							label="Amount available"
							name="amount"
							value={values.amount}
							onChange={handleChange}
							error={touched.amount && Boolean(errors.amount)}
							helperText={(touched.amount && errors.amount && typeof errors.amount === 'string') && errors.amount}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							disabled={loading}
							sx={{ mt: 2, mb: 2 }}
						>
							Buy
						</Button>
					</Box>
				</Box> }
			</>
		</Modal>
	);
};
