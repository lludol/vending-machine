import {
	Modal, Box, Typography, TextField, Button, Radio, FormControlLabel, RadioGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import {
	FunctionComponent, useCallback, useContext, useState,
} from 'react';
import * as yup from 'yup';
import ToastContext, { ToastContextType } from '../../contexts/ToastProvider';
import { updateUser } from '../../data/users';
import { useUser } from '../../data/users.swr';
import { User, UserUpdatePayload } from '../../models/user';

interface Props {
	open: boolean;
	onClose: () => void;
	user: User;
	onDeleteMyAccount: () => void;
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
	username: yup
		.string()
		.trim('Please remove leading and trailing spaces')
		.min(3, 'Username should be of minimum 8 characters length')
		.max(30, 'Username should be of maximum 30 characters length')
		.strict(),
	role: yup
		.string()
		.oneOf(['buyer', 'seller'], 'Role should be either buyer or seller'),
	password: yup
		.string()
		.min(8, 'Password should be of minimum 8 characters length')
		.max(30, 'Password should be of maximum 30 characters length'),
	passwordCheck: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const ModalProfile: FunctionComponent<Props> = ({
	open, onClose, user, onDeleteMyAccount,
}) => {
	const [loading, setLoading] = useState(false);
	const { toast } = useContext<ToastContextType>(ToastContext);
	const { mutate: mutateUser } = useUser();

	const onSubmit = useCallback(async (values: Partial<UserUpdatePayload>, { resetForm }) => {
		setLoading(true);
		try {
			await updateUser(user.id, values);
			await mutateUser();
			toast('Profile updated');
			resetForm();
			onClose();
		} catch (e) {
			if (e.code === 'ERR_BAD_REQUEST') {
				if (e.response.data.message === 'USERNAME_EXISTS') {
					toast('Username already exists.');
				} else {
					toast('Please review the form and try again.');
				}
			} else {
				toast('An unknown error occurred.');
			}
		}
		setLoading(false);
	}, [user, mutateUser, toast, onClose]);

	const {
		values, errors, touched,
		handleChange, handleSubmit,
	} = useFormik({
		initialValues: {
			username:      user.username,
			role:          user.role,
			password:      '',
			passwordCheck: '',
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
					Update profile
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						fullWidth
						id="username"
						label="Username"
						name="username"
						value={values.username}
						onChange={handleChange}
						error={touched.username && Boolean(errors.username)}
						helperText={(touched.username && errors.username && typeof errors.username === 'string') && errors.username}
						autoComplete="nickname"
						autoFocus
					/>

					<RadioGroup
						row
						name="role"
						value={values.role}
						onChange={handleChange}
					>
						<FormControlLabel value="buyer" control={<Radio required />} label="Buyer" />
						<FormControlLabel value="seller" control={<Radio required />} label="Seller" />
					</RadioGroup>

					<TextField
						margin="normal"
						fullWidth
						id="password"
						label="New password"
						name="password"
						type="password"
						value={values.password}
						onChange={handleChange}
						error={touched.password && Boolean(errors.password)}
						helperText={(touched.password && errors.password && typeof errors.password === 'string') && errors.password}
						autoComplete="new-password"
					/>

					<TextField
						margin="normal"
						fullWidth
						id="passwordCheck"
						label="Confirm password"
						name="passwordCheck"
						type="password"
						value={values.passwordCheck}
						onChange={handleChange}
						error={touched.passwordCheck && Boolean(errors.passwordCheck)}
						helperText={(touched.passwordCheck && errors.passwordCheck && typeof errors.passwordCheck === 'string') && errors.passwordCheck}
						autoComplete="new-password"
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={loading}
						sx={{ mt: 2, mb: 2 }}
					>
						Update
					</Button>
					<Button
						onClick={onDeleteMyAccount}
						color="error"
						fullWidth
						variant="contained"
						disabled={loading}
					>
						Delete my account
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
