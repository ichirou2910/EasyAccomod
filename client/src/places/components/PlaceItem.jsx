import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';

import './PlaceItem.css';

const PlaceItem = (props) => {
	return (
		<li className="place-item">
			<Card className="place-item__card card--lighter">
				<div className="place-item__image">
					<Link to={`/place/${props.id}`}>
						<img
							src={`${process.env.REACT_APP_HOST_URL}/${props.cover}`}
							alt={props.title}
						/>
					</Link>
				</div>
				<div className="place-item__info">
					<h2>
						<Link to={`/place/${props.id}`}>{props.title}</Link>
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

export default PlaceItem;
