import {React, useState }from 'react';
import { Button, Container, Table } from 'semantic-ui-react';
import useAxios from '../utils/useAxios';

export const VehicleViewPage = () => {

    const [testPlans, setTestPlans] = useState([]);

	let api = useAxios();

	let getTestPlans = async () => {
		let response = await api
			.get('/testplans')
			.then(function (response) {
				if (response.status === 200) {
					console.log('Success');
                    console.log(response.data)
                    setTestPlans(response.data)
				}
			})
			.catch(function (error) {
				if (error.response.status === 404) {
					console.log('Error');
				}
			});
	};
	return (
		<Container>
            <button onClick={getTestPlans}>CLICK ME!</button>
			<Table celled>
                <Table.Header >
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
                            <Table.Cell >{testPlan.vehicle.vehicleTyp}</Table.Cell>
                            <Table.Cell>{testPlan.testLocation}</Table.Cell>
                            <Table.Cell>{testPlan.vehicle.vinNumber}</Table.Cell>
                            <Table.Cell>{testPlan.vehicle.kennNumber}</Table.Cell>
                            <Table.Cell>{testPlan.testDuration}</Table.Cell>
                            <Table.Cell>{testPlan.testDate}</Table.Cell>
                            <Table.Cell><Button color='blue'>Details</Button> <Button color='red'>Delete</Button></Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
		</Container>
	);
};
