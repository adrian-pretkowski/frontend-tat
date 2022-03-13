import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button, Modal, Segment, Card, Table } from 'semantic-ui-react';
import _ from 'lodash';
import { FunctionDetailsModal } from './FunctionDetailsModal';

export const VehicleDetailsModal = ({
	openVehicleDetails,
	closeVehicleDetails,
	selectedVehicle,
}) => {
	const [barIndex, setBarIndex] = useState(0);
	const [mainChartVisibility, setMainChartVisibility] = useState(true);
	const [singleEcuChartVisibility, setSingleEcuChartVisibility] =
		useState(false);
	const [selectedEcuData, setSelectedEcuData] = useState([]);

	const [functionsListVisibility, setFunctionsListVisibility] = useState(false);

	let handleClick = (data, index) => {
		setMainChartVisibility(false);
		setSingleEcuChartVisibility(true);
		setBarIndex(index);
		setSelectedEcuData(selectedVehicle.vehicle.ecuMap[data.ecuName]);
	};

	let handleClickOnName = (value, index) => {
		setMainChartVisibility(false);
		setSingleEcuChartVisibility(true);
		setBarIndex(index);
		setSelectedEcuData(selectedVehicle.vehicle.ecuMap[value.value]);
	};

	
	const [functionList, setFunctionList] = useState([]);
	let getAllFunctions = (ecuMap) => {
		setFunctionList([]);

		Object.values(ecuMap).map((ecu, index) => {
			ecu.functionList.map((func, index) => {
				setFunctionList((oldValue) => [
					...oldValue,
					{
						functionId: func.functionId,
						functionName: func.functionName,
						startTime: func.startTime,
						duration: func.duration,
						ecuName: ecu.ecuName,
					},
				]);
			});
		});
	};

	//-------------SORTING TABLE FUNCTIONS--------------

	function funcTableReducer(state, action) {
		switch (action.type) {
			case 'INIT_DATA':
				return {
					column: null,
					dataFunc: functionList,
					direction: null,
				};
			case 'CHANGE_SORT':
				if (state.column === action.column) {
					return {
						...state,
						dataFunc: state.dataFunc.slice().reverse(),
						direction:
							state.direction === 'ascending' ? 'descending' : 'ascending',
					};
				}
				return {
					column: action.column,
					dataFunc: _.sortBy(state.dataFunc, [action.column]),
					direction: 'ascending',
				};
			default:
				throw new Error();
		}
	}

	const initialState = {
		column: null,
		dataFunc: functionList,
		direction: null,
	};

	const [state, dispatch] = React.useReducer(funcTableReducer, initialState);
	const { column, dataFunc, direction } = state;

	//------------------------------------------------------

	//FunctionDetails Modal
	const [openFunctionDetailsModal, setFunctionDetailsModal] = useState(false);
	const [selectedFunction, setSelectedFunction] = useState();

	return (
		<Modal
			size='fullscreen'
			centered={true}
			open={openVehicleDetails}
			onClose={() => closeVehicleDetails(false)}
			className='vehicleModal' //fixed horizontal center in App.css with transform: translateX(2.5%)
		>
			<Modal.Header>
				Selceted Vehicle: {selectedVehicle.vehicle.vinNumber}
			</Modal.Header>
			<Modal.Content>
				<Segment>
					<Card.Group itemsPerRow={6}>
						<Card>
							<Card.Content>
								<Card.Header>VIN:</Card.Header>
								<Card.Description>
									{selectedVehicle.vehicle.vinNumber}
								</Card.Description>
							</Card.Content>
						</Card>
						<Card>
							<Card.Content>
								<Card.Header>Kenn Number:</Card.Header>
								<Card.Description>
									{selectedVehicle.vehicle.kennNumber}
								</Card.Description>
							</Card.Content>
						</Card>
						<Card>
							<Card.Content>
								<Card.Header>Vehicle Typ:</Card.Header>
								<Card.Description>
									{selectedVehicle.vehicle.vehicleTyp}
								</Card.Description>
							</Card.Content>
						</Card>
						<Card>
							<Card.Content>
								<Card.Header>Test Location:</Card.Header>
								<Card.Description>
									{selectedVehicle.testLocation}
								</Card.Description>
							</Card.Content>
						</Card>
						<Card>
							<Card.Content>
								<Card.Header>Total duration:</Card.Header>
								<Card.Description>
									{selectedVehicle.testDuration}s
								</Card.Description>
							</Card.Content>
						</Card>
						<Card>
							<Card.Content>
								<Card.Header>Test Date:</Card.Header>
								<Card.Description>{selectedVehicle.testDate}</Card.Description>
							</Card.Content>
						</Card>
					</Card.Group>
				</Segment>
				<Segment style={{ overflow: 'auto' }}>
					{mainChartVisibility && (
						<BarChart
							width={1750}
							height={550}
							data={Object.values(selectedVehicle.vehicle.ecuMap)}
							margin={{
								top: 5,
								right: 90,
								left: 0,
								bottom: 60,
							}}
							barSize={20}
						>
							<XAxis
								dataKey='ecuName'
								angle={-45}
								dy={5}
								textAnchor='end'
								interval={0}
								label={{
									value: 'Ecu Duration [s]',
									position: 'insideCenter',
									dy: 60,
								}}
								scale='auto'
								padding={{ left: 10, right: 10 }}
								onClick={handleClickOnName}
							/>
							<YAxis />
							<Tooltip />
							{/* <Legend verticalAlign='top' wrapperStyle={{ lineHeight: '60px' }} /> */}
							<CartesianGrid strokeDasharray='3 3' />
							{/* <Brush dataKey='totalEcuDuration' height={10} stroke='#8884d8' /> */}
							<Bar
								dataKey='totalEcuDuration'
								label={{ position: 'top' }}
								fill='#8884d8'
								background={{ fill: '#eee' }}
								onClick={handleClick}
							/>
						</BarChart>
					)}
					{singleEcuChartVisibility && (
						<BarChart
							width={1750}
							height={550}
							data={Object.values(selectedEcuData.functionList)}
							margin={{
								top: 15,
								right: 90,
								left: 0,
								bottom: 180,
							}}
							barSize={20}
						>
							<XAxis
								dataKey='functionName'
								angle={-30}
								dy={5}
								textAnchor='end'
								interval={0}
								label={{
									value: `${selectedEcuData.ecuName} functions duration [s]`,
									position: 'insideCenter',
									dy: 180,
								}}
								scale='auto'
								padding={{ left: 10, right: 10 }}
							/>
							<YAxis />
							<Tooltip />
							{/* <Legend verticalAlign='top' wrapperStyle={{ lineHeight: '60px' }} /> */}
							<CartesianGrid strokeDasharray='5 0' />
							{/* <Brush dataKey='totalEcuDuration' height={10} stroke='#8884d8' /> */}
							<Bar
								dataKey='duration'
								label={{ position: 'top' }}
								fill='#8884d8'
								background={{ fill: '#eee' }}
							/>
						</BarChart>
					)}

					{functionsListVisibility && (
						<Table sortable celled striped compact fixed>
							<Table.Header className='functionsTableHeader'>
								<Table.Row className='functionsTableRow'>
									<Table.HeaderCell
										textAlign='center'
										sorted={column === 'functionId' ? direction : null}
										onClick={() =>
											dispatch({ type: 'CHANGE_SORT', column: 'functionId' })
										}
									>
										FunctionID
									</Table.HeaderCell>
									<Table.HeaderCell
										textAlign='center'
										sorted={column === 'ecuName' ? direction : null}
										onClick={() =>
											dispatch({ type: 'CHANGE_SORT', column: 'ecuName' })
										}
									>
										Ecu
									</Table.HeaderCell>
									<Table.HeaderCell
										textAlign='center'
										sorted={column === 'functionName' ? direction : null}
										onClick={() =>
											dispatch({ type: 'CHANGE_SORT', column: 'functionName' })
										}
									>
										Function Name
									</Table.HeaderCell>
									<Table.HeaderCell
										textAlign='center'
										sorted={column === 'startTime' ? direction : null}
										onClick={() =>
											dispatch({ type: 'CHANGE_SORT', column: 'startTime' })
										}
									>
										Start Time
									</Table.HeaderCell>
									<Table.HeaderCell
										textAlign='center'
										sorted={column === 'duration' ? direction : null}
										onClick={() =>
											dispatch({ type: 'CHANGE_SORT', column: 'duration' })
										}
									>
										Duration
									</Table.HeaderCell>
									<Table.HeaderCell
										textAlign='center'
										sorted={column === 'action' ? direction : null}
										onClick={() =>
											dispatch({ type: 'CHANGE_SORT', column: 'action' })
										}
									>
										Action
									</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body className='functionsTableBody'>
								{dataFunc.map(
									(
										{ functionId, functionName, startTime, duration, ecuName },
										index
									) => (
										<Table.Row className='functionsTableRow' key={functionId}>
											<Table.Cell textAlign='center'>{functionId}</Table.Cell>
											<Table.Cell textAlign='center'>{ecuName}</Table.Cell>
											<Table.Cell>{functionName}</Table.Cell>
											<Table.Cell textAlign='center'>{startTime}</Table.Cell>
											<Table.Cell textAlign='center'>{duration}s</Table.Cell>
											<Table.Cell textAlign='center'>
												<Button
													size='mini'
													color='orange'
													onClick={() => {
														setFunctionDetailsModal(true);
														setSelectedFunction(dataFunc[index]);
													}}
												>
													Details
												</Button>
											</Table.Cell>
										</Table.Row>
									)
								)}
							</Table.Body>
						</Table>
					)}
				</Segment>
			</Modal.Content>
			<Modal.Actions>
				{(singleEcuChartVisibility || functionsListVisibility) && (
					<Button
						color='blue'
						onClick={() => {
							setSingleEcuChartVisibility(false);
							setMainChartVisibility(true);
							setFunctionsListVisibility(false);
						}}
					>
						Show Vehicle
					</Button>
				)}
				{!functionsListVisibility && (
					<Button
						onClick={() => {
							setMainChartVisibility(false);
							setSingleEcuChartVisibility(false);
							getAllFunctions(selectedVehicle.vehicle.ecuMap);
							dispatch({ type: 'INIT_DATA' });
							setFunctionsListVisibility(true);
						}}
					>
						Functions
					</Button>
				)}
				<Button color='black' onClick={() => closeVehicleDetails(false)}>
					Close
				</Button>
			</Modal.Actions>

			{openFunctionDetailsModal && (
				<FunctionDetailsModal
					openFunctionDetails={openFunctionDetailsModal}
					closeFunctionDetails={setFunctionDetailsModal}
					selectedFunction={selectedFunction}
					sVehicleTyp={selectedVehicle.vehicle.vehicleTyp}
					sLocation={selectedVehicle.testLocation}
				/>
			)}
		</Modal>
	);
};
