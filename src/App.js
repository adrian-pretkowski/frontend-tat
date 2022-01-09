import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AdminPage } from './pages/AdminPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utils/PrivateRoute';

function App() {
	return (
		// <AuthProvider>
		<Routes>
			<Route
				path='/'
				element={
					<PrivateRoute>
						<HomePage />
					</PrivateRoute>
				}
			/>
			<Route
				path='/admin-dashboard'
				element={
					<PrivateRoute>
						<AdminPage />
					</PrivateRoute>
				}
			/>

			<Route path='/login' element={<LoginPage />} />
		</Routes>
		// </AuthProvider>
	);
}

export default App;
