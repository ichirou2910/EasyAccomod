import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
// import { socket } from '../../App';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { socket } from '../../App';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';

import { FaFilter } from 'react-icons/fa';

import './AdminUser.css';

const AdminUser = (props) => {
	const [userList, setUserList] = useState([]);
	const [filterOpen, setFilterOpen] = useState(true);

	const { isLoading, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
		{
			status: {
				value: null,
				isValid: true,
			},
			update_permit: {
				value: null,
				isValid: true,
			},
			username: {
				value: null,
				isValid: true,
			},
			realname: {
				value: null,
				isValid: true,
			},
			identifier: {
				value: null,
				isValid: true,
			},
			email: {
				value: null,
				isValid: true,
			},
			phone: {
				value: null,
				isValid: true,
			},
		},
		true
	);

	const submitHandler = async (e) => {
		e.preventDefault();
		let query = '';
		for (const item in formState.inputs) {
			let val = formState.inputs[item].value;
			if (val === 0 || val) {
				query = query.concat(`&${item}=${val}`);
			}
		}

		query = '?'.concat(query.substr(1));
		console.log(query);

		try {
			const filteredData = await sendRequest(
				`${process.env.REACT_APP_API_URL}/admin/user${query}`,
				'GET',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			console.log(filteredData);
			setUserList(filteredData);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const userData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setUserList(userData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth]);

	const verifyHandler = (id) => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/admin/grant_account/${id}`,
				'POST',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
					'Content-Type': 'application/json',
				}
			);
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

	const allowUpdateHandler = (id) => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/admin/grant_update/${id}`,
				'POST',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
		} catch (err) {
			console.log(err);
		}

		const newNoti = {
			context_id: id,
			user_id: id,
			description: 'Account Update allowed',
			context: 'Account Verification',
		};

		socket.emit('notifyClient', newNoti);
	};

	return (
		<>
			<Helmet>
				<title>{`EasyAccomod - Users`}</title>
			</Helmet>
			<div className="admin-user">
				{!filterOpen && (
					<div className="admin-user__filter-open">
						<Button onClick={() => setFilterOpen(true)}>
							<FaFilter />
						</Button>
					</div>
				)}
				{filterOpen && (
					<div className="admin-user__filter">
						<span
							className="admin-user__filter-close"
							onClick={() => setFilterOpen(false)}
						></span>
						<form onSubmit={submitHandler}>
							<div className="place-form__group">
								<h3>User Filter</h3>
								<hr />
								<Input
									id="status"
									element="checkbox"
									label="Verified"
									validators={[]}
									onInput={inputHandler}
									initialValue={0}
									initialValid={true}
								/>
								<Input
									id="update_permit"
									element="checkbox"
									label="Profile editable"
									validators={[]}
									onInput={inputHandler}
									initialValue={0}
									initialValid={true}
								/>
								<Input
									id="username"
									element="input"
									type="text"
									label="Username"
									validators={[]}
									onInput={inputHandler}
									initialValid={true}
								/>
								<Input
									id="realname"
									element="input"
									type="text"
									label="Realname"
									validators={[]}
									onInput={inputHandler}
									initialValid={true}
								/>
								<Input
									id="identifier"
									element="input"
									type="text"
									label="Identifier"
									validators={[]}
									onInput={inputHandler}
									initialValid={true}
								/>
								<Input
									id="email"
									element="input"
									type="text"
									label="Email"
									validators={[]}
									onInput={inputHandler}
									initialValid={true}
								/>
								<Input
									id="phone"
									element="input"
									type="text"
									label="Phone"
									validators={[]}
									onInput={inputHandler}
									initialValid={true}
								/>
							</div>
							<Button
								style={{ width: '100%' }}
								type="submit"
								disabled={!formState.isValid}
							>
								Filter
							</Button>
						</form>
					</div>
				)}
				<div className="admin-user__result">
					{!isLoading && userList && (
						<ul>
							{userList.map((item, index) => {
								return (
									<li key={index}>
										<Card className={`user-item__card card--lighter`}>
											<div className="user-item__info">
												<p className="user-item__name">
													<strong
														style={{
															color: `${item.status ? '#28a745' : '#dc3545'}`,
														}}
													>
														{item.username}
													</strong>
												</p>
												{!item.status && (
													<em
														style={{ color: '#17a2b8', cursor: 'pointer' }}
														onClick={() => {
															item.status = true;
															verifyHandler(item.id);
														}}
													>
														Click to verified
													</em>
												)}
												{!item.update_permit && (
													<em
														style={{ color: '#17a2b8', cursor: 'pointer' }}
														onClick={() => {
															item.update_permit = true;
															allowUpdateHandler(item.id);
														}}
													>
														(Allow Update)
													</em>
												)}
												<br />
												<p className="user-item__name">
													Real name: <strong>{item.realname}</strong>
												</p>
												<p className="user-item__name">
													Identifier: <strong>{item.identifier}</strong>
												</p>
												<p className="user-item__name">
													Address: <strong>{item.address}</strong>
												</p>
												<p className="user-item__name">
													Email: <strong>{item.email}</strong>
												</p>
												<p className="user-item__name">
													Phone: <strong>{item.phone}</strong>
												</p>
												{/* <span className="comment-item__rating">{props.cmt.rating}/5</span> */}
											</div>
										</Card>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>
		</>
	);
};

export default AdminUser;
