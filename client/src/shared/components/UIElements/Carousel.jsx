import React, { useState, useEffect, cloneElement } from 'react';

import './Carousel.css';

const Carousel = ({ carouselItems }) => {
	const [active, setActive] = useState(0);
	const length = carouselItems ? carouselItems.length : 0;

	useEffect(() => {
		setTimeout(() => {
			setActive((active + 1) % length);
		}, 5000);
	}, [active, length]);

	return (
		<div className="carousel">
			{length &&
				carouselItems.map((item, index) => {
					return (
						<div
							key={index}
							className={`carousel__item ${
								active === index ? 'carousel__item--active' : ''
							}`}
						>
							<a
								style={{
									backgroundImage: `url(${process.env.REACT_APP_HOST_URL}/${item})`,
								}}
							></a>
							<div className="carousel__item--overlay">
								<img
									src={`${process.env.REACT_APP_HOST_URL}/${item}`}
									alt={`Item ${index + 1}`}
								/>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default Carousel;
