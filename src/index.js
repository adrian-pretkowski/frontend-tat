import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SemanticNavbar from './components/SemanticNavbar';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<AuthProvider>
				<SemanticNavbar />
				<App />
			</AuthProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
