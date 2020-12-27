import React from "react";
import { Link } from "react-router-dom";

import "./StickyIcon.css";

const StickyIcon = (props) => {
	return (
		<div className="sticky-icon">
			<img src={props.src} alt={props.alt} />{" "}
			<Link to={props.to}>
				<p>{props.text}</p>
			</Link>
		</div>
	);
};

export default StickyIcon;
