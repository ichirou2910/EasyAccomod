import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';

import './PlaceItem.css';

const PlaceItem = (props) => {
	return (
		<li className="place-item">
			<Card className="place-item__card card--lighter">
				<div className="place-item__image">
					<Link to={`/place/${props.place._id}`}>
						<img
							src={`${process.env.REACT_APP_HOST_URL}/${props.place.images[0]}`}
							alt={props.place.title}
						/>
					</Link>
				</div>
				<div className="place-item__info">
					<h2>
						<Link to={`/admin/place/${props.place._id}`}>
							{props.place.title}
						</Link>
					</h2>
					<p>
						{props.place.ward}, {props.place.district}, {props.place.city}
					</p>
					<p>
						{props.place.price}
						{props.place.priceType}/{props.place.period} - {props.place.area} m2
						- {props.place.roomNum} RMs
					</p>
					<em>{props.place.date}</em>
				</div>
			</Card>
		</li>
	);
};

export default PlaceItem;
