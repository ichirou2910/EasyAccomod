import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import socketIOClient from 'socket.io-client';

import Navigation from './shared/components/Navigation/Navigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

import './App.css';

const MainPage = React.lazy(() => import('./shared/pages/MainPage'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const PlacePage = React.lazy(() => import('./places/pages/PlacePage'));
const UserPage = React.lazy(() => import('./user/pages/UserPage'));
const AdminPost = React.lazy(() => import('./admin/pages/AdminPost'));
const AdminChat = React.lazy(() => import('./admin/pages/AdminChat'));
const AdminUser = React.lazy(() => import('./admin/pages/AdminUser'));
const AdminNoti = React.lazy(() => import('./admin/pages/AdminNoti'));

const NoMatch = () => (
	<div style={{ textAlign: 'center', padding: '.5rem', color: 'white' }}>
		<h2>OOPS. The page you are looking for does not exist.</h2>
		<a href="/">
			<p>Back to Main Page</p>
		</a>
	</div>
);

const ENDPOINT = 'http://localhost:5000/';

let socket;

const App = () => {
	const { token, login, logout, loginInfo, setInfo } = useAuth();

	socket = socketIOClient(ENDPOINT);

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<MainPage />
				</Route>
				<Route path="/admin/place/create">
					<NewPlace />
				</Route>
				<Route path="/admin/place/:placeId">
					<PlacePage />
				</Route>
				<Route path="/admin/place">
					<AdminPost />
				</Route>
				<Route path="/admin/user/:userId">
					<UserPage />
				</Route>
				<Route path="/admin/user">
					<AdminUser />
				</Route>
				<Route path="/admin/chat">
					<AdminChat />
				</Route>
				<Route path="/admin/notification">
					<AdminNoti />
				</Route>
				<Route path="*">
					<NoMatch />
				</Route>
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<MainPage />
				</Route>
				<Route path="*">
					<NoMatch />
				</Route>
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

export { App, socket };
// export default App;
