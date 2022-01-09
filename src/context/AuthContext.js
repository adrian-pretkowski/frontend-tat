import { createContext, useState, useEffect } from 'react';
import { API_LOGIN, API_REFRESH_TOKEN } from '../static/apiServices';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
	let [authTokens, setAuthTokens] = useState(() =>
		localStorage.getItem('authTokens')
			? JSON.parse(localStorage.getItem('authTokens'))
			: null
	);

	let [user, setUser] = useState(() =>
		localStorage.getItem('authTokens')
			? jwt_decode(localStorage.getItem('authTokens'))
			: null
	);

	let [authRoles, setAuthRoles] = useState(() =>
		localStorage.getItem('roles')
			? JSON.parse(localStorage.getItem('roles'))
			: null
	);

	let navigate = useNavigate();

	let loginUser = async (e) => {
		e.preventDefault();
		const params = new URLSearchParams();
		params.append('username', e.target.username.value);
		params.append('password', e.target.password.value);

		const config = {
			headers: {
				'Access-Control-Allow-Origin': 'http://localhost:8080',
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Credentials': true,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};

		let response = await axios
			.post(API_LOGIN, params, config)
			.then(function (response) {
				return response;
			})
			.catch(function (error) {
				console.log(error);
				return error;
			});

		if (response.status === 200) {
			setAuthTokens(response.data);

			setUser(jwt_decode(response.data.access_token));
			localStorage.setItem('authTokens', JSON.stringify(response.data));

			setAuthRoles(
				JSON.stringify(jwt_decode(response.data.access_token).roles)
			);
			localStorage.setItem(
				'roles',
				JSON.stringify(jwt_decode(response.data.access_token).roles)
			);
			navigate('/');
		} else {
			alert('Something went wrong!');
		}
	};

	let logoutUser = () => {
		setAuthTokens(null);
		setUser(null);
		setAuthRoles(null);
		localStorage.removeItem('authTokens');
		localStorage.removeItem('roles');
		navigate('/login');
	};

	let contextData = {
		user: user,
		authTokens: authTokens,
		authRoles: authRoles,
		setAuthRoles: setAuthRoles,
		setAuthTokens: setAuthTokens,
		setUser: setUser,
		loginUser: loginUser,
		logoutUser: logoutUser,
	};

	return (
		<AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
	);
};

//---------------------------------------------------------------------
// console.log(response.data);
// console.log(response.status);
// console.log(response.statusText);
// console.log(response.headers['refresh_token']);
// console.log(response.config);
// authTokens = response.headers['access_token']
// refreshTokens = response.headers['refresh_token']
// console.log(authTokens)

//-----------------------------------------------------------------------

// let response = await fetch('http://localhost:8080/api/login', {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/x-www-form-urlencoded',
// 	},
// 	body: JSON.stringify({
// 		username: e.target.username.value,
// 		password: e.target.password.value,
// 	}),
// });

//--------------------------------------------------

// let response = await fetch('http://localhost:8080/api/login', {
// 	method: 'POST',
// 	mode: 'no-cors',
// 	headers: {
// 		'Accept': 'application/json',
// 		'Content-Type': 'application/x-www-form-urlencoded',
// 		'access-token': authTokens,
// 		'refresh-tokens': refreshTokens,
// 	},
// 	// body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value, })
// 	body: new URLSearchParams({
// 		username: e.target.username.value,
// 		password: e.target.password.value,
// 	}),
// })
// let data = await response.data.json();

// console.log('data', data);

// console.log('response', response);

//--------------------------------------------------
