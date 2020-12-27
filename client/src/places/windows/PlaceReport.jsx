import React, { useContext } from 'react';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
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

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('user_id', auth.loginInfo.user_id);
			formData.append('place_id', props.placeId);
			formData.append('content', formState.inputs.content.value);

			for (let key of formData.entries()) {
				console.log(key[0] + ', ' + key[1]);
			}

			await sendRequest(
				`${process.env.REACT_APP_API_URL}/report/create`,
				'POST',
				JSON.stringify({
					user_id: auth.loginInfo.user_id,
					place_id: props.placeId,
					content: formState.inputs.content.value,
				}),
				{
					Authorization: 'Bearer ' + auth.token,
					'Content-Type': 'application/json',
				}
			).then(() => console.log('Report sent'));
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
					validators={[VALIDATOR_REQUIRE()]}
					onInput={inputHandler}
				/>
				<div className="place-report__submit">
					<Button type="submit" disabled={!formState.isValid}>
						SEND
					</Button>
				</div>
			</form>
		</div>
	);
};

export default PlaceReport;
