import { Container, Divider, Header, Icon, Segment } from 'semantic-ui-react';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import useAxios from '../utils/useAxios';
import { Card, Button, Image } from 'semantic-ui-react';
import steve from '../resources/steve.jpg';
import './styles/AdminPage.css';
import { AddRoleModal } from '../components/Modal/AddRoleModal/AddRoleModal';
import { AddUserModal } from '../components/Modal/AddUserModal/AddUserModal';
import { DeleteUserModal } from '../components/Modal/DeleteUserModal/DeleteUserModal';
import { EditUserModal } from '../components/Modal/EditUserModal/EditUserModal';

export const AdminPage = () => {
	let [users, setUsers] = useState([]);
	let [roles, setRoles] = useState([]);
	let { authTokens, logoutUser } = useContext(AuthContext);

	let currentUserRoles = localStorage.getItem('roles');

	//contains selected user after click on button in list
	let [selectedUser, setSelectedUser] = useState();

	let api = useAxios();

	useEffect(
		() => {
			getUsers();
			getRoles();
		},
		[],
		[]
	);

	let getUsers = async () => {
		let response = await api
			.get('/users', {})
			.then(function (response) {
				if (response.status === 200) {
					setUsers(response.data);
				}
			})
			.catch(function (error) {
				if (error.response.status === 403) {
					console.log('Something went wrong!');
					logoutUser();
				}
			});
	};

	let getRoles = async () => {
		let response = await api
			.get('/roles', {})
			.then(function (response) {
				if (response.status === 200) {
					setRoles(response.data);
				}
			})
			.catch(function (error) {
				if (error.response.status === 403) {
					console.log('Something went wrong...');
				}
			});
	};

	/**
	 * **************************************************
	 * *****************Modal Controls*******************
	 * **************************************************
	 */

	//AddRoleModal
	const [openRoleModal, setOpenRoleModal] = useState(false);
	//AddUserModal
	const [openUserModal, setOpenUserModal] = useState(false);
	//DeleteUserModal
	const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
	//EditUserModal
	const [openEditUserModal, setOpenEditUserModal] = useState(false);

	return (
		<Container>
			<div className='admin-header'>
				<Header as='h1'>
					<Icon name='settings' />
					<Header.Content>
						Admin Dashboard
						<Header.Subheader>Users management</Header.Subheader>
					</Header.Content>
				</Header>
			</div>
			<Divider horizontal></Divider>
			<Segment>
				<Header as='h2'>
					<Header.Content>Roles in database:</Header.Content>
				</Header>
				{openRoleModal && (
					<AddRoleModal
						openRoleModal={openRoleModal}
						closeRoleModal={setOpenRoleModal}
					/>
				)}
				<Container>
					<Card.Group itemsPerRow={3}>
						{roles.map((role, index) => (
							<Card key={index}>
								<Card.Content>
									<Card.Header>{role.name}</Card.Header>
								</Card.Content>
							</Card>
						))}
					</Card.Group>
				</Container>
			</Segment>

			<Segment>
				<Header as='h2'>
					<Header.Content>Users in database:</Header.Content>
				</Header>
				{currentUserRoles.includes('ROLE_SUPER_ADMIN') && (
					<div className='button-container'>
						<Button
							onClick={() => setOpenUserModal(true)}
							animated
							color='green'
						>
							<Button.Content visible>Add User</Button.Content>
							<Button.Content hidden>
								<Icon name='add' />
							</Button.Content>
						</Button>
					</div>
				)}
				{openUserModal && (
					<AddUserModal
						openUserModal={openUserModal}
						closeUserModal={setOpenUserModal}
					/>
				)}
				<Card.Group itemsPerRow={3}>
					{users.map((user, index) => (
						<Card key={index}>
							<Card.Content>
								<Image floated='right' size='mini' src={steve} />
								<Card.Header>{`${user.firstName} ${user.lastName}`}</Card.Header>
								<Card.Meta>Username: {user.username}</Card.Meta>
								<Card.Meta>email: {user.email}</Card.Meta>
								{user.roles.map((role, index) => (
									<Card.Description key={index}>
										Role: {role.name}
									</Card.Description>
								))}
							</Card.Content>
							{currentUserRoles.includes('ROLE_SUPER_ADMIN') && (
								<Card.Content extra>
									<div className='ui two buttons'>
										<Button
											onClick={() => {
												setSelectedUser(user);
												setOpenEditUserModal(true);
											}}
											inverted
											color='blue'
										>
											Edit
										</Button>
										<Button
											onClick={() => {
												setSelectedUser(user);
												setOpenDeleteUserModal(true);
											}}
											inverted
											color='red'
										>
											Delete
										</Button>
									</div>
								</Card.Content>
							)}
						</Card>
					))}
				</Card.Group>
				{openDeleteUserModal && (
					<DeleteUserModal
						openDeleteUserModal={openDeleteUserModal}
						closeDeleteUserModal={setOpenDeleteUserModal}
						selectedUser={selectedUser}
					></DeleteUserModal>
				)}
				{openEditUserModal && (
					<EditUserModal
						openEditUserModal={openEditUserModal}
						closeEditUserModal={setOpenEditUserModal}
						selectedUser={selectedUser}
						availableRoles={roles}
					></EditUserModal>
				)}
			</Segment>
		</Container>
	);
};

export default AdminPage;
