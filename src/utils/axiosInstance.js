//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
//----------------------DEPRECATED----------------------
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { API_BASE_URL, API_REFRESH_TOKEN } from '../static/apiServices';

let authTokens = localStorage.getItem('authTokens')
	? JSON.parse(localStorage.getItem('authTokens'))
	: null;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		Authorization: `Bearer ${authTokens?.access_token}`,
	},
});

axiosInstance.interceptors.request.use(async (req) => {
	if (!authTokens) {
		authTokens = localStorage.getItem('authTokens')
			? JSON.parse(localStorage.getItem('authTokens'))
			: null;
		req.headers.Authorization = `Bearer ${authTokens?.access_token}`;
	}

	const user = jwt_decode(authTokens.access_token);
	const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

	if (!isExpired) {
		return req;
	}

	const response = await axios.get(API_REFRESH_TOKEN, {
		headers: {
			Authorization: `Bearer ${authTokens?.refresh_token}`,
		},
	});

	localStorage.setItem('authTokens', JSON.stringify(response.data));
	req.headers.Authorization = `Bearer ${response.data.access_token}`;

	return req;
});

export default axiosInstance;
