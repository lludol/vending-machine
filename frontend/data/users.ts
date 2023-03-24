import {
	BuyPayload, BuyResponse, DepositPayload, UserCreatePayload, UserUpdatePayload,
} from '../models/user';
import http from '../utils/http';

export const createUser = async (values: UserCreatePayload) => {
	const { data } = await http.post('/users', values);

	return data;
};

export const updateUser = async (id: number, values: UserUpdatePayload) => {
	const { data } = await http.put(`/users/${id}`, {
		username:      values.username && values.username.length > 0 ? values.username : undefined,
		role:          values.role,
		password:      values.password && values.password.length > 0 ? values.password : undefined,
		passwordCheck: values.passwordCheck && values.passwordCheck.length > 0
			? values.passwordCheck : undefined,
	});

	return data;
};

export const deleteUser = async (id: number) => {
	const { data } = await http.delete(`/users/${id}`);

	return data;
};

export const deposit = async (values: DepositPayload) => {
	const { data } = await http.post('/deposit', values);

	return data;
};

export const buy = async (values: BuyPayload) => {
	const { data } = await http.post<BuyResponse>('/buy', values);

	return data;
};

export const reset = async () => {
	const { data } = await http.post('/reset', {});

	return data;
};
