import React, { useState, useEffect, useContext, createRef } from 'react';
import { Link } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './CommentItem.css';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

const CommentItem = (props) => {
	const [avatar, setAvatar] = useState();

	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest } = useHttpClient();

	const activeCmt = createRef(null);
	const active = props.active;

	useEffect(() => {
		if (active && activeCmt.current) {
			scrollToRef(activeCmt);
		}
	}, [active, activeCmt]);

	useEffect(() => {
		const fetchAvt = async () => {
			try {
				const avt = await sendRequest(
					`${process.env.REACT_APP_API_URL}/user/avatar/${props.user}`
				);
				setAvatar(avt);
			} catch (err) {
				console.log(err);
			}
		};
		fetchAvt();
	}, [sendRequest, props.user]);

	return (
		<li className="comment-item" ref={activeCmt}>
			{error && <p>{error}</p>}
			{!isLoading && avatar && (
				<Card className={`comment-item__card card--lighter`}>
					{props.active && <div className="comment-item__active"></div>}
					<Link to={`/user/${props.user}`}>
						<Avatar
							small
							image={`${process.env.REACT_APP_HOST_URL}/${avatar}`}
							alt={`${props.user}'s avatar`}
						/>
					</Link>
					<div className="comment-item__info">
						<p className="comment-item__user">
							<strong>{props.user}</strong>
						</p>
						<p className="comment-item__content">{props.content}</p>
						<p className="comment-item__time">
							<em>{props.time}</em>
						</p>
					</div>
					{auth.isLoggedIn && auth.loginInfo.name === props.user && (
						<>
							<div className="comment-item__delete hidden">
								<button onClick={props.delete}>
									<FaTrash />
								</button>
							</div>
							<div className="comment-item__edit hidden">
								<button>
									<FaEdit />
								</button>
							</div>
						</>
					)}
				</Card>
			)}
		</li>
	);
};

export default CommentItem;
