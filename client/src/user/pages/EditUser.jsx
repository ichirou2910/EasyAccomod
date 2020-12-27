import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { socket } from '../../App';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './EditUser.css';
import '../../places/pages/PlaceForm.css';

const EditUser = () => {
	const [userInfo, setUserInfo] = useState();
	const [edited, setEdited] = useState(false);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler, setFormData] = useForm(
		{
			realname: {
				value: '',
				isValid: false,
			},
			identifier: {
				value: null,
				isValid: false,
			},
			address: {
				value: null,
				isValid: false,
			},
			phone: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	useEffect(() => {
		setFormData(
			{
				realname: {
					value: userInfo ? userInfo.realname : '',
					isValid: userInfo ? true : false,
				},
				identifier: {
					value: userInfo ? userInfo.identifier : '',
					isValid: userInfo ? true : false,
				},
				address: {
					value: userInfo ? userInfo.address : '',
					isValid: userInfo ? true : false,
				},
				phone: {
					value: userInfo ? userInfo.phone : '',
					isValid: userInfo ? true : false,
				},
			},
			true
		);
	}, [setFormData, userInfo]);

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

	const submitHandler = async (event) => {
		event.preventDefault();

		try {
			let empty = true; // Whether there is change in form value
			const newInfo = {};

			const formData = new FormData();
			if (formState.inputs.realname.value !== userInfo.realname) {
				newInfo['realname'] = formState.inputs.realname.value;
				empty = false;
			}
			if (formState.inputs.identifier.value !== userInfo.identifier) {
				newInfo['identifier'] = formState.inputs.identifier.value;
				empty = false;
			}
			if (formState.inputs.address.value !== userInfo.address) {
				newInfo['address'] = formState.inputs.address.value;
				empty = false;
			}
			if (formState.inputs.phone.value !== userInfo.phone) {
				newInfo['phone'] = formState.inputs.phone.value;
				empty = false;
			}

			if (!empty) {
				// Only send edit request if any field changed
				sendRequest(
					`${process.env.REACT_APP_API_URL}/user/${auth.loginInfo.user_id}`,
					'POST',
					JSON.stringify(newInfo),
					{
						Authorization: 'Bearer ' + auth.token,
						'Content-Type': 'application/json',
					}
				).then((res) => {
					const newInfo = { ...auth.loginInfo, avatar: res.avatar };
					auth.setInfo(newInfo);

					const newNoti = {
						context_id: auth.loginInfo.user_id,
						user_id: auth.loginInfo.user_id,
						description: 'Account Info update request',
						context: 'Account Update',
					};

					socket.emit('notifyAdmin', newNoti);

					setEdited(true);
				});
			} else {
				setEdited(true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	if (!userInfo) {
		return (
			<div style={{ marginTop: '4rem', color: 'white' }}>
				<h2>User not found</h2>
			</div>
		);
	}

	if (userInfo && !userInfo.update_permit) {
		// console.log('Edit not allowed');
		return <Redirect to="/profile" />;
	}

	if (edited) {
		// console.log('Edit finished');
		return <Redirect to="/profile" />;
	}

	return (
		<>
			<Helmet>
				<title>{`EasyAccomod - Edit Profile`}</title>
			</Helmet>
			{!isLoading && userInfo && userInfo.update_permit && (
				<form className="place-form base-view" onSubmit={submitHandler}>
					{isLoading && <LoadingSpinner asOverlay />}
					{error && <p>{error}</p>}
					{!isLoading && userInfo && (
						<>
							<div className="user-form__name">My Profile</div>
							<Input
								element="input"
								id="realname"
								type="text"
								label="Real Name"
								validators={[]}
								onInput={inputHandler}
								initialValue={userInfo.realname}
								initialValid={false}
							/>
							<Input
								element="input"
								id="identifier"
								type="text"
								label="Citizen Identifier"
								validators={[]}
								onInput={inputHandler}
								initialValue={userInfo.identifier}
							/>
							<Input
								element="input"
								id="address"
								type="text"
								label="Address"
								validators={[]}
								onInput={inputHandler}
								initialValue={userInfo.address}
							/>
							<Input
								element="input"
								id="phone"
								type="text"
								label="Phone No."
								validators={[]}
								onInput={inputHandler}
								initialValue={userInfo.phone}
							/>
							<div className="place-form__submit">
								<Button type="submit" disabled={!formState.isValid}>
									EDIT
								</Button>
							</div>
						</>
					)}
				</form>
			)}
		</>
	);
};

export default EditUser;
