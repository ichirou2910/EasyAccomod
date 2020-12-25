import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import {
	VALIDATOR_MAXLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlaceForm.css';

const NewPlace = () => {
	const [edited, setEdited] = useState(false);
	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
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
			roomtype: {
				value: null,
				isValid: false,
			},
			roomnum: {
				value: null,
				isValid: false,
			},
			price: {
				value: null,
				isValid: false,
			},
			pricetype: {
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
			bathroom: {
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
			time: {
				value: null,
				isValid: false,
			},
			timetype: {
				value: null,
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	const submitHandler = async (event) => {
		event.preventDefault();

		console.log(formState.inputs);

		// Create new Blog
		try {
			const formData = new FormData();
			formData.append('user_id', auth.loginInfo.user_id);
			formData.append('title', formState.inputs.title.value);
			formData.append('time', formState.inputs.time.value);
			formData.append('timeType', formState.inputs.timetype.value);
			formData.append('address', formState.inputs.address.value);
			formData.append('ward', formState.inputs.ward.value);
			formData.append('district', formState.inputs.district.value);
			formData.append('city', formState.inputs.city.value);
			formData.append('nearby', formState.inputs.nearby.value);
			formData.append('roomType', formState.inputs.roomtype.value);
			formData.append('roomNum', formState.inputs.roomnum.value);
			formData.append('price', formState.inputs.price.value);
			formData.append('priceType', formState.inputs.pricetype.value);
			formData.append('period', formState.inputs.period.value);
			formData.append('area', formState.inputs.area.value);
			formData.append('shared', formState.inputs.shared.value);
			formData.append('bath', formState.inputs.bathroom.value);
			formData.append('kitchen', formState.inputs.kitchen.value);
			formData.append('ac', formState.inputs.ac.value);
			formData.append('balcony', formState.inputs.balcony.value);
			formData.append('elec_water', formState.inputs.ew.value);
			formData.append('extras', formState.inputs.extras.value);
			formData.append('owner', auth.loginInfo.realname);
			formData.append('avatar', auth.loginInfo.avatar);
			formData.append('phone', auth.loginInfo.phone);
			formData.append('email', auth.loginInfo.email);
			formData.append('image', formState.inputs.image.value);

			sendRequest(
				`${process.env.REACT_APP_API_URL}/place/create`,
				'POST',
				formData,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			).then(() => setEdited(true));
		} catch (err) {
			console.log(err);
		}
	};

	if (edited) {
		return <Redirect to={`/`} />;
	}

	return (
		<>
			<Helmet>
				<title>{'EasyAccomod - New Place'}</title>
			</Helmet>
			<form className="place-form base-view" onSubmit={submitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
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
					/>
					<div className="place-form__pair">
						<Input
							id="time"
							element="input"
							type="number"
							label="Available Time"
							validators={[VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
						/>
						<Input
							id="timetype"
							element="select"
							options={[
								{ opt: 'week', label: 'Week(s)' },
								{ opt: 'month', label: 'Month(s)' },
								{ opt: 'quarter', label: 'Quarter(s)' },
								{ opt: 'year', label: 'Year(s)' },
							]}
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							initialValue="week"
							initialValid={true}
							onInput={inputHandler}
						/>
					</div>
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
					/>
					<Input
						id="ward"
						element="input"
						type="text"
						label="Ward/Commune"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<Input
						id="district"
						element="input"
						type="text"
						label="District/Urban"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<Input
						id="city"
						element="input"
						type="text"
						label="Province/City"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<Input
						id="nearby"
						element="input"
						type="text"
						label="Nearby Places"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<div className="place-form__pair">
						<Input
							id="roomnum"
							element="input"
							type="number"
							label="Number of Room"
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
						/>
						<Input
							id="roomtype"
							element="select"
							options={[
								{ opt: 'Lodging', label: 'Lodging' },
								{ opt: 'Mini Apartment', label: 'Mini Apartment' },
								{ opt: 'House', label: 'House' },
								{ opt: 'Apartment', label: 'Apartment' },
							]}
							validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
							onInput={inputHandler}
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
						/>
						<Input
							id="pricetype"
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
						id="bathroom"
						element="checkbox"
						label="Bathroom"
						validators={[]}
						onInput={inputHandler}
						initialValue={0}
						initialValid={true}
					/>
					<Input
						id="kitchen"
						element="checkbox"
						label="Kitchen"
						validators={[]}
						onInput={inputHandler}
						initialValue={0}
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
					/>
					<Input
						id="extras"
						element="textarea"
						label="Extras"
						validators={[VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
				</div>
				<ImageUpload
					id="image"
					description="CHOOSE COVER"
					onInput={inputHandler}
				/>
				<div className="place-form__submit">
					<Button type="submit" disabled={!formState.isValid}>
						CREATE
					</Button>
				</div>
			</form>
		</>
	);
};

export default NewPlace;
