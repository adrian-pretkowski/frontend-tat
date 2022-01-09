import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Button } from '../Button';
import { MenuItems } from './MenuItems';
import './Navbar.css';

class Navbar extends Component {
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
			<nav className='NavbarItems'>
				<h1 className='navbar-logo'>
					<i className='fas fa-stopwatch'></i> Time Analysis Tool{' '}
				</h1>
				<div className='menu-icon' onClick={this.handleClick}>
					<i
						className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}
					></i>
				</div>
				<ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
					{MenuItems.map((item, index) => {
						return (
							<li key={index}>
								<Link className={item.cName} to={item.url}>
									<i className={item.icon}></i> {item.title}
								</Link>
							</li>
						);
					})}

					{this.context.authRoles && (this.context.authRoles.includes('ROLE_SUPER_ADMIN') || this.context.authRoles.includes('ROLE_ADMIN')) && (
						<li>
							<Link className='nav-links' to='/admin-dashboard'>
								<i className='fas fa-users-cog'></i> Admin
							</Link>
						</li>
					)}
				</ul>

				{this.context.user && (
					<div className='greetings-user'>Hello, {this.context.user.sub}</div>
				)}

				{this.context.user ? (
					<Button onClick={this.context.logoutUser}>
						<i className='fas fa-sign-out-alt'></i>Logout
					</Button>
				) : (
					<Link to='/login'>
						<Button>
							<i className='fas fa-sign-in-alt'></i> Login
						</Button>
					</Link>
				)}
			</nav>
		);
	}
}

export default Navbar;
