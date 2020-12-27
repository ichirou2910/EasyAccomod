import React, { useState, useEffect, useContext } from 'react';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';

import PlaceList from '../../places/components/PlaceList';
import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';

import './SearchPage.css';
import { FaFilter } from 'react-icons/fa';

const SearchPage = (props) => {
	const [placeList, setPlaceList] = useState([]);
	const [filterOpen, setFilterOpen] = useState(true);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
		{
			ward: {
				value: null,
				isValid: true,
			},
			district: {
				value: null,
				isValid: true,
			},
			city: {
				value: null,
				isValid: true,
			},
			roomNum: {
				value: null,
				isValid: true,
			},
			roomType: {
				value: null,
				isValid: true,
			},
			price: {
				value: null,
				isValid: true,
			},
			pricetype: {
				value: null,
				isValid: true,
			},
			period: {
				value: null,
				isValid: true,
			},
			area: {
				value: null,
				isValid: true,
			},
			shared: {
				value: null,
				isValid: true,
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
		true
	);

	const submitHandler = async (e) => {
		e.preventDefault();
		let query = '';
		for (const item in formState.inputs) {
			let val = formState.inputs[item].value;
			if (val === 0 || val) {
				query = query.concat(`&${item}=${val}`);
			}
		}

		query = '?'.concat(query.substr(1));
		console.log(query);

		try {
			const filteredData = await sendRequest(
				`${process.env.REACT_APP_API_URL}/place${query}`,
				'GET',
				null,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
			setPlaceList(filteredData);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const fetchInfo = async () => {
			if (auth.loginInfo.user_type === 'Renter' && !props.all) {
				try {
					const placeData = await sendRequest(
						`${process.env.REACT_APP_API_URL}/favorite/${auth.loginInfo.user_id}`,
						'GET',
						null,
						{
							Authorization: 'Bearer ' + auth.token,
						}
					);
					placeData.map((item) => {
						item._id = item.place_id;
					});
					setPlaceList(placeData);
				} catch (err) {
					console.log(err);
				}
			} else if (auth.loginInfo.user_type === 'Owner' || props.all) {
				try {
					const placeData = await sendRequest(
						`${process.env.REACT_APP_API_URL}/place`,
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
				{!filterOpen && (
					<div className="search__filter-open">
						<Button onClick={() => setFilterOpen(true)}>
							<FaFilter />
						</Button>
					</div>
				)}
				{filterOpen && (
					<div className="search__filter">
						<span
							className="search__filter-close"
							onClick={() => setFilterOpen(false)}
						></span>
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
									initialValid={true}
								/>
								<Input
									id="district"
									element="input"
									type="text"
									label="District/Urban"
									validators={[]}
									onInput={inputHandler}
									initialValid={true}
								/>
								<Input
									id="city"
									element="input"
									type="text"
									label="Province/City"
									validators={[]}
									onInput={inputHandler}
									initialValid={true}
								/>
								<div className="place-form__pair">
									<Input
										id="roomNum"
										element="input"
										type="number"
										label="Number of Room"
										validators={[]}
										onInput={inputHandler}
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
										validators={[]}
										onInput={inputHandler}
										initialValue="Lodging"
										initialValid={true}
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
										initialValid={true}
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
									validators={[]}
									initialValue="mo"
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
									id="bath"
									element="select"
									label="Bathroom"
									validators={[]}
									onInput={inputHandler}
									options={[
										{ opt: 'shared', label: 'Shared' },
										{ opt: 'closed', label: 'Closed' },
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
										{ opt: 'shared', label: 'Shared' },
										{ opt: 'person', label: 'Personal' },
										{ opt: 'None', label: 'No cooking' },
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
							</div>
							<Button
								style={{ width: '100%' }}
								type="submit"
								disabled={!formState.isValid}
							>
								Filter
							</Button>
						</form>
					</div>
				)}
				<div className="search__result">
					<PlaceList places={placeList} />
				</div>
			</div>
		</>
	);
};

export default SearchPage;
