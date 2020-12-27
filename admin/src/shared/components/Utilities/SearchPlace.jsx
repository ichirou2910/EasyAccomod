import React, { useState, useEffect, useContext } from 'react';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';

import PlaceList from '../../../places/components/PlaceList';
import Input from '../FormElements/Input';
import Button from '../FormElements/Button';

import './SearchPlace.css';

const SearchPlace = () => {
	const [placeList, setPlaceList] = useState([]);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
		{
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
			roomnum: {
				value: null,
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
		},
		false
	);
	const submitHandler = (e) => {
		e.preventDefault();
		console.log(formState.inputs);
	};

	useEffect(() => {
		const fetchInfo = async () => {
			if (auth.loginInfo.user_type === 'Renter') {
				try {
					const placeData = await sendRequest(
						`${process.env.REACT_APP_API_URL}/favorite/${auth.loginInfo.user_id}`,
						'GET',
						null,
						{
							Authorization: 'Bearer ' + auth.token,
						}
					);
					setPlaceList(placeData);
				} catch (err) {
					console.log(err);
				}
			} else if (auth.loginInfo.user_type === 'Owner') {
				try {
					const placeData = await sendRequest(
						`${process.env.REACT_APP_API_URL}/place/user/${auth.loginInfo.user_id}`,
						'GET',
						null,
						{
							Authorization: 'Bearer ' + auth.token,
						}
					);
					setPlaceList(placeData);
				} catch (err) {
					console.log(err);
				}
			}
		};
		fetchInfo();
	}, [sendRequest, auth]);

	return (
		<>
			<div className="search">
				<div className="search__filter">
					<form onSubmit={submitHandler}>
						<div className="place-form__group">
							<h3>Room Info</h3>
							<hr />
							<Input
								id="ward"
								element="input"
								type="text"
								label="Ward/Commune"
								validators={[]}
								onInput={inputHandler}
							/>
							<Input
								id="district"
								element="input"
								type="text"
								label="District/Urban"
								validators={[]}
								onInput={inputHandler}
							/>
							<Input
								id="city"
								element="input"
								type="text"
								label="Province/City"
								validators={[]}
								onInput={inputHandler}
							/>
							<div className="place-form__pair">
								<Input
									id="roomnum"
									element="input"
									type="number"
									label="Number of Room"
									validators={[]}
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
									validators={[]}
									onInput={inputHandler}
								/>
							</div>
							<div className="place-form__pair">
								<Input
									id="price"
									element="input"
									type="number"
									label="Pricing (VND)"
									validators={[]}
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
									validators={[]}
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
								validators={[]}
								initialValue="month"
								initialValid={true}
								onInput={inputHandler}
							/>
							<Input
								id="area"
								element="input"
								type="number"
								label="Area (m2)"
								validators={[]}
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
								validators={[]}
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
						</div>
					</form>
				</div>
				<div className="search__result">
					<PlaceList places={placeList} />
				</div>
			</div>
		</>
	);
};

export default SearchPlace;
