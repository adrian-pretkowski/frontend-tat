import {
	Button,
	Modal,
	Header,
	Form,
	Message,
	Divider,
	Container,
	Item,
} from 'semantic-ui-react';
import React from 'react';
import useAxios from '../../../utils/useAxios';
import EmailValidator from 'email-validator';
import { useState } from 'react/cjs/react.development';

export const AddUserModal = ({ openUserModal, closeUserModal }) => {
	/**
	 * *************************************************************
	 * ***********************FORM VALIDATION***********************
	 * *************************************************************
	 */

	//FirstName
	const [fNameInput, setFirstName] = useState('');
	const [validFirstName, validateFirstName] = useState(true);

	//LastName
	const [lNameInput, setLastName] = useState('');
	const [validLastName, validateLastName] = useState(true);

	//Username
	const [usernameInput, setUsername] = useState('');
	const [validUsername, validateUsername] = useState(true);

	//Password
	const [passwordInput, setPassword] = useState('');
	const [validPassword, validatePassword] = useState(true);

	//Email
	const [emailInput, setEmail] = useState('');
	const [validEmail, validateEmail] = useState(true);

	// **************************************************************

	let api = useAxios();

	const [responseMessage, setResponseMessage] = useState([]);
	const [responseErrorHeader, setResponseErrorHeader] = useState('');
	const [responsePositiveStatus, setResponsePositiveStatus] = useState(false);
	const [responseBadRequest, setResponseBadRequest] = useState(false);
	const [responseUserExist, setResponseUserExist] = useState(false);

	let addUser = async (e) => {
		let response = await api
			.post('/user/save', {
				firstName: e.target.firstName.value,
				lastName: e.target.lastName.value,
				username: e.target.username.value,
				password: e.target.password.value,
				email: e.target.email.value,
			})
			.then(function (response) {
				if (response.status === 201) {
					setResponsePositiveStatus(true);
					setResponseMessage('User successfully added to database.');
					setResponseBadRequest(false);
					setResponseUserExist(false);
				}
			})
			.catch(function (error) {
				if (error.response.status === 400) {
					setResponseBadRequest(true);
					setResponsePositiveStatus(false);
					setResponseUserExist(false);
					setResponseMessage(Object.values(error.response.data));
				}
				if (error.response.status === 422) {
					setResponseUserExist(true);
					setResponseBadRequest(false);
					setResponsePositiveStatus(false);
					setResponseErrorHeader(error.response.headers.error_message);
					console.log(responseErrorHeader);
					console.log(error.response.headers);
				}
			});
	};

	return (
		<Modal
			onClose={() => {
				closeUserModal(false);
				window.location.reload(false);
			}}
			onOpen={() => closeUserModal(true)}
			open={openUserModal}
		>
			<Modal.Header>Add User</Modal.Header>
			<Modal.Content>
				<Modal.Description>
					<Form onSubmit={addUser}>
						<Form.Group unstackable widths={2}>
							<Form.Input
								name='firstName'
								label='First name'
								placeholder='First name'
								onChange={(e) => {
									setFirstName(e.target.value);

									if (fNameInput.length >= 1) {
										validateFirstName(true);
									} else {
										validateFirstName(false);
									}
								}}
								error={
									validFirstName
										? false
										: {
												content: 'First name should have at least 2 characters',
												pointing: 'below',
										  }
								}
							/>
							<Form.Input
								name='lastName'
								label='Last name'
								placeholder='Last name'
								onChange={(e) => {
									setLastName(e.target.value);

									if (lNameInput.length >= 1) {
										validateLastName(true);
									} else {
										validateLastName(false);
									}
								}}
								error={
									validLastName
										? false
										: {
												content: 'Last name should have at least 2 characters',
												pointing: 'below',
										  }
								}
							/>
						</Form.Group>
						<Form.Group widths={2}>
							<Form.Input
								name='username'
								label='Username'
								placeholder='Username'
								onChange={(e) => {
									setUsername(e.target.value);

									if (usernameInput.length >= 3) {
										validateUsername(true);
									} else {
										validateUsername(false);
									}
								}}
								error={
									validUsername
										? false
										: {
												content: 'Username should have at least 4 characters',
												pointing: 'below',
										  }
								}
							/>
							<Form.Input
								name='password'
								type='password'
								label='Password'
								placeholder='Password'
								onChange={(e) => {
									setPassword(e.target.value);

									if (passwordInput.length >= 3) {
										validatePassword(true);
									} else {
										validatePassword(false);
									}
								}}
								error={
									validPassword
										? false
										: {
												content: 'Password should have at least 4 characters',
												pointing: 'below',
										  }
								}
							/>
						</Form.Group>
						<Form.Group widths={2}>
							<Form.Input
								name='email'
								label='Email'
								placeholder='Email'
								onChange={(e) => {
									setEmail(e.target.value);
									validateEmail(EmailValidator.validate(e.target.value));
								}}
								error={
									validEmail
										? false
										: {
												content: 'Please enter a valid email adress.',
												pointing: 'below',
										  }
								}
							/>
						</Form.Group>
						<Button type='submit'>Submit</Button>

						<Divider horizontal></Divider>
					</Form>

					{responsePositiveStatus && (
						<Message
							success
							header='Your user registration was successful'
							content={responseMessage}
						/>
					)}

					{responseBadRequest && (
						<Message error>
							<Message.Header>Something went wrong</Message.Header>
							<Message.List>
								{responseMessage.map((element, index) => (
									<Message.Item key={index}>{element}</Message.Item>
								))}
							</Message.List>
						</Message>
					)}

					{responseUserExist && (
						<Message error>
							<Message.Header>Something went wrong</Message.Header>
							<Message.List>
								<Message.Item>{responseErrorHeader}</Message.Item>
							</Message.List>
						</Message>
					)}
				</Modal.Description>
			</Modal.Content>

			<Modal.Actions>
				<Button
					color='black'
					onClick={() => {
						window.location.reload(false);
						closeUserModal(false);
					}}
				>
					Cancel
				</Button>
			</Modal.Actions>
		</Modal>
	);
};
