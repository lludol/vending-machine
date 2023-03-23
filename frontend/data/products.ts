import { CreateProductPayload } from '../models/product';
import http from '../utils/http';

export const createProduct = async (values: CreateProductPayload) => {
	const { data } = await http.post('/products', values);

	return data;
};

export const updateProduct = async (id: number, values: CreateProductPayload) => {
	const { data } = await http.put(`/products/${id}`, values);

	return data;
};

export const deleteProduct = async (id: number) => {
	const { data } = await http.delete(`/products/${id}`);

	return data;
};
