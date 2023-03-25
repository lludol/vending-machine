import {
	Button, Container, Grid, TextField, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import useSignIn from '../hooks/useSignIn';

const validationSchema = yup.object({
	username: yup
		.string()
		.min(3, 'Username should be of minimum 3 characters length')
		.max(30, 'Username should be of maximum 30 characters length')
		.required('Username is required'),
	password: yup
		.string()
		.min(8, 'Password should be of minimum 8 characters length')
		.max(30, 'Password should be of maximum 30 characters length')
		.required('Password is required'),
});

const Signin = () => {
	const router = useRouter();
	const { loading, signIn } = useSignIn();

	const onSubmit = useCallback(async (values) => {
		await signIn(values);
		router.push('/');
	}, [router, signIn]);

	const {
		handleSubmit, handleChange,
		values, touched, errors,
	} = useFormik({
		initialValues: {
			username: '',
			password: '',
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
					Sign in
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
					<Button
						type="submit"
						fullWidth
						variant="contained"
						disabled={loading}
						sx={{ mt: 2, mb: 2 }}
					>
						SIGN IN
					</Button>
				</Box>
				<Grid container>
					<Grid item xs></Grid>
					<Grid item>
						<Link href="/signup">
							{'Don\'t have an account? Sign Up'}
						</Link>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default Signin;
