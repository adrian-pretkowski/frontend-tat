import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
	Button,
	Card,
	Container,
	Divider,
	Loader,
	Header,
	Icon,
	Search,
	Segment,
} from 'semantic-ui-react';
import useAxios from '../utils/useAxios';
import { SingleFunctionModal } from '../components/Modal/SingleFunctionModal';

export const FunctionViewPage = () => {
	let api = useAxios();

	useEffect(() => {
		getDistinctVehicles();
	}, []);

	//Tooltip Options
	let [isTooltip, setIsTooltip] = useState(true);
	let [tooltipIcon, setTooltipIcon] = useState('close');

	//-------------------------------------------------
	//-----ToDo:Change this to separate component------
	//-------------------------------------------------

	//useState for distinct Vehicles
	let [vehicleOptions, setVehicleOptions] = useState([]);
	let [selectedDistinctVehicle, setSelectedDistinctVehicle] = useState('');
	let [isVehicleSelected, setIsVehicleSelected] = useState(false);

	//Get distinct Vehicles
	let getDistinctVehicles = async () => {
		let response = await api
			.get('/vehicles/distinct')
			.then(function (response) {
				if (response.status === 200) {
					setVehicleOptions(response.data);
				}
			});
	};

	//useState for distinct EcuNames
	let [distinctEcus, setDistinctEcus] = useState([]);
	const [loadEcuData, setLoadEcuData] = useState(false);

	//Get distinct ecuNames based on selected Vehicle
	let getDistinctEcuNamesBasedOnVehicleTyp = async (choosenVehicle) => {
		setLoadEcuData(true);
		if (choosenVehicle !== '') {
			let response = await api
				.get(`/ecus/distinct-names/${choosenVehicle}`)
				.then(function (response) {
					if (response.status === 200) {
						setDistinctEcus(response.data);
					}
				});
		}
		setLoadEcuData(false);
	};

	//Searching State
	let [searchTerm, setSearchTerm] = useState('');
	let [searchFunctionTerm, setSearchFunctionTerm] = useState('');
	let [isEcuSelected, setIsEcuSelected] = useState(false);

	//useState for distinct FunctionNames
	const [loadFunctionData, setLoadFunctionData] = useState(false);
	let [selectedEcu, setSelectedEcu] = useState('');
	let [distinctFunctionNames, setDistinctFunctionNames] = useState([]);

	let getDistinctFunctionNamesBasedOnVehicleTypAndEcuName = async (
		choosenVehicle,
		choosenEcu
	) => {
		setLoadFunctionData(true);
		if (choosenVehicle !== '' && choosenEcu !== '') {
			let response = await api
				.get(`/functions/distinct-names/${choosenVehicle}/${choosenEcu}`)
				.then(function (response) {
					if (response.status === 200) {
						setDistinctFunctionNames(response.data);
					}
					setLoadFunctionData(false);
				});
		}
	};

	//SingleFunctionDetails Modal
	const [openFunctionDetailsModal, setOpenFunctionDetailsModal] =
		useState(false);
	const [selectedFunction, setSelectedFunction] = useState();

	//-------------------------------------------------
	//-------------------------------------------------
	//-------------------------------------------------

	return (
		<Container style={{ marginTop: '7em' }}>
			<Container>
				<Segment>
					<Header as='h2' floated='left' style={{ backgroundcolor: 'red' }}>
						<Icon className='asterisk' /> Function View
					</Header>
					<Button
						floated='right'
						icon={tooltipIcon}
						onClick={() => {
							setIsTooltip(!isTooltip);
							if (isTooltip === true) {
								setTooltipIcon('angle double down');
							} else {
								setTooltipIcon('close');
							}
						}}
					/>
					<Divider clearing />

					{isTooltip && (
						<Container>
							<Segment>
								<Header as='h3'>
									Select Vehicle
									<strong>
										{isVehicleSelected && `: ${selectedDistinctVehicle}`}
									</strong>
								</Header>
								<Divider clearing />
								<Card.Group itemsPerRow={2} textAlign={'center'}>
									{vehicleOptions.map((element, index) => (
										<Card
											textAlign='center'
											key={index}
											header={element}
											onClick={() => {
												getDistinctEcuNamesBasedOnVehicleTyp(element);
												setSelectedDistinctVehicle(element);
												setIsVehicleSelected(true);
												setIsEcuSelected(false);
												setSearchTerm('');
											}}
										/>
									))}
								</Card.Group>
							</Segment>
						</Container>
					)}
				</Segment>
				{loadEcuData ? (
					<Loader active inline='centered'>
						Loading...
					</Loader>
				) : (
					!isEcuSelected &&
					isVehicleSelected && (
						<Container>
							<Divider hidden />
							<Segment secondary textAlign='center'>
								<Search
									placeholder='Search...'
									showNoResults={false}
									onSearchChange={(event) => {
										setSearchTerm(event.target.value);
									}}
								/>
							</Segment>
							<Segment textAlign='center'>
								<Card.Group itemsPerRow={1}>
									{distinctEcus
										.filter((ecuName) => {
											if (searchTerm === '') {
												return ecuName;
											} else if (
												ecuName
													.toLowerCase()
													.includes(searchTerm.toLocaleLowerCase())
											) {
												return ecuName;
											}
										})
										.map((ecu, index) => (
											<Card
												key={index}
												header={ecu}
												onClick={() => {
													setSearchTerm('');
													setIsEcuSelected(true);
													setSelectedEcu(ecu);
													getDistinctFunctionNamesBasedOnVehicleTypAndEcuName(
														selectedDistinctVehicle,
														ecu
													);
												}}
											/>
										))}
								</Card.Group>
							</Segment>
						</Container>
					)
				)}
				{loadFunctionData ? (
					<Loader active inline='centered'>
						Loading...
					</Loader>
				) : (
					isEcuSelected &&
					isVehicleSelected && (
						<Container>
							<Segment>
								<Segment clearing>
									<Container>
										<Header as='h2' floated='left'>
											<Icon className='fas fa-microchip' />
											{selectedEcu}
										</Header>
										<Button
											floated='right'
											onClick={() => {
												setIsEcuSelected(false);
												setDistinctFunctionNames([]);
												setSearchFunctionTerm('');
											}}
										>
											Back
										</Button>

										<Divider clearing />
									</Container>

									<Container>
										<Container>
											<Segment textAlign='center' secondary>
												<Search
													placeholder='Search function...'
													showNoResults={false}
													onSearchChange={(event) => {
														setSearchFunctionTerm(event.target.value);
													}}
												/>
											</Segment>
											<Divider hidden />
										</Container>
										<Card.Group itemsPerRow={2}>
											{distinctFunctionNames
												.filter((functionName) => {
													if (searchFunctionTerm === '') {
														return functionName;
													} else if (
														functionName
															.toLowerCase()
															.includes(searchFunctionTerm.toLocaleLowerCase())
													) {
														return functionName;
													}
												})
												.map((functionName, index) => (
													<Card key={index}>
														<Card.Content floated='left'>
															<Card.Header>{functionName}</Card.Header>
															<Card.Description>
																<Button
																	color='blue'
																	floated='right'
																	onClick={() => {
																		setSearchFunctionTerm('');
																		setSelectedFunction(functionName);
																		setOpenFunctionDetailsModal(true);
																	}}
																>
																	Details
																</Button>
															</Card.Description>
														</Card.Content>
													</Card>
												))}
										</Card.Group>
									</Container>
								</Segment>
							</Segment>
						</Container>
					)
				)}
			</Container>
			{openFunctionDetailsModal && (
				<SingleFunctionModal
					openFunctionDetails={openFunctionDetailsModal}
					closeFunctionDetails={setOpenFunctionDetailsModal}
					selectedVehicle={selectedDistinctVehicle}
					selectedEcu={selectedEcu}
					selectedFunction={selectedFunction}
				/>
			)}
		</Container>
	);
};
