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
					`${process.env.REACT_APP_API_URL}/favorite/${auth.loginInfo.user_id}?place_id=${props.place._id}`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				if (info.length) {
					setFavorited(true);
				}
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, props.place, auth]);

	const favHandler = () => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/place/like/${props.place._id}`,
				'POST',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			).then(() => {
				sendRequest(
					`${process.env.REACT_APP_API_URL}/favorite/create`,
					'POST',
					JSON.stringify({
						user_id: auth.loginInfo.user_id,
						place_id: props.place._id,
						title: props.place.title,
						ward: props.place.ward,
						district: props.place.district,
						city: props.place.city,
						price: props.place.price,
						priceType: props.place.priceType,
						area: props.place.area,
						roomNum: props.place.roomNum,
						images: props.place.images,
					}),
					{
						Authorization: 'Bearer ' + auth.token,
						'Content-Type': 'application/json',
					}
				).then(() => setFavorited(true));
			});
		} catch (err) {
			console.log(err);
		}
	};

	const unfavHandler = () => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/place/unlike/${props.place._id}`,
				'POST',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			).then(() => {
				sendRequest(
					`${process.env.REACT_APP_API_URL}/favorite/${props.place._id}`,
					'DELETE',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				).then(() => setFavorited(false));
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="place-menu">
			<ul>
				<li className="place-menu__item">
					<a className="place-menu__icon" onClick={props.report}>
						<ReportIcon />
					</a>
				</li>
				<li className="place-menu__item">
					{favorited ? (
						<a className="place-menu__icon" onClick={unfavHandler}>
							<HeartFullIcon />
						</a>
					) : (
						<a className="place-menu__icon" onClick={favHandler}>
							<HeartIcon />
						</a>
					)}
				</li>
			</ul>
		</div>
	);
};

export default PlaceMenu;
