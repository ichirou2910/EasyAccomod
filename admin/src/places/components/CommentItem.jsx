import React from 'react';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './CommentItem.css';
import { FaStar } from 'react-icons/fa';

const CommentItem = (props) => {
	return (
		<li className="comment-item">
			<Card className={`comment-item__card card--lighter`}>
				<Avatar
					small
					image={`${process.env.REACT_APP_HOST_URL}/uploads/images/default-avatar.png`}
				/>
				<div className="comment-item__info">
					<p className="comment-item__user">
						<strong>{props.cmt.username}</strong>
						<span className="comment-item__rating">
							{props.cmt.rating}
							<FaStar />
						</span>
					</p>
					{/* <span className="comment-item__rating">{props.cmt.rating}/5</span> */}
					<p className="comment-item__content">{props.cmt.content}</p>
				</div>
			</Card>
		</li>
	);
};

export default CommentItem;
