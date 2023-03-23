import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const http = axios.create({
	baseURL: API_URL,
	timeout: 10000,
});

http.interceptors.request.use((config) => {
	const token = window.localStorage.getItem('token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default http;
