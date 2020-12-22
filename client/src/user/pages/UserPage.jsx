import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import ContentFeeds from '../../places/components/ContentFeeds';
import Avatar from '../../shared/components/UIElements/Avatar';
import StickyIcon from '../../shared/components/UIElements/StickyIcon';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './UserPage.css';

const userPageAvatarStyle = {
	margin: '0 auto',
	marginBottom: '-4rem',
	transform: 'translateY(-50%)',
	border: '.35rem solid var(--primary-bg-color)',
	backgroundColor: 'var(--primary-bg-color)',
	zIndex: 10,
};

const UserPage = () => {
	const [userInfo, setUserInfo] = useState();
	const [blogList, setBlogList] = useState();
	const [actList, setActList] = useState();

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);
	const userName = useParams().userName;

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const infoData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user/search/${userName}`
				);
				setUserInfo(infoData);
			} catch (err) {
				console.log(err);
			}

			try {
				const blogData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/blog/user/${userName}`
				);
				setBlogList(blogData);
			} catch (err) {
				console.log(err);
			}

			try {
				const actData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/activity/user/${userName}`
				);
				setActList(actData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, userName]);

	return (
		<>
			<Helmet>
				<title>{`Bloggit - ${userName}`}</title>
			</Helmet>
			<div className="user-page">
				{isLoading && <LoadingSpinner asOverlay />}
				{error && <p>{error}</p>}
				{!isLoading && auth.isLoggedIn && auth.loginInfo.name === userName && (
					<StickyIcon
						src={`${process.env.REACT_APP_HOST_URL}/uploads/images/edit-profile.png`}
						alt="edit profile icon"
						to={`/user/${userName}/edit`}
						text="Edit Profile"
					/>
				)}
				{!isLoading && userInfo && blogList && actList && (
					<>
						<div className="user-page__header">
							<Avatar
								large
								image={`${process.env.REACT_APP_HOST_URL}/${userInfo.avatar}`}
								alt={`${userInfo.name}'s Avatar`}
								style={userPageAvatarStyle}
							/>
							<div className="user-page__info">
								<h2>{userName}</h2>
								<p>{userInfo.description}</p>
							</div>
						</div>
						<div className="user-page__feeds">
							<ContentFeeds blogs={blogList} activities={actList} />
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default UserPage;
