import React, { useState, useEffect } from 'react';
import {
	Button,
	Card,
	Container,
	Divider,
	Loader,
	Message,
	Modal,
	Segment,
} from 'semantic-ui-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useAxios from '../../utils/useAxios';
import { VehicleDetailsModal } from './VehicleDetailsModal';

export const SingleFunctionModal = ({
	openFunctionDetails,
	closeFunctionDetails,
	selectedVehicle,
	selectedEcu,
	selectedFunction,
}) => {
	const [loadData, setLoadData] = useState(false);
	const [functionsList, setFunctionsList] = useState([]);

	let api = useAxios();

	useEffect(() => {
		if (openFunctionDetails) {
			getFunctionsList();
		}
	}, [openFunctionDetails]);

	//----------------FUNCTIONS------------------

	let getFunctionsList = async () => {
		setLoadData(true);
		let response = await api
			.get(`/functions/${selectedVehicle}/${selectedEcu}/${selectedFunction}`)
			.then(function (response) {
				if (response.status === 200) {
					setFunctionsList(response.data);
					getDurations(response.data);
				}
			})
			.catch(function (error) {
				if (error.response.status === 404) {
					console.log('Error during fetching DB...');
				}
			});
		setLoadData(false);
	};

	//Get Mind and Max duration of all functions in list
	let [minDuration, setMinDuration] = useState(null);
	let [maxDuration, setMaxDuration] = useState(null);
	let [averageDuration, setAverageDuration] = useState(null);

	function getDurations(functionList) {
		let valueList = [];
		let sum = 0;
		for (let i = 0; i < functionList.length; i++) {
			const element = functionList[i].duration;
			sum += element;
			valueList.push(element);
		}

		setMinDuration(Math.min(...valueList));
		setMaxDuration(Math.max(...valueList));
		setAverageDuration((sum / functionList.length).toPrecision(3));
	}

	//VehicleDetails Modal
	const [openVehicleDetailsModal, setVehicleDetailsModal] = useState(false);

	//get Vehicle based on ecuId
	let [isBarClicked, setIsBarClicked] = useState(false);
	let [foundVehicle, setFoundVehicle] = useState([]);
	const [loadDataVehicle, setLoadDataVehicle] = useState(false);

	let getVehicleBasedOnFunctionId = async (functionId) => {
		setLoadDataVehicle(true);
		let response = await api
			.get(`/testplans/based-on-function-id/${functionId}`)
			.then(function (response) {
				if (response.status === 200) {
					setFoundVehicle(response.data);
				}
			});
		setLoadDataVehicle(false);
	};

	let handleClickOnBar = (data, index) => {
		let functionId = data.functionId;
		if (functionId !== null && typeof functionId == 'number') {
			getVehicleBasedOnFunctionId(functionId);
			setIsBarClicked(true);
		} else {
			console.log('Error: FunctionId is empty!');
		}
	};

	//-------------------------------------------

	return (
		<Modal
			centered={true}
			open={openFunctionDetails}
			onClose={() => closeFunctionDetails(false)}
		>
			<Modal.Header>
				Selected Function: <strong>{selectedFunction}</strong> in ECU:{' '}
				<strong>{selectedEcu}</strong>
			</Modal.Header>
			<Modal.Content>
				{loadData ? (
					<Loader active inline='centered'>
						Loading...
					</Loader>
				) : (
					<Container>
						<Segment>
							<Card.Group itemsPerRow={4}>
								<Card>
									<Card.Content>
										<Card.Header>Functions in DB</Card.Header>
										<Card.Description>{functionsList.length}</Card.Description>
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
								<Card>
									<Card.Content>
										<Card.Header>Average duration:</Card.Header>
										<Card.Description>{averageDuration}s</Card.Description>
									</Card.Content>
								</Card>
							</Card.Group>
						</Segment>
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
									data={functionsList.map((value, index) => ({
										index: index + 1,
										value: value.duration,
										functionId: value.id,
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
											value: ` ${selectedFunction} [s]`,
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
										Clinck on single Bar to see more details...
									</Message.Header>
								</Message>
							</Segment>
						)}
					</Container>
				)}
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
					onClick={() => closeFunctionDetails(false)}
					content='Close'
				/>
			</Modal.Actions>
		</Modal>
	);
};
