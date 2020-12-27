import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Avatar from '../../shared/components/UIElements/Avatar';
import StickyIcon from '../../shared/components/UIElements/StickyIcon';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './UserPage.css';

const UserPage = () => {
	const [userInfo, setUserInfo] = useState({});
	const [placeList, setPlaceList] = useState([]);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const infoData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user/${auth.loginInfo.user_id}`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setUserInfo(infoData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth]);

	return (
		<>
			<Helmet>
				<title>EasyAccomod - My Profile</title>
			</Helmet>
			<div className="user-page base-view">
				{isLoading && <LoadingSpinner asOverlay />}
				{/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
				{!isLoading &&
					userInfo &&
					auth.isLoggedIn &&
					userInfo.update_permit && (
						<StickyIcon
							src={`${process.env.REACT_APP_HOST_URL}/uploads/images/edit-profile.png`}
							alt="edit profile icon"
							to={`/profile/edit`}
							text="Edit Profile"
						/>
					)}
				{!isLoading && userInfo && placeList && (
					<>
						<div className="user-page__header">
							<Avatar
								medium
								image={`${process.env.REACT_APP_HOST_URL}/${userInfo.avatar}`}
								alt={`${userInfo.name}'s Avatar`}
							/>
							<h2>{userInfo.username}</h2>
						</div>
						<div className="user-page__info">
							<h2>General Info</h2>
							<ul>
								<li>
									<span>
										<strong>Real Name</strong>
									</span>
									{userInfo.realname}
								</li>
								<li>
									<span>
										<strong>Identifier</strong>
									</span>
									{userInfo.identifier}
								</li>
								<li>
									<span>
										<strong>Address</strong>
									</span>
									{userInfo.address}
								</li>
								<li>
									<span>
										<strong>Phone</strong>
									</span>
									{userInfo.phone}
								</li>
								<li>
									<span>
										<strong>Email</strong>
									</span>
									{userInfo.email}
								</li>
								<li>
									<span>
										<strong>User Type</strong>
									</span>
									{userInfo.user_type}
								</li>
							</ul>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default UserPage;
