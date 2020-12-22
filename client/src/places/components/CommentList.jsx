import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import CommentItem from './CommentItem';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import './CommentList.css';
import '../pages/PlaceForm.css';

const commmentInputStyle = {
	height: 'auto',
};

const CommentList = (props) => {
	const [comments, setComments] = useState(props.comments);
	const [cmtAdded, setCmtAdded] = useState(false);

	const auth = useContext(AuthContext);
	const { sendRequest } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			content: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const commentAddHandler = async (event) => {
		event.preventDefault();

		let now = new Date();
		let _date = now.toISOString();
		let _display = now.toLocaleString('en-us', {
			timeZone: 'Asia/Ho_Chi_Minh',
		});

		const newComment = {
			user: auth.loginInfo.name,
			content: formState.inputs.content.value,
			blog_id: props.blogId,
			date: _date,
			displayDate: _display,
		};

		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/comment/`,
				'POST',
				JSON.stringify(newComment),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			)
				.then((res) => {
					// Assign id for comment
					newComment['_id'] = res._id;
					// Create new Activity
					sendRequest(
						`${process.env.REACT_APP_API_URL}/activity/create`,
						'POST',
						JSON.stringify({
							user: auth.loginInfo.name,
							blogId: props.blogId,
							type: 'comment',
							actionId: res._id,
							date: _date,
						}),
						{
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + auth.token,
						}
					);
				})
				.then(() => {
					setComments([...comments, newComment]);
					setFormData(
						{
							content: {
								value: 'New comment',
								isValid: false,
							},
						},
						false
					);
					setCmtAdded(true);
				});
		} catch (err) {
			console.log(err);
		}
	};

	const commentDeleteHandler = (id) => {
		console.log(id);
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/comment/${id}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			)
				.then(() => {
					sendRequest(
						`${process.env.REACT_APP_API_URL}/activity/comment/${id}`,
						'DELETE',
						null,
						{
							Authorization: 'Bearer ' + auth.token,
						}
					);
				})
				.then(() => {
					const cmts = comments.filter((item) => item._id !== id);
					setComments([...cmts]);
				});
		} catch (err) {
			console.log(err);
		}
	};

	const inputSubmitHandler = () => {
		setCmtAdded(false);
	};

	const activeCmt = useLocation().hash.slice(5);

	return (
		<div className="comment-list base-view">
			<div className="comment-list__header">
				<h2>Comments</h2>
			</div>
			{comments.length === 0 ? (
				<p className="comment-list__empty">Be the first one to comment</p>
			) : (
				<ul className="comment-list__content">
					{comments.map((item, index) => {
						return (
							<div key={index}>
								<CommentItem
									key={index}
									active={item._id === activeCmt}
									id={item._id}
									user={item.user}
									content={item.content}
									time={item.displayDate}
									delete={() => commentDeleteHandler(item._id)}
								/>
							</div>
						);
					})}
				</ul>
			)}
			{auth.isLoggedIn && (
				<form className="comment-list__new" onSubmit={commentAddHandler}>
					<Input
						element="textarea"
						id="content"
						label="Your Comment"
						onInput={inputHandler}
						onBlur={() => {}}
						onPaste={() => {}}
						validators={[VALIDATOR_REQUIRE()]}
						style={commmentInputStyle}
						submitted={cmtAdded}
						onSubmit={inputSubmitHandler}
					/>
					<div className="blog-form__submit">
						<Button type="submit" disabled={!formState.isValid}>
							POST COMMENT
						</Button>
					</div>
				</form>
			)}
		</div>
	);
};

export default CommentList;
