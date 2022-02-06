import React, { useState } from 'react';
import {  Button } from 'semantic-ui-react';
import { AddRoleModal } from '../components/Modal/AddRoleModal/AddRoleModal';


const HomePage = () => {
	
	const [openModal, setOpenModal] = useState(false);



	return (
		<div>
			<h2>Hello! It is a Home Page!</h2>
			<h3>You are logged to the home page...</h3>

			<Button onClick={() => setOpenModal(true)}> TEST </Button>

			{openModal && <AddRoleModal closeModal={setOpenModal}/>}
			
			
		</div>
	);
};

export default HomePage;
