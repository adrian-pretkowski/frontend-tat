import React, { useState } from 'react';
import {
	Button,
	Container,
	Divider,
	Segment,
	Table,
	Header,
	Loader,
	Card,
	Popup,
	Input,
} from 'semantic-ui-react';
import useAxios from '../utils/useAxios';

const HomePage = () => {
	const [openModal, setOpenModal] = useState(false);
	let [readFileName, setReadFileName] = useState('');
	let [fileArray, setFileArray] = useState([]);
	const [loadData, setLoadData] = useState(false);

	let handleFileChange = (e) => {
		setLoadData(true);
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.readAsText(file);

		reader.onload = () => {
			setReadFileName(file.name);
			let fileContentArray = reader.result.split(/\r\n|\n/);
			for (let line = 0; line < fileContentArray.length - 1; line++) {
				setFileArray((oldArray) => [...oldArray, fileContentArray[line]]);
				// console.log(line + '--->' + fileContentArray[line]);
			}
			setLoadData(false);
		};
	};

	let api = useAxios();

	let addTestPlan = async (fileLines) => {
		let response = await api
			.post('/testplans/save', fileLines, {
				headers: { 'Content-Type': 'application/json' },
			})
			.then(function (response) {
				if (response.status === 200) {
					console.log('Success!');
				}
			})
			.catch(function (error) {
				if (error.response.status === 400) {
					console.log('Error!');
				}
			});
	};

	return (
		<Container style={{ marginTop: '7em' }}>
			<h2>Hello! It is a Home Page!</h2>
			<h3>You are logged to the home page...</h3>

			<Button
				onClick={() => {
					let myJson = JSON.stringify(fileArray);
					console.log(myJson);
					addTestPlan(myJson);
				}}
			>
				TEST
			</Button>

			<Divider></Divider>
			<div>
				<Input type='file' onChange={handleFileChange}></Input>
			</div>

			<Divider></Divider>
			<p>FileName: {readFileName}</p>
			<p>FileContent: </p>
			{loadData ? (
				<Loader active inline='centered'>
					Loading...
				</Loader>
			) : (
				fileArray.map((line, index) => <p key={index}>{line}</p>)
			)}
		</Container>
	);
};

export default HomePage;
