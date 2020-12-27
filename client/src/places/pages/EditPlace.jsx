import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, useParams } from 'react-router-dom';
import {
	VALIDATOR_MAXLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { socket } from '../../App';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlaceForm.css';

const EditPlace = () => {
	const [place, setPlace] = useState();
	const [edited, setEdited] = useState(false);

	const auth = useContext(AuthContext);

	const { isLoading, error, sendRequest } = useHttpClient();

	const placeId = useParams().placeId;

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			address: {
				value: '',
				isValid: false,
			},
			ward: {
				value: '',
				isValid: false,
			},
			district: {
				value: '',
				isValid: false,
			},
			city: {
				value: '',
				isValid: false,
			},
			nearby: {
				value: '',
				isValid: false,
			},
			roomType: {
				value: null,
				isValid: false,
			},
			roomNum: {
				value: null,
				isValid: false,
			},
			price: {
				value: null,
				isValid: false,
			},
			priceType: {
				value: null,
				isValid: false,
			},
			period: {
				value: null,
				isValid: false,
			},
			area: {
				value: null,
				isValid: false,
			},
			shared: {
				value: null,
				isValid: false,
			},
			bath: {
				value: null,
				isValid: true,
			},
			kitchen: {
				value: null,
				isValid: true,
			},
			ac: {
				value: null,
				isValid: true,
			},
			balcony: {
				value: null,
				isValid: true,
			},
			ew: {
				value: null,
				isValid: false,
			},
			extras: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	// useEffect(() => {
	//   setFormData(
	//     {
	//       title: {
	//         value: place ? place.title : "",
	//         isValid: true,
	//       },
	//       content: {
	//         value: place ? place.content : "",
	//         isValid: true,
	//       },
	//     },
	//     true
	//   );
	// }, [setFormData, place]);

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
	}, [sendRequest, placeId]);

	const submitHandler = (event) => {
		event.preventDefault();

		let now = new Date();
		let _date = now.toISOString();
		let _display = now.toLocaleString('en-us', {
			timeZone: 'Asia/Ho_Chi_Minh',
		});

		try {
			let empty = true; // Whether there is change in form value
			let newData = {};

			if (formState.inputs.title.value !== place.title) {
				newData['title'] = formState.inputs.title.value;
				empty = false;
			}
			if (formState.inputs.address.value !== place.address) {
				newData['address'] = formState.inputs.address.value;
				empty = false;
			}
			if (formState.inputs.ward.value !== place.ward) {
				newData['ward'] = formState.inputs.ward.value;
				empty = false;
			}
			if (formState.inputs.district.value !== place.district) {
				newData['district'] = formState.inputs.district.value;
				empty = false;
			}
			if (formState.inputs.city.value !== place.city) {
				newData['city'] = formState.inputs.city.value;
				empty = false;
			}
			if (formState.inputs.nearby.value !== place.nearby) {
				newData['nearby'] = formState.inputs.nearby.value;
				empty = false;
			}
			if (formState.inputs.roomNum.value !== place.title) {
				newData['roomNum'] = formState.inputs.title.value;
				empty = false;
			}
			if (formState.inputs.roomType.value !== place.roomType) {
				newData['roomType'] = formState.inputs.roomType.value;
				empty = false;
			}
			if (formState.inputs.price.value !== place.price) {
				newData['price'] = formState.inputs.price.value;
				empty = false;
			}
			if (formState.inputs.priceType.value !== place.title) {
				newData['priceType'] = formState.inputs.title.value;
				empty = false;
			}
			if (formState.inputs.period.value !== place.period) {
				newData['period'] = formState.inputs.period.value;
				empty = false;
			}
			if (formState.inputs.area.value !== place.area) {
				newData['area'] = formState.inputs.area.value;
				empty = false;
			}
			if (formState.inputs.shared.value !== place.shared) {
				newData['shared'] = formState.inputs.shared.value;
				empty = false;
			}
			if (formState.inputs.bath.value !== place.bath) {
				newData['bath'] = formState.inputs.bath.value;
				empty = false;
			}
			if (formState.inputs.kitchen.value !== place.kitchen) {
				newData['kitchen'] = formState.inputs.kitchen.value;
				empty = false;
			}
			if (formState.inputs.ac.value !== place.ac) {
				newData['ac'] = formState.inputs.ac.value;
				empty = false;
			}
			if (formState.inputs.balcony.value !== place.balcony) {
				newData['balcony'] = formState.inputs.balcony.value;
				empty = false;
			}
			if (formState.inputs.ew.value !== place.elec_water) {
				newData['elec_water'] = formState.inputs.ew.value;
				empty = false;
			}
			if (formState.inputs.extras.value !== place.extras) {
				newData['extras'] = formState.inputs.extras.value;
				empty = false;
			}

			if (!empty) {
				// Only send edit request if any field changed
				sendRequest(
					`${process.env.REACT_APP_API_URL}/place/${placeId}`,
					'POST',
					JSON.stringify(newData),
					{
						Authorization: 'Bearer ' + auth.token,
						'Content-Type': 'application/json',
					}
				).then(() => {
					const newNoti = {
						context_id: placeId,
						user_id: auth.loginInfo.user_id,
						description: 'Place Info edited. Verification request.',
						context: 'Place Verification',
					};
					socket.emit('notifyAdmin', newNoti);
					setEdited(true);
				});
			} else {
				setEdited(true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	if (!place) {
		return (
			<div style={{ marginTop: '4rem' }}>
				<h2>Place not found</h2>
			</div>
		);
	}

	if (edited) {
		return <Redirect to={`/place/${placeId}`} />;
	}

	return (
		<>
			{place && (
				<Helmet>
					<title>{`EasyAccomod - Edit Place`}</title>
				</Helmet>
			)}
			{isLoading && <LoadingSpinner asOverlay />}
			{!isLoading && place && (
				<form className="place-form base-view" onSubmit={submitHandler}>
					{error && <p>{error}</p>}
					<div className="place-form__group">
						<h3>General</h3>
						<hr />
						<Input
							id="title"
							element="input"
							type="text"
							label="Title"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.title}
							initialValid={true}
						/>
					</div>
					<div className="place-form__group">
						<h3>Room Info</h3>
						<hr />
						<Input
							id="address"
							element="input"
							type="text"
							label="Address"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.address}
							initialValid={true}
						/>
						<Input
							id="ward"
							element="input"
							type="text"
							label="Ward/Commune"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.ward}
							initialValid={true}
						/>
						<Input
							id="district"
							element="input"
							type="text"
							label="District/Urban"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.district}
							initialValid={true}
						/>
						<Input
							id="city"
							element="input"
							type="text"
							label="Province/City"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.city}
							initialValid={true}
						/>
						<Input
							id="nearby"
							element="input"
							type="text"
							label="Nearby Places"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.nearby}
							initialValid={true}
						/>
						<div className="place-form__pair">
							<Input
								id="roomNum"
								element="input"
								type="number"
								label="Number of Room"
								validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
								onInput={inputHandler}
								initialValue={place.roomNum}
								initialValid={true}
							/>
							<Input
								id="roomType"
								element="select"
								options={[
									{ opt: 'Lodging', label: 'Lodging' },
									{ opt: 'Mini Apartment', label: 'Mini Apartment' },
									{ opt: 'House', label: 'House' },
									{ opt: 'Apartment', label: 'Apartment' },
								]}
								validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
								onInput={inputHandler}
								initialValue={'Lodging'}
								initialValid={true}
							/>
						</div>
						<div className="place-form__pair">
							<Input
								id="price"
								element="input"
								type="number"
								label="Pricing (VND)"
								validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
								onInput={inputHandler}
								initialValid={true}
								initialValue={place.price}
							/>
							<Input
								id="priceType"
								element="select"
								options={[
									{ opt: 'K', label: '.000' },
									{ opt: 'M', label: '.000.000' },
									{ opt: 'B', label: '.000.000.000' },
								]}
								validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
								initialValue="K"
								initialValid={true}
								onInput={inputHandler}
							/>
						</div>
						<Input
							id="period"
							element="select"
							label="Pay Period"
							options={[
								{ opt: 'mo', label: 'Monthly' },
								{ opt: 'qt', label: 'Quarterly' },
								{ opt: 'yr', label: 'Yearly' },
							]}
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							initialValue="mo"
							initialValid={true}
							onInput={inputHandler}
						/>
						<Input
							id="area"
							element="input"
							type="number"
							label="Area (m2)"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.area}
							initialValid={true}
						/>
						<Input
							id="shared"
							element="select"
							label="Shared with"
							options={[
								{ opt: '0', label: 'None' },
								{ opt: '1', label: '1 other person' },
								{ opt: '2', label: '2 other people' },
								{ opt: '3', label: '3 other people' },
								{ opt: '-1', label: 'More than 3 other people' },
							]}
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							initialValue="0"
							initialValid={true}
							onInput={inputHandler}
						/>
					</div>
					<div className="place-form__group">
						<h3>Room Facilities</h3>
						<hr />
						<Input
							id="bath"
							element="select"
							label="Bathroom"
							validators={[]}
							onInput={inputHandler}
							options={[
								{ opt: 'Shared', label: 'Shared' },
								{ opt: 'Closed', label: 'Closed' },
							]}
							initialValue={'shared'}
							initialValid={true}
						/>
						<Input
							id="kitchen"
							element="select"
							label="Kitchen"
							validators={[]}
							onInput={inputHandler}
							options={[
								{ opt: 'Shared', label: 'Shared' },
								{ opt: 'Personal', label: 'Personal' },
								{ opt: 'No cooking', label: 'No cooking' },
							]}
							initialValue={'shared'}
							initialValid={true}
						/>
						<Input
							id="ac"
							element="checkbox"
							label="Air-conditioner"
							validators={[]}
							onInput={inputHandler}
							initialValue={0}
							initialValid={true}
						/>
						<Input
							id="balcony"
							element="checkbox"
							label="Balcony"
							validators={[]}
							onInput={inputHandler}
							initialValue={0}
							initialValid={true}
						/>
						<Input
							id="ew" // Elec + Water
							element="input"
							type="text"
							label="Elec/Water"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.elec_water}
							initialValid={true}
						/>
						<Input
							id="extras"
							element="textarea"
							label="Extras"
							validators={[VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
							initialValue={place.extras}
							initialValid={true}
						/>
					</div>
					<div className="place-form__submit">
						<Button type="submit" disabled={!formState.isValid}>
							EDIT
						</Button>
					</div>
				</form>
			)}
		</>
	);
};

export default EditPlace;
