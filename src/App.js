import { Route, Routes } from 'react-router-dom';
import './App.css';
import { AdminPage } from './pages/AdminPage';
import { EcuViewPage } from './pages/EcuViewPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { VehicleViewPage } from './pages/VehicleViewPage';
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

			<Route path='vehicle-view' element={<VehicleViewPage />} />
			<Route path='ecu-view' element={<EcuViewPage />} />

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
