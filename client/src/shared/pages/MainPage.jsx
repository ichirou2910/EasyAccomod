import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHttpClient } from '../../shared/hooks/http-hook';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Carousel from '../../shared/components/UIElements/Carousel';

import './MainPage.css';

const MainPage = () => {
	const [blogList, setBlogList] = useState();
	const [actList, setActList] = useState();

	const { isLoading, error, sendRequest } = useHttpClient();

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const blogData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/blog/`
				);
				setBlogList(blogData);
			} catch (err) {
				console.log(err);
			}

			try {
				const actData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/activity/`
				);

				setActList(actData);
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
						<h3>Main Page</h3>
					</>
				)}
			</div>
		</>
	);
};

export default MainPage;
