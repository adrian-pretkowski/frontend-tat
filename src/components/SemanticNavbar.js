import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';
import AuthContext from '../context/AuthContext';

class SemanticNavbar extends Component {
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.state = {
			clicked: false,
		};
	}

	handleClick = () => {
		this.setState({
			clicked: !this.state.clicked,
		});
	};

	componentDidMount() {
		const contextUser = this.context;
	}

	render() {
		return (
			<div>
				<Menu fixed='top' inverted>
					<Container>
						<Menu.Item as='a' header>
							<i className='fas fa-stopwatch'></i>Time Analysis Tool
						</Menu.Item>
						<Menu.Item as={Link} to='/'>
							<Link to='/'>
								<i className='fas fa-home'></i> Home
							</Link>
						</Menu.Item>
						<Menu.Item as={Link} to='/vehicle-view'>
							<Link to='/vehicle-view'>
								<i className='fas fa-car'></i> Vehicle View
							</Link>
						</Menu.Item>
						<Menu.Item as={Link} to='/ecu-view'>
							<Link to='/ecu-view'>
								<i className='fas fa-microchip'></i> Ecu View
							</Link>
						</Menu.Item>
						<Menu.Item as={Link} to='/function-view'>
							<Link to='/function-view'>
								<i className='fas fa-atom'></i> Function View
							</Link>
						</Menu.Item>
						<Menu.Item as={Link} to='/pr-numbers'>
							<Link to='/pr-numbers'>
								<i className='fas fa-list-ol'></i> PR Numbers
							</Link>
						</Menu.Item>
						<Menu.Item as={Link} to='/about'>
							<Link to='/about'>
								<i className='fas fa-question-circle'></i> About
							</Link>
						</Menu.Item>
						{this.context.authRoles &&
							(this.context.authRoles.includes('ROLE_SUPER_ADMIN') ||
								this.context.authRoles.includes('ROLE_ADMIN')) && (
								<Menu.Item as={Link} to='/admin-dashboard'>
									<Link to='/admin-dashboard'>
										<i className='fas fa-users-cog'></i> Admin
									</Link>
								</Menu.Item>
							)}
						{this.context.user && (
							<Menu.Item>Hello, {this.context.user.sub}</Menu.Item>
						)}
						{this.context.user ? (
							<Menu.Item>
								<Button onClick={this.context.logoutUser}>
									<i className='fas fa-sign-out-alt'></i> Logout
								</Button>
							</Menu.Item>
						) : (
							<Menu.Item as={Link} to='/login'>
								<Link to='/login'>
									<Button>
										<i className='fas fa-sign-in-alt'></i> Login
									</Button>
								</Link>
							</Menu.Item>
						)}
					</Container>
				</Menu>
			</div>
		);
	}
}

export default SemanticNavbar;
