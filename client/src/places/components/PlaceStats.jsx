import React from 'react';

import './PlaceStats.css';

const PlaceStats = ({ views, frame }) => {
	let perc = [];

	let i;
	for (i = 0; i < frame.length; i++) {
		perc = [...perc, frame[i] / views];
	}

	console.log(perc);

	return (
		<div className="place-stats">
			<h2>View Statistics</h2>
			<hr />
			<div className="place-stats__list">
				<ul>
					{perc.map((item, index) => {
						return (
							<li
								key={index}
								style={{
									background: `linear-gradient(90deg, var(--dark-primary-color) ${
										item * 100
									}%, #00FFFF00 ${1 - item * 100}%)`,
								}}
							>
								{`${index}h - ${index + 3}h`}
								<span> </span>
							</li>
						);
					})}
				</ul>
			</div>
			<hr />
		</div>
	);
};

export default PlaceStats;
