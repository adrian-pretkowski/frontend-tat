import {
	Button,
	Modal,
	Header,
	Form,
	Message,
	Divider,
	Container,
	Item,
	Icon,
} from 'semantic-ui-react';
import { useState } from 'react';
import useAxios from '../../utils/useAxios';

export const DeleteUserModal = ({
	openDeleteUserModal,
	closeDeleteUserModal,
	selectedUser,
}) => {
	let api = useAxios();


	let deleteUser = async (e) => {
		let response = await api
			.delete('/user/delete/' + selectedUser.id)
			.then(function (response) {
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	return (
		<Modal
			basic
			onClose={() => {
				closeDeleteUserModal(false);
			}}
			onOpen={() => openDeleteUserModal(true)}
			open={openDeleteUserModal}
			size='small'
		>
			<Header icon>
				<Icon name='archive' />
				Delete user: {selectedUser.username}, id: {selectedUser.id}
			</Header>
			<Modal.Content>
				<p>
					Are you sure you want to delete user{' '}
					<strong>{selectedUser.username}</strong>?
				</p>
			</Modal.Content>
			<Modal.Actions>
				<Button
					basic
					color='red'
					inverted
					onClick={() => {
						closeDeleteUserModal(false);
					}}
				>
					<Icon name='remove' /> No
				</Button>
				<Button
					color='green'
					inverted
					onClick={() => {
						deleteUser();
						window.location.reload(false);
					}}
				>
					<Icon name='checkmark' /> Yes
				</Button>
			</Modal.Actions>
		</Modal>
	);
};
