import React from 'react';
import {
	Container,
	Divider,
	Icon,
	Header,
	Segment,
} from 'semantic-ui-react';


const HomePage = () => {
	return (
		<Container style={{ marginTop: '7em' }}>
			<Container>
				<Segment textAlign='center'>
					<Header as='h2'>
						Welcome on the Home Page of Time Analysis Tool
					</Header>
				</Segment>
				<Divider hidden />
			</Container>

			<Container>
				<Segment>
					<p>
						The purpose of the application is to time analyze the ECOS (Electric
						Check-Out System) process.
					</p>

					<p>
						The main emphasis was placed on the possibility of visuializaing
						duration of individual ECUs and their functions.
					</p>

					<p>
						With these assumptions, we can make a detailed time analysis of the
						components and the car as a whole.
					</p>

					<p>
						Ultimately, it is planned to implement the possibility of creating
						yout own version of the vehicle with the expected times, which will
						allow you to properly plan the process of the vehicle programming
						and appropriate timing of activities.
					</p>
				</Segment>

				<Segment>
					<Header as='h3'>Available features</Header>

					<p>
						<p>
							<strong>
								<Icon className='fas fa-car' /> Vehicle View
							</strong>
						</p>
						If you want to analyse Vehicles or add new single Vehicle - just
						visit the Vehicle View Page
					</p>

					<p>
						<p>
							<strong>
								<Icon className='fas fa-microchip' /> Ecu View
							</strong>
						</p>
						If you want to analyse ECUs - just visit the Ecu View Page
					</p>

					<p>
						<p>
							<strong>
								<Icon className='asterisk' /> Function View
							</strong>
						</p>
						If you want to analyse Functions - just visit the Function View Page
					</p>
					<p>
						<p>
							<strong>
								<Icon className='fas fa-list-ol' /> PR Numbers
							</strong>
						</p>
						This functionallity is not available yet. In future this function
						should help you with PR Numbers recognition.
					</p>
				</Segment>
			</Container>
		</Container>
	);
};

export default HomePage;
