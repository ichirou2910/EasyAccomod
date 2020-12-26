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
				<title>{'EasyAccomod - Main Page'}</title>
			</Helmet>
			<div className="main-page">
				<h2 style={{ color: 'white' }}>Welcome to EasyAccomod</h2>
				{!auth.isLoggedIn ? (
					<Auth />
				) : (
					<div className="main-page__actions">
						<a href="/profile">VIEW your profile</a>
						{auth.loginInfo.user_type === 'Owner' ? (
							<a href="/place/create">SHARE your places</a>
						) : (
							<a href="/search">FIND a place</a>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default MainPage;
