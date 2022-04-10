import React, { useState } from 'react';
import {
	Button,
	Container,
	Divider,
	Input,
	Loader,
	Message,
	Modal,
	Segment,
} from 'semantic-ui-react';
import useAxios from '../../utils/useAxios';

export const AddVehicleModal = ({
	openAddVehicleModal,
	closeAddVehicleModal,
}) => {
	let api = useAxios();
	const [loadData, setLoadData] = useState(false);
	let [readFileName, setReadFileName] = useState('');
	let [fileArray, setFileArray] = useState([]);
	const [readyToValidate, setReadyToValidate] = useState(false);
	const [fileIsValid, setFileIsValid] = useState(false);

	// Vehicle data to validation file
	const [vehicleVin, setVehicleVin] = useState('');
	const [vehicleTestDate, setVehicleTestDate] = useState('');
	const [vehicleTyp, setVehicleTyp] = useState('');
	const [vehicleTestPlan, setVehicleTestPlan] = useState('');
	let [vehicleStartKennNr, setVehicleStartKennNr] = useState('');
	let [vehicleEndKennNr, setVehicleEndKennNr] = useState('');
	let [vehicleKennNr, setVehicleKennNr] = useState('');

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
			}
			setReadyToValidate(true);
			setLoadData(false);
		};
	};

	let findBetweenCharacters = (textLine, firstChar, secondChar) => {
		let result = textLine.match(new RegExp(firstChar + '(.*)' + secondChar));
		return result[1];
	};

	function validateFile(file) {
		for (let line = 0; line < file.length; line++) {
			if (file[line].includes('Test date')) {
				setVehicleTestDate(findBetweenCharacters(file[line], "'", "'"));
			}
			if (file[line].includes('Vehicle VIN')) {
				setVehicleVin(findBetweenCharacters(file[line], "'", "'"));
			}
			if (file[line].includes('Vehicle typ')) {
				setVehicleTyp(findBetweenCharacters(file[line], "'", "'"));
			}
			if (file[line].includes('Current TestPlan')) {
				setVehicleTestPlan(findBetweenCharacters(file[line], "'", "'"));
			}
			if (file[line].includes('Start with KNR')) {
				setVehicleStartKennNr(findBetweenCharacters(file[line], "'", "'"));
			}
			if (file[line].includes('Done with KNR')) {
				setVehicleEndKennNr(findBetweenCharacters(file[line], "'", "'"));
			}
		}
		setFileIsValid(true);
	}

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
		<Modal
			onClose={() => {
				closeAddVehicleModal(false);
			}}
			onOpen={() => closeAddVehicleModal(true)}
			open={openAddVehicleModal}
		>
			<Modal.Header>Add new Vehicle</Modal.Header>
			<Modal.Content>
				<Modal.Description>
					<Container>
						<Segment>
							Select File:
							<Input
								type='file'
								fluid
								onChange={handleFileChange}
								onClick={() => {
									setReadyToValidate(false);
									setFileIsValid(false);
								}}
							/>
							{loadData && readyToValidate ? (
								<Loader active inline='centered'>
									Loading...
								</Loader>
							) : (
								readyToValidate && 
                                (
									<Container>
										<Divider hidden />
										<Button
											content='Validate'
											color='blue'
											fluid
											onClick={() => validateFile(fileArray)}
										/>
									</Container>
								)
							)}
						</Segment>
						{fileIsValid && (
							<Segment>
								<p>Test Date: {vehicleTestDate}</p>
								<p>Vehicle VIN: {vehicleVin}</p>
								<p>
									Vehicle KennNr:{' '}
									{vehicleStartKennNr === vehicleEndKennNr &&
										vehicleStartKennNr}
								</p>
								<p>Vehicle typ: {vehicleTyp}</p>
								<p>TestPlan: {vehicleTestPlan}</p>
							</Segment>
						)}
					</Container>
				</Modal.Description>
				{vehicleTestDate !== '' &&
				vehicleVin !== '' &&
				vehicleVin.length === 17 &&
				vehicleStartKennNr === vehicleEndKennNr &&
				vehicleStartKennNr.length === 14 &&
				vehicleTyp !== '' &&
				vehicleTestPlan !== ''
					? fileIsValid && (
							<Message positive>
								Given Textfile is Valid. You can add Vehicle to database...
							</Message>
					  )
					: fileIsValid && (
							<Message negative>
								Something went wrong - File is not Valid!
							</Message>
					  )}
			</Modal.Content>
			<Modal.Actions>
				{vehicleTestDate !== '' &&
					vehicleVin !== '' &&
					vehicleVin.length === 17 &&
					vehicleStartKennNr === vehicleEndKennNr &&
					vehicleStartKennNr.length === 14 &&
					vehicleTyp !== '' &&
					vehicleTestPlan !== '' &&
					fileIsValid && (
						<Button
							content='Add Vehicle'
							color='green'
							onClick={() => {
								let myJson = JSON.stringify(fileArray);
								addTestPlan(myJson);
							}}
						/>
					)}
				<Button
					color='black'
					content='Close'
					onClick={() => {
						closeAddVehicleModal(false);
					}}
				/>
			</Modal.Actions>
		</Modal>
	);
};
