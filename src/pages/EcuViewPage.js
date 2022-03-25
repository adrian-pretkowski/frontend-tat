import React, { useState, useEffect } from 'react';
import {
	Container,
	Header,
	Segment,
	Divider,
	Card,
	Icon,
	Grid,
	Button,
	Popup,
	Loader,
	Search,
} from 'semantic-ui-react';
import { SingleEcuModal } from '../components/Modal/SingleEcuModal';
import useAxios from '../utils/useAxios';

export const EcuViewPage = () => {
	let api = useAxios();

	useEffect(() => {
		getDistinctVehicles();
	}, []);

	//Tooltip Options
	let [isTooltip, setIsTooltip] = useState(true);
	let [tooltipIcon, setTooltipIcon] = useState('close');

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

	//useState for distinct TestLocations based on vehicleTyp
	let [testLocations, setTestLocations] = useState([]);
	let [selectedLocation, setSelectedLocation] = useState('');
	let [isLocationSelected, setIsLocationSelected] = useState(false);

	//Get distinct TestLocations based on selected Vehicle
	let getDistinctsTestLocationsBasedOnVehicleTyp = async (choosenVehicle) => {
		if (choosenVehicle !== '') {
			let response = await api
				.get(`/testplans/locations/${choosenVehicle}`)
				.then(function (response) {
					if (response.status === 200) {
						setTestLocations(response.data);
					}
				});
		}
	};

	//useState for distinct EcuNames
	let [distinctEcus, setDistinctEcus] = useState([]);
	const [loadData, setLoadData] = useState(false);
	let [displayed, setDisplayed] = useState(false);

	//Get distinct ecuNames based on selected Vehicle and Test Location
	let getDistinctEcuNamesBasedOnVehicleTypAndTestLocation = async (
		choosenVehicle,
		choosenTestLocation
	) => {
		if (choosenVehicle !== '' && choosenTestLocation !== '') {
			setLoadData(true);
			let response = await api
				.get(`/ecus/distinct-names/${choosenVehicle}/${choosenTestLocation}`)
				.then(function (response) {
					if (response.status === 200) {
						setDistinctEcus(response.data);
					}
				});
		}
		setLoadData(false);
	};

	//Searching State
	let [searchTerm, setSearchTerm] = useState('');

	//VehicleDetails Modal
	const [openEcuDetailsModal, setEcuDetailsModal] = useState(false);
	const [selectedEcu, setSelectedEcu] = useState();

	return (
		<Container style={{ marginTop: '7em' }}>
			<Segment>
				<Header as='h2' floated='left'>
					<Icon className='fas fa-microchip' /> Ecu View
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
				<Divider clearing></Divider>
				{isTooltip && (
					<Container>
						<Grid columns={2} divided>
							<Grid.Row>
								<Grid.Column>
									<Segment>
										<Header as='h3'>
											Select Vehicle
											<strong>
												{isVehicleSelected && `: ${selectedDistinctVehicle}`}
											</strong>
										</Header>
										<Divider clearing></Divider>
										<Card.Group itemsPerRow={2} textAlign={'center'}>
											{vehicleOptions.map((element, index) => (
												<Card
													textAlign='center'
													key={index}
													header={element}
													onClick={() => {
														getDistinctsTestLocationsBasedOnVehicleTyp(element);
														setSelectedDistinctVehicle(element);
														setIsVehicleSelected(true);
														setIsLocationSelected(false);
														setSelectedLocation('');
														setDistinctEcus([]);
														setDisplayed(false);
													}}
												></Card>
											))}
										</Card.Group>
									</Segment>
								</Grid.Column>
								{isVehicleSelected && (
									<Grid.Column>
										<Segment>
											<Header as='h3'>
												Select Location
												<strong>
													{isLocationSelected && `: ${selectedLocation}`}
												</strong>
											</Header>
											<Divider clearing></Divider>
											<Card.Group itemsPerRow={2}>
												{testLocations.map((element, index) => (
													<Card
														textAlign='center'
														key={index}
														header={element}
														onClick={() => {
															setSelectedLocation(element);
															setIsLocationSelected(true);
														}}
													/>
												))}
											</Card.Group>
										</Segment>
									</Grid.Column>
								)}
							</Grid.Row>
						</Grid>

						{isLocationSelected && (
							<Container>
								<Divider hidden></Divider>
								<Segment secondary textAlign='center'>
									<Button
										color='blue'
										onClick={() => {
											getDistinctEcuNamesBasedOnVehicleTypAndTestLocation(
												selectedDistinctVehicle,
												selectedLocation
											);
											setDisplayed(true);
											// setIsTooltip(false);
										}}
									>
										Show ECUs
									</Button>
								</Segment>
							</Container>
						)}
					</Container>
				)}
			</Segment>

			{loadData ? (
				<Loader active inline='centered'>
					Loading...
				</Loader>
			) : (
				displayed && (
					<Container>
						<Segment>
							<Segment secondary textAlign='center'>
								<Search
									placeholder='Search...'
									showNoResults={false}
									onSearchChange={(event) => {
										setSearchTerm(event.target.value);
									}}
								></Search>
							</Segment>

							<Divider hidden></Divider>
							<Card.Group itemsPerRow={4}>
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
									.map((ecuName, index) => {
										return (
											<Card key={index} fluid>
												<Card.Content as='h2'>
													{ecuName}
													<Button
														color='teal'
														floated='right'
														onClick={() => {
															setEcuDetailsModal(true);
															setSelectedEcu(ecuName);
														}}
													>
														Details
													</Button>
												</Card.Content>
											</Card>
										);
									})}
							</Card.Group>
						</Segment>
						{openEcuDetailsModal && (
							<SingleEcuModal
								openEcuDetails={openEcuDetailsModal}
								closeEcuDetails={setEcuDetailsModal}
								selectedEcu={selectedEcu}
								sVehicleTyp={selectedDistinctVehicle}
								sLocation={selectedLocation}
							/>
						)}
					</Container>
				)
			)}
		</Container>
	);
};
