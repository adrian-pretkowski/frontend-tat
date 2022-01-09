import {
	Button,
	Modal,
	Header,
	Image,
	Checkbox,
	Form,
	Message,
	Divider,
	Container,
	Item,
} from 'semantic-ui-react';
import steve from '../../../resources/steve.jpg';
import { useState, useEffect } from 'react/cjs/react.development';
import useAxios from '../../../utils/useAxios';

export const EditUserModal = ({
	openEditUserModal,
	closeEditUserModal,
	selectedUser,
	availableRoles,
}) => {
	let api = useAxios();

	//States of available Roles for selected User:
	const [userRole, setUserRole] = useState(false);
	const [managerRole, setManagerRole] = useState(false);
	const [adminRole, setAdminRole] = useState(false);
	const [superAdminRole, setSuperAdminRole] = useState(false);

	useEffect(() => {
		readRoles();
	});

	let readRoles = async () => {
		selectedUser.roles.forEach((userRole) => {
			if (userRole.name === 'ROLE_USER') {
				setUserRole(true);
			}
			if (userRole.name === 'ROLE_MANAGER') {
				setManagerRole(true);
			}
			if (userRole.name === 'ROLE_ADMIN') {
				setAdminRole(true);
			}
			if (userRole.name === 'ROLE_SUPER_ADMIN') {
				setSuperAdminRole(true);
			}
		});
	};

	let assignRole = async (username, roleName) => {
		let response = await api
			.post('/role/addtouser', {
				username: username,
				roleName: roleName,
			})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	return (
		<Modal
			onClose={() => closeEditUserModal(false)}
			onOpen={() => openEditUserModal(true)}
			open={openEditUserModal}
		>
			<Modal.Header>
				Edit user: {`${selectedUser.firstName} ${selectedUser.lastName}`}
			</Modal.Header>
			<Modal.Content image>
				<Image size='small' src={steve} wrapped />
				<Modal.Description>
					<Header>Edit Informations:</Header>
					<p>ToDo...</p>
					<p>{selectedUser.username}</p>
				</Modal.Description>
			</Modal.Content>
			<Modal.Content>
				<Modal.Description>
					<Header>Edit User Roles:</Header>
					<p>
						<Checkbox
							onChange={(e) => {
								setUserRole(!userRole);
								if (userRole === false) {
									assignRole(selectedUser.username, e.target.innerHTML);
								}
							}}
							checked={userRole}
							label='ROLE_USER'
						/>
					</p>
					<p>
						<Checkbox
							onChange={(e) => {
								setManagerRole(!managerRole);
								if (managerRole === false) {
									assignRole(selectedUser.username, e.target.innerHTML);
								}
							}}
							checked={managerRole}
							label='ROLE_MANAGER'
						/>
					</p>
					<p>
						<Checkbox
							onChange={(e) => {
								setAdminRole(!adminRole);
								if (adminRole === false) {
									assignRole(selectedUser.username, e.target.innerHTML);
								}
							}}
							checked={adminRole}
							label='ROLE_ADMIN'
						/>
					</p>
					<p>\
						<Checkbox
							onChange={(e) => {
								setSuperAdminRole(!superAdminRole);
								if (superAdminRole === false) {
									assignRole(selectedUser.username, e.target.innerHTML);
								}
							}}
							checked={superAdminRole}
							label='ROLE_SUPER_ADMIN'
						/>
					</p>
				</Modal.Description>
			</Modal.Content>
			<Modal.Actions>
				<Button color='black' onClick={() => closeEditUserModal(false)}>
					Nope
				</Button>
				<Button
					content="Yep, that's me"
					labelPosition='right'
					icon='checkmark'
					onClick={() => closeEditUserModal(false)}
					positive
				/>
			</Modal.Actions>
		</Modal>
	);
};
