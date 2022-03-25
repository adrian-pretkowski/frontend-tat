import React, { useState, useEffect } from 'react';
import {
	Button,
	Divider,
	Modal,
	Segment,
	Card,
	Table,
	Loader,
	Message,
	Container,
} from 'semantic-ui-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useAxios from '../../utils/useAxios';
import { VehicleDetailsModal } from './VehicleDetailsModal';
export const SingleEcuModal = ({
	openEcuDetails,
	closeEcuDetails,
	selectedEcu,
	sVehicleTyp,
	sLocation,
}) => {
	let api = useAxios();
	const [loadData, setLoadData] = useState(false);
	const [loadDataVehicle, setLoadDataVehicle] = useState(false);
	const [ecuList, setEcuList] = useState([]);

	useEffect(() => {
		if (openEcuDetails) {
			getEcuList();
		}
	}, [openEcuDetails]);

	//------------FUNCTIONS------------

	let getEcuList = async () => {
		setLoadData(true);
		let response = await api
			.get(`/ecus/${sVehicleTyp}/${sLocation}/${selectedEcu}`)
			.then(function (response) {
				if (response.status === 200) {
					setEcuList(response.data);
					getDurations(response.data);
				}
			})
			.catch(function (error) {
				if (error.response.status === 404) {
					console.log('Error');
				}
			});
		setLoadData(false);
	};

	//Get Min and Max duration of all ecus in list
	let [minDuration, setMinDuration] = useState(null);
	let [maxDuration, setMaxDuration] = useState(null);

	function getDurations(ecuList) {
		let valuesList = [];
		for (let i = 0; i < ecuList.length; i++) {
			const element = ecuList[i].totalEcuDuration;
			valuesList.push(element);
		}
		setMinDuration(Math.min(...valuesList));
		setMaxDuration(Math.max(...valuesList));
	}

	//VehicleDetails Modal
	const [openVehicleDetailsModal, setVehicleDetailsModal] = useState(false);

	//get Vehicle based on ecuId
	let [isBarClicked, setIsBarClicked] = useState(false);
	let [foundVehicle, setFoundVehicle] = useState([]);

	let getVehicleBasedOnEcuId = async (ecuId) => {
		setLoadDataVehicle(true);
		let response = await api
			.get(`/testplans/based-on-ecu-id/${ecuId}`)
			.then(function (response) {
				if (response.status === 200) {
					setFoundVehicle(response.data);
					console.log(response.data);
				}
			});
		setLoadDataVehicle(false);
	};

	let handleClickOnBar = (data, index) => {
		let ecuId = data.ecuId;
		if (ecuId !== null && typeof ecuId == 'number') {
			getVehicleBasedOnEcuId(ecuId);
			setIsBarClicked(true);
		} else {
			console.log('Error: EcuId is empty!');
		}
	};

	//---------------------------------

	return (
		<Modal
			centered={true}
			open={openEcuDetails}
			onClose={() => closeEcuDetails(false)}
		>
			<Modal.Header>Selected Ecu: {selectedEcu}</Modal.Header>

			<Modal.Content>
				{loadData ? (
					<Loader active inline='centered'>
						Loading...
					</Loader>
				) : (
					<Segment>
						<Card.Group itemsPerRow={3}>
							<Card>
								<Card.Content>
									<Card.Header>ECUs in DB</Card.Header>
									<Card.Description>{ecuList.length}</Card.Description>
								</Card.Content>
							</Card>
							<Card>
								<Card.Content>
									<Card.Header>Min. duration</Card.Header>
									<Card.Description>{minDuration}s</Card.Description>
								</Card.Content>
							</Card>
							<Card>
								<Card.Content>
									<Card.Header>Max. duration</Card.Header>
									<Card.Description>{maxDuration}s</Card.Description>
								</Card.Content>
							</Card>
						</Card.Group>
					</Segment>
				)}{' '}
				<Container>
					{loadData ? (
						<Loader active inline='centered'>
							Loading...
						</Loader>
					) : (
						<Container>
							<Container>
								<Button.Group>
									<Button>Last 10</Button>
									<Button>Last 20</Button>
									<Button>Last 100</Button>
								</Button.Group>
							</Container>
							<Segment>
								<BarChart
									width={900}
									height={300}
									data={ecuList.map((value, index) => ({
										index: index + 1,
										value: value.totalEcuDuration,
										ecuId: value.id,
									}))}
									margin={{
										top: 15,
										right: 60,
										left: 0,
										bottom: 30,
									}}
									barSize={20}
								>
									<XAxis
										dataKey={'index'}
										dy={5}
										interval={0}
										label={{
											value: ` ${selectedEcu} [s]`,
											position: 'insideCenter',
											dy: 30,
										}}
										scale='auto'
									/>
									<YAxis />
									<Tooltip />
									<CartesianGrid strokeDasharray='3 3' />
									<Bar
										dataKey='value'
										label={{ position: 'top' }}
										fill='#8884d8'
										background={{ fill: '#eee' }}
										onClick={handleClickOnBar}
									/>
								</BarChart>
							</Segment>
						</Container>
					)}
					{loadDataVehicle ? (
						<Loader active inline='centered'>
							Loading...
						</Loader>
					) : isBarClicked ? (
						<Segment>
							<Container>
								<Card.Group itemsPerRow={5}>
									<Card>
										<Card.Content>
											<Card.Header>VIN</Card.Header>
											<Card.Description>
												{foundVehicle.vehicle.vinNumber}
											</Card.Description>
										</Card.Content>
									</Card>
									<Card>
										<Card.Content>
											<Card.Header>Vehicle Typ</Card.Header>
											<Card.Description>
												{foundVehicle.vehicle.vehicleTyp}
											</Card.Description>
										</Card.Content>
									</Card>
									<Card>
										<Card.Content>
											<Card.Header>Test Location</Card.Header>
											<Card.Description>
												{foundVehicle.testLocation}
											</Card.Description>
										</Card.Content>
									</Card>
									<Card>
										<Card.Content>
											<Card.Header>Total Duration</Card.Header>
											<Card.Description>
												{foundVehicle.testDuration}s
											</Card.Description>
										</Card.Content>
									</Card>
									<Card>
										<Card.Content>
											<Card.Header>Test Date</Card.Header>
											<Card.Description>
												{foundVehicle.testDate}
											</Card.Description>
										</Card.Content>
									</Card>
								</Card.Group>
							</Container>
							<Container>
								<Divider hidden></Divider>
								<Button
									fluid
									color='blue'
									onClick={() => {
										setVehicleDetailsModal(true);
									}}
								>
									Vehicle Details
								</Button>
							</Container>
						</Segment>
					) : (
						<Segment>
							<Message>
								<Message.Header>
									Click on single Bar to see more details...
								</Message.Header>
							</Message>
						</Segment>
					)}
				</Container>
			</Modal.Content>

			{openVehicleDetailsModal && (
				<VehicleDetailsModal
					openVehicleDetails={openVehicleDetailsModal}
					closeVehicleDetails={setVehicleDetailsModal}
					selectedVehicle={foundVehicle}
				/>
			)}
			<Modal.Actions>
				<Button
					color='black'
					onClick={() => {
						closeEcuDetails(false);
						setIsBarClicked(false);
					}}
					content='Close'
				/>
			</Modal.Actions>
		</Modal>
	);
};
