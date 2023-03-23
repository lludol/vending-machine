import useSWRImmutable from 'swr/immutable';
import { User } from '../models/user';
import http from '../utils/http';

export function useUser() {
	return useSWRImmutable<User>(
		'/users/me',
		async (url) => {
			const { data } = await http.get<User>(url);
			return data;
		},
	);
}
