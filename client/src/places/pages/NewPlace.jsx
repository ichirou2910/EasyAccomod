import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import {
	VALIDATOR_MAXLENGTH,
	VALIDATOR_MINLENGTH,
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
			nearby: {
				value: '',
				isValid: false,
			},
			roomtype: {
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
				isValid: false,
			},
			kitchen: {
				value: null,
				isValid: false,
			},
			ac: {
				value: null,
				isValid: false,
			},
			balcony: {
				value: null,
				isValid: false,
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
			cover: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	const submitHandler = async (event) => {
		event.preventDefault();

		console.log(formState.inputs);

		// let now = new Date();
		// let _date = now.toISOString();
		// let _display = now.toLocaleString('en-us', {
		// 	timeZone: 'Asia/Ho_Chi_Minh',
		// });

		// // Create new Blog
		// try {
		// 	const formData = new FormData();
		// 	formData.append('user', auth.loginInfo.name);
		// 	formData.append('title', formState.inputs.title.value);
		// 	formData.append('content', formState.inputs.content.value);
		// 	formData.append('cover', formState.inputs.cover.value);
		// 	formData.append('date', _date);
		// 	formData.append('displayDate', _display);

		// 	sendRequest(
		// 		`${process.env.REACT_APP_API_URL}/blog/create`,
		// 		'POST',
		// 		formData,
		// 		{
		// 			Authorization: 'Bearer ' + auth.token,
		// 		}
		// 	)
		// 		.then((res) => {
		// 			return sendRequest(
		// 				`${process.env.REACT_APP_API_URL}/activity/create`,
		// 				'POST',
		// 				JSON.stringify({
		// 					user: auth.loginInfo.name,
		// 					blogId: res._id,
		// 					type: 'post',
		// 					date: _date,
		// 				}),
		// 				{
		// 					'Content-Type': 'application/json',
		// 					Authorization: 'Bearer ' + auth.token,
		// 				}
		// 			);
		// 		})
		// 		.then(() => setEdited(true));
		// } catch (err) {
		// 	console.log(err);
		// }
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
						id="nearby"
						element="input"
						type="text"
						label="Nearby Places"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<Input
						id="roomtype"
						element="input"
						type="text"
						label="Room Type"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
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
							initialValue="month"
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
						initialValue="month"
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
						element="input"
						type="text"
						label="Bathroom"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<Input
						id="kitchen"
						element="input"
						type="text"
						label="Kitchen"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<Input
						id="ac"
						element="input"
						type="text"
						label="Air-conditioner"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
					/>
					<Input
						id="balcony"
						element="input"
						type="text"
						label="Balcony"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(64)]}
						onInput={inputHandler}
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
					id="cover"
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