import React, { Suspense } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
// import socketIOClient from 'socket.io-client';

import Navigation from './shared/components/Navigation/Navigation';
import MainPage from './shared/pages/MainPage';
import NewPlace from './places/pages/NewPlace';
import EditPlace from './places/pages/EditPlace';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

import './App.css';

const Auth = React.lazy(() => import('./user/pages/Auth'));
const UserPage = React.lazy(() => import('./user/pages/UserPage'));
const EditUser = React.lazy(() => import('./user/pages/EditUser'));
const PlacePage = React.lazy(() => import('./places/pages/PlacePage'));

// const ENDPOINT = 'http://localhost:5000/';

// let socket;

const App = () => {
	const { token, login, logout, loginInfo, setInfo } = useAuth();

	// socket = socketIOClient(ENDPOINT);

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<MainPage />
				</Route>
				<Route path="/user/:userName/edit">
					<EditUser />
				</Route>
				<Route path="/user/:userName">
					<UserPage />
				</Route>
				<Route path="/place/create" exact>
					<NewPlace />
				</Route>
				<Route path="/place/:placeId/edit" exact>
					<EditPlace />
				</Route>
				<Route path="/place/:placeId">
					<PlacePage />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<MainPage />
				</Route>
				<Route path="/user/:userName">
					<UserPage />
				</Route>
				<Route path="/place/:placeId">
					<PlacePage />
				</Route>
				<Route path="/auth">
					<Auth />
				</Route>
				<Redirect to="/auth" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				loginInfo: loginInfo,
				login: login,
				logout: logout,
				setInfo: setInfo,
			}}
		>
			<Router>
				<Navigation />
				<main>
					<Suspense
						fallback={
							<div>
								<LoadingSpinner />
							</div>
						}
					>
						{routes}
					</Suspense>
				</main>
			</Router>
		</AuthContext.Provider>
	);
};

// export { App, socket };
export default App;
