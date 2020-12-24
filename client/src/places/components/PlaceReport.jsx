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

const PlaceReport = () => {
	const { isLoading, error, sendRequest } = useHttpClient();

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

		console.log(formState.inputs);
	};

	return (
		<div className="place-report">
			<form onSubmit={submitHandler}>
				<h2>Report Place</h2>
				<hr />
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
