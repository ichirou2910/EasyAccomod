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
// import MainPage from './shared/pages/MainPage';
// import SearchPage from './shared/pages/SearchPage';
import NewPlace from './places/pages/NewPlace';
import EditPlace from './places/pages/EditPlace';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

import './App.css';

const Auth = React.lazy(() => import('./user/pages/Auth'));
const MainPage = React.lazy(() => import('./shared/pages/MainPage'));
const SearchPage = React.lazy(() => import('./shared/pages/SearchPage'));
const UserPage = React.lazy(() => import('./user/pages/UserPage'));
const EditUser = React.lazy(() => import('./user/pages/EditUser'));
const PlacePage = React.lazy(() => import('./places/pages/PlacePage'));

const NoMatch = () => (
	<h2 style={{ color: 'white', textAlign: 'center' }}>
		The page you are looking for doesn't exist
	</h2>
);

// const ENDPOINT = 'http://localhost:5000/';

// let socket;

const App = () => {
	const { token, login, logout, loginInfo, setInfo } = useAuth();

	// socket = socketIOClient(ENDPOINT);

	let routes;

	if (token) {
		routes =
			loginInfo.user_type === 'Renter' ? (
				<Switch>
					<Route path="/" exact>
						<MainPage />
					</Route>
					<Route path="/search">
						<SearchPage all />
					</Route>
					<Route path="/profile/place">
						<SearchPage />
					</Route>
					<Route path="/profile/edit">
						<EditUser />
					</Route>
					<Route path="/profile">
						<UserPage />
					</Route>
					<Route path="/place/:placeId">
						<PlacePage />
					</Route>
					<Route path="*">
						<NoMatch />
					</Route>
					{/* <Redirect to="/" /> */}
				</Switch>
			) : (
				<Switch>
					<Route path="/search">
						<SearchPage />
					</Route>
					<Route path="/place/create">
						<NewPlace />
					</Route>
					<Route path="/place/:placeId/edit">
						<EditPlace />
					</Route>
					<Route path="/place/:placeId">
						<PlacePage />
					</Route>
					<Route path="/profile/edit" exact>
						<EditUser />
					</Route>
					<Route path="/profile/place" exact>
						<SearchPage />
					</Route>
					<Route path="/profile" exact>
						<UserPage />
					</Route>
					<Route path="*">
						<NoMatch />
					</Route>
					{/* <Redirect to="/profile" /> */}
				</Switch>
			);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<MainPage />
				</Route>
				<Route path="/auth">
					<Auth />
				</Route>
				<Route path="*">
					<NoMatch />
				</Route>
				{/* <Redirect to="/" /> */}
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
