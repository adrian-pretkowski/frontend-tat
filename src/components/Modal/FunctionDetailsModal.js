import React, { useState, useEffect } from 'react';
import {
	Button,
	Modal,
	Segment,
	Card,
	Table,
	Loader,
	Message,
} from 'semantic-ui-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useAxios from '../../utils/useAxios';

export const FunctionDetailsModal = ({
	openFunctionDetails,
	closeFunctionDetails,
	selectedFunction,
	sVehicleTyp,
	sLocation,
}) => {
	const [loadData, setLoadData] = useState(false);
	const [durationsList, setDurationList] = useState([]);

	let api = useAxios();
	const [average, setAverage] = useState(null);

	useEffect(() => {
		if (openFunctionDetails) {
			getFunctionDurations();
		}
	}, [openFunctionDetails]);

	//----------------FUNCTIONS------------------

	//Get all testplans
	let getFunctionDurations = async () => {
		setLoadData(true);
		let response = await api
			.get(
				`/functions/durations/${sVehicleTyp}/${sLocation}/${selectedFunction.ecuName}/${selectedFunction.functionName}`
			)
			.then(function (response) {
				if (response.status === 200) {
					setDurationList(response.data);
				}
			})
			.catch(function (error) {
				if (error.response.status === 404) {
					console.log('Error');
				}
			});
		setLoadData(false);
	};

	function countAverageValue(array) {
		let sum = 0;
		for (let index = 0; index < array.length; index++) {
			sum += array[index];
		}

		return sum / array.length;
	}

	//-------------------------------------------

	return (
		<Modal
			centered={true}
			open={openFunctionDetails}
			onClose={() => closeFunctionDetails(false)}
		>
			<Modal.Header>
				Selceted Function: {selectedFunction.functionName}
				<p> ECU: {selectedFunction.ecuName}</p>
			</Modal.Header>

			<Modal.Content>
				{loadData ? (
					<Loader active inline='centered'>
						Loading...
					</Loader>
				) : (
					<Segment>
						<Card.Group itemsPerRow={4}>
							<Card>
								<Card.Content>
									<Card.Header>Functions in DB</Card.Header>
									<Card.Description>{durationsList.length}</Card.Description>
								</Card.Content>
							</Card>
							<Card>
								<Card.Content>
									<Card.Header>Duration</Card.Header>
									<Card.Description>
										{selectedFunction.duration}s
									</Card.Description>
								</Card.Content>
							</Card>
							<Card>
								<Card.Content>
									<Card.Header>Min. duration</Card.Header>
									<Card.Description>
										{Math.min(...durationsList)}s
									</Card.Description>
								</Card.Content>
							</Card>
							<Card>
								<Card.Content>
									<Card.Header>Max. duration</Card.Header>
									<Card.Description>
										{Math.max(...durationsList)}s
									</Card.Description>
								</Card.Content>
							</Card>
						</Card.Group>
					</Segment>
				)}
				{loadData ? (
					<Loader active inline='centered'>
						Loading...
					</Loader>
				) : (
					<Segment>
						<BarChart
							width={900}
							height={300}
							data={durationsList.map((value, index) => ({
								index: index + 1,
								value,
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
									value: ` ${selectedFunction.functionName} [s]`,
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
							/>
						</BarChart>
					</Segment>
				)}
				{loadData ? (
					<Loader active inline='centered'>
						Loading...
					</Loader>
				) : (
					<Message positive>
						<Message.Header> Everything is OK!</Message.Header>
						<p>Current function duration: <strong>{selectedFunction.duration}s</strong></p>
						<p>The average duration is: <strong>{countAverageValue(durationsList)}s</strong></p>
					</Message>
				)}
			</Modal.Content>
			<Modal.Actions>
				<Button color='black' onClick={() => closeFunctionDetails(false)}>
					Close
				</Button>
			</Modal.Actions>
		</Modal>
	);
};
