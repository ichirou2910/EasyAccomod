import React, { useState, useContext, useEffect } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import { useForm } from '../../hooks/form-hook';
import { socket } from '../../../App';

import './Notification.css';

const Notice = (props) => {
	return (
		<li className="notification__item">
			<p>{props.item.description}</p>
			{/* <p>{props.item.date}</p> */}
		</li>
	);
};

const Notification = () => {
	const [notices, setNotices] = useState([]);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	useEffect(() => {
		socket.on('sendtoClient', (data) => {
			setNotices([...notices, data]);
		});

		return () => {
			socket.off('sendtoClient');
		};
	});

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const data = await sendRequest(
					`${process.env.REACT_APP_API_URL}/notice/user/${auth.loginInfo.user_id}`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setNotices(data);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth]);

	return (
		<div className="notification">
			<h2>Notification</h2>
			{!isLoading && notices && (
				<div className="notification__list">
					<ul>
						{notices.map((item, index) => {
							return <Notice key={index} item={item} />;
						})}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Notification;
