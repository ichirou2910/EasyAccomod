import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { socket } from '../../App';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';

import './AdminNoti.css';

const AdminNoti = () => {
	const [notices, setNotices] = useState([]);

	const { isLoading, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
		{
			mark: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			const filteredData = await sendRequest(
				`${process.env.REACT_APP_API_URL}/notice/filter?mark=${formState.inputs.mark.value}`,
				'GET',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			setNotices(filteredData);
		} catch (err) {
			console.log(err);
		}
	};

	const acceptExtension = (count, user, id) => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/admin/confirm_extend`,
				'POST',
				JSON.stringify({
					place_id: id,
				}),
				{
					Authorization: 'Bearer ' + auth.token,
					'Content-Type': 'application/json',
				}
			).then(() => {
				sendRequest(
					`${process.env.REACT_APP_API_URL}/notice/mark/${count}`,
					'POST',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
			});
		} catch (err) {
			console.log(err);
		}

		const newNoti = {
			context_id: id,
			user_id: user,
			description: 'Time extension request accepted',
			context: 'Time Extension',
		};

		socket.emit('notifyClient', newNoti);
	};

	const denyExtension = (count, user, id) => {
		sendRequest(
			`${process.env.REACT_APP_API_URL}/notice/mark/${count}`,
			'POST',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			}
		);
		const newNoti = {
			context_id: id,
			user_id: user,
			description: 'Time extension request denied',
			context: 'Time Extension',
		};

		socket.emit('notifyClient', newNoti);
	};

	const acceptPlace = (count, user, id) => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/admin/confirm_place`,
				'POST',
				JSON.stringify({
					place_id: id,
				}),
				{
					Authorization: 'Bearer ' + auth.token,
					'Content-Type': 'application/json',
				}
			).then(() => {
				sendRequest(
					`${process.env.REACT_APP_API_URL}/notice/mark/${count}`,
					'POST',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
			});
		} catch (err) {
			console.log(err);
		}

		const newNoti = {
			context_id: id,
			user_id: user,
			description: 'Place verification request accepted',
			context: 'Place Verification',
		};

		socket.emit('notifyClient', newNoti);
	};

	const denyPlace = (count, user, id) => {
		sendRequest(
			`${process.env.REACT_APP_API_URL}/notice/mark/${count}`,
			'POST',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			}
		);
		const newNoti = {
			context_id: id,
			user_id: user,
			description: 'Place verification request accepted',
			context: 'Place Verification',
		};

		socket.emit('notifyClient', newNoti);
	};

	const acceptVerification = (count, id) => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/admin/grant_account/${id}`,
				'POST',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			).then(() => {
				sendRequest(
					`${process.env.REACT_APP_API_URL}/notice/mark/${count}`,
					'POST',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
			});
		} catch (err) {
			console.log(err);
		}

		const newNoti = {
			context_id: id,
			user_id: id,
			description: 'Account verification request accepted',
			context: 'Account Verification',
		};

		socket.emit('notifyClient', newNoti);
	};

	const denyVerification = (count, id) => {
		sendRequest(
			`${process.env.REACT_APP_API_URL}/notice/mark/${count}`,
			'POST',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			}
		);
		const newNoti = {
			context_id: id,
			user_id: id,
			description: 'Account verification request denied',
			context: 'Account Verification',
		};

		socket.emit('notifyClient', newNoti);
	};

	const markRead = (count) => {
		sendRequest(
			`${process.env.REACT_APP_API_URL}/notice/mark/${count}`,
			'POST',
			null,
			{
				Authorization: 'Bearer ' + auth.token,
			}
		);
	};

	useEffect(() => {
		socket.on('sendtoAdmin', (data) => {
			setNotices([data, ...notices]);
		});
		return () => {
			socket.off('sendtoAdmin');
		};
	});

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const infoData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/notice`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setNotices(infoData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth]);

	return (
		<>
			<Helmet>
				<title>{`EasyAccomod - Notifications`}</title>
			</Helmet>
			<div className="admin-noti">
				<form onSubmit={submitHandler}>
					<Input
						id="mark"
						element="checkbox"
						label="Read"
						validators={[]}
						onInput={inputHandler}
						initialValue={0}
						initialValid={true}
					/>
					<Button type="submit">Filter</Button>
				</form>
				{!isLoading && notices && (
					<ul>
						{notices.map((item, index) => {
							return (
								<li key={index}>
									<Card className={`user-item__card card--lighter`}>
										<p>{item.description}</p>
										{item.context === 'Time Extension' && (
											<>
												<a
													rel="noreferrer"
													target="_blank"
													href={`/admin/place/${item.context_id}`}
													style={{ color: 'var(--accent-color)' }}
												>
													Mentioned Place
												</a>
												<p>Requested Time: {item.value} days</p>
												{!item.mark && (
													<>
														<Button
															style={{ marginRight: '.5rem' }}
															onClick={() =>
																acceptExtension(
																	item.count,
																	item.user_id,
																	item.context_id
																)
															}
														>
															Accept
														</Button>
														<Button
															danger
															onClick={() =>
																denyExtension(
																	item.count,
																	item.user_id,
																	item.context_id
																)
															}
														>
															Deny
														</Button>
													</>
												)}
											</>
										)}
										{item.context === 'Place Verification' && (
											<>
												<a
													rel="noreferrer"
													target="_blank"
													href={`/admin/place/${item.context_id}`}
													style={{ color: 'var(--accent-color)' }}
												>
													Mentioned Place
												</a>
												<p>Requested Time: {item.value} days</p>
												{!item.mark && (
													<>
														<Button
															style={{ marginRight: '.5rem' }}
															onClick={() =>
																acceptPlace(
																	item.count,
																	item.user_id,
																	item.context_id
																)
															}
														>
															Accept
														</Button>
														<Button
															danger
															onClick={() =>
																denyPlace(
																	item.count,
																	item.user_id,
																	item.context_id
																)
															}
														>
															Deny
														</Button>
													</>
												)}
											</>
										)}
										{item.context === 'Account Verification' && (
											<>
												<a
													rel="noreferrer"
													target="_blank"
													href={`/admin/user/${item.context_id}`}
													style={{ color: 'var(--accent-color)' }}
												>
													Mentioned User
												</a>
												{!item.mark && (
													<>
														<Button
															style={{ marginRight: '.5rem' }}
															onClick={() =>
																acceptVerification(item.count, item.context_id)
															}
														>
															Accept
														</Button>
														<Button
															danger
															onClick={() =>
																denyVerification(item.count, item.context_id)
															}
														>
															Deny
														</Button>
													</>
												)}
											</>
										)}
										{item.context === 'Place Status Update' && (
											<Button
												target="_blank"
												href={`/admin/place/${item.context_id}`}
												onClick={() => markRead(item.count)}
											>
												Visit Place
											</Button>
										)}
										{item.context === 'Account Update' && (
											<Button
												// rel="noreferrer"
												target="_blank"
												href={`/admin/user/${item.context_id}`}
												onClick={() => markRead(item.count)}
											>
												Visit User
											</Button>
										)}
									</Card>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</>
	);
};

export default AdminNoti;
