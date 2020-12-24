import React, { useEffect, useState } from 'react';

import { ReactComponent as ShareIcon } from '../../icons/share.svg';
import { ReactComponent as ReportIcon } from '../../icons/report.svg';
import { ReactComponent as HeartIcon } from '../../icons/heart.svg';
import { ReactComponent as HeartFullIcon } from '../../icons/heartfull.svg';

import './PlaceMenu.css';

const PlaceMenu = (props) => {
	const [favorited, setFavorited] = useState(props.favorited);

	useEffect(() => {
		setFavorited(props.favorited);
	}, [props.favorited]);

	return (
		<div className="place-menu">
			<ul>
				<li className="place-menu__item">
					<a className="place-menu__icon" onClick={() => {}}>
						<ShareIcon />
					</a>
				</li>
				<li className="place-menu__item">
					<a className="place-menu__icon" onClick={props.report}>
						<ReportIcon />
					</a>
				</li>
				<li className="place-menu__item">
					<a
						className="place-menu__icon"
						onClick={favorited ? props.decFav : props.incFav}
					>
						{props.favorited ? <HeartFullIcon /> : <HeartIcon />}
					</a>
				</li>
			</ul>
		</div>
	);
};

export default PlaceMenu;
