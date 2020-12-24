import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHttpClient } from '../../shared/hooks/http-hook';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../../places/components/PlaceList';

import './MainPage.css';

const MainPage = () => {
	const [placeList, setPlaceList] = useState();

	const { isLoading, error, sendRequest } = useHttpClient();

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const placeData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/place/`
				);
				setPlaceList(placeData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest]);

	return (
		<>
			<Helmet>
				<title>{'EasyAccomod - Main Page'}</title>
			</Helmet>
			<div className="main-page">
				{isLoading && <LoadingSpinner asOverlay />}
				{error && <p>{error}</p>}
				{!isLoading && (
					<>
						<PlaceList places={placeList} />
					</>
				)}
			</div>
		</>
	);
};

export default MainPage;
