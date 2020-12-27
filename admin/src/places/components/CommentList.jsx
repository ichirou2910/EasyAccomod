import React, { useState, useContext, useEffect } from 'react';
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
	const { isLoading, sendRequest } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			content: {
				value: '',
				isValid: false,
			},
			rating: {
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
			username: auth.loginInfo.realname,
			content: formState.inputs.content.value,
			rating: formState.inputs.rating.value,
			date: _date,
			displayDate: _display,
		};

		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/comment/${props.placeId}`,
				'POST',
				JSON.stringify(newComment),
				{
					Authorization: 'Bearer ' + auth.token,
					'Content-Type': 'application/json',
				}
			).then(() => {
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

	const inputSubmitHandler = () => {
		setCmtAdded(false);
	};

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const cmtData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/comment/${props.placeId}`
				);
				setComments(cmtData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, props.placeId]);

	return (
		<div className="comment-list base-view">
			<div className="comment-list__header">
				<h2>Comments</h2>
			</div>
			{!isLoading && comments && (
				<>
					{comments.length === 0 ? (
						<p className="comment-list__empty">Be the first one to comment</p>
					) : (
						<ul className="comment-list__content">
							{comments.map((item, index) => {
								return (
									<div key={index}>
										<CommentItem key={index} cmt={item} />
									</div>
								);
							})}
						</ul>
					)}
				</>
			)}
			{auth.isLoggedIn && auth.loginInfo.user_type === 'Renter' && (
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
					<Input
						element="select"
						id="rating"
						label="Rating"
						options={[
							{ opt: '1', label: '1' },
							{ opt: '2', label: '2' },
							{ opt: '3', label: '3' },
							{ opt: '4', label: '4' },
							{ opt: '5', label: '5' },
						]}
						validators={[VALIDATOR_REQUIRE()]}
						initialValue="1"
						initialValid={true}
						onInput={inputHandler}
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
