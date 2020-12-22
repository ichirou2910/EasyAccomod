import React from 'react';

import './Cover.css';

const Cover = (props) => {
	return (
		<div
			className={`cover ${props.center ? 'cover--center' : ''} ${
				props.bottom ? 'cover--bottom' : ''
			}`}
		>
			{props.banner && (
				<div className="banner-wrapper">
					<img src={props.image} alt={props.alt} />
				</div>
			)}
			{!props.banner && (
				<div className="cover-wrapper">
					<img src={props.image} alt={props.alt} />
				</div>
			)}
		</div>
	);
};

export default Cover;
