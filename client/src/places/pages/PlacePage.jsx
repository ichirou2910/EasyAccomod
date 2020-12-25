import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
// import { socket } from '../../App';

import { FaEye, FaHeart, FaPhone, FaEnvelope } from 'react-icons/fa';

import PlaceMenu from '../components/PlaceMenu';
import PlaceReport from '../components/PlaceReport';
import Button from '../../shared/components/FormElements/Button';
import Avatar from '../../shared/components/UIElements/Avatar';
import Carousel from '../../shared/components/UIElements/Carousel';
import Modal from '../../shared/components/UIElements/Modal';
import StickyIcon from '../../shared/components/UIElements/StickyIcon';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlacePage.css';

// const samplePlace = {
// 	title: 'Room for rent at Thinh Quang Ward, near Mipec Tower',
// 	owner: 'Ichirou Keita',
// 	avatar:
// 		'https://blog.ichiroukeita.tk/uploads/images/51f373d2-8546-48d0-8227-1b77036d5f82.png',
// 	phone: '0123456789',
// 	email: 'ichiroukeita@acco.com',
// 	address: 'Thinh Quang Ward, Dong Da District',
// 	nearby: 'BIDV bank, a lot of cafes, markets',
// 	roomtype: 'Mini Apartment',
// 	roomnum: 2,
// 	price: '100',
// 	pricetype: 'K',
// 	period: 'mo',
// 	area: 40,
// 	shared: 1,
// 	bathroom: 'Working',
// 	kitchen: 'Working',
// 	ac: 'Working',
// 	balcony: 'Yes but kinda small',
// 	ew: 'Elec: 1.900 VND/kWh, Water: 10.000 VND/m3',
// 	extras: 'Free GF <(")',
// 	images: [
// 		'https://home.aloyeal.com/wp-content/uploads/2019/06/ph%C3%B2ng-tr%E1%BB%8D-m%C6%A1-%C6%B0%E1%BB%9Bc-1170x0-c-center.jpg',
// 		'https://news.landber.com/uploads/images/tim-thue-nha-tro-duoi-1-trieu-tai-ha-noi-danh-cho-sinh-vien-1.jpg',
// 		'https://news.mogi.vn/wp-content/uploads/2019/10/cho-thue-phong-tro-ha-noi-anh-bia.jpg',
// 	],
// 	favorited: false,
// };

const PlacePage = () => {
	const [place, setPlace] = useState({});
	const [showReport, setShowReport] = useState(false);

	const [favorited, setFavorited] = useState(place.favorited);
	const [favorites, setFavorites] = useState(0);
	const [views, setViews] = useState(0);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);
	const placeId = useParams().placeId;

	// useEffect(() => {
	// 	socket.emit('init_data');
	// 	socket.on('get_data', (data) => {
	// 		setViews(data.views);
	// 		setFavorites(data.likes);
	// 	});
	// 	socket.on('change_data', () => {
	// 		socket.emit('init_data');
	// 	});
	// 	socket.emit('inc_view');

	// 	return () => {
	// 		socket.off('get_data');
	// 		socket.off('change_data');
	// 	};
	// }, []);

	const incFavorites = () => {
		// socket.emit('inc_like');
		setFavorited(!favorited);
	};

	const decFavorites = () => {
		// socket.emit('dec_like');
		setFavorited(!favorited);
	};

	const callHandler = () => {
		let dummyNumber = document.createElement('input');
		document.body.appendChild(dummyNumber);
		dummyNumber.setAttribute('value', place.phone);
		dummyNumber.select();
		document.execCommand('copy');
		document.body.removeChild(dummyNumber);
		alert('Phone number copied!');
	};

	const openReportHandler = () => setShowReport(true);

	const closeReportHandler = () => setShowReport(false);

	const sendReportHandler = () => {};

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const placeData = await sendRequest(
					`${process.env.REACT_APP_API_URL}/place/${placeId}`,
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setPlace(placeData);
			} catch (err) {
				console.log(err);
			}
		};
		fetchInfo();
	}, [sendRequest, auth, placeId]);

	return (
		<>
			{place && (
				<Helmet>
					<title>{`EasyAccomod - ${place.title}`}</title>
				</Helmet>
			)}
			<div className="place-page">
				{isLoading && <LoadingSpinner asOverlay />}
				{error && <p>{error}</p>}
				{!isLoading &&
					auth.isLoggedIn &&
					place &&
					auth.loginInfo.name === place.user && (
						<StickyIcon
							src={`${process.env.REACT_APP_HOST_URL}/uploads/images/edit-place.png`}
							alt="edit place icon"
							to={`/place/${place._id}/edit`}
							text="Edit Place"
						/>
					)}
				{!isLoading && place && (
					<>
						<Modal
							show={showReport}
							onCancel={closeReportHandler}
							contentClass="place-page__modal-content"
							footerClass="place-page__modal-actions"
						>
							<PlaceReport placeId={place._id} />
						</Modal>
						<PlaceMenu
							favorited={favorited}
							incFav={incFavorites}
							decFav={decFavorites}
							report={openReportHandler}
						/>
						{/* <Carousel carouselItems={place.images} /> */}
						<div className="place-page__content-section base-view">
							<div className="place-page__header">
								<h2>{place.title}</h2>
								{/* <p>{place.address}</p> */}
								<p>
									{place.ward}, {place.district}, {place.city}
								</p>
								<span>
									<em>{place.roomType}</em>
								</span>
								<p>
									<span style={{ color: '#2d6a64' }}>
										<FaEye />{' '}
									</span>
									{views}
									<span style={{ color: '#dc3545' }}>
										<FaHeart />{' '}
									</span>
									{favorites}
								</p>
							</div>
							<hr />
							<div className="place-page__stats">
								<div className="place-page--multi-line">
									<p>Price</p>
									<p>
										<strong>
											{`${place.price}${place.priceType}/${place.period}`}
										</strong>
									</p>
								</div>
								<div className="place-page--multi-line">
									<p>Area</p>
									<p>
										<strong>{`${place.area} m2`}</strong>
									</p>
								</div>
								<div className="place-page--multi-line">
									<p>Rooms</p>
									<p>
										<strong>{place.roomNum}</strong>
									</p>
								</div>
								<div className="place-page--multi-line">
									<p>Share</p>
									<p>
										<strong>
											{place.shared === 0
												? 'None'
												: place.shared === -1
												? '>3 ppl'
												: `${place.shared} ppl`}
										</strong>
									</p>
								</div>
							</div>
							<hr />
							<div className="place-page__basic-info">
								<h2>
									<strong>Room Info</strong>
								</h2>
								<ul>
									<li>
										<span>
											<strong>Address: </strong>
											{place.address}
										</span>
									</li>
									<li>
										<span>
											<strong>Near: </strong>
										</span>
										{place.nearby}
									</li>
								</ul>
							</div>
							<hr />
							<div className="place-page__facilities">
								<h2>
									<strong>Room Facilities</strong>
								</h2>
								<ul>
									<li>
										<span>
											<strong>Bathroom: </strong>
										</span>
										{place.bath ? 'Yes' : 'No'}
									</li>
									<li>
										<span>
											<strong>Kitchen: </strong>
										</span>
										{place.kitchen ? 'Yes' : 'No'}
									</li>
									<li>
										<span>
											<strong>Air-conditioner: </strong>
										</span>
										{place.ac ? 'Yes' : 'No'}
									</li>
									<li>
										<span>
											<strong>Balcony: </strong>
										</span>
										{place.balcony ? 'Yes' : 'No'}
									</li>
								</ul>
								{place.extras && <p>{place.extras}</p>}
							</div>
							<hr />
							<div className="place-page__other">
								<h2>
									<strong>Other Infos</strong>
								</h2>
								<ul>
									<li>
										<span>
											<strong>Elec/Water: </strong>
										</span>
										{place.elec_water}
									</li>
								</ul>
							</div>
							<hr />
							<h2>
								<strong>Contact</strong>
							</h2>
							<div className="place-page__contact">
								<Avatar
									medium
									image={`${process.env.REACT_APP_HOST_URL}/${place.avatar}`}
									alt={`${place.owner}'s avatar`}
								/>
								<div className="place-page__info">
									<p>{place.owner}</p>
									<div>
										<Button
											onClick={callHandler}
											style={{
												backgroundColor: '#28a745',
												borderColor: '#28a745',
											}}
										>
											<FaPhone />
										</Button>
										<Button
											newtab
											href={`mailto:${place.email}?subject=${place.title}`}
											style={{
												backgroundColor: '#dc3545',
												borderColor: '#dc3545',
											}}
										>
											<FaEnvelope />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default PlacePage;
