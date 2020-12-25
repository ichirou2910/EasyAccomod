import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../../places/components/PlaceList';

import './MainPage.css';

const MainPage = () => {
	const [placeList, setPlaceList] = useState([]);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const placeData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/place`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setPlaceList(placeData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth.token]);

	return (
		<>
			{placeList && (
				<Helmet>
					<title>{'EasyAccomod - Main Page'}</title>
				</Helmet>
			)}
			<div className="main-page">
				{isLoading && <LoadingSpinner asOverlay />}
				{!isLoading &&
					auth.isLoggedIn &&
					auth.loginInfo.user_type === 'Renter' &&
					placeList && (
						<>
							<PlaceList places={placeList} />
						</>
					)}
				{!auth.isLoggedIn && (
					<h2 style={{ color: 'white' }}>
						Welcome to EasyAccomod.{' '}
						<span>
							<a href="/auth" style={{ color: 'var(--accent-color)' }}>
								Login
							</a>
						</span>{' '}
						to get started.
					</h2>
				)}
			</div>
		</>
	);
};

export default MainPage;
