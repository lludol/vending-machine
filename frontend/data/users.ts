import {
	BuyPayload, BuyResponse, DepositPayload, Role,
} from '../models/user';
import http from '../utils/http';

export const createUser = async (values: { username: string, password: string, role: Role }) => {
	const { data } = await http.post('/users', values);

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
