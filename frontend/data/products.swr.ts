import useSWR from 'swr';
import { Product } from '../models/product';
import http from '../utils/http';

export const useProducts = () => useSWR(
	'/products',
	async (url) => {
		const { data } = await http.get<Product[]>(url);
		return data;
	},
);

export const useProduct = (id: number) => useSWR(
	['/products', id],
	async ([url, productId]) => {
		if (productId === null) {
			return null;
		}

		const { data } = await http.get<Product>(`${url}/${productId}`);
		return data;
	},
);
