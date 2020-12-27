import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
// import { socket } from '../../App';

import {
	FaEye,
	FaHeart,
	FaPhone,
	FaEnvelope,
	FaTimes,
	FaCheck,
} from 'react-icons/fa';

import PlaceReport from '../windows/PlaceReport';
import PlaceStats from '../windows/PlaceStats';
import PlaceExtend from '../windows/PlaceExtend';
import PlaceMenu from '../components/PlaceMenu';
import CommentList from '../components/CommentList';
import Button from '../../shared/components/FormElements/Button';
import Avatar from '../../shared/components/UIElements/Avatar';
import Carousel from '../../shared/components/UIElements/Carousel';
import Modal from '../../shared/components/UIElements/Modal';
import StickyIcon from '../../shared/components/UIElements/StickyIcon';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlacePage.css';

const reportModal = {
	position: 'fixed',
	bottom: 'calc(var(--nav-height) * 0.8 + 15px)',
};

const extendModal = {
	height: 'auto',
};

const PlacePage = () => {
	const [place, setPlace] = useState({});
	const [comments, setComments] = useState([]);

	const [rented, setRented] = useState(true);
	const [showReport, setShowReport] = useState(false);
	const [showStats, setShowStats] = useState(false);
	const [showExtend, setShowExtend] = useState(false);

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

	const callHandler = () => {
		let dummyNumber = document.createElement('input');
		document.body.appendChild(dummyNumber);
		dummyNumber.setAttribute('value', place.phone);
		dummyNumber.select();
		document.execCommand('copy');
		document.body.removeChild(dummyNumber);
		alert('Phone number copied!');
	};

	const rentedHandler = () => {
		try {
			sendRequest(
				`${process.env.REACT_APP_API_URL}/place/rented/${placeId}`,
				'POST',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			).then(setRented(true));
		} catch (err) {
			console.log(err);
		}
	};

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
				setRented(placeData.rented);
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
					auth.loginInfo.name === place.user &&
					!place.status && (
						<StickyIcon
							src={`${process.env.REACT_APP_HOST_URL}/uploads/images/edit-place.png`}
							alt="edit place icon"
							to={`/place/${place._id}/edit`}
							text="Edit Place"
						/>
					)}
				{!isLoading && place && comments && (
					<>
						{auth.loginInfo.user_type === 'Renter' && (
							<Modal
								show={showReport}
								header="Report Place"
								onCancel={() => setShowReport(false)}
								contentClass="place-page__modal-content"
								footerClass="place-page__modal-actions"
							>
								<PlaceReport
									placeId={placeId}
									exit={() => setShowReport(false)}
								/>
							</Modal>
						)}
						{auth.loginInfo.user_type === 'Owner' &&
							auth.loginInfo.user_id === place.user_id && (
								<>
									<Modal
										style={reportModal}
										show={showStats}
										header="View Statistics"
										onCancel={() => setShowStats(false)}
										contentClass="place-page__modal-content"
										// footerClass="place-page__modal-actions"
									>
										<PlaceStats views={place.views} frame={place.timeFrame} />
									</Modal>
									<Modal
										style={extendModal}
										show={showExtend}
										header="Extend Availability"
										onCancel={() => setShowExtend(false)}
										contentClass="place-page__modal-content"
										footerClass="place-page__modal-actions"
									>
										<PlaceExtend
											placeId={place._id}
											exit={() => setShowExtend(false)}
										/>
									</Modal>
								</>
							)}
						{auth.loginInfo.user_type === 'Renter' && (
							<PlaceMenu place={place} report={() => setShowReport(true)} />
						)}
						<Carousel carouselItems={place.images} />
						<div className="place-page__content-section base-view">
							<div className="place-page__header">
								{auth.loginInfo.user_type === 'Owner' && (
									<>
										{place.status ? (
											<span
												style={{
													color: '#28a745',
													cursor: 'pointer',
												}}
												onClick={() => setShowExtend(true)}
											>
												<FaCheck />{' '}
												<em>
													<strong>Verified</strong>, available for{' '}
													<strong>{place.timeRemain} day(s)</strong> left
												</em>
											</span>
										) : (
											<span
												style={{
													color: '#dc3545',
												}}
											>
												<FaTimes /> <em>Not verified</em>
											</span>
										)}
										{rented ? (
											<>
												<br />
												<span
													style={{
														color: '#17a2b8',
													}}
												>
													<FaCheck />{' '}
													<em>
														<strong>Rented</strong>
													</em>
												</span>
											</>
										) : (
											<>
												<br />
												<br />
												<Button onClick={rentedHandler}>Mark as Rented</Button>
											</>
										)}
									</>
								)}
								<h2>{place.title}</h2>
								{/* <p>{place.address}</p> */}
								<p>
									{place.ward}, {place.district}, {place.city}
								</p>
								<span>
									<em>{place.roomType}</em>
								</span>
								<p>
									{auth.loginInfo.user_type === 'Owner' ? (
										<>
											<span
												style={{ color: '#2d6a64', cursor: 'pointer' }}
												onClick={() => setShowStats(true)}
											>
												<FaEye />{' '}
											</span>
											{place.views}
										</>
									) : (
										<>
											<span style={{ color: '#2d6a64' }}>
												<FaEye />{' '}
											</span>
											{place.views}
										</>
									)}
									<span style={{ color: '#dc3545' }}>
										<FaHeart />{' '}
									</span>
									{place.likes}
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
										{place.bath}
									</li>
									<li>
										<span>
											<strong>Kitchen: </strong>
										</span>
										{place.kitchen}
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
							{auth.loginInfo.user_type === 'Renter' && (
								<>
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
								</>
							)}
						</div>
						<CommentList disabled placeId={placeId} />
					</>
				)}
			</div>
		</>
	);
};

export default PlacePage;
