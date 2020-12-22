import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { VALIDATOR_MAXLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

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
	const userName = useParams().userName;

	const [formState, inputHandler, setFormData] = useForm(
		{
			description: {
				value: '',
				isValid: false,
			},
			avatar: {
				value: null,
				isValid: true,
			},
			cover: {
				value: null,
				isValid: true,
			},
		},
		false
	);

	useEffect(() => {
		setFormData(
			{
				description: {
					value: userInfo ? userInfo.description : '',
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
					`${process.env.REACT_APP_API_URL}/user/search/${userName}`
				);

				setUserInfo(infoData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, userName]);

	const submitHandler = async (event) => {
		event.preventDefault();

		try {
			let empty = true; // Whether there is change in form value

			const formData = new FormData();
			if (formState.inputs.description.value !== userInfo.description) {
				formData.append('description', formState.inputs.description.value);
				empty = false;
			}
			if (formState.inputs.avatar) {
				formData.append('avatar', formState.inputs.avatar.value);
				empty = false;
			}
			if (formState.inputs.cover) {
				empty = false;
				formData.append('cover', formState.inputs.cover.value);
			}

			if (!empty) {
				// Only send edit request if any field changed
				sendRequest(
					`${process.env.REACT_APP_API_URL}/user/${userName}`,
					'POST',
					formData,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				).then((res) => {
					const newInfo = { ...auth.loginInfo, avatar: res.avatar };
					auth.setInfo(newInfo);
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
			<div style={{ marginTop: '4rem' }}>
				<h2>User not found</h2>
			</div>
		);
	}

	if (edited) {
		return <Redirect to={`/user/${userName}`} />;
	}

	return (
		<>
			<Helmet>
				<title>{`Bloggit - ${userName}`}</title>
			</Helmet>
			<form className="blog-form base-view" onSubmit={submitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				{error && <p>{error}</p>}
				{!isLoading && userInfo && (
					<>
						<div className="user-form__name">
							<strong>{userName}</strong>&#39;s Profile
						</div>
						<div className="user-form__description">
							<Input
								id="description"
								element="textarea"
								label="Description (max 120 chars)"
								validators={[VALIDATOR_MAXLENGTH(120)]}
								errorText="Description too long or empty."
								onInput={inputHandler}
								initialValue={userInfo.description}
								initialValid={true}
								style={{ height: 'auto' }}
							/>
						</div>
						<ImageUpload
							square
							id="avatar"
							onInput={inputHandler}
							description="CHANGE AVATAR"
							initialValue={`${process.env.REACT_APP_HOST_URL}/${userInfo.avatar}`}
							initialValid={true}
						/>
						<ImageUpload
							id="cover"
							onInput={inputHandler}
							description="CHANGE COVER"
							initialValue={`${process.env.REACT_APP_HOST_URL}/${userInfo.cover}`}
							initialValid={true}
						/>
						<div className="blog-form__submit">
							<Button type="submit" disabled={!formState.isValid}>
								EDIT
							</Button>
						</div>
					</>
				)}
			</form>
		</>
	);
};

export default EditUser;
