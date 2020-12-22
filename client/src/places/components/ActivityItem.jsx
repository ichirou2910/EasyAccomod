import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useHttpClient } from '../../shared/hooks/http-hook';

import Avatar from '../../shared/components/UIElements/Avatar';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './ActivityItem.css';

const avatarStyle = {
	// border: '3px solid var(--lighter-primary-color)',
	// backgroundColor: 'var(--lighter-primary-color)',
	border: '3px solid var(--sub-color)',
	backgroundColor: 'var(--sub-color)',
};

const ActivityItem = (props) => {
	const [avatar, setAvatar] = useState();
	const [blog, setBlog] = useState();

	const { isLoading, error, sendRequest } = useHttpClient();

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const avt = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user/avatar/${props.user}`
				);
				setAvatar(avt);
			} catch (err) {}

			try {
				const blogData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/blog/${props.blogId}`
				);
				setBlog(blogData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, props.blogId, props.user]);

	return (
		<li className="activity-item">
			{isLoading && <LoadingSpinner asOverlay />}
			{error && <p>{error}</p>}
			{!isLoading && blog && avatar && (
				<>
					<Link to={`/user/${props.user}`}>
						<Avatar
							image={`${process.env.REACT_APP_HOST_URL}/${avatar}`}
							alt={`${props.user}'s Avatar`}
							style={avatarStyle}
							medium
						/>
					</Link>
					<div className="activity-item__info">
						<HashLink
							to={
								props.actionId
									? `/blog/${props.blogId}#cmt-${props.actionId}`
									: `/blog/${props.blogId}`
							}
						>
							<p className="activity-item__user">
								<strong>{props.user}</strong> {props.action}
							</p>
							<p className="activity-item__title">
								<span>{blog.title}</span>
							</p>
						</HashLink>
					</div>
				</>
			)}
		</li>
	);
};

export default ActivityItem;
