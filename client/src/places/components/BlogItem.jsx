import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';

import './BlogItem.css';

const BlogItem = (props) => {
	return (
		<li className="blog-item">
			<Card className="blog-item__card card--lighter">
				<div className="blog-item__image">
					<Link to={`/blog/${props.id}`}>
						<img
							src={`${process.env.REACT_APP_HOST_URL}/${props.cover}`}
							alt={props.title}
						/>
					</Link>
				</div>
				<div className="blog-item__info">
					<h2>
						<Link to={`/blog/${props.id}`}>{props.title}</Link>
					</h2>
					<p>
						<Link to={`/user/${props.user}`}>
							<em>{props.user}</em>
						</Link>
					</p>
					<p>{props.date}</p>
				</div>
			</Card>
		</li>
	);
};

export default BlogItem;
