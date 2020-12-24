import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, useParams } from 'react-router-dom';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlaceForm.css';

const EditBlog = () => {
	const [blog, setBlog] = useState();
	const [edited, setEdited] = useState(false);
	const [deleted, setDeleted] = useState(false);

	const auth = useContext(AuthContext);

	const { isLoading, error, sendRequest } = useHttpClient();

	const blogId = useParams().blogId;

	const [formState, inputHandler, setFormData] = useForm(
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

	useEffect(() => {
		setFormData(
			{
				title: {
					value: blog ? blog.title : '',
					isValid: true,
				},
				content: {
					value: blog ? blog.content : '',
					isValid: true,
				},
			},
			true
		);
	}, [setFormData, blog]);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const blogData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/blog/${blogId}`
				);
				setBlog(blogData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, blogId]);

	const submitHandler = (event) => {
		event.preventDefault();

		let now = new Date();
		let _date = now.toISOString();
		let _display = now.toLocaleString('en-us', {
			timeZone: 'Asia/Ho_Chi_Minh',
		});

		try {
			let empty = true; // Whether there is change in form value

			const formData = new FormData();
			if (formState.inputs.title.value !== blog.title) {
				formData.append('title', formState.inputs.title.value);
				empty = false;
			}
			if (formState.inputs.content.value !== blog.content) {
				formData.append('content', formState.inputs.content.value);
				empty = false;
			}
			if (formState.inputs.cover) {
				empty = false;
				formData.append('cover', formState.inputs.cover.value);
			}

			formData.append('date', _date);
			formData.append('displayDate', _display);

			if (!empty) {
				// Only send edit request if any field changed
				sendRequest(
					`${process.env.REACT_APP_API_URL}/blog/${blogId}`,
					'POST',
					formData,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				).then(() => setEdited(true));
			} else {
				setEdited(true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const deleteBlogHandler = async (event) => {
		event.preventDefault();

		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/blog/${blogId}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			)
				.then(() => {
					sendRequest(
						`${process.env.REACT_APP_API_URL}/comment/blog/${blogId}`,
						'DELETE',
						null,
						{
							Authorization: 'Bearer ' + auth.token,
						}
					);
				})
				.then(() => {
					sendRequest(
						`${process.env.REACT_APP_API_URL}/activity/blog/${blogId}`,
						'DELETE',
						null,
						{
							Authorization: 'Bearer ' + auth.token,
						}
					).then(() => {
						setDeleted(true);
					});
				});
		} catch (err) {
			console.log(err);
		}
	};

	if (!blog) {
		return (
			<div style={{ marginTop: '4rem' }}>
				<h2>Blog not found</h2>
			</div>
		);
	}

	if (edited) {
		return <Redirect to={`/blog/${blogId}`} />;
	}

	if (deleted) {
		return <Redirect to={'/'} />;
	}

	return (
		<>
			{blog && (
				<Helmet>
					<title>{`Bloggit - ${blog.title}`}</title>
				</Helmet>
			)}
			<form className="blog-form base-view" onSubmit={submitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				{error && <p>{error}</p>}
				{!isLoading && blog && (
					<>
						<div className="blog-form__title">
							<Input
								id="title"
								element="input"
								type="text"
								label="Title"
								validators={[VALIDATOR_REQUIRE()]}
								errorText="Please enter a valid title."
								onInput={inputHandler}
								initialValue={blog.title}
								initialValid={true}
							/>
						</div>
						<ImageUpload
							id="cover"
							onInput={inputHandler}
							description="CHANGE COVER"
							initialValue={`${process.env.REACT_APP_HOST_URL}/${blog.cover}`}
							initialValid={true}
						/>
						<div className="blog-form__submit">
							<Button type="submit" disabled={!formState.isValid}>
								EDIT
							</Button>
							<Button danger onClick={deleteBlogHandler}>
								DELETE
							</Button>
						</div>
					</>
				)}
			</form>
		</>
	);
};

export default EditBlog;
