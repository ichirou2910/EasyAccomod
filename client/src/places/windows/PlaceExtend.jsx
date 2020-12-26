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
			formData.append('time', auth.loginInfo.time.value);
			formData.append('timeType', formState.inputs.timeType.value);

			sendRequest(
				`${process.env.REACT_APP_API_URL}/place/extend/${props.place_id}`,
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
		return <Redirect to={`/place/${props.place_id}`} />;
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
