import { React, useState } from 'react';
import { useEffect } from 'react/cjs/react.development';
import {
	Button,
	Container,
	Divider,
	Segment,
	Table,
	Header,
	Loader,
	Dropdown,
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

	let getTestPlans = async () => {
		setLoadData(true);
		let response = await api
			.get('/testplans')
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

	let getDistinctVehicles = async () => {
		let response = await api
			.get('/vehicles/distinct')
			.then(function (response) {
				if (response.status === 200) {
					response.data.map((element, index) => {
						setVehicleOptions((old) => [
							...old,
							{
								key: index,
								text: element,
								value: index,
							},
						]);
					});
				}
			});
	};

	let getDistinctsTestLocationsBasedOnVehicleTyp = async (choosenVehicle) => {
		if (choosenVehicle !== '') {
			let response = await api
				.get(`/testplans/locations/${choosenVehicle}`)
				.then(function (response) {
					if (response.status === 200) {
						console.log(response.data);
						response.data.map((element, index) => {
							setTestLocations((old) => [
								...old,
								{
									key: index,
									text: element,
									value: index,
								},
							]);
						});
					}
				});
		}
	};
	//useState for distinct Vehicles
	const [vehicleOptions, setVehicleOptions] = useState([]);
	const [selectedDistinctVehicle, setSelectedDistinctVehicle] = useState('');

	//useState for distinct TestLocations based on vehicleTyp
	const [testLocations, setTestLocations] = useState([]);

	let handleChangeDistinctVehicles = (e, data) => {
		setSelectedDistinctVehicle(vehicleOptions[data.value].text);
		console.log('selectedDistinctVehicle:', selectedDistinctVehicle);
		setTestLocations([]);
		getDistinctsTestLocationsBasedOnVehicleTyp(selectedDistinctVehicle);
	};

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
				<Divider clearing></Divider>
				<Button onClick={getTestPlans} color='blue'>
					Caddy 5
				</Button>
				<Dropdown
					options={vehicleOptions}
					placeholder='Select Vehicle'
					selection
					value={vehicleOptions.value}
					onChange={handleChangeDistinctVehicles}
				/>
				<Dropdown
					options={testLocations}
					placeholder='Select test location'
					selection
					value={testLocations.value}
				/>
			</Segment>

			{loadData ? (
				<Loader active inline='centered'>
					Loading...
				</Loader>
			) : (
				<Segment>
					<Table celled>
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
