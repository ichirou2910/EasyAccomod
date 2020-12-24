import React, { useState, useEffect } from 'react';

import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './PlaceList.css';

const itemsPerPage = 5;

const PlaceList = (props) => {
	const [places, setPlaces] = useState([]);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (props.places) {
			setPlaces(
				props.places.slice(
					page * itemsPerPage,
					Math.min(props.places.length, page * itemsPerPage + itemsPerPage)
				)
			);
		}
	}, [props.places, page]);

	const pageInc = () => {
		if (page < props.places.length / itemsPerPage - 1)
			setPage((page) => page + 1);
	};

	const pageDec = () => {
		if (page > 0) setPage((page) => page - 1);
	};

	return (
		<div className="place-list">
			{!props.places || props.places.length === 0 ? (
				<p className="place-list__empty">No place written yet</p>
			) : (
				<>
					<div className="place-list__navi">
						<Button onClick={pageDec}>
							<FaChevronLeft />
						</Button>
						<p>
							Page {page + 1}/{Math.ceil(props.places.length / 10)}
						</p>
						<Button onClick={pageInc}>
							<FaChevronRight />
						</Button>
					</div>
					<ul className="place-list__content">
						{places.map((place, index) => (
							<PlaceItem key={index} place={place} />
						))}
					</ul>
				</>
			)}
		</div>
	);
};

export default PlaceList;
