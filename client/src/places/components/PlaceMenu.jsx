import React, { useContext, useEffect, useState } from 'react';

import { ReactComponent as ShareIcon } from '../../icons/share.svg';
import { ReactComponent as ReportIcon } from '../../icons/report.svg';
import { ReactComponent as HeartIcon } from '../../icons/heart.svg';
import { ReactComponent as HeartFullIcon } from '../../icons/heartfull.svg';

import './PlaceMenu.css';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

const PlaceMenu = (props) => {
	const [favorited, setFavorited] = useState(props.favorited);

	const { sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const info = await sendRequest(
					`${process.env.REACT_APP_API_URL}/favorite/${auth.loginInfo.user_id}?place_id=${props.placeId}`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				// if (inf)
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [props.favorited]);

	const favHandler = () => {
		try {
			// const formData = new FormData();
			// formData.append('user_id', auth.loginInfo.user_id);
			// formData.append('place_id', props.placeId);

			// for (let key of formData.entries()) {
			// 	console.log(key[0] + ', ' + key[1]);
			// }

			sendRequest(
				`${process.env.REACT_APP_API_URL}/favorite/create`,
				'POST',
				JSON.stringify({
					user_id: auth.loginInfo.user_id,
					place_id: props.placeId,
				}),
				{
					Authorization: 'Bearer ' + auth.token,
					'Content-Type': 'application/json',
				}
			).then(() => console.log('Report sent'));
		} catch (err) {
			console.log(err);
		}
	};

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
					<a className="place-menu__icon" onClick={favHandler}>
						{props.favorited ? <HeartFullIcon /> : <HeartIcon />}
					</a>
				</li>
			</ul>
		</div>
	);
};

export default PlaceMenu;
