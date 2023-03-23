import {
	Modal, Box, Typography, TextField, Button,
} from '@mui/material';
import { useFormik } from 'formik';
import {
	FunctionComponent, useCallback, useContext, useEffect, useState,
} from 'react';
import * as yup from 'yup';
import ToastContext, { ToastContextType } from '../../contexts/ToastProvider';
import { createProduct, updateProduct } from '../../data/products';
import { useProduct, useProducts } from '../../data/products.swr';
import { CreateProductPayload } from '../../models/product';

interface Props {
	open: boolean;
	onClose: () => void;
	productId?: number | null;
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
	amountAvailable: yup
		.number()
		.min(1, 'The minimum value is 1')
		.required('Amount available is required'),
	cost: yup
		.number()
		.min(1, 'The minimum value is 1')
		.required('Cost is required'),
	productName: yup
		.string()
		.min(3, 'Product name should be of minimum 3 characters length')
		.max(255, 'Product name should be of maximum 255 characters length'),
});

export const ModalCreateProduct: FunctionComponent<Props> = ({ open, onClose, productId }) => {
	const [loading, setLoading] = useState(false);
	const { toast } = useContext<ToastContextType>(ToastContext);
	const { mutate: mutateProducts } = useProducts();
	const { data: product, mutate: mutateProduct } = useProduct(productId);

	const onSubmit = useCallback(async (values: CreateProductPayload, { resetForm }) => {
		setLoading(true);
		try {
			if (product) {
				await updateProduct(product.id, values);
				await mutateProduct();
				toast('Product updated');
			} else {
				await createProduct(values);
				toast('Product created');
			}
			await mutateProducts();
			resetForm();

			onClose();
		} catch (error) {
			if (error.code === 'ERR_BAD_REQUEST') {
				if (error.response.data.message === 'PRODUCT_EXISTS') {
					toast('Product exists');
					setLoading(false);
					return;
				}
			}
			toast('An error occurred');
		}
		setLoading(false);
	}, [mutateProduct, mutateProducts, onClose, product, toast]);

	const {
		values, setValues, errors, touched,
		handleChange, handleSubmit,
	} = useFormik({
		initialValues: {
			productName:     '',
			amountAvailable: 1,
			cost:            5,
		},
		validationSchema,
		onSubmit,
	});

	useEffect(() => {
		if (open && product) {
			setValues({
				productName:     product.productName,
				amountAvailable: product.amountAvailable,
				cost:            product.cost,
			});
		}
	}, [open, product, setValues]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle}>
				<Typography variant="h6" component="h2">
					Create a product
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="productName"
						label="Product name"
						name="productName"
						value={values.productName}
						onChange={handleChange}
						error={touched.productName && Boolean(errors.productName)}
						helperText={(touched.productName && errors.productName && typeof errors.productName === 'string') && errors.productName}
						autoFocus
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						type="number"
						id="amountAvailable"
						label="Amount available"
						name="amountAvailable"
						value={values.amountAvailable}
						onChange={handleChange}
						error={touched.amountAvailable && Boolean(errors.amountAvailable)}
						helperText={(touched.amountAvailable && errors.amountAvailable && typeof errors.amountAvailable === 'string') && errors.amountAvailable}
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						type="number"
						id="cost"
						label="Price"
						name="cost"
						value={values.cost}
						onChange={handleChange}
						error={touched.cost && Boolean(errors.cost)}
						helperText={(touched.cost && errors.cost && typeof errors.cost === 'string') && errors.cost}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={loading}
						sx={{ mt: 2, mb: 2 }}
					>
							Create
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
