import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<AuthProvider>
				<Navbar />
				<App />
			</AuthProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
