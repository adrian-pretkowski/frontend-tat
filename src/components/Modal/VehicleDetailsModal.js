import { useState, useEffect } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	Brush,
} from 'recharts';
import { Button, Modal, Segment, Card } from 'semantic-ui-react';

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

	let handleClick = (data, index) => {
		setMainChartVisibility(false);
		setSingleEcuChartVisibility(true);
		setBarIndex(index);
		setSelectedEcuData(selectedVehicle.vehicle.ecuMap[data.ecuName]);
	};

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
							width={1800}
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
								// onClick={handleClick}
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
							width={1800}
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
				</Segment>
			</Modal.Content>
			<Modal.Actions>
				{singleEcuChartVisibility && (
					<Button
						color='blue'
						onClick={() => {
							setSingleEcuChartVisibility(false);
							setMainChartVisibility(true);
						}}
					>
						Show Vehicle
					</Button>
				)}
				<Button color='black' onClick={() => closeVehicleDetails(false)}>
					Close
				</Button>
			</Modal.Actions>
		</Modal>
	);
};
