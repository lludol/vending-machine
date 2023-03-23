import http from '../utils/http';

export const signin = async (values: { username: string, password: string }) => {
	const { data } = await http.post('/auth/signin', values);

	return data;
};

export default signin;
