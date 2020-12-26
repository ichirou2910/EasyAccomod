import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';

import './PlaceExtend.css';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

const PlaceExtend = (props) => {
	const [edited, setEdited] = useState(false);

	const { isLoading, error, sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
		{
			time: {
				value: '',
				isValid: false,
			},
			timeType: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const submitHandler = (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('time', formState.inputs.time.value);
			formData.append('timeType', formState.inputs.timeType.value);

			for (let key of formData.entries()) {
				console.log(key[0] + ', ' + key[1]);
			}

			sendRequest(
				`${process.env.REACT_APP_API_URL}/place/extend/${props.placeId}`,
				'POST',
				formData,
				{
					Authorization: 'Bearer ' + auth.token,
				}
			);
		} catch (err) {
			console.log(err);
		}
	};

	if (edited) {
		props.exit();
	}

	return (
		<div className="place-extend">
			<form onSubmit={submitHandler}>
				<div className="place-form__pair">
					<Input
						id="time"
						element="input"
						type="number"
						label="Time"
						validators={[]}
						onInput={inputHandler}
					/>
					<Input
						id="timeType"
						element="select"
						options={[
							{ opt: 'week', label: 'Week(s)' },
							{ opt: 'month', label: 'Month(s)' },
							{ opt: 'quarter', label: 'Quarter(s)' },
							{ opt: 'year', label: 'Year(s)' },
						]}
						validators={[]}
						initialValue="week"
						initialValid={true}
						onInput={inputHandler}
					/>
				</div>
				<Button type="submit" disabled={!formState.isValid}>
					Request
				</Button>
			</form>
		</div>
	);
};

export default PlaceExtend;
