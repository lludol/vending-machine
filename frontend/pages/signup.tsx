import {
	Button, Container, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createUser } from '../data/users';
import ToastContext, { ToastContextType } from '../contexts/ToastProvider';
import { UserCreatePayload } from '../models/user';

const validationSchema = yup.object({
	username: yup
		.string()
		.trim('Please remove leading and trailing spaces')
		.min(3, 'Username should be of minimum 8 characters length')
		.max(30, 'Username should be of maximum 30 characters length')
		.strict()
		.required('Username is required'),
	password: yup
		.string()
		.min(8, 'Password should be of minimum 8 characters length')
		.max(30, 'Password should be of maximum 30 characters length')
		.required('Password is required'),
	passwordCheck: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Passwords must match')
		.required('Password is required'),
	role: yup
		.string()
		.oneOf(['buyer', 'seller'], 'Role should be either buyer or seller')
		.required('Role is required'),
});

const Signup = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { toast } = useContext<ToastContextType>(ToastContext);

	const onSubmit = useCallback(async (values: UserCreatePayload) => {
		setLoading(true);
		try {
			await createUser(values);
			toast('Account created, you can now sign in.');
			router.push('/signin');
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
	}, [router, toast]);

	const {
		handleSubmit, handleChange,
		errors, touched, values,
	} = useFormik({
		initialValues: {
			username:      '',
			password:      '',
			passwordCheck: '',
			role:          'buyer',
		},
		validationSchema,
		onSubmit,
	});

	return (
		<Container maxWidth="xs">
			<Box
				sx={{
					marginTop:     8,
					display:       'flex',
					flexDirection: 'column',
					alignItems:    'center',
				}}>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
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

					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						value={values.password}
						onChange={handleChange}
						error={touched.password && Boolean(errors.password)}
						helperText={(touched.password && errors.password && typeof errors.password === 'string') && errors.password}
						autoComplete="current-password"
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						name="passwordCheck"
						label="Confirm password"
						type="password"
						id="passwordCheck"
						value={values.passwordCheck}
						onChange={handleChange}
						error={touched.passwordCheck && Boolean(errors.passwordCheck)}
						helperText={(touched.passwordCheck && errors.passwordCheck && typeof errors.passwordCheck === 'string') && errors.passwordCheck}
						autoComplete="current-password"
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

					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={loading}
						sx={{ mt: 2, mb: 2 }}
					>
						SIGN UP
					</Button>
				</Box>
				<Grid container>
					<Grid item xs></Grid>
					<Grid item>
						<Link href="/signin">
							{'Already have an account? Sign In'}
						</Link>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default Signup;
