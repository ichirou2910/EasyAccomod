import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import {
	VALIDATOR_MAXLENGTH,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Editor from '../../shared/components/FormElements/Editor';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlaceForm.css';

const NewBlog = () => {
	const [edited, setEdited] = useState(false);
	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			content: {
				value: '',
				isValid: false,
			},
			cover: {
				value: null,
				isValid: true,
			},
		},
		false
	);

	const submitHandler = async (event) => {
		event.preventDefault();

		let now = new Date();
		let _date = now.toISOString();
		let _display = now.toLocaleString('en-us', {
			timeZone: 'Asia/Ho_Chi_Minh',
		});

		// Create new Blog
		try {
			const formData = new FormData();
			formData.append('user', auth.loginInfo.name);
			formData.append('title', formState.inputs.title.value);
			formData.append('content', formState.inputs.content.value);
			formData.append('cover', formState.inputs.cover.value);
			formData.append('date', _date);
			formData.append('displayDate', _display);

			sendRequest(
				`${process.env.REACT_APP_API_URL}/blog/create`,
				'POST',
				formData,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			)
				.then((res) => {
					return sendRequest(
						`${process.env.REACT_APP_API_URL}/activity/create`,
						'POST',
						JSON.stringify({
							user: auth.loginInfo.name,
							blogId: res._id,
							type: 'post',
							date: _date,
						}),
						{
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + auth.token,
						}
					);
				})
				.then(() => setEdited(true));
		} catch (err) {
			console.log(err);
		}
	};

	if (edited) {
		return <Redirect to={`/`} />;
	}

	return (
		<>
			<Helmet>
				<title>{'Bloggit - New Blog'}</title>
			</Helmet>
			<form className="blog-form base-view" onSubmit={submitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				{error && <p>{error}</p>}
				<div className="blog-form__title">
					<Input
						id="title"
						element="input"
						type="text"
						label="Title"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						errorText="Please enter a valid title."
						onInput={inputHandler}
					/>
				</div>
				<Editor
					id="content"
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
					errorText="Please enter valid content (at least 5 characters)."
					onInput={inputHandler}
					editValue=""
					editValid={false}
					previewValue={formState.inputs['content'].value}
				/>
				<ImageUpload
					id="cover"
					description="CHOOSE COVER"
					onInput={inputHandler}
				/>
				<div className="blog-form__submit">
					<Button type="submit" disabled={!formState.isValid}>
						CREATE
					</Button>
				</div>
			</form>
		</>
	);
};

export default NewBlog;
