import React, { useState, useEffect, cloneElement } from 'react';

import './Carousel.css';

const Carousel = (props) => {
	const [active, setActive] = useState(0);
	let scrollInterval = null;

	useEffect(() => {
		scrollInterval = setTimeout(() => {
			const { carouselItems } = props;
			setActive((active + 1) % carouselItems.length);
		}, 2000);
	}, [scrollInterval]);

	const { carouselItems, ...rest } = props;
	return (
		<div className="carousel">
			{carouselItems.map((item, index) => {
				const activeStyle = active === index ? 'carousel__item--active' : '';
				return cloneElement(item, {
					...rest,
					className: 'carousel__item' + activeStyle,
				});
			})}
		</div>
	);
};

export default Carousel;
