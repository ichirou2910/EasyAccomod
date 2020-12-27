import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../shared/context/auth-context';

import './MainPage.css';
import Auth from '../../user/pages/Auth';

const MainPage = () => {
	const auth = useContext(AuthContext);

	return (
		<>
			<Helmet>
				<title>{'EasyAccomod - Admin'}</title>
			</Helmet>
			<div
				className="main-container"
				style={{
					backgroundImage: `url(${process.env.REACT_APP_HOST_URL}/uploads/images/main-background.png)`,
				}}
			>
				<div className="main-page">
					<h2 style={{ color: 'white' }}>Welcome to EasyAccomod</h2>
					{!auth.isLoggedIn ? (
						<Auth />
					) : (
						<div className="main-page__actions">
							<a href="/admin/user">Get Started</a>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default MainPage;
