import React, { useState, useContext } from 'react';
import {
	VALIDATOR_MAXLENGTH,
	VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import './PlaceReport.css';

const PlaceReport = (props) => {
	const { sendRequest } = useHttpClient();

	const auth = useContext(AuthContext);

	const [formState, inputHandler] = useForm(
		{
			content: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	const submitHandler = (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('user_id', auth.loginInfo.user_id);
			formData.append('place_id', props.placeId);
			formData.append('content', formState.inputs.content.value);

			for (let key of formData.entries()) {
				console.log(key[0] + ', ' + key[1]);
			}

			sendRequest(
				`${process.env.REACT_APP_API_URL}/report/create`,
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

	return (
		<div className="place-report">
			<form onSubmit={submitHandler}>
				<Input
					id="content"
					element="textarea"
					label="Tell us why"
					validators={[VALIDATOR_MAXLENGTH(64)]}
					onInput={inputHandler}
				/>
				<div className="place-report__submit">
					<Button danger onClick={submitHandler}>
						SEND
					</Button>
				</div>
			</form>
		</div>
	);
};

export default PlaceReport;
