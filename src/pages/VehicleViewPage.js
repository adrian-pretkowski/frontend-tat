import React, { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import _ from 'lodash';
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
} from 'semantic-ui-react';
import { VehicleDetailsModal } from '../components/Modal/VehicleDetailsModal';
import useAxios from '../utils/useAxios';

export const VehicleViewPage = () => {
	const [loadData, setLoadData] = useState(false);
	const [testPlans, setTestPlans] = useState([]);

	let api = useAxios();

	useEffect(() => {
		getDistinctVehicles();
	}, []);

	//-------------------------------------------
	//----------------FUNCTIONS------------------

	//Get all testplans
	let getTestPlans = async (vehicleTyp, testLocation) => {
		setLoadData(true);
		console.log(vehicleTyp);
		console.log(testLocation);
		let response = await api
			.get(`/testplans/${vehicleTyp}/${testLocation}`)
			.then(function (response) {
				if (response.status === 200) {
					setTestPlans(response.data);
				}
			})
			.catch(function (error) {
				if (error.response.status === 404) {
					console.log('Error');
				}
			});
		setLoadData(false);
	};

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

	//----------------------------------------------------
	//----------------------------------------------------
	let [isTooltip, setIsTooltip] = useState(true);
	let [tooltipIcon, setTooltipIcon] = useState('close');

	//useState for distinct Vehicles
	let [vehicleOptions, setVehicleOptions] = useState([]);
	let [selectedDistinctVehicle, setSelectedDistinctVehicle] = useState('');
	let [isVehicleSelected, setIsVehicleSelected] = useState(false);

	//useState for distinct TestLocations based on vehicleTyp
	let [testLocations, setTestLocations] = useState([]);
	let [selectedLocation, setSelectedLocation] = useState('');
	let [isLocationSelected, setIsLocationSelected] = useState(false);

	//VehicleDetails Modal
	const [openVehicleDetailsModal, setVehicleDetailsModal] = useState(false);
	const [selectedVehicle, setSelectedVehicle] = useState();

	return (
		<Container>
			<div></div>
			<Segment>
				<Header as='h2' floated='left'>
					Vehicle View
				</Header>
				<Popup
					content='Show/Hide context menu'
					mouseEnterDelay={500}
					mouseLeaveDelay={50}
					on='hover'
					trigger={
						<Button
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
					}
				/>
				<Divider clearing></Divider>
				{isTooltip && (
					<Segment>
						<Header as='h3' floated='left'>
							Select Vehicle
							{isVehicleSelected && `: ${selectedDistinctVehicle}`}
						</Header>
						<Divider clearing></Divider>
						<Card.Group itemsPerRow={5} textAlign={'center'}>
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
									}}
								/>
							))}
						</Card.Group>

						{isVehicleSelected && (
							<Container>
								<Divider hidden></Divider>
								<Header as='h3' floated='left'>
									Select Location{isLocationSelected && `: ${selectedLocation}`}
								</Header>
								<Divider clearing></Divider>
								<Card.Group itemsPerRow={5}>
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

								{isLocationSelected && (
									<Container>
										<Divider hidden></Divider>
										<Button
											color='violet'
											onClick={() => {
												getTestPlans(selectedDistinctVehicle, selectedLocation);
											}}
										>
											Show Vehicles
										</Button>
									</Container>
								)}
							</Container>
						)}
					</Segment>
				)}
			</Segment>

			{loadData ? (
				<Loader active inline='centered'>
					Loading...
				</Loader>
			) : (
				<Segment>
					<Table sortable celled tableData={testPlans}>
						<Table.Header>
							<Table.Row textAlign='center'>
								<Table.HeaderCell>Vehicle Typ</Table.HeaderCell>
								<Table.HeaderCell>Test Location</Table.HeaderCell>
								<Table.HeaderCell>VIN</Table.HeaderCell>
								<Table.HeaderCell>Kenn Number</Table.HeaderCell>
								<Table.HeaderCell>Test Duration</Table.HeaderCell>
								<Table.HeaderCell>Test Date</Table.HeaderCell>
								<Table.HeaderCell>Action</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							{testPlans.map((testPlan, index) => (
								<Table.Row key={index} textAlign='center'>
									<Table.Cell>{testPlan.vehicle.vehicleTyp}</Table.Cell>
									<Table.Cell>{testPlan.testLocation}</Table.Cell>
									<Table.Cell>{testPlan.vehicle.vinNumber}</Table.Cell>
									<Table.Cell>{testPlan.vehicle.kennNumber}</Table.Cell>
									<Table.Cell>{testPlan.testDuration}</Table.Cell>
									<Table.Cell>{testPlan.testDate}</Table.Cell>
									<Table.Cell>
										<Button
											color='blue'
											onClick={() => {
												setVehicleDetailsModal(true);
												setSelectedVehicle(testPlan);
											}}
										>
											Details
										</Button>{' '}
										<Button color='red'>Delete</Button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					{openVehicleDetailsModal && (
						<VehicleDetailsModal
							openVehicleDetails={openVehicleDetailsModal}
							closeVehicleDetails={setVehicleDetailsModal}
							selectedVehicle={selectedVehicle}
						/>
					)}
				</Segment>
			)}
		</Container>
	);
};
