import {
	Modal, Box, Typography, Button, FormControlLabel, FormLabel, Radio, RadioGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import {
	FunctionComponent, useCallback, useContext, useState,
} from 'react';
import * as yup from 'yup';
import ToastContext, { ToastContextType } from '../../contexts/ToastProvider';
import { deposit } from '../../data/users';
import { useUser } from '../../data/users.swr';
import { DepositPayload } from '../../models/user';

interface Props {
	open: boolean;
	onClose: () => void;
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
	deposit: yup
		.number()
		.oneOf([5, 10, 20, 50, 100], 'Deposit should be one of 5, 10, 20, 50, 100')
		.required('Deposit is required'),
});

export const ModalDeposit: FunctionComponent<Props> = ({ open, onClose }) => {
	const { mutate: mutateUser } = useUser();
	const [loading, setLoading] = useState(false);
	const { toast } = useContext<ToastContextType>(ToastContext);

	const onSubmit = useCallback(async (values: DepositPayload, { resetForm }) => {
		setLoading(true);
		try {
			await deposit(values);
			await mutateUser();
			toast(`$${values.deposit} has been deposited`);
			resetForm();

			onClose();
		} catch (error) {
			toast('An error occurred');
		}
		setLoading(false);
	}, [mutateUser, onClose, toast]);

	const { handleSubmit, values, handleChange } = useFormik({
		initialValues: {
			deposit: 5,
		},
		validationSchema,
		onSubmit,
	});

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle}>
				<Typography variant="h6" component="h2">
					Deposit coins
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<FormLabel id="deposit">Amount</FormLabel>
					<RadioGroup
						row
						name="deposit"
						value={values.deposit}
						onChange={handleChange}
					>
						<FormControlLabel value="5" control={<Radio required/>} label="5" />
						<FormControlLabel value="10" control={<Radio required/>} label="10" />
						<FormControlLabel value="20" control={<Radio required/>} label="20" />
						<FormControlLabel value="50" control={<Radio required/>} label="50" />
						<FormControlLabel value="100" control={<Radio required/>} label="100" />
					</RadioGroup>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={loading}
						sx={{ mt: 2, mb: 2 }}
					>
						Deposit
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
