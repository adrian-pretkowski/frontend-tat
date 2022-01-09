import { Button, Modal, Header } from 'semantic-ui-react';
import React from 'react';

export const AddRoleModal = ({ openRoleModal, closeRoleModal }) => {
	return (
		<Modal
			onClose={() => closeRoleModal(false)}
			onOpen={() => closeRoleModal(true)}
			open={openRoleModal}
		>
			<Modal.Header>Add new Role</Modal.Header>
			<Modal.Content>

				<Modal.Description>
					<Header>Default Profile Image</Header>
					<p>
						We've found the following gravatar image associated with your e-mail
						address.
					</p>
					<p>Is it okay to use this photo?</p>
				</Modal.Description>
			</Modal.Content>
			<Modal.Actions>
				<Button color='black' onClick={() => closeRoleModal(false)}>
					Cancel
				</Button>
				<Button
					content="Add Role"
					labelPosition='right'
					icon='checkmark'
					onClick={() => closeRoleModal(false)}
					positive
				/>
			</Modal.Actions>
		</Modal>
	);
};
