import React from 'react';
// import { Link } from 'react-router-dom';
import { ReactComponent as ShareIcon } from '../../icons/share.svg';
import { ReactComponent as ReportIcon } from '../../icons/report.svg';
import { ReactComponent as HeartIcon } from '../../icons/heart.svg';
import { ReactComponent as HeartFullIcon } from '../../icons/heartfull.svg';

import './PlaceMenu.css';

const PlaceMenu = () => {
	return (
		// <Link to="/place/create">
		<div className="place-menu">
			<ul>
				<li className="place-menu__item">
					<a href="#" className="place-menu__icon" onClick={() => {}}>
						<ShareIcon />
					</a>
				</li>
				<li className="place-menu__item">
					<a href="#" className="place-menu__icon" onClick={() => {}}>
						<ReportIcon />
					</a>
				</li>
				<li className="place-menu__item">
					<a href="#" className="place-menu__icon" onClick={() => {}}>
						<HeartIcon />
					</a>
				</li>
				{/* <li className="place-menu__item">
					{props.to ? (
						<a href={props.to} className="navbar__icon-btn">
							{props.icon}
						</a>
					) : (
						<>
							<a
								href="#"
								className="navbar__icon-btn"
								onClick={() => setOpen(!open)}
							>
								{props.icon}
							</a>
							{open && props.children}
						</>
					)}
				</li> */}
			</ul>
		</div>
		// </Link>
	);
};

export default PlaceMenu;
