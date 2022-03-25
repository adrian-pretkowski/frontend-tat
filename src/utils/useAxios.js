import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { API_BASE_URL, API_REFRESH_TOKEN } from '../static/apiServices';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const useAxios = () => {
	const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

	const axiosInstance = axios.create({
		baseURL: API_BASE_URL,
		headers: {
			Authorization: `Bearer ${authTokens?.access_token}`,
		},
	});

	axiosInstance.interceptors.request.use(async (req) => {
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

		setAuthTokens(response.data);
		setUser(jwt_decode(response.data.access_token));
		
		localStorage.setItem(
			'roles',
			JSON.stringify(jwt_decode(response.data.access_token).roles)
		);

		req.headers.Authorization = `Bearer ${response.data.access_token}`;

		return req;
	});

	return axiosInstance;
};

export default useAxios;
