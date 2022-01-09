import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
	let { loginUser } = useContext(AuthContext);

	return (
		<div className='form-center'>
			<form className='ui form' onSubmit={loginUser}>
				<h3>Log in!</h3>
				<div className='field'>
					<label>Username</label>
					<input
						type='text'
						name='username'
						placeholder='Enter your username...'
					/>
				</div>
				<div className='field'>
					<label>Password</label>
					<input
						type='password'
						name='password'
						placeholder='Enter your password...'
					/>
				</div>
				{/* <input type='submit' value='Log in' /> */}
				<button type='submit' className='ui button'>
					Log in
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
